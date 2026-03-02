'use client'

import { MouseEventHandler, MouseEvent, useState, useEffect } from 'react'
import * as Ably from 'ably'
import { AblyProvider, useAbly, useConnectionStateListener } from 'ably/react'
import { Shield, CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import PageHeader from '../../components/PageHeader'
import FeatureCard from '../../components/FeatureCard'

export default function Authentication() {
  const [client, setClient] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    const ably = new Ably.Realtime({ authUrl: '/token', authMethod: 'POST' });
    setClient(ably);
    return () => { ably.close(); };
  }, []);

  if (!client) {
    return (
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Shield}
            title="Authentication"
            description="Establish a secure, persistent bi-directional connection"
            docsLink="https://ably.com/docs/getting-started/react#authenticate"
            accentColor="cyan"
          />
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AblyProvider client={ client }>
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Shield}
            title="Authentication"
            description="Establish a secure, persistent bi-directional connection"
            docsLink="https://ably.com/docs/getting-started/react#authenticate"
            accentColor="cyan"
          />
          <ConnectionStatus />
        </div>
      </div>
    </AblyProvider>
  )
}

const ConnectionStatus = () => {
  const ably = useAbly();
  const [logs, setLogs] = useState<Array<string>>([])
  const [connectionState, setConnectionState] = useState('unknown')

  useConnectionStateListener((stateChange) => {
    setConnectionState(stateChange.current)
    setLogs(prev => [`Connection state change: ${stateChange.previous} → ${stateChange.current}`, ...prev])
  })

  const connectionToggle: MouseEventHandler = (_event: MouseEvent<HTMLButtonElement>) => {
    if(connectionState === 'connected') {
      ably.connection.close()
    }
    else if(connectionState === 'closed') {
      ably.connection.connect()
    }
  }

  const isConnected = connectionState === 'connected'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FeatureCard>
          <h2 className="text-xl font-bold text-white mb-6">Connection Control</h2>

          {/* Status Display */}
          <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 uppercase tracking-wider">Status</span>
              {isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className={`text-2xl font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {connectionState}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={connectionToggle}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl ${
              isConnected
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </motion.button>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="text-2xl font-bold text-white mb-1">256-bit</div>
              <div className="text-xs text-gray-500 uppercase">Encryption</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="text-2xl font-bold text-white mb-1">&lt;50ms</div>
              <div className="text-xs text-gray-500 uppercase">Latency</div>
            </div>
          </div>
        </FeatureCard>
      </motion.div>

      {/* Connection Log */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/5 overflow-hidden h-full">
          {/* Terminal Header */}
          <div className="bg-slate-950/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm text-gray-500 font-jetbrains-mono">connection.log</span>
            </div>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Log Content */}
          <div className="p-6 font-jetbrains-mono text-sm space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-slate-950/30 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-gray-600 text-xs mt-0.5">{String(logs.length - index).padStart(2, '0')}</span>
                <span className="text-cyan-400 flex-1">{log}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
