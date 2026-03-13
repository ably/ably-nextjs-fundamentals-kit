'use client'

import { useAbly, ChannelProvider, usePresence, usePresenceListener } from "ably/react"
import { useState, ReactElement, FC } from 'react'
import { Users, UserPlus, UserMinus, Activity, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import PageHeader from '../../components/PageHeader';
import FeatureCard from '../../components/FeatureCard';
import { useAblyReady } from '../ably-client-provider'

const avatarColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-amber-500',
]

export default function Presence() {
  const ready = useAblyReady()

  if (!ready) {
    return (
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Users}
            title="Presence"
            description="Track who's online in real-time"
            docsLink="https://ably.com/docs/getting-started/react#usePresence"
            accentColor="green"
          />
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return <PresenceInner />
}

function PresenceInner() {
  const ably = useAbly()
  const clientId = ably.auth.clientId
  const [isOnline, setIsOnline] = useState(false)

  function toggleState(val: boolean) {
    setIsOnline(val)
  }

  return (
    <ChannelProvider channelName="room">
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            icon={Users}
            title="Presence"
            description="Track who's online in real-time"
            docsLink="https://ably.com/docs/getting-started/react#usePresence"
            accentColor="green"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Control Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <FeatureCard className="sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Your Presence</h2>

                {/* Client ID */}
                <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-white/5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Client ID</div>
                  <div className="text-lg font-bold text-white font-jetbrains-mono">{clientId}</div>
                </div>

                {/* Join/Leave Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleState(!isOnline)}
                  className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl mb-6 flex items-center justify-center gap-2 ${
                    isOnline
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                      : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                  }`}
                >
                  {isOnline ? (
                    <><UserMinus className="w-5 h-5" />Leave Space</>
                  ) : (
                    <><UserPlus className="w-5 h-5" />Join Space</>
                  )}
                </motion.button>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
                    <span className="text-sm text-gray-400">Your Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                      <span className={`text-sm font-bold ${isOnline ? 'text-green-400' : 'text-gray-600'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            </motion.div>

            {/* Members List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              {isOnline ? (
                <PresenceMessages avatarColors={avatarColors} clientId={clientId} />
              ) : (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/5 overflow-hidden">
                  <div className="bg-slate-950/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Active Members</h2>
                      <p className="text-sm text-gray-500">0 online now</p>
                    </div>
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="p-6">
                    <div className="text-center py-16">
                      <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500">No one here yet</p>
                      <p className="text-sm text-gray-600 mt-1">Join the space to see yourself</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ChannelProvider>
  )
}

const PresenceMessages: FC<{avatarColors: string[], clientId: string}> = ({avatarColors, clientId}): ReactElement => {
  const { updateStatus } = usePresence("room", {'status':'available'});
  const { presenceData } = usePresenceListener("room");

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/5 overflow-hidden">
      <div className="bg-slate-950/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Active Members</h2>
          <p className="text-sm text-gray-500">{presenceData.length} online now</p>
        </div>
        <Activity className="w-5 h-5 text-green-400" />
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {presenceData.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-950/30 rounded-2xl p-5 border border-white/5 hover:border-green-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0`}>
                    {member.clientId.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold truncate">{member.clientId}</h3>
                      {member.clientId === clientId && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-gray-500">
                        Joined {new Date(member.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
