export const PORTFOLIO_TEMPLATES = [
  // 1-10: Modern & Tech
  { id: "modern", name: "Modern Dark", category: "Modern & Tech", bg: "from-slate-950 via-slate-900 to-indigo-950", accent: "from-indigo-500 to-cyan-400", cardBg: "bg-slate-900/80 border-slate-800", text: "text-slate-100", badge: "Popular" },
  { id: "indigo-glow", name: "Indigo Glow", category: "Modern & Tech", bg: "from-indigo-950 via-slate-900 to-purple-950", accent: "from-indigo-400 to-purple-400", cardBg: "bg-indigo-950/40 border-indigo-800/40", text: "text-indigo-50", badge: "Featured" },
  { id: "electric-cyber", name: "Electric Cyber", category: "Modern & Tech", bg: "from-slate-950 via-blue-950 to-slate-950", accent: "from-cyan-400 to-blue-600", cardBg: "bg-blue-950/40 border-cyan-500/30", text: "text-cyan-50", badge: "Trending" },
  { id: "glassmorphism", name: "Glassmorphism", category: "Modern & Tech", bg: "from-indigo-900 via-purple-900 to-slate-900", accent: "from-white/30 to-white/10", cardBg: "bg-white/10 backdrop-blur-xl border-white/20", text: "text-white", badge: "Hot" },
  { id: "quantum-blue", name: "Quantum Blue", category: "Modern & Tech", bg: "from-blue-950 via-slate-900 to-sky-950", accent: "from-sky-400 to-indigo-500", cardBg: "bg-sky-950/30 border-sky-800/50", text: "text-sky-50" },
  { id: "neon-grid", name: "Neon Grid", category: "Modern & Tech", bg: "from-slate-950 via-fuchsia-950 to-slate-950", accent: "from-fuchsia-400 to-pink-500", cardBg: "bg-fuchsia-950/30 border-fuchsia-500/30", text: "text-fuchsia-50" },
  { id: "gradient-mesh", name: "Gradient Mesh", category: "Modern & Tech", bg: "from-purple-950 via-indigo-950 to-cyan-950", accent: "from-purple-400 via-pink-400 to-cyan-400", cardBg: "bg-slate-900/90 border-slate-800", text: "text-slate-100" },
  { id: "obsidian-tech", name: "Obsidian Tech", category: "Modern & Tech", bg: "from-black via-zinc-950 to-zinc-900", accent: "from-zinc-100 to-zinc-400", cardBg: "bg-zinc-900 border-zinc-800", text: "text-zinc-100" },
  { id: "digital-horizon", name: "Digital Horizon", category: "Modern & Tech", bg: "from-slate-900 via-sky-950 to-indigo-900", accent: "from-cyan-300 to-indigo-400", cardBg: "bg-slate-900/80 border-cyan-900/40", text: "text-slate-100" },
  { id: "cloud-native", name: "Cloud Native", category: "Modern & Tech", bg: "from-cyan-950 via-slate-900 to-blue-950", accent: "from-cyan-400 to-teal-300", cardBg: "bg-cyan-950/30 border-cyan-800/40", text: "text-cyan-50" },

  // 11-20: Minimal & Clean
  { id: "minimal", name: "Minimalist Light", category: "Minimal & Clean", bg: "bg-white", accent: "from-slate-900 to-slate-700", cardBg: "bg-slate-50 border-slate-200", text: "text-slate-900", badge: "Clean" },
  { id: "nordic-frost", name: "Nordic Frost", category: "Minimal & Clean", bg: "bg-slate-50", accent: "from-sky-600 to-slate-800", cardBg: "bg-white border-slate-200", text: "text-slate-800" },
  { id: "monochrome-slate", name: "Monochrome Slate", category: "Minimal & Clean", bg: "bg-slate-900", accent: "from-slate-100 to-slate-400", cardBg: "bg-slate-800/60 border-slate-700", text: "text-slate-100" },
  { id: "paper-clean", name: "Paper Clean", category: "Minimal & Clean", bg: "bg-stone-50", accent: "from-stone-900 to-stone-700", cardBg: "bg-white border-stone-200", text: "text-stone-900" },
  { id: "swiss-typography", name: "Swiss Typography", category: "Minimal & Clean", bg: "bg-white", accent: "from-red-600 to-slate-900", cardBg: "bg-slate-50 border-slate-900/10", text: "text-slate-950" },
  { id: "pure-canvas", name: "Pure Canvas", category: "Minimal & Clean", bg: "bg-zinc-50", accent: "from-zinc-800 to-zinc-600", cardBg: "bg-white border-zinc-200", text: "text-zinc-900" },
  { id: "zen-studio", name: "Zen Studio", category: "Minimal & Clean", bg: "bg-emerald-50/30", accent: "from-emerald-800 to-teal-700", cardBg: "bg-white border-emerald-100", text: "text-emerald-950" },
  { id: "linear-light", name: "Linear Light", category: "Minimal & Clean", bg: "bg-gray-50", accent: "from-indigo-600 to-blue-600", cardBg: "bg-white border-gray-200", text: "text-gray-900" },
  { id: "minimal-mono", name: "Minimal Mono", category: "Minimal & Clean", bg: "bg-neutral-900", accent: "from-white to-neutral-400", cardBg: "bg-neutral-800 border-neutral-700", text: "text-neutral-100" },
  { id: "architect-clean", name: "Architect Clean", category: "Minimal & Clean", bg: "bg-amber-50/20", accent: "from-amber-900 to-slate-800", cardBg: "bg-white border-amber-900/10", text: "text-slate-900" },

  // 21-30: Cyberpunk & Dark
  { id: "terminal-cli", name: "Terminal CLI", category: "Cyber & Dark", bg: "bg-black", accent: "from-green-400 to-emerald-500", cardBg: "bg-zinc-950 border-green-500/30 font-mono", text: "text-green-400", badge: "Geek" },
  { id: "matrix-green", name: "Matrix Green", category: "Cyber & Dark", bg: "from-black via-zinc-950 to-green-950", accent: "from-emerald-400 to-green-300", cardBg: "bg-black/80 border-emerald-500/40", text: "text-emerald-300" },
  { id: "midnight-cyber", name: "Midnight Cyber", category: "Cyber & Dark", bg: "from-slate-950 via-purple-950 to-cyan-950", accent: "from-cyan-400 to-fuchsia-500", cardBg: "bg-slate-900/90 border-cyan-500/30", text: "text-cyan-100" },
  { id: "hacker-pulse", name: "Hacker Pulse", category: "Cyber & Dark", bg: "from-zinc-950 via-black to-red-950", accent: "from-red-500 to-rose-400", cardBg: "bg-zinc-900/90 border-red-500/30", text: "text-red-100" },
  { id: "synthwave-80s", name: "Synthwave 80s", category: "Cyber & Dark", bg: "from-purple-950 via-indigo-950 to-pink-950", accent: "from-pink-500 via-purple-400 to-cyan-400", cardBg: "bg-purple-900/40 border-pink-500/40", text: "text-pink-100" },
  { id: "deep-space", name: "Deep Space", category: "Cyber & Dark", bg: "from-black via-indigo-950 to-slate-950", accent: "from-violet-400 to-indigo-300", cardBg: "bg-slate-900/80 border-violet-500/30", text: "text-violet-100" },
  { id: "dark-emerald", name: "Dark Emerald", category: "Cyber & Dark", bg: "from-slate-950 via-emerald-950 to-teal-950", accent: "from-emerald-400 to-teal-300", cardBg: "bg-emerald-950/30 border-emerald-500/30", text: "text-emerald-50" },
  { id: "phantom-violet", name: "Phantom Violet", category: "Cyber & Dark", bg: "from-slate-950 via-violet-950 to-purple-950", accent: "from-violet-400 to-pink-400", cardBg: "bg-violet-950/30 border-violet-500/30", text: "text-violet-100" },
  { id: "stealth-black", name: "Stealth Black", category: "Cyber & Dark", bg: "bg-black", accent: "from-neutral-400 to-neutral-600", cardBg: "bg-neutral-950 border-neutral-800", text: "text-neutral-200" },
  { id: "cyber-noir", name: "Cyber Noir", category: "Cyber & Dark", bg: "from-zinc-950 via-slate-950 to-zinc-950", accent: "from-amber-400 to-cyan-400", cardBg: "bg-zinc-900/80 border-amber-500/20", text: "text-zinc-100" },

  // 31-40: Professional & Corporate
  { id: "professional", name: "Executive Suite", category: "Professional", bg: "from-slate-900 via-slate-800 to-slate-900", accent: "from-blue-400 to-indigo-300", cardBg: "bg-slate-800/80 border-slate-700", text: "text-slate-100", badge: "Pro" },
  { id: "corporate-navy", name: "Corporate Navy", category: "Professional", bg: "from-slate-950 via-blue-950 to-slate-900", accent: "from-blue-400 to-sky-300", cardBg: "bg-slate-900/90 border-blue-800/50", text: "text-blue-50" },
  { id: "enterprise-blue", name: "Enterprise Blue", category: "Professional", bg: "bg-slate-900", accent: "from-indigo-400 to-blue-500", cardBg: "bg-slate-800 border-slate-700", text: "text-slate-100" },
  { id: "minimal-executive", name: "Minimal Executive", category: "Professional", bg: "bg-slate-100", accent: "from-slate-900 to-slate-700", cardBg: "bg-white border-slate-300", text: "text-slate-900" },
  { id: "leadership-pro", name: "Leadership Pro", category: "Professional", bg: "from-stone-900 via-slate-900 to-stone-900", accent: "from-amber-400 to-yellow-200", cardBg: "bg-stone-900 border-amber-900/40", text: "text-amber-50" },
  { id: "strategic-silver", name: "Strategic Silver", category: "Professional", bg: "from-slate-800 via-zinc-900 to-slate-900", accent: "from-slate-200 to-zinc-400", cardBg: "bg-slate-800/90 border-slate-600", text: "text-slate-100" },
  { id: "benchmark-white", name: "Benchmark White", category: "Professional", bg: "bg-white", accent: "from-blue-600 to-indigo-700", cardBg: "bg-slate-50 border-slate-200 shadow-sm", text: "text-slate-900" },
  { id: "apex-blue", name: "Apex Blue", category: "Professional", bg: "from-blue-900 via-slate-900 to-indigo-950", accent: "from-cyan-400 to-blue-300", cardBg: "bg-blue-950/50 border-blue-700/40", text: "text-blue-100" },
  { id: "legacy-slate", name: "Legacy Slate", category: "Professional", bg: "bg-slate-950", accent: "from-slate-300 to-slate-500", cardBg: "bg-slate-900 border-slate-800", text: "text-slate-200" },
  { id: "distinction-dark", name: "Distinction Dark", category: "Professional", bg: "from-zinc-950 via-slate-900 to-zinc-950", accent: "from-yellow-400 to-amber-300", cardBg: "bg-zinc-900/90 border-yellow-500/30", text: "text-yellow-50" },

  // 41-45: Creative & Vibrant
  { id: "aurora-gradient", name: "Aurora Gradient", category: "Creative", bg: "from-emerald-950 via-indigo-950 to-purple-950", accent: "from-emerald-400 via-cyan-400 to-purple-400", cardBg: "bg-slate-900/80 border-emerald-500/30", text: "text-slate-100", badge: "Vibrant" },
  { id: "sunset-flame", name: "Sunset Flame", category: "Creative", bg: "from-slate-950 via-rose-950 to-orange-950", accent: "from-rose-500 via-orange-400 to-amber-300", cardBg: "bg-slate-900/80 border-rose-500/30", text: "text-rose-50" },
  { id: "pastel-bloom", name: "Pastel Bloom", category: "Creative", bg: "from-pink-50 via-purple-50 to-indigo-50", accent: "from-purple-600 to-pink-600", cardBg: "bg-white/80 border-purple-100 shadow-sm", text: "text-slate-900" },
  { id: "electric-violet", name: "Electric Violet", category: "Creative", bg: "from-violet-950 via-purple-950 to-slate-950", accent: "from-violet-400 to-fuchsia-400", cardBg: "bg-violet-950/40 border-violet-500/40", text: "text-violet-50" },
  { id: "cosmic-burst", name: "Cosmic Burst", category: "Creative", bg: "from-slate-950 via-indigo-950 to-rose-950", accent: "from-pink-400 via-purple-400 to-indigo-400", cardBg: "bg-indigo-950/40 border-pink-500/30", text: "text-slate-100" },

  // 46-50: Specialized & Role-Focused
  { id: "fullstack-studio", name: "Fullstack Studio", category: "Specialized", bg: "from-slate-950 via-indigo-950 to-slate-900", accent: "from-indigo-400 to-cyan-400", cardBg: "bg-slate-900/90 border-indigo-500/30", text: "text-slate-100" },
  { id: "ai-specialist", name: "AI Specialist", category: "Specialized", bg: "from-slate-950 via-cyan-950 to-indigo-950", accent: "from-cyan-300 via-blue-400 to-purple-400", cardBg: "bg-cyan-950/30 border-cyan-500/40", text: "text-cyan-50", badge: "AI Ready" },
  { id: "frontend-craft", name: "Frontend Craft", category: "Specialized", bg: "from-purple-950 via-slate-950 to-pink-950", accent: "from-pink-400 to-violet-400", cardBg: "bg-purple-950/30 border-pink-500/30", text: "text-pink-50" },
  { id: "systems-terminal", name: "Systems Terminal", category: "Specialized", bg: "bg-black", accent: "from-amber-400 to-yellow-300", cardBg: "bg-zinc-950 border-amber-500/30 font-mono", text: "text-amber-400" },
  { id: "data-analytics", name: "Data Analytics", category: "Specialized", bg: "from-slate-950 via-sky-950 to-teal-950", accent: "from-teal-300 to-sky-400", cardBg: "bg-sky-950/30 border-teal-500/30", text: "text-teal-50" },
];
