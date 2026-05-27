// app/api/instagram/debug/route.ts
import { NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!
const HOST = 'instagram-scraper-api11.p.rapidapi.com'
const USER_ID = '76666209099' // _sbcreation's user_id from earlier response

export async function GET() {
  const headers = {
    'Content-Type': 'application/json',
    'x-rapidapi-host': HOST,
    'x-rapidapi-key': RAPIDAPI_KEY,
  }

  const res = await fetch(
    `https://${HOST}/get_instagram_posts_details_from_id?user_id=${USER_ID}`,
    { headers }
  )
  const data = await res.json()

  return NextResponse.json({
    status: res.status,
    top_keys: Object.keys(data),
    // What type is data.data?
    data_type: typeof data.data,
    data_is_array: Array.isArray(data.data),
    // If data.data is object, show its keys
    data_data_keys: data.data && typeof data.data === 'object' && !Array.isArray(data.data)
      ? Object.keys(data.data)
      : 'data.data is not an object',
    // If data.data is array, show first item keys
    data_data_first_item_keys: Array.isArray(data.data) && data.data[0]
      ? Object.keys(data.data[0])
      : 'not an array',
    // Show first 500 chars of raw
    raw_preview: JSON.stringify(data).slice(0, 500),
  })
}