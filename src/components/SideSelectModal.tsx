"use client";

interface Props {
  walletAddress: string;
  onSelect: (side: "iran" | "israel") => void;
}

export default function SideSelectModal({ walletAddress, onSelect }: Props) {
  const short = walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-green-900/20" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-900/20" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <div className="text-xs tracking-widest text-white/40 mb-2 uppercase">Wallet: {short}</div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-1" style={{ fontFamily: "sans-serif" }}>
            CHOOSE YOUR SIDE
          </h1>
          <p className="text-white/50 text-sm">Your GITWAR holdings will fight for the side you choose</p>
        </div>

        {/* Side Buttons */}
        <div className="grid grid-cols-2 gap-6 w-full">

          {/* Iran */}
          <button
            onClick={() => onSelect("iran")}
            className="group relative overflow-hidden rounded-2xl border-2 border-green-600/60 bg-black/60 p-8 flex flex-col items-center gap-4 hover:border-green-400 hover:bg-green-950/40 transition-all duration-200"
          >
            {/* Flag */}
            <div className="flex flex-col w-32 h-20 overflow-hidden rounded-sm border border-white/20">
              <div className="flex-1 bg-[#239f40]" />
              <div className="flex-1 bg-white flex items-center justify-center">
                <span className="text-[#c60000] text-lg font-bold">☽</span>
              </div>
              <div className="flex-1 bg-[#c60000]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300 mb-1" style={{ fontFamily: "sans-serif" }}>IRAN</div>
              <div className="text-xs text-white/40">Islamic Republic</div>
            </div>
            <div className="text-4xl">🕌</div>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, transparent 70%)" }}
            />
          </button>

          {/* Israel */}
          <button
            onClick={() => onSelect("israel")}
            className="group relative overflow-hidden rounded-2xl border-2 border-blue-600/60 bg-black/60 p-8 flex flex-col items-center gap-4 hover:border-blue-400 hover:bg-blue-950/40 transition-all duration-200"
          >
            {/* Flag */}
            <div className="flex flex-col w-32 h-20 overflow-hidden rounded-sm border border-white/20 bg-white">
              <div className="h-[22%] bg-[#0038b8]" />
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[#0038b8] text-2xl">✡</span>
              </div>
              <div className="h-[22%] bg-[#0038b8]" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300 mb-1" style={{ fontFamily: "sans-serif" }}>ISRAEL</div>
              <div className="text-xs text-white/40">State of Israel</div>
            </div>
            <div className="text-4xl">✡️</div>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
            />
          </button>
        </div>

        <p className="text-white/25 text-xs text-center">
          You can only fight for one side per wallet. Choose wisely.
        </p>
      </div>
    </div>
  );
}
