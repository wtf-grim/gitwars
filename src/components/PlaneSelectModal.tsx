"use client";

export type PlaneTier = 1 | 2 | 3 | 4 | 5;

interface TierInfo {
  tier: PlaneTier;
  name: string;
  subtitle: string;
  description: string;
  requirement: string;
  minPct: number; // minimum % to unlock
  icon: string;
  color: string;
  borderColor: string;
  glowColor: string;
}

const TIERS: TierInfo[] = [
  {
    tier: 1,
    name: "SCOUT PROP",
    subtitle: "Tier I",
    description: "A battle-worn propeller plane. Gets you in the air — barely.",
    requirement: "Any holdings",
    minPct: 0,
    icon: "✈",
    color: "#a0a0a0",
    borderColor: "border-white/30",
    glowColor: "rgba(255,255,255,0.08)",
  },
  {
    tier: 2,
    name: "LIGHT FIGHTER",
    subtitle: "Tier II",
    description: "Twin-engine attack craft. Faster and more agile than the scout.",
    requirement: "≥ 0.2% supply",
    minPct: 0.2,
    icon: "🛩",
    color: "#4ade80",
    borderColor: "border-green-500/60",
    glowColor: "rgba(74,222,128,0.12)",
  },
  {
    tier: 3,
    name: "STRIKE HAWK",
    subtitle: "Tier III",
    description: "Swept-wing interceptor. Born for dogfights.",
    requirement: "≥ 0.5% supply",
    minPct: 0.5,
    icon: "🦅",
    color: "#60a5fa",
    borderColor: "border-blue-400/60",
    glowColor: "rgba(96,165,250,0.12)",
  },
  {
    tier: 4,
    name: "F-16 VIPER",
    subtitle: "Tier IV",
    description: "Full afterburner. The apex air-superiority fighter.",
    requirement: "≥ 1% supply",
    minPct: 1,
    icon: "⚡",
    color: "#f59e0b",
    borderColor: "border-amber-400/60",
    glowColor: "rgba(245,158,11,0.12)",
  },
  {
    tier: 5,
    name: "B-52 HAMMER",
    subtitle: "Tier V",
    description: "Strategic bomber. One pass. Total destruction.",
    requirement: "≥ 3% supply",
    minPct: 3,
    icon: "💣",
    color: "#f87171",
    borderColor: "border-red-400/70",
    glowColor: "rgba(248,113,113,0.15)",
  },
];

interface Props {
  walletAddress: string;
  side: "iran" | "israel";
  holdingPct: number; // 0–100 (percent of total supply held)
  onSelect: (tier: PlaneTier) => void;
}

