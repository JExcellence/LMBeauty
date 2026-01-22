/**
 * Instagram Basic Display API Integration
 * 
 * Fetches recent posts from Instagram using the Basic Display API.
 * Requires INSTAGRAM_ACCESS_TOKEN in environment variables.
 * 
 * Setup instructions:
 * 1. Go to https://developers.facebook.com/apps/
 * 2. Create a new app (Consumer type)
 * 3. Add "Instagram Basic Display" product
 * 4. Add yourself as a test user and accept the invitation
 * 5. Generate a token and exchange it for a long-lived token
 * 6. Add the token to your .env.local file
 */

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string; // For videos
  permalink: string;
  timestamp: string;
}

export interface InstagramFeedResponse {
  posts: InstagramPost[];
  error?: string;
}

const INSTAGRAM_API_URL = 'https://graph.instagram.com';

/**
 * Fetches recent Instagram posts
 * @param limit Number of posts to fetch (default: 6, max: 25)
 * @returns Array of Instagram posts or empty array on error
 */
export async function getInstagramPosts(limit: number = 6): Promise<InstagramFeedResponse> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('Instagram: INSTAGRAM_ACCESS_TOKEN not configured');
    return { posts: [], error: 'Token not configured' };
  }
  
  try {
    // Fetch user's media
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`,
      {
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Instagram API error:', errorData);
      return { posts: [], error: errorData.error?.message || 'API error' };
    }
    
    const data = await response.json();
    
    // Filter out videos if we only want images, or get thumbnail for videos
    const posts: InstagramPost[] = data.data.map((post: InstagramPost) => ({
      ...post,
      // Use thumbnail_url for videos, media_url for images
      media_url: post.media_type === 'VIDEO' ? post.thumbnail_url || post.media_url : post.media_url,
    }));
    
    return { posts };
  } catch (error) {
    console.error('Instagram fetch error:', error);
    return { posts: [], error: 'Failed to fetch posts' };
  }
}

/**
 * Refreshes a long-lived access token
 * Long-lived tokens expire after 60 days and need to be refreshed
 * Call this periodically (e.g., every 50 days) to keep the token valid
 */
export async function refreshInstagramToken(): Promise<string | null> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('Instagram: No token to refresh');
    return null;
  }
  
  try {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token refresh error:', errorData);
      return null;
    }
    
    const data = await response.json();
    console.log('New token expires in:', data.expires_in, 'seconds');
    
    // Note: You'll need to manually update your .env.local with the new token
    // or implement a more sophisticated token storage solution
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}
