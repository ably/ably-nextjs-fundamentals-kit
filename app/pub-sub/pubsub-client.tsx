'use client'

import { ChannelProvider, useChannel } from "ably/react"
import * as Ably from 'ably'
import { MouseEventHandler, MouseEvent, useState } from 'react'
import { Radio, Send, Server, MessageSquare, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import PageHeader from '../../components/PageHeader';
import FeatureCard from '../../components/FeatureCard';
import { useAblyReady } from '../ably-client-provider'

export default function PubSubClient() {
  const ready = useAblyReady()

  if (!ready) {
    return (
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Radio}
            title="Pub/Sub Channels"
            description="Publish messages and subscribe to real-time updates"
            docsLink="https://ably.com/docs/getting-started/react#useChannel"
            accentColor="purple"
          />
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChannelProvider channelName="status-updates">
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Radio}
            title="Pub/Sub Channels"
            description="Publish messages and subscribe to real-time updates"
            docsLink="https://ably.com/docs/getting-started/react#useChannel"
            accentColor="purple"
          />
          <PubSubMessages />
        </div>
      </div>
    </ChannelProvider>
  )
}

interface PubSubMessage {
  id: string
  text: string
  source: 'client' | 'server'
  timestamp: string
}

function PubSubMessages() {
  const [messages, setMessages] = useState<Array<PubSubMessage>>([])

  const { channel } = useChannel("status-updates", (message: Ably.Message) => {
    const source = message.name === 'update-from-client' ? 'client' : 'server' as const
    setMessages(prev => [
      { id: `${Date.now()}-${source}`, text: message.data.text, source, timestamp: new Date().toISOString() },
      ...prev,
    ])
  });

  const [messageText, setMessageText] = useState<string>('Hello world')

  const publicFromClientHandler: MouseEventHandler = (_event: MouseEvent<HTMLButtonElement>) => {
    if(channel === null) return
    channel.publish('update-from-client', {text: `${messageText} @ ${new Date().toISOString()}`})
  }

  const publicFromServerHandler: MouseEventHandler = (_event: MouseEvent<HTMLButtonElement>) => {
    fetch('/publish', {
        'method': 'POST',
        'headers': {
            'content-type': 'application/json',
        },
        'body': JSON.stringify({text: `${messageText} @ ${new Date().toISOString()}`})
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Compose Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
        <FeatureCard className="sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Compose Message
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Message Content
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none font-manrope"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Type your message..."
              />
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={publicFromClientHandler}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Publish from Client
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={publicFromServerHandler}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Server className="w-4 h-4" />
                Publish from Server
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{messages.filter(m => m.source === 'client').length}</div>
                <div className="text-xs text-gray-500 uppercase">Client</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{messages.filter(m => m.source === 'server').length}</div>
                <div className="text-xs text-gray-500 uppercase">Server</div>
              </div>
            </div>
          </div>
        </FeatureCard>
      </motion.div>

      {/* Message Stream */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-3"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/5 overflow-hidden">
          <div className="bg-slate-950/50 px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Message Stream</h2>
            <p className="text-sm text-gray-500">{messages.length} messages published</p>
          </div>

          <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <Radio className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-600 mt-1">Publish a message to see it here</p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`p-4 rounded-xl border ${
                    msg.source === 'client'
                      ? 'bg-purple-500/5 border-purple-500/20'
                      : 'bg-blue-500/5 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      msg.source === 'client' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                    }`}>
                      {msg.source === 'client' ? (
                        <Send className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Server className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase ${
                          msg.source === 'client' ? 'text-purple-400' : 'text-blue-400'
                        }`}>
                          {msg.source}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white break-words">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
