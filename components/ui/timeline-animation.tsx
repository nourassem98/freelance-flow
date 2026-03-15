"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface TimelineContentProps {
  animationNum: number
  timelineRef: React.RefObject<HTMLDivElement | null>
  customVariants?: any
  className?: string
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
}

export function TimelineContent({
  animationNum,
  timelineRef,
  customVariants,
  className,
  children,
  as = "div",
}: TimelineContentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: animationNum * 0.4,
        duration: 0.5,
      },
    },
  }

  const variants = customVariants || defaultVariants

  const MotionComponent = motion(as as any)

  return (
    <MotionComponent
      ref={contentRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}