import * as Ably from 'ably'
import History from './history-client'

// Ably.Rest uses its own HTTP client (not Next.js fetch), so Next.js can't
// detect that this page depends on external data and would statically render
// it at build time with stale history. Force dynamic to fetch fresh data.
export const dynamic = 'force-dynamic'

const rest = process.env.ABLY_API_KEY ? new Ably.Rest(process.env.ABLY_API_KEY) : null

async function fetchHistory(): Promise<Array<{ id: string; text: string; source: 'client' | 'server'; timestamp: string }>> {
  if (!rest) return [];

  const channel = rest.channels.get('status-updates');
  const messages: Array<{ id: string; text: string; source: 'client' | 'server'; timestamp: string }> = [];

  let page: Ably.PaginatedResult<Ably.Message> | null = await channel.history();
  do {
    for (const message of page.items) {
      const source = message.name === 'update-from-client' ? 'client' : 'server' as const;
      messages.push({
        id: `${message.id}-hist`,
        text: message.data.text,
        source,
        timestamp: new Date(message.timestamp!).toISOString(),
      });
    }
    page = await page.next();
  } while (page);

  return messages;
}

export default async function HistoryPage() {
  const initialHistory = await fetchHistory();
  return <History initialHistory={initialHistory} />;
}
