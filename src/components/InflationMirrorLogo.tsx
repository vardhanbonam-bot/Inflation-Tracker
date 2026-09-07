import React, { useState } from 'react';
import { motion } from 'motion/react';

interface InflationMirrorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: {
    container: 'w-8 h-8',
    radius: 'rounded-lg',
    innerRadius: 'rounded-[7px]',
    sparkleSize: 10,
    strokeWidth: 2,
    nodeRadius: 3
  },
  md: {
    container: 'w-10 h-10',
    radius: 'rounded-xl',
    innerRadius: 'rounded-[10px]',
    sparkleSize: 13,
    strokeWidth: 2.5,
    nodeRadius: 4
  },
  lg: {
    container: 'w-16 h-16',
    radius: 'rounded-2xl',
    innerRadius: 'rounded-[14px]',
    sparkleSize: 18,
    strokeWidth: 3.5,
    nodeRadius: 5
  },
  xl: {
    container: 'w-24 h-24',
    radius: 'rounded-3xl',
    innerRadius: 'rounded-[22px]',
    sparkleSize: 24,
    strokeWidth: 4.5,
    nodeRadius: 7
  }
};

export const InflationMirrorLogo: React.FC<InflationMirrorLogoProps> = ({
  size = 'md',
  interactive = true,
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dims = SIZE_MAP[size];

  return (
    <motion.div
      className={`relative select-none flex items-center justify-center shrink-0 cursor-pointer ${dims.container} ${className}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        y: interactive ? [-1.5, 1.5, -1.5] : 0,
        rotate: interactive ? [-0.5, 0.5, -0.5] : 0
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      whileHover={interactive ? { scale: 1.08 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
    >
      {/* 1. Ambient Background Glow */}
      <motion.div
        className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr from-teal-500/30 via-sky-500/20 to-indigo-500/30 blur-md pointer-events-none`}
        animate={{
          opacity: isHovered ? 0.9 : 0.45,
          scale: isHovered ? 1.15 : 1
        }}
        transition={{ duration: 0.4 }}
      />

      {/* 2. Prismatic Outer Bevel Rim */}
      <div
        className={`relative w-full h-full p-[1.5px] ${dims.radius} bg-gradient-to-br from-teal-400 via-sky-400 to-indigo-500 shadow-lg shadow-teal-500/20`}
      >
        {/* 3. Deep Obsidian Glass Chamber */}
        <div
          className={`relative w-full h-full ${dims.innerRadius} bg-slate-950 overflow-hidden flex items-center justify-center border border-white/10`}
        >
          {/* Subtle Background Refraction Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-slate-950 to-indigo-950/40" />

          {/* Micro Grid Texture simulating Financial Depth */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: '20% 20%'
            }}
          />

          {/* 4. Core Theme Vector Graphics (The Inflation Mirror Optics) */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10 p-[12%]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="mirrorTrendGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>

              <filter id="vectorGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Baseline Inflation Benchmark (Subtle dotted trend) */}
            <path
              d="M 12 76 Q 45 68 88 56"
              stroke="#64748b"
              strokeWidth={dims.strokeWidth}
              strokeDasharray="4 3"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* The Mirrored Personal Inflation Laser Curve */}
            <motion.path
              d="M 12 72 Q 40 60 85 24"
              stroke="url(#mirrorTrendGrad)"
              strokeWidth={dims.strokeWidth * 1.5}
              strokeLinecap="round"
              filter="url(#vectorGlow)"
              initial={{ pathLength: 0.8 }}
              animate={{
                pathLength: [0.85, 1, 0.85]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Apex Reflection Pulse Node (The personal inflation peak) */}
            <g transform="translate(85, 24)">
              {/* Outer expanding ripple */}
              <motion.circle
                r={dims.nodeRadius * 1.8}
                stroke="#38bdf8"
                strokeWidth="1.5"
                fill="none"
                animate={{
                  scale: [1, 2.2, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
              {/* Inner luminous core */}
              <circle
                r={dims.nodeRadius}
                fill="#2dd4bf"
                filter="drop-shadow(0 0 4px #2dd4bf)"
              />
            </g>

            {/* Mirrored Reflection Prism Axes */}
            <line
              x1="50"
              y1="14"
              x2="50"
              y2="86"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </svg>

          {/* 5. Sweeping Mirror Glass Sheen Animation */}
          <motion.div
            className="absolute -inset-full w-[300%] h-[300%] pointer-events-none"
            style={{
              background:
                'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)'
            }}
            animate={{
              x: ['-100%', '100%'],
              y: ['-100%', '100%']
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              repeatDelay: 2.2,
              ease: 'easeInOut'
            }}
          />

          {/* Glass Specular Edge Glint (Top-left) */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>

      {/* 6. Corner Prismatic Diamond Sparkle */}
      <motion.div
        className="absolute -top-1 -right-1 text-white z-20 pointer-events-none"
        animate={{
          scale: [0.8, 1.25, 0.8],
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <svg
          width={dims.sparkleSize}
          height={dims.sparkleSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="url(#sparkleGrad)"
          />
          <defs>
            <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
};
