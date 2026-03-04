'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import * as Ably from 'ably'
import { AblyProvider } from 'ably/react'
import names from 'random-names-generator'

const AblyReadyContext = createContext(false)

export function useAblyReady() {
  return useContext(AblyReadyContext)
}

export default function AblyClientProvider({ children }: { children: ReactNode }) {
  const [clientId] = useState(() => names.random())
  const [client, setClient] = useState<Ably.Realtime | null>(null)

  useEffect(() => {
    const ably = new Ably.Realtime({ authUrl: '/token', authMethod: 'POST', clientId })
    setClient(ably)
    return () => { ably.close() }
  }, [clientId])

  if (!client) {
    return (
      <AblyReadyContext.Provider value={false}>
        {children}
      </AblyReadyContext.Provider>
    )
  }

  return (
    <AblyProvider client={client}>
      <AblyReadyContext.Provider value={true}>
        {children}
      </AblyReadyContext.Provider>
    </AblyProvider>
  )
}
