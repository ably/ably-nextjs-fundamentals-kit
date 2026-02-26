'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, Github } from 'lucide-react'

const navItems = [
  { label: 'Start', href: '/' },
  { label: 'Authentication', href: '/authentication' },
  { label: 'Pub/Sub', href: '/pub-sub' },
  { label: 'Presence', href: '/presence' },
  { label: 'History', href: '/history' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-orange-500/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-[127px]">
              <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 101.954 32">
                <path
                  d="M62.922 24.9786V4.08815H66.6933V11.6512C67.9709 10.435 69.6164 9.76046 71.3538 9.76046C75.4317 9.76046 79.0498 12.8675 79.0498 17.5484C79.0498 22.2293 75.4317 25.3465 71.3538 25.3465C69.5244 25.3465 67.7971 24.6209 66.5094 23.3025V24.9786H62.922ZM75.2784 17.5484C75.2784 14.932 73.4183 13.1025 70.9859 13.1025C68.6148 13.1025 66.7853 14.84 66.6933 17.3644V17.5484C66.6933 20.1648 68.5534 21.9942 70.9859 21.9942C73.4183 21.9942 75.2784 20.1648 75.2784 17.5484ZM80.7974 24.9786V4.08815H84.5688V24.9786H80.7974ZM89.8425 30.3954L92.0399 25.1523L86.0712 10.1284H90.1491L93.9511 20.6247L97.8144 10.1284H101.954L93.8591 30.4056H89.8425V30.3954ZM56.9329 10.1284V12.0192C55.6247 10.5883 53.7952 9.77068 51.9147 9.77068C47.8367 9.77068 44.2187 12.8777 44.2187 17.5586C44.2187 22.2498 47.8367 25.3465 51.9147 25.3465C53.8668 25.3465 55.7166 24.4982 57.0555 22.9754V24.9888H60.3465V10.1284H56.9329ZM56.5649 17.5484C56.5649 20.1341 54.7048 21.9942 52.2724 21.9942C49.8399 21.9942 47.9798 20.1341 47.9798 17.5484C47.9798 14.9626 49.8399 13.1025 52.2724 13.1025C54.6435 13.1025 56.4729 14.8706 56.5649 17.3644V17.5484Z"
                  fill="#ffffff"
                  className="group-hover:fill-orange-400 transition-colors"
                />
                <path
                  d="M19.2858 0L3.14788 29.5369L0 27.3293L14.932 0H19.2858ZM19.5107 0L35.6487 29.5369L38.7965 27.3293L23.8646 0H19.5107Z"
                  fill="url(#paint0_linear_header)"
                />
                <path
                  d="M35.4238 29.7106L19.3983 17.16L3.37272 29.7106L6.64324 32L19.3983 22.0147L32.1533 32L35.4238 29.7106Z"
                  fill="url(#paint1_linear_header)"
                />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_header" x1="5.47361" x2="32.4603" y1="37.4219" y2="7.45023">
                    <stop stopColor="#FF5416" />
                    <stop offset="0.2535" stopColor="#FF5115" />
                    <stop offset="0.461" stopColor="#FF4712" />
                    <stop offset="0.6523" stopColor="#FF350E" />
                    <stop offset="0.8327" stopColor="#FF1E08" />
                    <stop offset="1" stopColor="#FF0000" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_header" x1="10.7084" x2="26.6583" y1="39.3593" y2="21.6452">
                    <stop stopColor="#FF5416" />
                    <stop offset="0.2535" stopColor="#FF5115" />
                    <stop offset="0.461" stopColor="#FF4712" />
                    <stop offset="0.6523" stopColor="#FF350E" />
                    <stop offset="0.8327" stopColor="#FF1E08" />
                    <stop offset="1" stopColor="#FF0000" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-sm text-gray-400 group-hover:text-orange-400 transition-colors">
              Next.js Kit
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://ably.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/ably"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
