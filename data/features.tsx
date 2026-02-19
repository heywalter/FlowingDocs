import React, { ReactNode } from 'react'
import { translate } from '@docusaurus/Translate'
import WebDeveloperSvg from '@site/static/svg/undraw_web_developer.svg'
import SpiderSvg from '@site/static/svg/undraw_spider.svg'
import OpenSourceSvg from '@site/static/svg/undraw_open_source.svg'

export type FeatureItem = {
  title: string
  description: string
  header?: ReactNode
  icon?: ReactNode
}

const FEATURES: FeatureItem[] = [
  {
    title: translate({
      message: '聚焦技术文档工程化',
      id: 'homepage.feature.focus',
    }),
    description: translate({
      message: '致力于将复杂的技术逻辑转化为清晰易懂的文档内容，探索如何通过 API 设计、开发者体验优化以及文档即代码（Docs-as-Code）实践，帮助团队更高效地协作与交付。',
      id: 'homepage.feature.focus.description',
    }),
    header: (
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-1 shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/25 dark:from-slate-900 dark:via-blue-900/50 dark:to-indigo-900/30">
        {/* 外层光晕效果 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* 内容区域 */}
        <div className="relative h-56 overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-gray-900/90">
          {/* 动态背景网格 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* 浮动装饰元素 */}
          <div className="absolute left-4 top-4 size-3 rounded-full bg-blue-400/60 animate-pulse" />
          <div className="absolute right-6 top-8 size-2 rounded-full bg-indigo-400/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-6 left-8 size-4 rounded-full bg-purple-400/30 animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* 主要内容 */}
          <div className="flex h-full items-center justify-center p-8">
            <div className="relative">
              {/* SVG 背景光环 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200/50 to-indigo-300/50 blur-xl scale-150 transition-transform duration-700 group-hover:scale-175 dark:from-blue-800/30 dark:to-indigo-700/30" />
              
              {/* SVG 容器 */}
              <div className="relative flex size-28 items-center justify-center rounded-full border border-white/20 bg-white/50 shadow-2xl backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 dark:border-gray-700/30 dark:bg-gray-800/50">
                <WebDeveloperSvg
                  className="transition-all duration-1000 group-hover:scale-105"
                  style={{
                    width: '80px',
                    height: '80px',
                    filter: 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3))',
                  }}
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
            </div>
          </div>
          
          {/* 底部渐变 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50/80 to-transparent dark:from-blue-900/40" />
        </div>
      </div>
    ),
    icon: (
      <div className="group relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 opacity-75 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-md" />
        <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-all duration-300 group-hover:scale-110">
          <svg className="size-6 text-white transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: translate({
      message: '探索 AI 在技术写作中的应用',
      id: 'homepage.feature.ai',
    }),
    description: translate({
      message: '探索和实践如何用 AI 工具来提高技术文档的效率，比如自动化生成、智能校对和交互式文档设计。希望通过这些探索，让知识传播变得更轻松、更有趣。',
      id: 'homepage.feature.ai.description',
    }),
    header: (
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 p-1 shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/25 dark:from-violet-900 dark:via-purple-900/50 dark:to-fuchsia-900/30">
        {/* AI 主题的动态背景 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-violet-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* 内容区域 */}
        <div className="relative h-56 overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-gray-900/90">
          {/* 神经网络风格背景 */}
          <div className="absolute inset-0">
            <div className="absolute left-8 top-6 size-1 rounded-full bg-purple-400/60 animate-ping" />
            <div className="absolute right-12 top-12 size-1 rounded-full bg-pink-400/60 animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute left-16 bottom-16 size-1 rounded-full bg-violet-400/60 animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute right-8 bottom-8 size-1 rounded-full bg-fuchsia-400/60 animate-ping" style={{ animationDelay: '1.5s' }} />
            
            {/* 连接线 */}
            <svg className="absolute inset-0 size-full opacity-20" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d="M30 30 Q100 80 170 50" stroke="url(#lineGradient)" strokeWidth="1" fill="none" className="animate-pulse" />
              <path d="M50 150 Q120 100 180 130" stroke="url(#lineGradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            </svg>
          </div>
          
          {/* 主要内容 */}
          <div className="flex h-full items-center justify-center p-8">
            <div className="relative">
              {/* AI 光环效果 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-300/60 blur-2xl scale-150 transition-transform duration-700 group-hover:scale-175 group-hover:rotate-180 dark:from-purple-800/40 dark:to-pink-700/40" />
              
              {/* SVG 容器 */}
              <div className="relative flex size-28 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/60 to-purple-50/80 shadow-2xl backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 dark:border-gray-700/30 dark:from-gray-800/60 dark:to-purple-900/80">
                <SpiderSvg
                  className="transition-all duration-1000 group-hover:scale-105 group-hover:hue-rotate-15"
                  style={{
                    width: '85px',
                    height: '85px',
                    filter: 'drop-shadow(0 8px 16px rgba(147, 51, 234, 0.4))',
                  }}
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
            </div>
          </div>
          
          {/* 底部渐变 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50/80 to-transparent dark:from-purple-900/40" />
        </div>
      </div>
    ),
    icon: (
      <div className="group relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 opacity-75 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-md" />
        <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg transition-all duration-300 group-hover:scale-110">
          <svg className="size-6 text-white transition-transform duration-300 group-hover:-rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15L8 12.2v.8c0 1.1.9 2 2 2h2v2h2v-2h1.35c.45-.78.65-1.67.65-2.6V9.65C17.18 8.23 16.12 7 14.8 7H12V5h-2v2H8.8C7.67 7 6.82 7.85 6.82 9v3c0 .55.45 1 1 1h2.18v2H12c1.1 0 2-.9 2-2v-1.8l1.35-1.35C16.77 9.82 17 10.88 17 12c0 2.76-2.24 5-5 5z" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    title: translate({
      message: '围绕用户旅程提升信息体验',
      id: 'homepage.feature.ux',
    }),
    description: translate({
      message: '我们相信优秀的文档应贯穿用户的完整旅程：从初次接触到深入实践，从问题排查到进阶扩展。通过渐进式内容设计，帮助关键信息高效触达用户。',
      id: 'homepage.feature.ux.description',
    }),
    header: (
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-1 shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/25 dark:from-emerald-900 dark:via-teal-900/50 dark:to-cyan-900/30">
        {/* 用户旅程主题背景 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* 内容区域 */}
        <div className="relative h-56 overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl dark:bg-gray-900/90">
          {/* 用户旅程路径背景 */}
          <div className="absolute inset-0">
            {/* 路径点 */}
            <div className="absolute left-6 top-8 size-2 rounded-full bg-emerald-400/70 animate-pulse" />
            <div className="absolute left-20 top-16 size-2 rounded-full bg-teal-400/70 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute right-20 top-12 size-2 rounded-full bg-cyan-400/70 animate-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="absolute right-8 bottom-12 size-2 rounded-full bg-emerald-400/70 animate-pulse" style={{ animationDelay: '0.9s' }} />
            
            {/* 连接路径 */}
            <svg className="absolute inset-0 size-full opacity-30" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M20 40 Q60 20 100 60 T180 80" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse" />
              <path d="M40 160 Q100 140 160 120" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeDasharray="3,3" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            </svg>
          </div>
          
          {/* 主要内容 */}
          <div className="flex h-full items-center justify-center p-8">
            <div className="relative">
              {/* 用户体验光环 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-200/60 to-cyan-300/60 blur-2xl scale-150 transition-transform duration-700 group-hover:scale-175 group-hover:rotate-90 dark:from-emerald-800/40 dark:to-cyan-700/40" />
              
              {/* SVG 容器 */}
              <div className="relative flex size-28 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/60 to-emerald-50/80 shadow-2xl backdrop-blur-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 dark:border-gray-700/30 dark:from-gray-800/60 dark:to-emerald-900/80">
                <OpenSourceSvg
                  className="transition-all duration-1000 group-hover:scale-105"
                  style={{
                    width: '85px',
                    height: '85px',
                    filter: 'drop-shadow(0 8px 16px rgba(16, 185, 129, 0.4))',
                  }}
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
            </div>
          </div>
          
          {/* 底部渐变 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-50/80 to-transparent dark:from-emerald-900/40" />
        </div>
      </div>
    ),
    icon: (
      <div className="group relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-600 opacity-75 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-md" />
        <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg transition-all duration-300 group-hover:scale-110">
          <svg className="size-6 text-white transition-transform duration-300 group-hover:rotate-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </div>
    ),
  },
]

export default FEATURES
