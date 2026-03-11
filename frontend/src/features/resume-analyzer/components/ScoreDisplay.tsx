import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";

interface ScoreDisplayProps {
  score: number;
}




export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const theme = scoreTheme(score);

  const size = 224;
  const center = size / 2;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;

  const springScore = useSpring(0, { stiffness: 60, damping: 18 });
  const displayScore = useTransform(springScore, (v) => Math.round(v));

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  return (
    <Card className="relative overflow-hidden border-0 bg-black/30 backdrop-blur-xl">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

      <CardContent className="relative z-10 p-10">
        <div className="flex flex-col items-center justify-center">
          <p className="mb-8 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
            Match Probability
          </p>

          <div className="relative flex h-56 w-56 items-center justify-center">
            {/* Outer glow */}
            <div
              className={`absolute inset-0 rounded-full blur-[70px] opacity-15 ${theme.glow}`}
            />

            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90 overflow-visible"
            >
              <defs>
                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>

                <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                strokeWidth="6"
                fill="transparent"
                className="text-white/10"
                stroke="currentColor"
              />

              {/* Progress */}
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                stroke={`url(#${theme.gradient})`}
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset: circumference * (1 - score / 100),
                }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="drop-shadow-[0_0_16px_rgba(0,0,0,0.35)]"
              />
            </svg>

            {/* Center content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="flex items-baseline">
                <motion.span
                  className={`text-7xl font-black tracking-tight ${theme.text}`}
                >
                  {displayScore}
                </motion.span>
                <span className={`ml-1 text-2xl font-bold opacity-40 ${theme.text}`}>
                  %
                </span>
              </div>

              <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                Match Score
              </span>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* helpers */

function scoreTheme(score: number) {
  if (score >= 80) {
    return {
      text: "text-emerald-400",
      glow: "bg-emerald-400",
      gradient: "emeraldGradient",
    };
  }
  if (score >= 60) {
    return {
      text: "text-amber-400",
      glow: "bg-amber-400",
      gradient: "amberGradient",
    };
  }
  return {
    text: "text-rose-400",
    glow: "bg-rose-400",
    gradient: "roseGradient",
  };
}

