import React, { useEffect, useRef, useState } from 'react'
import type { Locale } from './model'
import styles from './styles.module.css'

type Props = { running: boolean, reduced: boolean, locale: Locale }

/**
 * Modern vector pipeline connection streams connecting Source -> Engine -> Browser.
 * High-performance, razor-sharp on all screen resolutions, zero WebGL overhead.
 */
export default function Scene({ running, reduced }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [paths, setPaths] = useState<{ p1: string, p2: string, p3: string, p4: string, p5: string, p6: string }>({
    p1: '', p2: '', p3: '', p4: '', p5: '', p6: '',
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updatePaths = () => {
      const parent = container.parentElement
      if (!parent) return
      const parentRect = parent.getBoundingClientRect()
      const width = parentRect.width
      const height = parentRect.height

      if (width < 800) {
        // Handled via stacked layout on mobile
        setPaths({ p1: '', p2: '', p3: '', p4: '', p5: '', p6: '' })
        return
      }

      // Column approximate boundary percentages based on 34% / 28% / 38%
      const col1Right = width * 0.33
      const col2Left = width * 0.36
      const col2Right = width * 0.61
      const col3Left = width * 0.65

      const midY = height * 0.45

      // Source to Engine lines (3 inputs converging to engine)
      const y1 = height * 0.30
      const y2 = height * 0.45
      const y3 = height * 0.60
      const engineInY = height * 0.48

      const p1 = `M ${col1Right} ${y1} C ${col1Right + 30} ${y1}, ${col2Left - 30} ${engineInY - 20}, ${col2Left} ${engineInY - 20}`
      const p2 = `M ${col1Right} ${y2} C ${col1Right + 30} ${y2}, ${col2Left - 30} ${engineInY}, ${col2Left} ${engineInY}`
      const p3 = `M ${col1Right} ${y3} C ${col1Right + 30} ${y3}, ${col2Left - 30} ${engineInY + 20}, ${col2Left} ${engineInY + 20}`

      // Engine to Browser lines (engine output to browser inputs)
      const engineOutY = height * 0.48
      const targetY1 = height * 0.32
      const targetY2 = height * 0.48
      const targetY3 = height * 0.64

      const p4 = `M ${col2Right} ${engineOutY - 15} C ${col2Right + 30} ${engineOutY - 15}, ${col3Left - 30} ${targetY1}, ${col3Left} ${targetY1}`
      const p5 = `M ${col2Right} ${engineOutY} C ${col2Right + 30} ${engineOutY}, ${col3Left - 30} ${targetY2}, ${col3Left} ${targetY2}`
      const p6 = `M ${col2Right} ${engineOutY + 15} C ${col2Right + 30} ${engineOutY + 15}, ${col3Left - 30} ${targetY3}, ${col3Left} ${targetY3}`

      setPaths({ p1, p2, p3, p4, p5, p6 })
    }

    updatePaths()
    const ro = new ResizeObserver(updatePaths)
    ro.observe(container.parentElement || container)

    return () => ro.disconnect()
  }, [])

  if (!paths.p1) return null

  return (
    <div ref={containerRef} className={styles.scene} aria-hidden="true">
      <svg className={styles.pipelineSvg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--journey-stream-start, #8f85f3)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--journey-stream-mid, #6344ff)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--journey-stream-end, #a855f7)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--journey-stream-mid, #6344ff)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--journey-stream-pulse, #38bdf8)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--journey-stream-end, #10b981)" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base connecting channels */}
        <path d={paths.p1} className={styles.channelBase} />
        <path d={paths.p2} className={styles.channelBase} />
        <path d={paths.p3} className={styles.channelBase} />
        <path d={paths.p4} className={styles.channelBase} />
        <path d={paths.p5} className={styles.channelBase} />
        <path d={paths.p6} className={styles.channelBase} />

        {/* Active streaming beams */}
        <path
          d={paths.p1}
          className={`${styles.streamLine} ${running ? styles.streamingFast : styles.streamingIdle}`}
          stroke="url(#streamGrad1)"
        />
        <path
          d={paths.p2}
          className={`${styles.streamLine} ${running ? styles.streamingFast : styles.streamingIdle}`}
          stroke="url(#streamGrad1)"
        />
        <path
          d={paths.p3}
          className={`${styles.streamLine} ${running ? styles.streamingFast : styles.streamingIdle}`}
          stroke="url(#streamGrad1)"
        />

        <path
          d={paths.p4}
          className={`${styles.streamLine} ${running ? styles.streamingFast : styles.streamingIdle}`}
          stroke="url(#streamGrad2)"
        />
        <path
          d={paths.p5}
          className={`${styles.streamLine} ${running ? styles.streamingFast : styles.streamingIdle}`}
          stroke="url(#streamGrad2)"
        />
        <path
          d={paths.p6}
          className={`${styles.streamLine} ${running ? styles.streamingFast : styles.streamingIdle}`}
          stroke="url(#streamGrad2)"
        />

        {/* Animated conveyor chips: multiple files assembling into engine and outputs */}
        {!reduced && (
          <>
            {/* Input chips from Source to Engine */}
            <g className={styles.chipNode}>
              <animateMotion path={paths.p1} dur={running ? '1.4s' : '4.6s'} repeatCount="indefinite" />
              <rect x="-30" y="-10" width="60" height="20" rx="5" fill="var(--card-bg)" stroke="#8167ff" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#8167ff" fontFamily="ui-monospace, SFMono-Regular, monospace">
                start.md
              </text>
            </g>

            <g className={styles.chipNode}>
              <animateMotion path={paths.p2} dur={running ? '1.4s' : '4.6s'} begin={running ? '0.25s' : '0.9s'} repeatCount="indefinite" />
              <rect x="-34" y="-10" width="68" height="20" rx="5" fill="var(--card-bg)" stroke="#a855f7" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#a855f7" fontFamily="ui-monospace, SFMono-Regular, monospace">
                sidebars.ts
              </text>
            </g>

            <g className={styles.chipNode}>
              <animateMotion path={paths.p3} dur={running ? '1.4s' : '4.6s'} begin={running ? '0.5s' : '1.8s'} repeatCount="indefinite" />
              <rect x="-32" y="-10" width="64" height="20" rx="5" fill="var(--card-bg)" stroke="#6344ff" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#6344ff" fontFamily="ui-monospace, SFMono-Regular, monospace">
                theme.css
              </text>
            </g>

            {/* Output chips from Engine to Browser */}
            <g className={styles.chipNode}>
              <animateMotion path={paths.p4} dur={running ? '1.4s' : '4.6s'} begin={running ? '0.2s' : '0.8s'} repeatCount="indefinite" />
              <rect x="-33" y="-10" width="66" height="20" rx="5" fill="var(--card-bg)" stroke="#10b981" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#10b981" fontFamily="ui-monospace, SFMono-Regular, monospace">
                index.html
              </text>
            </g>

            <g className={styles.chipNode}>
              <animateMotion path={paths.p5} dur={running ? '1.4s' : '4.6s'} begin={running ? '0.45s' : '1.7s'} repeatCount="indefinite" />
              <rect x="-31" y="-10" width="62" height="20" rx="5" fill="var(--card-bg)" stroke="#38bdf8" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#38bdf8" fontFamily="ui-monospace, SFMono-Regular, monospace">
                bundle.js
              </text>
            </g>

            <g className={styles.chipNode}>
              <animateMotion path={paths.p6} dur={running ? '1.4s' : '4.6s'} begin={running ? '0.7s' : '2.6s'} repeatCount="indefinite" />
              <rect x="-31" y="-10" width="62" height="20" rx="5" fill="var(--card-bg)" stroke="#10b981" strokeWidth="1.2" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#10b981" fontFamily="ui-monospace, SFMono-Regular, monospace">
                style.css
              </text>
            </g>

            {/* Animated packet pulses on active compilation */}
            {running && (
              <>
                <circle r="4" fill="#a855f7" filter="url(#glowEffect)" className={styles.particle}>
                  <animateMotion path={paths.p1} dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#6344ff" filter="url(#glowEffect)" className={styles.particle}>
                  <animateMotion path={paths.p2} dur="1.2s" begin="0.2s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#8f85f3" filter="url(#glowEffect)" className={styles.particle}>
                  <animateMotion path={paths.p3} dur="1.2s" begin="0.4s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#38bdf8" filter="url(#glowEffect)" className={styles.particle}>
                  <animateMotion path={paths.p4} dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#10b981" filter="url(#glowEffect)" className={styles.particle}>
                  <animateMotion path={paths.p5} dur="1.2s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#38bdf8" filter="url(#glowEffect)" className={styles.particle}>
                  <animateMotion path={paths.p6} dur="1.2s" begin="1.0s" repeatCount="indefinite" />
                </circle>
              </>
            )}
          </>
        )}
      </svg>
    </div>
  )
}
