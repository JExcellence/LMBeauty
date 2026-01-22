import { NextResponse } from 'next/server';

/**
 * Instagram Feed API Endpoint
 * 
 * Fetches the latest posts from Instagram using the Basic Display API.
 * Includes caching and categorization by service type (volumen, einzeltechnik, hybrid).
 */

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface CategorizedPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  category?: 'volumentechnik' | 'einzeltechnik' | 'hybridtechnik' | 'general';
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}

// Simple in-memory cache
let cachedPosts: CategorizedPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Keywords to categorize posts - STRICT matching
// Volumentechnik: volumen, wet look, whispy ONLY
// Einzeltechnik: 1:1, classic ONLY  
// Hybridtechnik: hybrid ONLY
// Everything else (lifting, etc.) goes to general

const categoryKeywords: Record<string, string[]> = {
  volumentechnik: [
    'volumen',
    'volume',
    'whispy',
    'wispy', 
    'wet look',
    'wetlook',
  ],
  einzeltechnik: [
    '1:1',
    'classic',
  ],
  hybridtechnik: [
    'hybrid',
  ],
};

// Priority order
const categoryOrder = ['volumentechnik', 'hybridtechnik', 'einzeltechnik'];

function categorizePost(caption?: string): CategorizedPost['category'] {
  if (!caption) return 'general';
  
  // Remove all hashtags and their words (e.g. #volumelashes becomes nothing)
  const captionWithoutHashtags = caption
    .replace(/#\w+/g, '')
    .toLowerCase();
  
  // Check categories in priority order
  for (const category of categoryOrder) {
    const keywords = categoryKeywords[category];
    for (const keyword of keywords) {
      if (captionWithoutHashtags.includes(keyword)) {
        return category as CategorizedPost['category'];
      }
    }
  }
  
  return 'general';
}

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('❌ INSTAGRAM_ACCESS_TOKEN not configured');
      return NextResponse.json(
        { error: 'Instagram not configured', posts: [], byCategory: {} },
        { status: 200 }
      );
    }
    
    // Check cache
    const now = Date.now();
    if (cachedPosts && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 Returning cached Instagram posts');
      const byCategory = groupByCategory(cachedPosts);
      return NextResponse.json({ posts: cachedPosts, byCategory, cached: true });
    }
    
    // Fetch from Instagram API - get more posts to have enough for each category
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';
    const limit = 50; // Fetch more to categorize
    
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
    
    console.log('🔄 Fetching Instagram posts...');
    
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Instagram API error:', response.status, errorData);
      
      if (response.status === 400 || response.status === 190) {
        return NextResponse.json({
          error: 'Instagram token expired or invalid',
          posts: cachedPosts || [],
          byCategory: cachedPosts ? groupByCategory(cachedPosts) : {},
        });
      }
      
      return NextResponse.json({
        error: 'Failed to fetch Instagram posts',
        posts: cachedPosts || [],
        byCategory: cachedPosts ? groupByCategory(cachedPosts) : {},
      });
    }
    
    const data: InstagramResponse = await response.json();
    
    // Filter to only images and categorize
    const categorizedPosts: CategorizedPost[] = data.data
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
      .map(post => {
        const category = categorizePost(post.caption);
        // Debug log for categorization
        if (post.caption) {
          console.log(`📸 Post: "${post.caption.substring(0, 50)}..." → ${category}`);
        }
        return {
          id: post.id,
          media_url: post.media_url,
          permalink: post.permalink,
          caption: post.caption,
          timestamp: post.timestamp,
          category,
        };
      });
    
    // Update cache
    cachedPosts = categorizedPosts;
    cacheTimestamp = now;
    
    const byCategory = groupByCategory(categorizedPosts);
    
    console.log(`✅ Fetched ${categorizedPosts.length} Instagram posts`);
    console.log(`   - Volumen: ${byCategory.volumentechnik?.length || 0}`);
    console.log(`   - Einzel: ${byCategory.einzeltechnik?.length || 0}`);
    console.log(`   - Hybrid: ${byCategory.hybridtechnik?.length || 0}`);
    console.log(`   - General: ${byCategory.general?.length || 0}`);
    
    return NextResponse.json({ posts: categorizedPosts, byCategory, cached: false });
    
  } catch (error) {
    console.error('❌ Error fetching Instagram feed:', error);
    return NextResponse.json({
      error: 'Internal server error',
      posts: cachedPosts || [],
      byCategory: cachedPosts ? groupByCategory(cachedPosts) : {},
    }, { status: 200 });
  }
}

function groupByCategory(posts: CategorizedPost[]): Record<string, CategorizedPost[]> {
  return posts.reduce((acc, post) => {
    const category = post.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {} as Record<string, CategorizedPost[]>);
}
