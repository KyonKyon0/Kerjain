"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Star, 
  Wrench, 
  Zap, 
  Home, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ShieldCheck, 
  MapPin,
  Briefcase,
  TrendingUp,
  Cpu,
  Building2,
  Lock,
  Globe2,
  HeartHandshake,
  Users,
  Award,
  Sparkles,
  Smartphone,
  QrCode,
  Scale,
  Compass,
  DollarSign,
  Layers,
  ArrowUpRight,
  Truck,
  Flame,
  Check,
  Radio,
  Clock,
  Eye,
  Activity,
  Landmark,
  Coins,
  LayoutGrid,
  Image as ImageIcon,
  Wallet,
  Menu,
  X,
  Bell,
  SlidersHorizontal,
  Coffee,
  ShoppingBag,
  Utensils,
  Scissors,
  Lightbulb,
  Heart,
  Sun,
  Wifi,
  Package,
  Crown,
  Gem,
  Rocket,
  Plane,
  Camera,
  Music,
  Headphones,
  BookOpen,
  Watch,
  Palette,
  Key,
  Gift,
  ThumbsUp,
  Send,
  MessageSquare,
  Footprints,
  Smile,
  CloudRain,
  Target,
  Flag,
  Shield,
  Laptop,
  Hammer,
  Car,
  Bike,
  CupSoda
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, MotionValue } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 1. NIGHT SKY WITH TWINKLING STARS BACKGROUND (OPTIMIZED 60FPS)
function NightSkyCosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const starCount = Math.min(Math.floor((width * height) / 12000), 80);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        const alpha =
          star.baseAlpha +
          Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, Math.min(1, alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
}

// 2. GEOMETRIC BAUHAUS DOODLE SILHOUETTES (Reference Style: Minimalist Geometric Graphic Vectors)
function DoodleArrow({ className = "w-7 h-7 text-cyan-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M15 15 L85 45 L54 54 L45 85 Z" />
    </svg>
  );
}

function DoodleStar({ className = "w-7 h-7 text-yellow-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 5 Q50 50 95 50 Q50 50 50 95 Q50 50 5 50 Q50 50 50 5 Z" />
    </svg>
  );
}

function DoodleBulb({ className = "w-7 h-7 text-amber-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <circle cx="50" cy="42" r="28" />
      <path d="M40 36 A16 16 0 0 1 60 36" fill="none" stroke="#070b14" strokeWidth="6" strokeLinecap="round" />
      <rect x="40" y="70" width="20" height="12" rx="3" />
      <path d="M50 6 L50 0 M20 15 L15 10 M80 15 L85 10 M8 42 L2 42 M92 42 L98 42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function DoodleEye({ className = "w-7 h-7 text-purple-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M15 50 Q50 18 85 50 Q50 82 15 50 Z" />
      <circle cx="50" cy="50" r="14" fill="#070b14" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      <line x1="28" y1="28" x2="22" y2="18" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="22" x2="50" y2="10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="72" y1="28" x2="78" y2="18" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function DoodlePencil({ className = "w-7 h-7 text-emerald-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <rect x="30" y="20" width="38" height="20" rx="3" transform="rotate(-45 45 35)" />
      <polygon points="12,58 20,78 40,70" />
    </svg>
  );
}

function DoodleDrop({ className = "w-7 h-7 text-blue-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 12 C50 12 20 50 20 68 A30 30 0 0 0 80 68 C80 50 50 12 50 12 Z" />
      <circle cx="42" cy="65" r="6" fill="#070b14" />
    </svg>
  );
}

