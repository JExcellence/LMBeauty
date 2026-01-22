import { NextRequest, NextResponse } from 'next/server';

/**
 * Instagram Webhook Verification Endpoint
 * 
 * Facebook/Instagram sends a GET request to verify the webhook URL.
 * We must respond with the hub.challenge value if the verify_token matches.
 */

// GET - Webhook verification (Facebook sends this to verify your endpoint)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  const verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN;
  
  // Check if this is a verification request
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Instagram webhook verified successfully');
    // Return the challenge as plain text (required by Facebook)
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  
  // Invalid verification attempt
  console.log('❌ Instagram webhook verification failed', { mode, token, verifyToken });
  return NextResponse.json(
    { error: 'Verification failed' },
    { status: 403 }
  );
}

// POST - Receive webhook events (when Instagram sends updates)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 Instagram webhook event received:', JSON.stringify(body, null, 2));
    
    // Handle different event types here if needed
    // For now, just acknowledge receipt
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
