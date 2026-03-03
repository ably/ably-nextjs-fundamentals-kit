'use client'

import { ChannelProvider, useChannel } from "ably/react"
import * as Ably from 'ably'
import { useState } from 'react'
import { Clock, AlertCircle, ArrowRight, ExternalLink, Database, Sparkles, Send, Server } from 'lucide-react'
import { motion } from 'motion/react'
import PageHeader from '../../components/PageHeader';
import { useAblyReady } from '../ably-client-provider'

interface HistoryProps {
  initialHistory: Array<HistoryMessage>
}

export default function History({ initialHistory }: HistoryProps) {
  const ready = useAblyReady()

  if (!ready) {
    return (
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Clock}
            title="History"
            description="Retrieve historical messages from your channels"
            docsLink="https://ably.com/docs/storage-history/history?lang=javascript"
            accentColor="amber"
          />
          <MessageDisplay historicalMessages={initialHistory} realtimeMessages={[]} />
        </div>
      </div>
    );
  }

  return (
    <ChannelProvider channelName="status-updates">
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Clock}
            title="History"
            description="Retrieve historical messages from your channels"
            docsLink="https://ably.com/docs/storage-history/history?lang=javascript"
            accentColor="amber"
          />
          <HistoryMessages initialHistory={initialHistory} />
        </div>
      </div>
    </ChannelProvider>
  )
}

interface HistoryMessage {
  id: string
  text: string
  source: 'client' | 'server'
  timestamp: string
}

function HistoryMessages({ initialHistory }: { initialHistory: Array<HistoryMessage> }) {
  const [realtimeMessages, setRealtimeMessages] = useState<Array<HistoryMessage>>([])

  useChannel("status-updates", (message: Ably.Message) => {
    const source = message.name === 'update-from-client' ? 'client' : 'server' as const
    setRealtimeMessages(prev => [
      { id: `${Date.now()}-rt`, text: message.data.text, source, timestamp: new Date().toISOString() },
      ...prev,
    ])
  });

  return <MessageDisplay historicalMessages={initialHistory} realtimeMessages={realtimeMessages} />
}

function MessageDisplay({ historicalMessages, realtimeMessages }: { historicalMessages: Array<HistoryMessage>; realtimeMessages: Array<HistoryMessage> }) {
  const [activeTab, setActiveTab] = useState<'history' | 'realtime'>('history')

  const currentMessages = activeTab === 'history' ? historicalMessages : realtimeMessages
  const totalMessages = historicalMessages.length + realtimeMessages.length

  return (
    <>
      {/* Warning Banner — only when no messages */}
      {totalMessages === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold mb-2">Configuration Required</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Messages are stored for 2 minutes by default. To store them longer, enable the{' '}
                <code className="px-2 py-1 bg-slate-950/50 border border-white/10 rounded text-amber-400 font-jetbrains-mono text-xs">
                  Persist all messages
                </code>
                {' '}channel rule for the{' '}
                <code className="px-2 py-1 bg-slate-950/50 border border-white/10 rounded text-amber-400 font-jetbrains-mono text-xs">
                  status-updates
                </code>
                {' '}channel in your Ably app.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/pub-sub"
                  className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  Publish a message first
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://ably.com/docs/channels?lang=javascript#rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Configure channel rules
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-2 mb-8"
      >
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            History
          </div>
        </button>
        <button
          onClick={() => setActiveTab('realtime')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'realtime'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Realtime
          </div>
        </button>
      </motion.div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/5 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-950/50 px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white capitalize">{activeTab} Messages</h2>
          <p className="text-sm text-gray-500">
            {activeTab === 'history'
              ? `${historicalMessages.length} messages stored`
              : 'Live message stream'}
          </p>
        </div>

        {/* Messages or Empty State */}
        <div className="p-6">
          {currentMessages.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="inline-flex p-6 bg-slate-950/50 rounded-full mb-6">
                {activeTab === 'history' ? (
                  <Database className="w-12 h-12 text-gray-700" />
                ) : (
                  <Sparkles className="w-12 h-12 text-gray-700" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No Messages Found</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {activeTab === 'history'
                  ? 'There are no historical messages stored yet. Publish some messages and they\'ll appear here.'
                  : 'Waiting for new messages to arrive in real-time. Publish a message to see it stream here instantly.'}
              </p>
              <a
                href="/pub-sub"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                Go to Pub/Sub
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl border ${
                    msg.source === 'client'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-orange-500/5 border-orange-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      msg.source === 'client' ? 'bg-amber-500/10' : 'bg-orange-500/10'
                    }`}>
                      {msg.source === 'client' ? (
                        <Send className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Server className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase ${
                          msg.source === 'client' ? 'text-amber-400' : 'text-orange-400'
                        }`}>
                          {msg.source}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white break-words">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Info Cards — inside the main card */}
        <div className="border-t border-white/5 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-bold text-white mb-1">2 min</div>
            <div className="text-xs text-gray-500 uppercase">Default Retention</div>
          </div>
          <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-bold text-white mb-1">∞</div>
            <div className="text-xs text-gray-500 uppercase">With Persistence</div>
          </div>
          <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-bold text-white mb-1">{totalMessages}</div>
            <div className="text-xs text-gray-500 uppercase">Messages Stored</div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
