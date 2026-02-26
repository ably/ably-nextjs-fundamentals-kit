import { NextRequest, NextResponse } from 'next/server'
import * as Ably from "ably"

export async function POST(req: Request) {
  if (!process.env.ABLY_API_KEY) {
    return NextResponse.json({ errorMessage: `Missing ABLY_API_KEY environment variable.
        If you're running locally, please ensure you have a value for ABLY_API_KEY=your-key in your .env or .env.local file.
        If you're running in Netlify or Vercel, make sure you've configured the environment variable ABLY_API_KEY in the dashboard.
        Please see README.md for more details on configuring your Ably API Key.`,
      },{
        status: 500,
        headers: new Headers({
          "content-type": "application/json"
        })
      });
    }

  const client = new Ably.Rest(process.env.ABLY_API_KEY)

  var channel = client.channels.get('status-updates')
  const message: { text: string } = await req.json()

  // By publishing via the serverless function you can perform
  // checks in a trusted environment on the data being published
  const disallowedWords = [ 'foo', 'bar', 'fizz', 'buzz' ]

  const containsDisallowedWord = disallowedWords.some(word => {
    return message.text.match(new RegExp(`\\b${word}\\b`))
  })

  if(containsDisallowedWord) {
    return new Response("", { 'status': 403 });
  }

  await channel.publish('update-from-server', message)
  return new Response("");
}
