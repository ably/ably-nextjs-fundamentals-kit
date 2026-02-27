'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'

const stats = [
  { label: 'Global Edge Network', value: '25+', suffix: 'regions' },
  { label: 'Messages per day', value: '70B+', suffix: '' },
  { label: 'Active connections', value: '5M+', suffix: '' },
]

export default function HomeClient() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400 font-semibold">Next.js Fundamentals Kit</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight md:leading-tight">
              <span className="text-white">Build realtime</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 bg-clip-text text-transparent">
                experiences faster
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Explore Ably&apos;s fundamentals with Next.js. Build notifications, activity streams, chat,
              realtime dashboards, and collaborative multiplayer experiences.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/authentication"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                Get Started
              </Link>
              <a
                href="https://ably.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-all border border-white/10"
              >
                View Documentation
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                  {stat.suffix && <span className="text-orange-400 ml-1">{stat.suffix}</span>}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  )
}