export default function PlaneSelectModal({ walletAddress, side, holdingPct, onSelect }: Props) {
  const short = walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);
  const isIran = side === "iran";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 overflow-y-auto py-8">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-25"
          style={{
            background: isIran
              ? "radial-gradient(ellipse, #239f40 0%, transparent 70%)"
              : "radial-gradient(ellipse, #0038b8 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <div className="text-xs tracking-widest text-white/40 mb-1 uppercase">
            {isIran ? "🇮🇷 IRAN" : "🇮🇱 ISRAEL"} · Wallet: {short}
          </div>
          <h1
            className="text-4xl font-black text-white tracking-tight mb-1"
            style={{ fontFamily: "sans-serif" }}
          >
            SELECT YOUR AIRCRAFT
          </h1>
          <p className="text-white/50 text-sm">
            Your GITWAR holdings:{" "}
            <span className="text-orange-400 font-bold">{holdingPct.toFixed(3)}% of supply</span>
          </p>
        </div>

        {/* Plane grid */}
        <div className="grid grid-cols-5 gap-3 w-full">
          {TIERS.map((t) => {
            const unlocked = holdingPct >= t.minPct;
            return (
              <button
                key={t.tier}
                disabled={!unlocked}
                onClick={() => onSelect(t.tier)}
                className={`
                  relative group flex flex-col items-center gap-3 rounded-xl border-2 p-4
                  transition-all duration-200
                  ${t.borderColor}
                  ${unlocked
                    ? "bg-black/60 hover:bg-white/5 cursor-pointer hover:scale-[1.03]"
                    : "bg-black/40 opacity-40 cursor-not-allowed grayscale"
                  }
                `}
              >
                {/* Glow on hover */}
                {unlocked && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at center, ${t.glowColor} 0%, transparent 70%)` }}
                  />
                )}

                {/* Tier label */}
                <div className="text-[10px] tracking-widest font-bold" style={{ color: t.color, fontFamily: "sans-serif" }}>
                  {t.subtitle}
                </div>

                {/* Icon */}
                <div className="text-4xl leading-none">{t.icon}</div>

                {/* Plane silhouette art */}
                <PlaneSilhouette tier={t.tier} color={unlocked ? t.color : "#555"} />

                {/* Name */}
                <div
                  className="text-sm font-black text-center leading-tight"
                  style={{ color: unlocked ? t.color : "#555", fontFamily: "sans-serif" }}
                >
                  {t.name}
                </div>

                {/* Description */}
                <div className="text-[10px] text-white/40 text-center leading-snug" style={{ fontFamily: "sans-serif" }}>
                  {t.description}
                </div>

                {/* Requirement badge */}
                <div
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wide ${
                    unlocked ? "bg-white/10 text-white/60" : "bg-red-900/40 text-red-400"
                  }`}
                  style={{ fontFamily: "sans-serif" }}
                >
                  {unlocked ? "✓ UNLOCKED" : `🔒 ${t.requirement}`}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-white/20 text-xs text-center" style={{ fontFamily: "sans-serif" }}>
          Higher tiers grant speed and firepower advantages in battle
        </p>
      </div>
    </div>
  );
}

// ── ASCII-style SVG silhouettes per tier ──────────────────────────────────────
function PlaneSilhouette({ tier, color }: { tier: PlaneTier; color: string }) {
  const paths: Record<PlaneTier, React.ReactNode> = {
    // Tier 1 — classic propeller biplane-ish
    1: (
      <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
        {/* fuselage */}
        <rect x="20" y="14" width="28" height="7" rx="2" fill={color} />
        {/* nose */}
        <polygon points="48,14 56,17.5 48,21" fill={color} />
        {/* tail */}
        <polygon points="20,14 14,9 18,17.5" fill={color} />
        <polygon points="20,21 14,26 18,17.5" fill={color} />
        {/* main wing */}
        <rect x="26" y="6" width="14" height="23" rx="2" fill={color} opacity="0.85" />
        {/* propeller */}
        <rect x="56" y="11" width="3" height="14" rx="1" fill={color} opacity="0.7" />
        <rect x="54" y="16" width="7" height="3" rx="1" fill={color} opacity="0.7" />
      </svg>
    ),
    // Tier 2 — twin-engine light fighter
    2: (
      <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
        {/* fuselage */}
        <rect x="18" y="15" width="30" height="6" rx="2" fill={color} />
        {/* nose */}
        <polygon points="48,15 58,18 48,21" fill={color} />
        {/* tail fins */}
        <polygon points="18,15 10,8 16,18" fill={color} />
        <polygon points="18,21 10,28 16,18" fill={color} />
        {/* swept wing */}
        <polygon points="24,17 36,17 40,6 28,6" fill={color} opacity="0.9" />
        <polygon points="24,19 36,19 40,30 28,30" fill={color} opacity="0.9" />
        {/* engine pods */}
        <ellipse cx="36" cy="10" rx="4" ry="2" fill={color} opacity="0.7" />
        <ellipse cx="36" cy="26" rx="4" ry="2" fill={color} opacity="0.7" />
      </svg>
    ),
    // Tier 3 — swept-wing interceptor
    3: (
      <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
        {/* fuselage (sleeker) */}
        <rect x="16" y="15.5" width="32" height="5" rx="2" fill={color} />
        {/* nose cone */}
        <polygon points="48,15.5 60,18 48,20.5" fill={color} />
        {/* tail */}
        <polygon points="16,15.5 8,10 14,18" fill={color} />
        <polygon points="16,20.5 8,26 14,18" fill={color} />
        {/* delta wing */}
        <polygon points="22,17 44,17 32,4" fill={color} opacity="0.9" />
        <polygon points="22,19 44,19 32,32" fill={color} opacity="0.9" />
        {/* canards */}
        <polygon points="42,16 48,16 46,12" fill={color} opacity="0.8" />
        <polygon points="42,20 48,20 46,24" fill={color} opacity="0.8" />
      </svg>
    ),
    // Tier 4 — F-16 style
    4: (
      <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
        {/* long fuselage */}
        <rect x="12" y="16" width="38" height="4" rx="1" fill={color} />
        {/* pointed nose */}
        <polygon points="50,16 63,18 50,20" fill={color} />
        {/* tail unit */}
        <polygon points="12,16 4,8 10,18" fill={color} />
        <polygon points="12,20 4,28 10,18" fill={color} />
        {/* cropped delta wing */}
        <polygon points="20,17 46,17 38,5 18,5" fill={color} opacity="0.9" />
        <polygon points="20,19 46,19 38,31 18,31" fill={color} opacity="0.9" />
        {/* ventral fin */}
        <rect x="14" y="20" width="8" height="4" rx="1" fill={color} opacity="0.6" />
        {/* afterburner glow */}
        <ellipse cx="8" cy="18" rx="4" ry="2" fill="#ff6600" opacity="0.8" />
        <ellipse cx="5" cy="18" rx="2" ry="1.2" fill="#ffaa00" opacity="0.9" />
      </svg>
    ),
    // Tier 5 — B-52 bomber
    5: (
      <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
        {/* wide fuselage */}
        <rect x="14" y="15" width="36" height="10" rx="3" fill={color} />
        {/* blunt nose */}
        <ellipse cx="50" cy="20" rx="5" ry="5" fill={color} />
        {/* tail tower */}
        <rect x="14" y="8" width="5" height="14" rx="1" fill={color} opacity="0.9" />
        <polygon points="14,8 10,2 19,8" fill={color} opacity="0.8" />
        {/* massive wing */}
        <polygon points="18,17 50,17 60,5 8,5" fill={color} opacity="0.85" />
        <polygon points="18,23 50,23 60,35 8,35" fill={color} opacity="0.85" />
        {/* 4 engine pods */}
        {[10, 20, 38, 48].map((x, i) => (
          <ellipse key={i} cx={x} cy={i < 2 ? 9 : 31} rx="4" ry="1.8" fill={color} opacity="0.7" />
        ))}
        {/* bomb bay outline */}
        <rect x="28" y="25" width="12" height="3" rx="1" fill={color} opacity="0.5" />
      </svg>
    ),
  };

  return <div className="flex items-center justify-center">{paths[tier]}</div>;
}
