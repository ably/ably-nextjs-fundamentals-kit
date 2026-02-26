'use client'

import { ExternalLink } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

const colorMap: Record<string, { iconBg: string; iconText: string; linkText: string; linkHover: string }> = {
  cyan:   { iconBg: 'bg-cyan-500/10',   iconText: 'text-cyan-400',   linkText: 'text-cyan-400',   linkHover: 'hover:text-cyan-300' },
  purple: { iconBg: 'bg-purple-500/10', iconText: 'text-purple-400', linkText: 'text-purple-400', linkHover: 'hover:text-purple-300' },
  green:  { iconBg: 'bg-green-500/10',  iconText: 'text-green-400',  linkText: 'text-green-400',  linkHover: 'hover:text-green-300' },
  amber:  { iconBg: 'bg-amber-500/10',  iconText: 'text-amber-400',  linkText: 'text-amber-400',  linkHover: 'hover:text-amber-300' },
}

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  docsLink: string
  accentColor: keyof typeof colorMap
}

export default function PageHeader({ icon: Icon, title, description, docsLink, accentColor }: PageHeaderProps) {
  const colors = colorMap[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 ${colors.iconBg} rounded-2xl`}>
          <Icon className={`w-10 h-10 ${colors.iconText}`} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 text-lg">{description}</p>
        </div>
      </div>
      <a
        href={docsLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 ${colors.linkText} ${colors.linkHover} transition-colors`}
      >
        <ExternalLink className="w-4 h-4" />
        <span className="font-semibold">Documentation</span>
      </a>
    </motion.div>
  )
}
