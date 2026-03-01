"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SideSelectModal from "@/components/SideSelectModal";
import PlaneSelectModal, { type PlaneTier } from "@/components/PlaneSelectModal";

const WarMap = dynamic(() => import("@/components/WarMap"), { ssr: false });

type GameState = "wallet" | "side" | "plane" | "playing";

// ── Mock holding percentage ───────────────────────────────────────
// Until the GITWAR CA is live, derive a mock % from the wallet address
// so every address gets a deterministic (but varied) holding value.
// Replace this function with a real on-chain balance lookup later.
function getMockHoldingPct(address: string): number {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) >>> 0;
  }
  // Spread evenly-ish across 0–4% so all tiers are reachable in demo
  return ((hash % 1000) / 1000) * 4.0;
}

export default function WarPage() {
  const [gameState, setGameState]   = useState<GameState>("wallet");
  const [walletAddress, setWalletAddress] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [side, setSide]             = useState<"iran" | "israel" | null>(null);
  const [tier, setTier]             = useState<PlaneTier>(1);
  const [error, setError]           = useState("");

  const holdingPct = walletAddress ? getMockHoldingPct(walletAddress) : 0;

  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) { setError("Paste your Solana wallet address"); return; }
    if (val.length < 32 || val.length > 44) {
      setError("That doesn't look like a valid Solana address");
      return;
    }
    setWalletAddress(val);
    setError("");
    setGameState("side");
  }

  function handleSideSelect(chosen: "iran" | "israel") {
    setSide(chosen);
    setGameState("plane");
  }

  function handlePlaneSelect(chosen: PlaneTier) {
    setTier(chosen);
    setGameState("playing");
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ fontFamily: "sans-serif" }}>

      {/* ── WALLET ENTRY ─────────────────────────────── */}
      {gameState === "wallet" && (
        <div className="flex flex-col items-center justify-center h-full px-4">
          {/* Background glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20"
              style={{ background: "radial-gradient(ellipse, #ff4400 0%, transparent 70%)" }} />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
            {/* Logo / Title */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl">🇮🇷</span>
                <span className="text-white/20 text-2xl font-bold">⚔️</span>
                <span className="text-4xl">🇮🇱</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tight leading-none">
                GITWAR
              </h1>
              <p className="text-white/40 mt-2 text-sm tracking-widest uppercase">
                The Middle East War Game
              </p>
            </div>

            {/* Tagline */}
            <div className="text-center text-white/60 text-sm max-w-xs leading-relaxed">
              Hold <span className="text-orange-400 font-bold">$GITWAR</span> tokens,
              connect your wallet, choose your side, and fly into battle.
            </div>

            {/* Wallet Form */}
            <form onSubmit={handleConnect} className="w-full flex flex-col gap-3">
              <label className="text-white/50 text-xs tracking-widest uppercase">
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setError(""); }}
                placeholder="Paste your wallet address..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-orange-400/60 focus:bg-white/8 transition-all"
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className="text-red-400 text-xs">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-sm tracking-widest uppercase transition-all"
              >
                Enter Battlefield →
              </button>
            </form>

            {/* Token info */}
            <div className="text-white/25 text-xs text-center">
              Your $GITWAR holdings determine your aircraft tier
            </div>
          </div>
        </div>
      )}

      {/* ── SIDE SELECT ───────────────────────────────── */}
      {gameState === "side" && (
        <SideSelectModal walletAddress={walletAddress} onSelect={handleSideSelect} />
      )}

      {/* ── PLANE SELECT ──────────────────────────────── */}
      {gameState === "plane" && side && (
        <PlaneSelectModal
          walletAddress={walletAddress}
          side={side}
          holdingPct={holdingPct}
          onSelect={handlePlaneSelect}
        />
      )}

      {/* ── PLAYING ───────────────────────────────────── */}
      {gameState === "playing" && side && (
        <WarMap side={side} walletAddress={walletAddress} tier={tier} />
      )}
    </div>
  );
}
