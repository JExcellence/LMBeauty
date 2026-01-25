import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://api.lmbeauty.de';

// Fallback reviews data
const fallbackReviews = [
  {
    author_name: 'Sarah M.',
    rating: 5,
    text: 'Ich bin absolut begeistert! Die Wimpern sehen so natürlich aus und halten super lange. Lisa nimmt sich wirklich Zeit für die Beratung.',
    time: Date.now() / 1000,
    relative_time_description: 'vor 2 Wochen',
    profile_photo_url: ''
  },
  {
    author_name: 'Anna K.',
    rating: 5,
    text: 'Endlich ein Studio, wo ich mich wohlfühle! Die Atmosphäre ist entspannt und das Ergebnis perfekt. Komme definitiv wieder!',
    time: Date.now() / 1000,
    relative_time_description: 'vor 1 Monat',
    profile_photo_url: ''
  },
  {
    author_name: 'Julia S.',
    rating: 5,
    text: 'Beste Wimpernverlängerung, die ich je hatte! Lisa arbeitet sehr präzise und das Studio ist super sauber. Absolute Empfehlung!',
    time: Date.now() / 1000,
    relative_time_description: 'vor 3 Wochen',
    profile_photo_url: ''
  }
];

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/frontend/reviews`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn('Backend not available, using fallback reviews');
      return NextResponse.json({ success: true, data: { reviews: fallbackReviews } });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: true, data: { reviews: fallbackReviews } });
  }
}