function DoodleCoffee({ className = "w-7 h-7 text-amber-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <rect x="20" y="35" width="45" height="40" rx="6" />
      <path d="M65 45 C78 45 78 65 65 65" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <line x1="15" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 25 Q35 15 30 5 M45 25 Q50 15 45 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function DoodleStairs({ className = "w-7 h-7 text-teal-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <polygon points="20,80 20,60 40,60 40,40 60,40 60,20 80,20 80,80" />
    </svg>
  );
}

function DoodleChevron({ className = "w-7 h-7 text-rose-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M25 25 L50 50 L25 75 M55 25 L80 50 L55 75" />
    </svg>
  );
}

function DoodleSun({ className = "w-7 h-7 text-yellow-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <circle cx="50" cy="50" r="22" />
      <path d="M50 10 L50 0 M50 90 L50 100 M10 50 L0 50 M90 50 L100 50 M22 22 L14 14 M78 78 L86 86 M22 78 L14 86 M78 22 L86 14" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function DoodleSpark({ className = "w-6 h-6 text-emerald-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <polygon points="50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38" />
    </svg>
  );
}

function DoodleShield({ className = "w-7 h-7 text-purple-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 15 L80 28 V55 C80 75 50 90 50 90 C50 90 20 75 20 55 V28 Z" />
    </svg>
  );
}

// 3. ULTRA-DENSE SEAMLESS INFINITE LOOPING BAUHAUS & LIFESTYLE ICONS HIGHWAY
function LoopingDoodleRow({
  icons,
  direction = "left",
  speed = 40,
  top,
  bottom,
  scrollX,
  opacity,
}: {
  icons: React.ReactNode[];
  direction?: "left" | "right";
  speed?: number;
  top?: string;
  bottom?: string;
  scrollX?: MotionValue<number>;
  opacity?: MotionValue<number>;
}) {
  return (
    <motion.div 
      style={{
        ...(top ? { top } : {}),
        ...(bottom ? { bottom } : {}),
        ...(opacity ? { opacity } : {}),
      }}
      className="absolute left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-10 flex items-center h-10 sm:h-12"
    >
      <motion.div 
        style={scrollX ? { x: scrollX } : undefined}
        className="w-full flex shrink-0"
      >
        <motion.div
          animate={{
            x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
          }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex shrink-0 items-center gap-10 sm:gap-14 whitespace-nowrap min-w-full"
        >
          {/* Set 1 */}
          <div className="flex items-center gap-10 sm:gap-14 shrink-0">
            {icons.map((icon, idx) => (
              <div key={`s1-${idx}`} className="shrink-0 flex items-center justify-center">
                {icon}
              </div>
            ))}
          </div>
          {/* Set 2 (Seamless loop replica) */}
          <div className="flex items-center gap-10 sm:gap-14 shrink-0">
            {icons.map((icon, idx) => (
              <div key={`s2-${idx}`} className="shrink-0 flex items-center justify-center">
                {icon}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function DenseGeometricDoodleBackground({
  mushroomOpacityLayer1,
  mushroomOpacityLayer2,
  rowSlideLeft,
  rowSlideRight,
}: {
  mushroomOpacityLayer1?: MotionValue<number>;
  mushroomOpacityLayer2?: MotionValue<number>;
  rowSlideLeft?: MotionValue<number>;
  rowSlideRight?: MotionValue<number>;
}) {
  // Diverse icon sets for each row (14-16 icons each, looping endlessly)
  const topRow1Icons = [
    <div key="t1-1" className="text-emerald-400 opacity-25"><DoodleBulb className="w-8 h-8 sm:w-10 sm:h-10" /></div>,
    <div key="t1-2" className="text-cyan-400 opacity-25"><Rocket className="w-6 h-6 sm:w-8 sm:h-8 rotate-12" /></div>,
    <div key="t1-3" className="text-purple-400 opacity-25"><DoodleEye className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t1-4" className="text-yellow-400 opacity-25"><Sparkles className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t1-5" className="text-rose-400 opacity-25"><Crown className="w-6 h-6 sm:w-8 sm:h-8 rotate-6" /></div>,
    <div key="t1-6" className="text-blue-400 opacity-25"><Camera className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t1-7" className="text-emerald-300 opacity-25"><DoodleStairs className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t1-8" className="text-amber-400 opacity-25"><Coffee className="w-6 h-6 sm:w-8 sm:h-8 -rotate-12" /></div>,
    <div key="t1-9" className="text-teal-400 opacity-25"><Zap className="w-6 h-6 sm:w-8 sm:h-8 rotate-12" /></div>,
    <div key="t1-10" className="text-pink-400 opacity-25"><Heart className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t1-11" className="text-yellow-300 opacity-25"><DoodleStar className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t1-12" className="text-cyan-400 opacity-25"><Plane className="w-6 h-6 sm:w-8 sm:h-8 -rotate-12" /></div>,
    <div key="t1-13" className="text-purple-400 opacity-25"><DoodleShield className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t1-14" className="text-emerald-400 opacity-25"><Palette className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const topRow2Icons = [
    <div key="t2-1" className="text-cyan-400 opacity-25"><DoodleSpark className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t2-2" className="text-amber-400 opacity-25"><Palette className="w-6 h-6 sm:w-8 sm:h-8 rotate-12" /></div>,
    <div key="t2-3" className="text-emerald-400 opacity-25"><DoodlePencil className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t2-4" className="text-rose-400 opacity-25"><Flame className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t2-5" className="text-purple-400 opacity-25"><Gem className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t2-6" className="text-teal-300 opacity-25"><DoodleChevron className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t2-7" className="text-cyan-400 opacity-25"><Compass className="w-6 h-6 sm:w-8 sm:h-8 rotate-45" /></div>,
    <div key="t2-8" className="text-yellow-400 opacity-25"><Award className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t2-9" className="text-blue-400 opacity-25"><Music className="w-6 h-6 sm:w-8 sm:h-8 -rotate-6" /></div>,
    <div key="t2-10" className="text-purple-400 opacity-25"><Headphones className="w-6 h-6 sm:w-8 sm:h-8 rotate-12" /></div>,
    <div key="t2-11" className="text-emerald-400 opacity-25"><Cpu className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t2-12" className="text-yellow-400 opacity-25"><DoodleSun className="w-7 h-7 sm:w-10 sm:h-10" /></div>,
    <div key="t2-13" className="text-emerald-400 opacity-25"><Key className="w-6 h-6 sm:w-8 sm:h-8 rotate-45" /></div>,
    <div key="t2-14" className="text-rose-400 opacity-25"><Scissors className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const topRow3Icons = [
    <div key="t3-1" className="text-purple-400 opacity-25"><DoodleEye className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-2" className="text-emerald-400 opacity-25"><DoodleBulb className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-3" className="text-yellow-400 opacity-25"><DoodleStar className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-4" className="text-blue-400 opacity-25"><DoodleDrop className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t3-5" className="text-amber-400 opacity-25"><DoodleCoffee className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-6" className="text-cyan-400 opacity-25"><DoodleArrow className="w-8 h-8 sm:w-10 sm:h-10" /></div>,
    <div key="t3-7" className="text-rose-400 opacity-25"><Smile className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t3-8" className="text-teal-300 opacity-25"><DoodleStairs className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-9" className="text-purple-400 opacity-25"><DoodleShield className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-10" className="text-yellow-400 opacity-25"><DoodleSun className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="t3-11" className="text-rose-400 opacity-25"><DoodleChevron className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t3-12" className="text-cyan-400 opacity-25"><Rocket className="w-6 h-6 sm:w-8 sm:h-8 rotate-45" /></div>,
    <div key="t3-13" className="text-blue-400 opacity-25"><Laptop className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const topRow4Icons = [
    <div key="t4-1" className="text-amber-400 opacity-25"><Coffee className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-2" className="text-teal-400 opacity-25"><DoodleSpark className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-3" className="text-blue-400 opacity-25"><Laptop className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-4" className="text-purple-400 opacity-25"><Gem className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-5" className="text-emerald-400 opacity-25"><DoodlePencil className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-6" className="text-yellow-300 opacity-25"><Sparkles className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-7" className="text-pink-400 opacity-25"><Heart className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-8" className="text-cyan-400 opacity-25"><Compass className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-9" className="text-amber-400 opacity-25"><ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-10" className="text-emerald-300 opacity-25"><DoodleBulb className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-11" className="text-purple-400 opacity-25"><DoodleEye className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-12" className="text-teal-400 opacity-25"><Zap className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-13" className="text-yellow-400 opacity-25"><DoodleStar className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="t4-14" className="text-amber-400 opacity-25"><Utensils className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const bottomRow1Icons = [
    <div key="b1-1" className="text-emerald-400 opacity-25"><DoodleStairs className="w-8 h-8 sm:w-10 sm:h-10" /></div>,
    <div key="b1-2" className="text-teal-400 opacity-25"><Footprints className="w-6 h-6 sm:w-8 sm:h-8 rotate-12" /></div>,
    <div key="b1-3" className="text-rose-400 opacity-25"><DoodleChevron className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b1-4" className="text-cyan-400 opacity-25"><Send className="w-6 h-6 sm:w-8 sm:h-8 -rotate-12" /></div>,
    <div key="b1-5" className="text-purple-400 opacity-25"><DoodleEye className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b1-6" className="text-yellow-400 opacity-25"><DoodleStar className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b1-7" className="text-amber-400 opacity-25"><CupSoda className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b1-8" className="text-emerald-400 opacity-25"><ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 rotate-6" /></div>,
    <div key="b1-9" className="text-blue-400 opacity-25"><DoodleDrop className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b1-10" className="text-teal-400 opacity-25"><MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b1-11" className="text-emerald-400 opacity-25"><DoodleStairs className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b1-12" className="text-purple-400 opacity-25"><BookOpen className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b1-13" className="text-cyan-400 opacity-25"><Rocket className="w-6 h-6 sm:w-8 sm:h-8 rotate-45" /></div>,
    <div key="b1-14" className="text-teal-400 opacity-25"><Car className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const bottomRow2Icons = [
    <div key="b2-1" className="text-yellow-400 opacity-25"><Sparkles className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b2-2" className="text-rose-400 opacity-25"><CloudRain className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b2-3" className="text-teal-400 opacity-25"><DoodleSun className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b2-4" className="text-amber-400 opacity-25"><DoodleCoffee className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b2-5" className="text-emerald-400 opacity-25"><DoodleBulb className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b2-6" className="text-cyan-400 opacity-25"><Scissors className="w-6 h-6 sm:w-8 sm:h-8 -rotate-45" /></div>,
    <div key="b2-7" className="text-purple-400 opacity-25"><DoodleShield className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b2-8" className="text-yellow-300 opacity-25"><DoodleStar className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b2-9" className="text-rose-400 opacity-25"><Heart className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b2-10" className="text-teal-300 opacity-25"><DoodlePencil className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b2-11" className="text-blue-400 opacity-25"><Flag className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b2-12" className="text-amber-400 opacity-25"><Coffee className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b2-13" className="text-yellow-400 opacity-25"><Zap className="w-6 h-6 sm:w-8 sm:h-8 -rotate-12" /></div>,
    <div key="b2-14" className="text-amber-400 opacity-25"><Bike className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const bottomRow3Icons = [
    <div key="b3-1" className="text-emerald-400 opacity-25"><CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b3-2" className="text-teal-400 opacity-25"><DoodleSun className="w-8 h-8 sm:w-10 sm:h-10" /></div>,
    <div key="b3-3" className="text-rose-400 opacity-25"><Smile className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b3-4" className="text-purple-400 opacity-25"><DoodleShield className="w-8 h-8 sm:w-10 sm:h-10" /></div>,
    <div key="b3-5" className="text-cyan-400 opacity-25"><Rocket className="w-6 h-6 sm:w-8 sm:h-8 rotate-45" /></div>,
    <div key="b3-6" className="text-emerald-400 opacity-25"><DoodleStairs className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b3-7" className="text-purple-400 opacity-25"><DoodleEye className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b3-8" className="text-amber-400 opacity-25"><DoodleCoffee className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b3-9" className="text-teal-400 opacity-25"><DoodleSpark className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b3-10" className="text-yellow-400 opacity-25"><Crown className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b3-11" className="text-blue-400 opacity-25"><DoodleDrop className="w-7 h-7 sm:w-9 sm:h-9" /></div>,
    <div key="b3-12" className="text-rose-400 opacity-25"><DoodleChevron className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b3-13" className="text-rose-400 opacity-25"><Watch className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  const bottomRow4Icons = [
    <div key="b4-1" className="text-teal-400 opacity-25"><Zap className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-2" className="text-amber-400 opacity-25"><Palette className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-3" className="text-emerald-400 opacity-25"><DoodlePencil className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-4" className="text-cyan-400 opacity-25"><Compass className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-5" className="text-purple-400 opacity-25"><Gem className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-6" className="text-yellow-300 opacity-25"><Sparkles className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-7" className="text-pink-400 opacity-25"><Heart className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-8" className="text-emerald-300 opacity-25"><DoodleBulb className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-9" className="text-amber-400 opacity-25"><ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-10" className="text-blue-400 opacity-25"><Laptop className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-11" className="text-purple-400 opacity-25"><DoodleEye className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-12" className="text-yellow-400 opacity-25"><DoodleStar className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-13" className="text-emerald-400 opacity-25"><Key className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
    <div key="b4-14" className="text-emerald-400 opacity-25"><Wrench className="w-6 h-6 sm:w-8 sm:h-8" /></div>,
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* TOP ZONE: 4 INFINITE LOOPING HIGHWAYS (SELANG-SELING KIRI & KANAN)        */}
      {/* ========================================================================= */}
      {/* Row 1 (top: 2% - Endless Marquee Left + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={topRow1Icons} 
        direction="left" 
        speed={38} 
        top="2%" 
        scrollX={rowSlideLeft} 
      />

      {/* Row 2 (top: 7% - Endless Marquee Right + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={topRow2Icons} 
        direction="right" 
        speed={44} 
        top="7%" 
        scrollX={rowSlideRight} 
      />

      {/* Row 3 (top: 13% - Endless Marquee Left + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={topRow3Icons} 
        direction="left" 
        speed={40} 
        top="13%" 
        scrollX={rowSlideLeft} 
      />

      {/* Row 4 (top: 19% - Endless Marquee Right + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={topRow4Icons} 
        direction="right" 
        speed={46} 
        top="19%" 
        scrollX={rowSlideRight} 
      />

      {/* ========================================================================= */}
      {/* BOTTOM ZONE: 4 INFINITE LOOPING HIGHWAYS (SELANG-SELING KANAN & KIRI)     */}
      {/* ========================================================================= */}
      {/* Row 1 (bottom: 2% - Endless Marquee Right + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={bottomRow1Icons} 
        direction="right" 
        speed={36} 
        bottom="2%" 
        scrollX={rowSlideRight} 
      />

      {/* Row 2 (bottom: 7% - Endless Marquee Left + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={bottomRow2Icons} 
        direction="left" 
        speed={42} 
        bottom="7%" 
        scrollX={rowSlideLeft} 
      />

      {/* Row 3 (bottom: 13% - Endless Marquee Right + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={bottomRow3Icons} 
        direction="right" 
        speed={48} 
        bottom="13%" 
        scrollX={rowSlideRight} 
      />

      {/* Row 4 (bottom: 19% - Endless Marquee Left + Scroll Parallax) */}
      <LoopingDoodleRow 
        icons={bottomRow4Icons} 
        direction="left" 
        speed={40} 
        bottom="19%" 
        scrollX={rowSlideLeft} 
      />

      {/* Multiplicative Layer (Endlessly Looping on Zoom-Out) */}
      {mushroomOpacityLayer1 && (
        <>
          <LoopingDoodleRow 
            icons={topRow2Icons} 
            direction="left" 
            speed={30} 
            top="16%" 
            opacity={mushroomOpacityLayer1} 
            scrollX={rowSlideLeft} 
          />
          <LoopingDoodleRow 
            icons={bottomRow2Icons} 
            direction="right" 
            speed={32} 
            bottom="16%" 
            opacity={mushroomOpacityLayer1} 
            scrollX={rowSlideRight} 
          />
        </>
      )}
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Butter-Smooth Physics-Based Spring Interpolation (Eliminates Scroll Wheel Notch Jitter)
  const smoothHeroProgress = useSpring(heroScrollProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  // Hero Sticky Scroll: Smooth elevation (-240px) & crisp zoom (1.0 -> 1.55x)
  const heroTextOpacity = useTransform(smoothHeroProgress, [0, 0.32], [1, 0]);
  const heroImageY = useTransform(smoothHeroProgress, [0, 0.72], [0, -240]);
  const heroImageScale = useTransform(smoothHeroProgress, [0, 0.72], [1.0, 1.55]);
  const heroSectionOpacity = useTransform(smoothHeroProgress, [0.65, 0.9], [1, 0]);

  // Sticky Scroll Pinned Zoom-Out & Curtain Opening for "Keunggulan Platform Cerdas"
  const keunggulanRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: keunggulanScrollProgress } = useScroll({
    target: keunggulanRef,
    offset: ["start start", "end end"],
  });

  const smoothKeunggulanProgress = useSpring(keunggulanScrollProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  // 1. Grid Zoom Out: starts zoomed-in close (1.28x), zooms out smoothly to fit the whole canvas (1.0x on desktop, 0.70x on mobile)
  const bentoGridScale = useTransform(smoothKeunggulanProgress, [0, 0.7], [1.28, 1.0]);
  const bentoGridScaleMobile = useTransform(smoothKeunggulanProgress, [0, 0.7], [1.06, 0.70]);

  // 2. Physical Center Gap Expansion (0px initially -> completely rapat/joined, expands gradually as curtain opens):
  const centerGapHeight = useTransform(smoothKeunggulanProgress, [0.25, 0.68], [0, 310]);
  const centerGapHeightMobile = useTransform(smoothKeunggulanProgress, [0.25, 0.68], [0, 240]);

  // 3. Center Text Reveal: emerges smoothly between 0.25 -> 0.58 without clipping
  const centerTextOpacity = useTransform(smoothKeunggulanProgress, [0.28, 0.55], [0, 1]);
  const centerTextScale = useTransform(smoothKeunggulanProgress, [0.25, 0.62], [0.75, 1.0]);
  const centerTextY = useTransform(smoothKeunggulanProgress, [0.25, 0.62], [20, 0]);

  // 4. Background Bauhaus Doodles Multiplying & Alternating Parallax Horizontal Slide (1 Baris Kiri, 1 Baris Kanan Selang-Seling):
  const doodleMushroomOpacityLayer1 = useTransform(smoothKeunggulanProgress, [0.08, 0.45], [0, 0.28]);
  const doodleMushroomOpacityLayer2 = useTransform(smoothKeunggulanProgress, [0.25, 0.68], [0, 0.32]);
  const rowSlideLeft = useTransform(smoothKeunggulanProgress, [0, 1], [0, -100]);
  const rowSlideRight = useTransform(smoothKeunggulanProgress, [0, 1], [0, 100]);

  // 5. Section Header
  const keunggulanHeaderOpacity = useTransform(smoothKeunggulanProgress, [0, 0.25], [1, 0.85]);

  // Scroll-Pinned Unified Showcase & Impact Journey (All in ONE single seamless section)
  const showcaseContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: showcaseScrollProgress } = useScroll({
    target: showcaseContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothShowcaseProgress = useSpring(showcaseScrollProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.35,
    restDelta: 0.001,
  });

  // Stage 1: Phone Mockups Glide and Exit (Progress 0.0 -> 0.32)
  const showcaseX = useTransform(smoothShowcaseProgress, [0, 0.30], ["0%", "-130%"]);
  const showcaseTrackOpacity = useTransform(smoothShowcaseProgress, [0.24, 0.31], [1, 0]);

  // Stage 1 Header (Eksplorasi Antarmuka)
  const header1Opacity = useTransform(smoothShowcaseProgress, [0, 0.25, 0.30], [1, 1, 0]);
  const header1Y = useTransform(smoothShowcaseProgress, [0.25, 0.30], [0, -15]);

  // Stage 2: Asta Cita Header (Fades in first at 0.32, holds, then fades out at 0.62)
  const astaHeaderOpacity = useTransform(smoothShowcaseProgress, [0.32, 0.36, 0.58, 0.62], [0, 1, 1, 0]);
  const astaHeaderY = useTransform(smoothShowcaseProgress, [0.32, 0.36, 0.58, 0.62], [15, 0, 0, -15]);

  // Asta Cita (4 items): fade in sequentially from 0.38 to 0.56 (AFTER header is visible), then fade out at 0.58-0.62
  const astaCard1Opacity = useTransform(smoothShowcaseProgress, [0.38, 0.42, 0.58, 0.62], [0, 1, 1, 0]);
  const astaCard1Scale = useTransform(smoothShowcaseProgress, [0.38, 0.42], [0.88, 1]);
  const astaCard1Y = useTransform(smoothShowcaseProgress, [0.38, 0.42, 0.58, 0.62], [15, 0, 0, -15]);

  const astaCard2Opacity = useTransform(smoothShowcaseProgress, [0.43, 0.47, 0.58, 0.62], [0, 1, 1, 0]);
  const astaCard2Scale = useTransform(smoothShowcaseProgress, [0.43, 0.47], [0.88, 1]);
  const astaCard2Y = useTransform(smoothShowcaseProgress, [0.43, 0.47, 0.58, 0.62], [15, 0, 0, -15]);

  const astaCard3Opacity = useTransform(smoothShowcaseProgress, [0.48, 0.52, 0.58, 0.62], [0, 1, 1, 0]);
  const astaCard3Scale = useTransform(smoothShowcaseProgress, [0.48, 0.52], [0.88, 1]);
  const astaCard3Y = useTransform(smoothShowcaseProgress, [0.48, 0.52, 0.58, 0.62], [15, 0, 0, -15]);

  const astaCard4Opacity = useTransform(smoothShowcaseProgress, [0.53, 0.57, 0.58, 0.62], [0, 1, 1, 0]);
  const astaCard4Scale = useTransform(smoothShowcaseProgress, [0.53, 0.57], [0.88, 1]);
  const astaCard4Y = useTransform(smoothShowcaseProgress, [0.53, 0.57, 0.58, 0.62], [15, 0, 0, -15]);

  // Stage 3: SDGs Header (Fades in first at 0.63, stays visible)
  const sdgHeaderOpacity = useTransform(smoothShowcaseProgress, [0.63, 0.68], [0, 1]);
  const sdgHeaderY = useTransform(smoothShowcaseProgress, [0.63, 0.68], [15, 0]);

  // SDGs (5 items): fade in sequentially from 0.70 to 0.94 (AFTER header is visible)
  const sdgCard1Opacity = useTransform(smoothShowcaseProgress, [0.70, 0.74], [0, 1]);
  const sdgCard1Scale = useTransform(smoothShowcaseProgress, [0.70, 0.74], [0.88, 1]);
  const sdgCard1Y = useTransform(smoothShowcaseProgress, [0.70, 0.74], [15, 0]);

  const sdgCard2Opacity = useTransform(smoothShowcaseProgress, [0.75, 0.79], [0, 1]);
  const sdgCard2Scale = useTransform(smoothShowcaseProgress, [0.75, 0.79], [0.88, 1]);
  const sdgCard2Y = useTransform(smoothShowcaseProgress, [0.75, 0.79], [15, 0]);

  const sdgCard3Opacity = useTransform(smoothShowcaseProgress, [0.80, 0.84], [0, 1]);
  const sdgCard3Scale = useTransform(smoothShowcaseProgress, [0.80, 0.84], [0.88, 1]);
  const sdgCard3Y = useTransform(smoothShowcaseProgress, [0.80, 0.84], [15, 0]);

  const sdgCard4Opacity = useTransform(smoothShowcaseProgress, [0.85, 0.89], [0, 1]);
  const sdgCard4Scale = useTransform(smoothShowcaseProgress, [0.85, 0.89], [0.88, 1]);
  const sdgCard4Y = useTransform(smoothShowcaseProgress, [0.85, 0.89], [15, 0]);

  const sdgCard5Opacity = useTransform(smoothShowcaseProgress, [0.90, 0.94], [0, 1]);
  const sdgCard5Scale = useTransform(smoothShowcaseProgress, [0.90, 0.94], [0.88, 1]);
  const sdgCard5Y = useTransform(smoothShowcaseProgress, [0.90, 0.94], [15, 0]);

  const astaMotionStyles = [
    { opacity: astaCard1Opacity, scale: astaCard1Scale, y: astaCard1Y },
    { opacity: astaCard2Opacity, scale: astaCard2Scale, y: astaCard2Y },
    { opacity: astaCard3Opacity, scale: astaCard3Scale, y: astaCard3Y },
    { opacity: astaCard4Opacity, scale: astaCard4Scale, y: astaCard4Y },
  ];

  const sdgMotionStyles = [
    { opacity: sdgCard1Opacity, scale: sdgCard1Scale, y: sdgCard1Y },
    { opacity: sdgCard2Opacity, scale: sdgCard2Scale, y: sdgCard2Y },
    { opacity: sdgCard3Opacity, scale: sdgCard3Scale, y: sdgCard3Y },
    { opacity: sdgCard4Opacity, scale: sdgCard4Scale, y: sdgCard4Y },
    { opacity: sdgCard5Opacity, scale: sdgCard5Scale, y: sdgCard5Y },
  ];

  // 6. Luxury CTA Section Scroll Transforms (Smoothly fades in and fades out linked to scroll progress)
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaSectionRef,
    offset: ["start end", "end start"],
  });

  const smoothCtaProgress = useSpring(ctaScrollProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.4,
  });

  const ctaSectionOpacity = useTransform(smoothCtaProgress, [0, 0.22, 0.78, 1], [0, 1, 1, 0.15]);
  const ctaSectionScale = useTransform(smoothCtaProgress, [0, 0.22, 0.78, 1], [0.94, 1, 1, 0.96]);
  const ctaSectionY = useTransform(smoothCtaProgress, [0, 0.22, 0.78, 1], [35, 0, 0, -25]);

  // All Showcase Screens from Demo_Konsumer and Demo_Mitra (11 Verified High-Res Screens)
  const allShowcaseScreens = [
    {
      role: "KONSUMEN",
      roleBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      title: "Manajemen Akun & Profil",
      subtitle: "Akses identitas pengguna terverifikasi, metode pembayaran, dan riwayat saldo terpadu.",
      src: "/Demo_Konsumer/Landing Page_Phone Beranda.png",
    },
    {
      role: "KONSUMEN",
      roleBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      title: "Pembuatan Tugas Terstruktur",
      subtitle: "Formulir digital dengan penetapan koordinat lokasi presisi dan instruksi pekerjaan.",
      src: "/Demo_Konsumer/3.png",
    },
    {
      role: "KONSUMEN",
      roleBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      title: "Pemantauan Status & Riwayat",
      subtitle: "Monitoring alur tugas aktif mulai dari penugasan mitra hingga pekerjaan tuntas.",
      src: "/Demo_Konsumer/6.png",
    },
    {
      role: "KONSUMEN",
      roleBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      title: "Progres Pengerjaan Real-Time",
      subtitle: "Tahapan kerja transparan yang dilindungi sistem rekening bersama (escrow).",
      src: "/Demo_Konsumer/5.png",
    },
    {
      role: "KONSUMEN",
      roleBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      title: "Komunikasi Pesan Terenkripsi",
      subtitle: "Saluran koordinasi privat antara konsumen dan mitra tanpa membagikan kontak pribadi.",
      src: "/Demo_Konsumer/4.png",
    },
    {
      role: "MITRA KERJA",
      roleBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Dasbor Operasional Mitra",
      subtitle: "Aktivasi status ketersediaan kerja serta ringkasan akumulasi pendapatan harian.",
      src: "/Demo_Mitra/8.png",
    },
    {
      role: "MITRA KERJA",
      roleBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Peta Penugasan Berbasis Lokasi",
      subtitle: "Eksplorasi peluang pekerjaan terdekat secara interaktif berbasis geolokasi.",
      src: "/Demo_Mitra/9.png",
    },
    {
      role: "MITRA KERJA",
      roleBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Pusat Koordinasi Mitra",
      subtitle: "Layanan pesan terpadu untuk konfirmasi teknis langsung dengan pemberi tugas.",
      src: "/Demo_Mitra/10.png",
    },
    {
      role: "MITRA KERJA",
      roleBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Detail Penugasan & Jaminan Upah",
      subtitle: "Rincian spesifikasi pekerjaan dengan kepastian dana yang telah diamankan sistem.",
      src: "/Demo_Mitra/11.png",
    },
    {
      role: "MITRA KERJA",
      roleBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Evaluasi & Reputasi Profesional",
      subtitle: "Portofolio pencapaian, tingkat penyelesaian tugas, dan rekam jejak penilaian.",
      src: "/Demo_Mitra/12.png",
    },
    {
      role: "MITRA KERJA",
      roleBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Manajemen Keuangan & Penarikan",
      subtitle: "Grafik analisis pendapatan berkala dan fasilitas penarikan dana langsung.",
      src: "/Demo_Mitra/13.png",
    },
  ];

  // Asta Cita Data (4 Strategic Pillars) with concise impact explanations
  const astaCitaItems = [
    {
      code: "Asta Cita 3",
      title: "Penciptaan Lapangan Kerja & Kewirausahaan",
      tag: "Ketenagakerjaan",
      description: "Membuka peluang kerja harian fleksibel tanpa perantara dan meningkatkan kemandirian ekonomi pekerja lepas di seluruh wilayah.",
      icon: Briefcase,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/60",
      accentBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      code: "Asta Cita 4",
      title: "Penguatan IPTEK, Inovasi & Digitalisasi",
      tag: "Transformasi Digital",
      description: "Digitalisasi sektor jasa informal melalui algoritma radar GPS presisi, sistem reputasi transparan, dan pembayaran QRIS otomatis.",
      icon: Cpu,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30 hover:border-blue-400/60",
      accentBg: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      code: "Asta Cita 6",
      title: "Pembangunan Merata dari Desa & Daerah",
      tag: "Pemberdayaan Lokal",
      description: "Menghubungkan tenaga kerja lokal langsung dengan kebutuhan rumah tangga di tingkat RT/RW dan kelurahan secara berkeadilan.",
      icon: Landmark,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30 hover:border-amber-400/60",
      accentBg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      code: "Asta Cita 7",
      title: "Tata Kelola, Integritas & Keamanan Transaksi",
      tag: "Transparansi & Rekber",
      description: "Perlindungan hak konsumen dan mitra lewat sistem rekening bersama (escrow otomatis) serta enkripsi pesan privat.",
      icon: ShieldCheck,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30 hover:border-purple-400/60",
      accentBg: "bg-purple-500/20 text-purple-400 border-purple-500/40",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
  ];

  // SDGs Data (5 Global Goals) with concise impact explanations
  const sdgsItems = [
    {
      code: "SDG 8",
      title: "Pekerjaan Layak & Pertumbuhan Ekonomi",
      tag: "Fokus Utama",
      description: "Mendorong pertumbuhan ekonomi inklusif dan produktif melalui standarisasi upah adil tanpa potongan komisi siluman.",
      icon: TrendingUp,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30 hover:border-rose-400/60",
      accentBg: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      code: "SDG 1",
      title: "Tanpa Kemiskinan (No Poverty)",
      tag: "Pemberdayaan",
      description: "Meningkatkan daya beli dan pendapatan harian keluarga berpenghasilan rendah melalui akses pesanan kerja instan.",
      icon: Coins,
      color: "text-red-400 bg-red-500/10 border-red-500/30 hover:border-red-400/60",
      accentBg: "bg-red-500/20 text-red-400 border-red-500/40",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    {
      code: "SDG 9",
      title: "Industri, Inovasi & Infrastruktur Digital",
      tag: "Inovasi Platform",
      description: "Membangun infrastruktur platform digital yang tangguh, cepat, dan mudah diakses oleh seluruh lapisan masyarakat.",
      icon: Layers,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/30 hover:border-orange-400/60",
      accentBg: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    },
    {
      code: "SDG 10",
      title: "Pengurangan Kesenjangan Sosial",
      tag: "Kesetaraan Akses",
      description: "Membuka kesempatan kerja setara bagi siapa pun tanpa memandang latar belakang formal, berbasis reputasi ulasan nyata.",
      icon: Users,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/30 hover:border-pink-400/60",
      accentBg: "bg-pink-500/20 text-pink-400 border-pink-500/40",
      badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    },
    {
      code: "SDG 11",
      title: "Kota & Komunitas Berkelanjutan",
      tag: "Komunitas Lokal",
      description: "Mengoptimalkan pertukaran jasa dalam radius lingkungan terdekat guna menekan jarak perjalanan dan memperkuat gotong royong.",
      icon: Globe2,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/30 hover:border-teal-400/60",
      accentBg: "bg-teal-500/20 text-teal-400 border-teal-500/40",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-white selection:bg-primary/20 overflow-x-clip relative">
      
      {/* Cosmic Night Sky Background */}
      <NightSkyCosmicBackground />

      {/* 1. Header (Navbar Clean Corporate Style) */}
      <header className="fixed top-0 z-50 w-full bg-[#070b14]/75 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 md:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-primary/20 p-1.5 flex items-center justify-center border border-primary/40 shrink-0 shadow-md shadow-primary/20">
              <Image
                src="/logo-notext.png"
                alt="KerjaIn Logo"
                width={28}
                height={28}
                priority
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("Logo_Here")) {
                    target.src = "/Logo_Here/Kerjain_Logo_NO Text.png";
                  }
                }}
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">KerjaIn</span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#fitur" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">
              Keunggulan
            </Link>
            <Link href="#showcase" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">
              Ada Apa di KerjaIn?
            </Link>
            <Link href="#dampak" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">
              Asta Cita & SDGs
            </Link>
            
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login" className="text-xs font-bold text-white hover:text-emerald-400 transition-colors px-3 py-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Masuk
              </Link>
              <Link href="/register" className="rounded-full font-black text-xs h-10 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center">
                Mulai Sekarang
              </Link>
            </div>
          </nav>

          <div className="md:hidden flex items-center gap-3">
            <Link href="/login" className="p-2 text-white">
              <Lock className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link href="/register" className="rounded-full font-bold text-xs h-8 px-4 bg-emerald-600 text-white flex items-center justify-center">
              Mulai
            </Link>
          </div>

        </div>
      </header>

      <main className="flex-1 relative z-10">
        
        {/* ========================================================================= */}
        {/* 2. HERO SECTION (RESPONSIVE GOLDEN-RATIO PROPORTIONS FOR PC & MOBILE)     */}
        {/* ========================================================================= */}
        <section 
          ref={heroRef} 
          className="relative h-[200vh] w-full"
        >
          {/* Sticky Viewport Container - Perfectly Balanced for Mobile (pt-36) and PC (md:pt-24 lg:pt-28) */}
          <div className="sticky top-0 h-screen w-full flex flex-col items-center pt-36 sm:pt-36 md:pt-24 lg:pt-28 px-2 sm:px-4 overflow-hidden z-20">
            
            {/* Header Content at z-10 - Fixed Position in Place (Only Fades Out) */}
            <motion.div 
              style={{ opacity: heroTextOpacity }}
              className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-2.5 sm:space-y-3 z-10"
            >
              {/* Title & Description that stay fixed and gently fade out as user scrolls */}
              <div className="space-y-1.5 sm:space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
                  Kerja<span className="text-emerald-400">In</span>
                </h1>
                <p className="text-sm sm:text-base md:text-xl text-gray-200 font-semibold tracking-tight max-w-xl px-2 leading-relaxed">
                  Bereskan Urusan Rumah, Buka Peluang Kerja Seketika
                </p>
              </div>

              {/* Fixed Proportional CTA button behind the rising image */}
              <div className="pt-1">
                <Link 
                  href="/register" 
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-emerald-600/40 hover:scale-105 transition-all"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </motion.div>

            {/* Phone & Hand Graphic in Front (z-30) - Rising Upwards with Butter-Smooth Spring Physics */}
            <motion.div 
              style={{ 
                opacity: heroSectionOpacity,
                y: heroImageY, 
                scale: heroImageScale,
                willChange: "transform, opacity",
              }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[94vw] sm:max-w-[480px] md:max-w-[580px] lg:max-w-[700px] h-[48vh] sm:h-[50vh] md:h-[54vh] lg:h-[56vh] flex items-end justify-center pointer-events-none origin-bottom z-30 transform-gpu"
            >
              <img 
                src="/Demo_Konsumer/Landing Page_Phone Beranda.png" 
                alt="Antarmuka KerjaIn" 
                className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] transform-gpu will-change-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/Demo_Konsumer/Beranda.jpg";
                }}
              />
            </motion.div>

            {/* Floating Scroll Indicator Badge */}
            <motion.div 
              style={{ opacity: heroTextOpacity }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 z-40 pointer-events-none"
            >
              <div className="w-6 h-8 rounded-full border-2 border-emerald-500/30 flex items-center justify-center p-0.5 bg-black/40 backdrop-blur-sm shadow-lg">
                <motion.div 
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-2 bg-emerald-400 rounded-full"
                />
              </div>
              <span className="text-[8px] uppercase font-bold tracking-widest text-emerald-400 mt-0.5 drop-shadow">Scroll</span>
            </motion.div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 3. KEUNGGULAN (STICKY PINNED 4-ROW PUZZLE & DAILY/TECH ICON FILLERS)      */}
        {/* ========================================================================= */}
        <section 
          ref={keunggulanRef}
          id="fitur" 
          className="relative h-[260vh] sm:h-[290vh] w-full bg-[#070b14] border-t border-white/10"
        >
          {/* Sticky Viewport Window */}
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between overflow-hidden px-2 sm:px-6 md:px-8 z-20 py-3 sm:py-5">
            
            {/* Glowing Ambient Cosmic Glows */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
            <div className="absolute top-2/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
            <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />

            {/* Dense Geometric Bauhaus Doodles Scattered in Background (Alternating Parallax on Scroll, Multiplies on zoom out) */}
            <DenseGeometricDoodleBackground 
              mushroomOpacityLayer1={doodleMushroomOpacityLayer1}
              mushroomOpacityLayer2={doodleMushroomOpacityLayer2}
              rowSlideLeft={rowSlideLeft}
              rowSlideRight={rowSlideRight}
            />

            {/* ========================================================================= */}
            {/* TOP HEADER: Clean 3-Tier Section Header (Image 3 Style)                   */}
            {/* ========================================================================= */}
            <div className="w-full max-w-6xl z-30 flex flex-col items-center pointer-events-none shrink-0 mb-1">
              <motion.div 
                style={{ opacity: keunggulanHeaderOpacity }}
                className="container mx-auto max-w-6xl text-center space-y-1 z-30"
              >
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  Keunggulan di <span className="text-emerald-400">KerjaIn</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium max-w-lg mx-auto">
                  Scroll ke bawah untuk menjelajahi seluruh ekosistem layanan instan & cerdas
                </p>
              </motion.div>
            </div>

            {/* ========================================================================= */}
            {/* 4-ROW BENTO CANVAS: TIGHT PUZZLE ASSEMBLY FIRST -> THEN CURTAIN OPENS     */}
            {/* ========================================================================= */}
            {/* Desktop & Tablet Canvas View */}
            <motion.div 
              style={{ 
                scale: bentoGridScale,
                willChange: "transform",
              }}
              className="hidden sm:flex flex-col items-center justify-center w-full max-w-6xl origin-center z-20 transform-gpu my-auto relative"
            >
              {/* TOP 2 ROWS (Row 1 + Row 2) */}
              <div className="w-full space-y-3 sm:space-y-3.5 transform-gpu">
                {/* === ROW 1 (4 CARDS: VARIED SIZES) === */}
                <div className="grid grid-cols-12 gap-3 sm:gap-3.5">
                  {/* Card 1: Col 3 - Radar GPS (Masuk dari Kiri-Atas) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -70, y: -40 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-blue-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Compass className="w-32 h-32 text-blue-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-blue-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          GPS Real-Time
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Radar Geolokasi
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Lacak posisi tugas dan mitra terdekat dalam radius GPS presisi.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        Live Tracking
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 2: Col 4 - Mode Siap Kerja (Masuk dari Atas) */}
                  <motion.div 
                    initial={{ opacity: 0, y: -60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-4 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950/40 via-zinc-900/90 to-zinc-950/95 border border-emerald-500/30 hover:border-emerald-400/60 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Zap className="w-36 h-36 text-emerald-500/[0.09] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-emerald-500/[0.18] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          1-Klik On/Off
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Mode Siap Kerja Instan
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Atur fleksibilitas jam kerja dan penerimaan orderan hanya dengan 1 sentuhan.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Bebas Fleksibel
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 3: Col 2 - Buat Job (Masuk dari Atas) */}
                  <motion.div 
                    initial={{ opacity: 0, y: -60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-2 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-teal-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Briefcase className="w-28 h-28 text-teal-500/[0.07] absolute -bottom-4 -right-4 pointer-events-none group-hover:scale-110 group-hover:text-teal-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Job Kilat
                      </h3>
                      <p className="text-[10px] text-gray-300 font-medium leading-relaxed">
                        1 Menit beres & transparan.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1 pt-1">
                      <span className="text-[9px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                        Form Cepat
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 4: Col 3 - Proteksi Escrow (Masuk dari Kanan-Atas) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 70, y: -40 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-purple-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <ShieldCheck className="w-32 h-32 text-purple-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-purple-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                          Garansi 100%
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Rekber Escrow
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Dana tersimpan aman sampai tugas selesai tuntas.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        Anti-Penipuan
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* === ROW 2 (3 CARDS: VARIED SIZES) === */}
                <div className="grid grid-cols-12 gap-3 sm:gap-3.5">
                  {/* Card 5: Col 4 - Slide Confirm (Masuk dari Kiri) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-4 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-cyan-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <SlidersHorizontal className="w-36 h-36 text-cyan-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-cyan-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          Slide Validasi
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Geser Konfirmasi Selesai
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Tombol geser anti-salah pencet menjamin persetujuan pekerjaan disepakati kedua pihak.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        Persetujuan 2-Arah
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 6: Col 5 - Notifikasi Real-Time (Masuk dari Atas Tengah) */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.85, y: -20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-5 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950/40 via-zinc-900/90 to-zinc-950/95 border border-blue-500/30 hover:border-blue-400/60 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Bell className="w-36 h-36 text-blue-500/[0.08] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-blue-500/[0.16] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          Alert Instan
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Pusat Notifikasi Real-Time
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Peringatan langsung saat order diambil, progres bertambah, dan pembayaran sukses.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        Update Otomatis
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 7: Col 3 - Chat Privat (Masuk dari Kanan) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-emerald-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Lock className="w-32 h-32 text-emerald-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-emerald-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Terenkripsi
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Chat Privat
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Komunikasi aman tanpa perlu buka nomor HP pribadi.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Privasi 100%
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* 🌟 EXPANDABLE CENTERPIECE CONTAINER (HEIGHT = 0 INITIALLY SO 4 ROWS ARE 100% RAPAT) */}
              <motion.div 
                style={{ 
                  height: centerGapHeight,
                  opacity: centerTextOpacity,
                }}
                className="w-full flex flex-col items-center justify-center relative z-30 overflow-visible py-2"
              >
                <motion.div 
                  style={{ 
                    scale: centerTextScale,
                    y: centerTextY
                  }}
                  className="text-center relative py-2 px-3 w-full max-w-6xl"
                >
                  {/* Radiant Cosmic Backglow (Stretches edge-to-edge from ujung ke ujung) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] max-w-none h-48 bg-gradient-to-r from-emerald-500/30 via-teal-400/40 to-cyan-500/30 blur-3xl pointer-events-none rounded-full" />
                  
                  {/* Huge Bold Title (Clean proportion without vertical cutoff) */}
                  <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-[0_16px_50px_rgba(16,185,129,0.5)]">
                    Kerja<span className="text-emerald-400">In</span>,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                      Your Daily Helpful App
                    </span>
                  </h2>
                  
                  {/* Bold Subtitle */}
                  <p className="text-xs sm:text-base md:text-lg text-gray-200 font-bold mt-2 max-w-2xl mx-auto drop-shadow-md">
                    Solusi cerdas & praktis untuk bereskan segala kebutuhan rumah harian Anda.
                  </p>
                </motion.div>
              </motion.div>

              {/* BOTTOM 2 ROWS (Row 3 + Row 4) - Sits directly below Row 2 with standard gap when centerGapHeight is 0 */}
              <div className="w-full space-y-3 sm:space-y-3.5 transform-gpu">
                {/* === ROW 3 (4 CARDS: VARIED SIZES) === */}
                <div className="grid grid-cols-12 gap-3 sm:gap-3.5">
                  {/* Card 8: Col 3 - Riwayat Selesai (Masuk dari Kiri) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-amber-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Clock className="w-32 h-32 text-amber-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-amber-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Dokumentasi
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Riwayat Pekerjaan
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Arsip rapi semua pekerjaan tuntas beserta rincian upah.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Audit Digital
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 9: Col 3 - Dompet Saldo (Masuk dari Bawah) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-indigo-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Wallet className="w-32 h-32 text-indigo-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-indigo-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                          <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          Dompet Digital
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Mutasi Saldo Instan
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Tarik saldo kapan saja ke rekening bank dan e-wallet.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        Tarik Bebas Biaya
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 10: Col 3 - Grafik Pendapatan (Masuk dari Bawah) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-emerald-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <TrendingUp className="w-32 h-32 text-emerald-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-emerald-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Analitik
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Grafik Pemasukan
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Pantau grafik produktivitas & pendapatan harian.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Target Harian
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 11: Col 3 - Rating & Reputasi (Masuk dari Kanan) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-amber-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Award className="w-32 h-32 text-amber-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-amber-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Skor 5.0
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Reputasi Bintang
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Sistem rating 2-arah menjaga kepuasan bersama.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Ulasan Jujur
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* === ROW 4 (3 CARDS: VARIED SIZES) === */}
                <div className="grid grid-cols-12 gap-3 sm:gap-3.5">
                  {/* Card 12: Col 4 - Pembayaran QRIS Instan (Masuk dari Kiri-Bawah) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -70, y: 40 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-4 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-blue-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <QrCode className="w-36 h-36 text-blue-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-blue-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <QrCode className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          QRIS Dinamis
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Pembayaran QRIS Instan
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Scan barcode QRIS langsung dari semua e-wallet & m-banking dengan verifikasi saldo otomatis.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        Scan Instan
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 13: Col 5 - Mitra Terverifikasi (Masuk dari Bawah) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-5 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950/40 via-zinc-900/90 to-zinc-950/95 border border-emerald-500/30 hover:border-emerald-400/60 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <CheckCircle2 className="w-36 h-36 text-emerald-500/[0.08] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-emerald-500/[0.16] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Keamanan Terjamin
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Mitra Andal Terverifikasi
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Verifikasi identitas resmi untuk menjamin integritas & rasa aman Anda.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        ID Terverifikasi
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 14: Col 3 - Dashboard Terpadu (Masuk dari Kanan-Bawah) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 70, y: 40 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800/90 via-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-teal-500/40 relative p-4 sm:p-5 flex flex-col justify-between min-h-[175px] sm:min-h-[190px] shadow-xl group transition-all transform-gpu"
                  >
                    <Cpu className="w-32 h-32 text-teal-500/[0.07] absolute -bottom-5 -right-5 pointer-events-none group-hover:scale-110 group-hover:text-teal-500/[0.15] transition-all duration-500 transform-gpu" />
                    <div className="z-10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                          Pusat Kontrol
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                        Dashboard Eksekutif
                      </h3>
                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                        Pusat kendali intuitif seluruh status tugas & saldo.
                      </p>
                    </div>
                    <div className="z-10 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                        Multi-Device
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>


            {/* ========================================================================= */}
            {/* MOBILE (HP) CANVAS VIEW - 4-ROW BENTO PUZZLE (COMPLETELY RAPAT FIRST)     */}
            {/* ========================================================================= */}
            <motion.div 
              style={{ 
                scale: bentoGridScaleMobile,
                willChange: "transform",
              }}
              className="sm:hidden flex flex-col items-center justify-center w-[660px] origin-center z-20 transform-gpu my-auto"
            >
              {/* TOP 2 ROWS */}

              {/* TOP 2 ROWS */}
              <div className="w-full space-y-2.5 transform-gpu">
                {/* Row 1 (4 cards) */}
                <div className="grid grid-cols-12 gap-2.5">
                  <motion.div 
                    initial={{ opacity: 0, x: -50, y: -30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Compass className="w-24 h-24 text-blue-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">GPS Real-Time</span>
                      <h3 className="text-sm font-black text-white">Radar Geolokasi</h3>
                      <p className="text-[10px] text-gray-300">Lacak tugas & mitra terdekat.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full w-fit">Live Tracking</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Zap className="w-28 h-28 text-emerald-500/15 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">1-Klik On/Off</span>
                      <h3 className="text-sm font-black text-white">Mode Siap Kerja</h3>
                      <p className="text-[10px] text-gray-300">Fleksibilitas jam kerja instan.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">Bebas Fleksibel</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-2 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Briefcase className="w-20 h-20 text-teal-500/10 absolute -bottom-2 -right-2 pointer-events-none" />
                    <div className="space-y-1">
                      <div className="w-5 h-5 rounded-md bg-teal-500/20 flex items-center justify-center text-teal-400"><Briefcase className="w-3 h-3" /></div>
                      <h3 className="text-xs font-black text-white">Job Kilat</h3>
                      <p className="text-[9px] text-gray-300">1 Menit beres.</p>
                    </div>
                    <span className="text-[7px] font-semibold text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded-full w-fit">Form Cepat</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50, y: -30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <ShieldCheck className="w-24 h-24 text-purple-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Garansi 100%</span>
                      <h3 className="text-sm font-black text-white">Rekber Escrow</h3>
                      <p className="text-[10px] text-gray-300">Dana aman di rekening bersama.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full w-fit">Anti-Penipuan</span>
                  </motion.div>
                </div>

                {/* Row 2 (3 cards) */}
                <div className="grid grid-cols-12 gap-2.5">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-4 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <SlidersHorizontal className="w-28 h-28 text-cyan-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Slide Validasi</span>
                      <h3 className="text-sm font-black text-white">Geser Konfirmasi</h3>
                      <p className="text-[10px] text-gray-300">Anti-salah pencet tugas tuntas.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full w-fit">Persetujuan 2-Arah</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Bell className="w-28 h-28 text-blue-500/15 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Alert Instan</span>
                      <h3 className="text-sm font-black text-white">Notifikasi Real-Time</h3>
                      <p className="text-[10px] text-gray-300">Peringatan langsung status order.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full w-fit">Update Otomatis</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Lock className="w-24 h-24 text-emerald-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Terenkripsi</span>
                      <h3 className="text-sm font-black text-white">Chat Privat</h3>
                      <p className="text-[10px] text-gray-300">Tanpa umbar no HP.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">Privasi 100%</span>
                  </motion.div>
                </div>
              </div>

              {/* Mobile Centerpiece Text (Expandable Height 0 initially so 4 rows are 100% rapat!) */}
              <motion.div 
                style={{ 
                  height: centerGapHeightMobile,
                  opacity: centerTextOpacity,
                }}
                className="w-full overflow-hidden flex flex-col items-center justify-center relative z-30 my-auto"
              >
                <motion.div 
                  style={{ 
                    scale: centerTextScale,
                    y: centerTextY
                  }}
                  className="py-2 text-center relative z-30 w-full px-2"
                >
                  <div className="relative inline-block w-full px-1">
                    {/* Glowing Radiant Aura */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-32 bg-gradient-to-r from-emerald-500/45 via-teal-400/40 to-cyan-400/45 blur-2xl pointer-events-none rounded-full" />
                    
                    {/* Giant Bold Title on Mobile */}
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_10px_35px_rgba(16,185,129,0.6)]">
                      Kerja<span className="text-emerald-400">In</span>,{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-300">
                        Your Daily Helpful App
                      </span>
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-gray-200 font-bold mt-1.5 max-w-xs mx-auto drop-shadow leading-relaxed">
                      Solusi cerdas & praktis untuk bereskan segala kebutuhan rumah harian Anda.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* BOTTOM 2 ROWS (Sits directly below Row 2 when centerGapHeightMobile is 0!) */}
              <div className="w-full space-y-2.5 transform-gpu">
                {/* Row 3 (4 cards) */}
                <div className="grid grid-cols-12 gap-2.5">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Clock className="w-24 h-24 text-amber-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Dokumentasi</span>
                      <h3 className="text-sm font-black text-white">Riwayat Kerja</h3>
                      <p className="text-[10px] text-gray-300">Arsip tugas tuntas & upah.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full w-fit">Audit Digital</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Wallet className="w-24 h-24 text-indigo-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Dompet Digital</span>
                      <h3 className="text-sm font-black text-white">Mutasi Saldo</h3>
                      <p className="text-[10px] text-gray-300">Tarik saldo instan 0 biaya.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full w-fit">Bebas Biaya</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <TrendingUp className="w-24 h-24 text-emerald-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Analitik</span>
                      <h3 className="text-sm font-black text-white">Grafik Omzet</h3>
                      <p className="text-[10px] text-gray-300">Pantau pertumbuhan omzet.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">Target Harian</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Award className="w-24 h-24 text-amber-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Skor 5.0</span>
                      <h3 className="text-sm font-black text-white">Reputasi Bintang</h3>
                      <p className="text-[10px] text-gray-300">Ulasan 2-arah terpercaya.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full w-fit">Ulasan Jujur</span>
                  </motion.div>
                </div>

                {/* Row 4 (3 cards) */}
                <div className="grid grid-cols-12 gap-2.5">
                  <motion.div 
                    initial={{ opacity: 0, x: -50, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-4 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <QrCode className="w-28 h-28 text-blue-500/10 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">QRIS Dinamis</span>
                      <h3 className="text-sm font-black text-white">QRIS Instan</h3>
                      <p className="text-[10px] text-gray-300">Scan bayar otomatis terverifikasi.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full w-fit">Scan Instan</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <CheckCircle2 className="w-28 h-28 text-emerald-500/15 absolute -bottom-3 -right-3 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Keamanan</span>
                      <h3 className="text-sm font-black text-white">Mitra Terverifikasi</h3>
                      <p className="text-[10px] text-gray-300">Seleksi ID resmi & terjamin.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">ID Terverifikasi</span>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    className="col-span-3 rounded-2xl bg-zinc-900/90 border border-white/10 p-3.5 min-h-[145px] flex flex-col justify-between relative overflow-hidden"
                  >
                    <Cpu className="w-24 h-24 text-teal-500/10 absolute -bottom-2 -right-2 pointer-events-none" />
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">Pusat Kontrol</span>
                      <h3 className="text-sm font-black text-white">Dashboard</h3>
                      <p className="text-[10px] text-gray-300">Pusat kendali tugas.</p>
                    </div>
                    <span className="text-[8px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full w-fit">Multi-Device</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 4. SCROLL-PINNED HORIZONTAL CAROUSEL (ADA APA DI KERJAIN? MEMAKSA FOTO DULU)*/}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 4 & 5. UNIFIED SCROLL-PINNED SHOWCASE & ASTA CITA/SDGS JOURNEY            */}
        {/* ========================================================================= */}
        <section id="showcase" ref={showcaseContainerRef} className="relative h-[650vh] border-t border-white/10 bg-[#070b14]">
          
          {/* Sticky Viewport Window that holds position throughout the entire journey */}
          <div className="sticky top-16 sm:top-20 h-[calc(100vh-4rem)] flex flex-col items-center justify-start overflow-hidden px-3 sm:px-6 md:px-8 pt-6 sm:pt-10 pb-4 sm:pb-6">
            
            {/* FULL SCREEN BACKDROP BOX BEHIND STAGE 2 (ASTA CITA) */}
            <motion.div 
              style={{ opacity: astaHeaderOpacity }}
              className="absolute inset-2 sm:inset-4 md:inset-6 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#0c1322]/90 via-[#0a0f1d]/85 to-[#070b14]/90 border border-emerald-500/20 shadow-2xl pointer-events-none overflow-hidden z-10"
            >
              {/* Full-Screen Ambient Emerald Glow */}
              <div className="absolute -top-20 inset-x-0 mx-auto w-3/4 h-80 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
            </motion.div>

            {/* FULL SCREEN BACKDROP BOX BEHIND STAGE 3 (SDGS) */}
            <motion.div 
              style={{ opacity: sdgHeaderOpacity }}
              className="absolute inset-2 sm:inset-4 md:inset-6 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#160c18]/90 via-[#100a16]/85 to-[#070b14]/90 border border-rose-500/20 shadow-2xl pointer-events-none overflow-hidden z-10"
            >
              {/* Full-Screen Ambient Rose Glow */}
              <div className="absolute -top-20 inset-x-0 mx-auto w-3/4 h-80 bg-rose-500/15 blur-3xl rounded-full pointer-events-none" />
            </motion.div>

            {/* ========================================================================= */}
            {/* FIXED-HEIGHT HEADER ZONE: Positions all 3 headers at the exact same spot   */}
            {/* ========================================================================= */}
            <div className="relative w-full max-w-4xl min-h-[140px] sm:min-h-[165px] md:min-h-[185px] flex items-center justify-center text-center shrink-0 z-30 mb-3 sm:mb-5">
              
              {/* Header 1: Eksplorasi Antarmuka */}
              <motion.div 
                style={{ opacity: header1Opacity, y: header1Y }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-1.5 pointer-events-none"
              >
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Eksplorasi Antarmuka <span className="text-emerald-400">KerjaIn</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                  Pengalaman operasional yang terintegrasi penuh bagi Konsumen dan Mitra Kerja.
                </p>
              </motion.div>

              {/* Header 2: Prioritas Nasional Asta Cita (Clean Open Header with Large Logo) */}
              <motion.div 
                style={{ opacity: astaHeaderOpacity, y: astaHeaderY }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-1.5 pointer-events-none"
              >
                <img 
                  src="/demo sdg_asta cita/asta cita logo.png" 
                  alt="Asta Cita Logo" 
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-2xl mb-1.5"
                />
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Prioritas Nasional <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Asta Cita Kepresidenan RI</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
                  Pilar strategis pemberdayaan ekonomi kerakyatan dan penciptaan lapangan kerja inklusif.
                </p>
              </motion.div>

              {/* Header 3: Sustainable Development Goals (Clean Open Header with Large Logo) */}
              <motion.div 
                style={{ opacity: sdgHeaderOpacity, y: sdgHeaderY }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-1.5 pointer-events-none"
              >
                <img 
                  src="/demo sdg_asta cita/sdg logo.png" 
                  alt="SDGs Logo" 
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-2xl mb-1.5"
                />
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Sustainable Development Goals <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">(SDGs)</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
                  Komitmen inklusif platform terhadap 5 sasaran pembangunan berkelanjutan global.
                </p>
              </motion.div>

            </div>

            {/* ========================================================================= */}
            {/* CONTENT ZONE: Strictly below header, fully isolated and non-overlapping    */}
            {/* ========================================================================= */}
            <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center min-h-[340px] sm:min-h-[400px] z-20">
              
              {/* STAGE 1: Phone Mockups Track */}
              <motion.div 
                style={{ x: showcaseX, opacity: showcaseTrackOpacity }}
                className="flex items-center gap-6 sm:gap-8 w-max pl-4 pr-12 absolute inset-x-0"
              >
                {allShowcaseScreens.map((screen, idx) => (
                  <div 
                    key={idx}
                    className="w-[270px] sm:w-[310px] md:w-[330px] rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900/95 via-zinc-900/90 to-zinc-950/95 border border-white/15 p-4 sm:p-5 shadow-2xl flex flex-col justify-between space-y-3 shrink-0 select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border", screen.roleBadge)}>
                        {screen.role}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {idx + 1} / {allShowcaseScreens.length}
                      </span>
                    </div>

                    {/* Clean Pure Phone Mockup */}
                    <div className="relative w-full h-[330px] sm:h-[370px] flex items-center justify-center pointer-events-none">
                      <img 
                        src={screen.src} 
                        alt={screen.title} 
                        className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                        loading="lazy"
                      />
                    </div>

                    {/* Full Non-Truncated Legible Typography */}
                    <div className="space-y-1 text-left min-h-[56px] flex flex-col justify-center">
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug break-words">
                        {screen.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed break-words">
                        {screen.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* STAGE 2: Asta Cita (4 Symmetrical Cards: 2x2 on Mobile, 4 in 1 Row on Desktop) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-6xl mx-auto">
                  {astaCitaItems.map((item, idx) => (
                    <motion.div 
                      key={`asta-${idx}`}
                      style={{
                        opacity: astaMotionStyles[idx].opacity,
                        scale: astaMotionStyles[idx].scale,
                        y: astaMotionStyles[idx].y,
                      }}
                      className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0c121e]/95 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border", item.badgeColor)}>
                          {item.code}
                        </span>
                        <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center border", item.accentBg)}>
                          <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[9.5px] sm:text-[10.5px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-0.5">
                        <span className="text-[7.5px] sm:text-[8px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
                          {item.tag}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* STAGE 3: SDGs (5 Cards - Single Odd Card on TOP [1 + 2 + 2], 5 in 1 Row on Desktop) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-wrap justify-center items-stretch gap-2 sm:gap-3 w-full max-w-6xl mx-auto">
                  {sdgsItems.map((sdg, idx) => (
                    <motion.div 
                      key={`sdg-${idx}`}
                      style={{
                        opacity: sdgMotionStyles[idx].opacity,
                        scale: sdgMotionStyles[idx].scale,
                        y: sdgMotionStyles[idx].y,
                      }}
                      className={cn(
                        "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#0c121e]/95 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between space-y-1.5 sm:space-y-2 transition-all",
                        idx === 0 
                          ? "w-full max-w-[280px] sm:max-w-[340px] md:max-w-none md:flex-1 mx-auto" 
                          : "w-[calc(50%-5px)] sm:w-[calc(50%-6px)] md:w-auto md:flex-1"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border", sdg.badgeColor)}>
                          {sdg.code}
                        </span>
                        <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center border", sdg.accentBg)}>
                          <sdg.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-[11px] sm:text-xs font-black text-white leading-snug">
                          {sdg.title}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                          {sdg.description}
                        </p>
                      </div>

                      <div className="pt-0.5">
                        <span className="text-[7.5px] sm:text-[8px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
                          {sdg.tag}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. EXCLUSIVE LUXURY BLACK CALL TO ACTION PORTAL                           */}
        {/* ========================================================================= */}
        <section ref={ctaSectionRef} className="py-24 sm:py-32 px-4 bg-[#020408] text-white relative overflow-hidden border-t border-white/10">
          {/* Subtle Ambient Obsidian Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[380px] bg-gradient-to-r from-emerald-500/10 via-zinc-800/10 to-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(255,255,255,0.03),transparent)]" />

          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              style={{
                opacity: ctaSectionOpacity,
                scale: ctaSectionScale,
                y: ctaSectionY,
              }}
              className="rounded-[2.5rem] bg-gradient-to-b from-zinc-950/95 via-[#080c14]/95 to-black border border-white/10 hover:border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.85)] relative p-8 sm:p-14 md:p-18 overflow-hidden text-center space-y-8 transition-colors"
            >
              {/* Specular Top Glow Arc */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

              {/* Kinetic Typography Headline Section */}
              <div className="space-y-4 max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white flex flex-col items-center justify-center space-y-1">
                  
                  {/* Top Row: "Ready to" + "Experience Effortless" */}
                  <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4">
                    {/* Step 2: "Ready to" slides in from the left and gracefully shifts the text */}
                    <motion.span
                      variants={{
                        hidden: { 
                          opacity: 0, 
                          x: -35, 
                          filter: "blur(6px)",
                          transition: { duration: 0.3 }
                        },
                        visible: { 
                          opacity: 1, 
                          x: 0, 
                          filter: "blur(0px)",
                          transition: { duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] } 
                        }
                      }}
                      className="inline-block text-white"
                    >
                      Ready to
                    </motion.span>

                    {/* Step 1: "Experience Effortless" appears first in the spotlight */}
                    <motion.span
                      variants={{
                        hidden: { 
                          opacity: 0, 
                          scale: 0.88, 
                          y: 15, 
                          filter: "blur(8px)",
                          transition: { duration: 0.3 }
                        },
                        visible: { 
                          opacity: 1, 
                          scale: 1, 
                          y: 0, 
                          filter: "blur(0px)",
                          transition: { duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] } 
                        }
                      }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-emerald-300"
                    >
                      Experience Effortless
                    </motion.span>
                  </div>

                  {/* Step 3: "Daily Living?" emerges below */}
                  <motion.div
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        y: 25, 
                        filter: "blur(8px)",
                        transition: { duration: 0.3 }
                      },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        filter: "blur(0px)",
                        transition: { duration: 0.7, delay: 1.4, ease: [0.16, 1, 0.3, 1] } 
                      }
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300"
                  >
                    Daily Living?
                  </motion.div>

                </h2>

                {/* Step 4: Subtitle fades in smoothly */}
                <motion.p 
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 20,
                      transition: { duration: 0.3 }
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { duration: 0.6, delay: 1.95, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  className="text-sm sm:text-base md:text-lg text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed pt-1"
                >
                  Create your account in seconds. Discover verified local assistance or register as a trusted service partner today.
                </motion.p>
              </div>

              {/* Step 5: Exclusive Luxury Action Buttons fade in */}
              <motion.div 
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 25, 
                    scale: 0.96,
                    transition: { duration: 0.3 }
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    transition: { duration: 0.6, delay: 2.35, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 relative z-10"
              >
                <Link 
                  href="/register" 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white hover:bg-zinc-200 text-black px-9 py-4 text-sm sm:text-base font-black shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.28)] hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                  Get Started as Client
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/register?role=partner" 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/15 hover:border-emerald-500/40 px-9 py-4 text-sm sm:text-base font-black backdrop-blur-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                >
                  Register as Partner
                </Link>
              </motion.div>

              {/* Step 6: Minimalist Exclusive Perks Bar settles in */}
              <motion.div 
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 15,
                    transition: { duration: 0.3 }
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: 2.75, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400 font-semibold tracking-wide relative z-10"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  Instant Free Registration
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  Protected Escrow Flow
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  Direct Wallet Payout
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
