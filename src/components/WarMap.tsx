"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import PlayerPlane from "./PlayerPlane";
import type { PlaneTier } from "./PlaneSelectModal";
import { CombatLayer, DamageableBuilding, IRAN_BUILDINGS, ISRAEL_BUILDINGS } from "./CombatSystem";
import type { ScoreState } from "./CombatSystem";

// ─── Flag Components ─────────────────────────────────────────────

function IranFlag({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[-32, 30, 0]}>
        <boxGeometry args={[1.5, 60, 1.5]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0, 50, 0]}>
        <boxGeometry args={[60, 20, 0.5]} />
        <meshStandardMaterial color="#239f40" />
      </mesh>
      <mesh position={[0, 30, 0]}>
        <boxGeometry args={[60, 20, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[60, 20, 0.5]} />
        <meshStandardMaterial color="#c60000" />
      </mesh>
      <mesh position={[0, 30, 0.4]}>
        <cylinderGeometry args={[6, 6, 0.5, 16]} />
        <meshStandardMaterial color="#c60000" />
      </mesh>
      <mesh position={[2, 31, 0.8]}>
        <cylinderGeometry args={[5, 5, 0.6, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Accurate Star of David (hexagram): 6 rotated thin diamond boxes at 0°,60°,120°
function StarOfDavid({ cx, cy, cz, r, thickness }: {
  cx: number; cy: number; cz: number; r: number; thickness: number;
}) {
  // Two interlocked equilateral triangles → 6 rhombus "spokes" at every 60°
  const angles = [0, 60, 120]; // degrees — one upward triangle + one downward
  const rad = (d: number) => (d * Math.PI) / 180;
  return (
    <group position={[cx, cy, cz]}>
      {/* Upward triangle — 3 spokes */}
      {angles.map((a) => (
        <mesh key={`u${a}`} rotation={[0, 0, rad(a)]}>
          <boxGeometry args={[thickness, r * 2, thickness * 0.5]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
      ))}
      {/* Downward triangle — 3 spokes offset 30° */}
      {angles.map((a) => (
        <mesh key={`d${a}`} rotation={[0, 0, rad(a + 30)]}>
          <boxGeometry args={[thickness, r * 2, thickness * 0.5]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
      ))}
      {/* Solid centre hex to fill the middle gap */}
      <mesh>
        <cylinderGeometry args={[r * 0.32, r * 0.32, thickness * 0.4, 6]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
    </group>
  );
}

function IsraelFlag({ position }: { position: [number, number, number] }) {
  // Real flag proportions: width 66, height 48 (≈ 8:11 scaled to 48 h for pole)
  const fw = 66; const fh = 48;
  const stripeH = fh * 0.145; // ~7 units each stripe
  const stripeY_top = fh * 0.79;  // top stripe centre from bottom of flag
  const stripeY_bot = fh * 0.21;  // bottom stripe centre
  const flagBase = 20; // Y offset so flag sits above ground on pole

  return (
    <group position={position}>
      {/* Flagpole */}
      <mesh position={[-fw * 0.5, flagBase + fh / 2, 0]}>
        <boxGeometry args={[1.5, fh + flagBase * 2, 1.5]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      {/* White field */}
      <mesh position={[fw * 0.5 - 1, flagBase + fh / 2, 0]}>
        <boxGeometry args={[fw, fh, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Top blue stripe */}
      <mesh position={[fw * 0.5 - 1, flagBase + stripeY_top, 0.35]}>
        <boxGeometry args={[fw, stripeH, 0.4]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
      {/* Bottom blue stripe */}
      <mesh position={[fw * 0.5 - 1, flagBase + stripeY_bot, 0.35]}>
        <boxGeometry args={[fw, stripeH, 0.4]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
      {/* Star of David — centred on flag */}
      <StarOfDavid
        cx={fw * 0.5 - 1}
        cy={flagBase + fh / 2}
        cz={0.7}
        r={7}
        thickness={1.8}
      />
    </group>
  );
}

// ─── Pixel terrain texture generator ─────────────────────────────

function makePixelTerrainTexture(): THREE.CanvasTexture {
  const SIZE = 512;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // Base sandy fill
  ctx.fillStyle = "#c8a96e";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Pixel noise — random variation in earthy tones
  const colors = ["#b89858","#d4b880","#c0a060","#a88848","#dcc488","#b0905a","#c8b070","#aa8040"];
  const pxSize = 8;
  for (let y = 0; y < SIZE; y += pxSize) {
    for (let x = 0; x < SIZE; x += pxSize) {
      if (Math.random() > 0.55) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, pxSize, pxSize);
      }
    }
  }

  // Iran side tint (left half) — darker ochre
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgba(160,130,80,0.35)";
  ctx.fillRect(0, 0, SIZE / 2, SIZE);

  // Israel side tint (right half) — lighter sand
  ctx.fillStyle = "rgba(220,200,140,0.25)";
  ctx.fillRect(SIZE / 2, 0, SIZE / 2, SIZE);
  ctx.globalCompositeOperation = "source-over";

  // Add some scattered dark spots (rocks/scrub)
  for (let i = 0; i < 180; i++) {
    const rx = Math.floor((Math.random() * SIZE) / pxSize) * pxSize;
    const ry = Math.floor((Math.random() * SIZE) / pxSize) * pxSize;
    ctx.fillStyle = Math.random() > 0.5 ? "#8a7248" : "#6a5830";
    ctx.fillRect(rx, ry, pxSize, pxSize);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  tex.magFilter = THREE.NearestFilter; // keep pixel look sharp
  return tex;
}

// ─── Desert Terrain ───────────────────────────────────────────────

function DesertGround() {
  const tex = React.useMemo(() => makePixelTerrainTexture(), []);
  return (
    <>
      {/* Main pixel terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8000, 8000, 48, 48]} />
        <meshStandardMaterial map={tex} roughness={0.95} metalness={0} />
      </mesh>
      {/* Border line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <planeGeometry args={[12, 8000]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
    </>
  );
}

// ─── Clouds ───────────────────────────────────────────────────────

function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[180, 40, 90]} />
        <meshStandardMaterial color="#f0f4ff" transparent opacity={0.82} roughness={1} />
      </mesh>
      <mesh position={[60, 18, 10]}>
        <boxGeometry args={[120, 50, 80]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.78} roughness={1} />
      </mesh>
      <mesh position={[-50, 12, -10]}>
        <boxGeometry args={[100, 38, 70]} />
        <meshStandardMaterial color="#eef2ff" transparent opacity={0.7} roughness={1} />
      </mesh>
      <mesh position={[20, 30, 0]}>
        <boxGeometry args={[80, 36, 60]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
    </group>
  );
}

function Clouds() {
  const cloudPositions: [number, number, number][] = [
    [-1200, 900,  -2000], [600, 1100, -1500], [-400, 800, -800],
    [1400, 1000, -2200], [-800, 1200, 400], [200, 950, 1000],
    [-1600, 850, 1200], [900, 1050, 1800], [-200, 1150, 2200],
    [1600, 900, 800],  [-1000, 1000, -1600], [400, 1100, -3000],
    [-600, 850, 3000], [1200, 1000, 2600],  [-1800, 1050, -400],
    [0, 1200, -2800], [800, 900, 2000], [-1400, 1100, 1800],
  ];
  return (
    <>
      {cloudPositions.map((pos, i) => <Cloud key={i} position={pos} />)}
    </>
  );
}

function Mountains({ side }: { side: "iran" | "israel" }) {
  const x = side === "iran" ? -1800 : 1800;
  const color = side === "iran" ? "#8b7355" : "#9aab7a";
  const peaks = [-800, -400, 0, 400, 800];
  return (
    <group>
      {peaks.map((z, i) => (
        <mesh key={i} position={[x, 0, z]}>
          <coneGeometry args={[160 + (i % 3) * 60, 400 + (i % 2) * 200, 4]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Palm Tree ────────────────────────────────────────────────────

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 20, 6]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 6) * Math.PI * 2) * 5,
            21,
            Math.cos((i / 6) * Math.PI * 2) * 5,
          ]}
          rotation={[0.4, (i / 6) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.4, 0.2, 8]} />
          <meshStandardMaterial color="#2d7a2d" />
        </mesh>
      ))}
    </group>
  );
}

function PalmCluster({ position }: { position: [number, number, number] }) {
  const offsets: [number, number, number][] = [
    [0, 0, 0], [9, 0, 5], [-7, 0, 8], [5, 0, -9], [-3, 0, -5],
  ];
  return (
    <group position={position}>
      {offsets.map((off, i) => <PalmTree key={i} position={off} />)}
    </group>
  );
}

// ─── Building ─────────────────────────────────────────────────────
// Detailed: base band, window rows front+side, AC units, ledges

export interface BuildingProps {
  position: [number, number, number];
  w: number; h: number; d: number;
  color: string;
  windowColor?: string;
  roofColor?: string;
  bodyMatRef?: React.RefObject<THREE.MeshStandardMaterial | null>;
}

export function Building({ position, w, h, d, color, windowColor = "#ffcc88", roofColor, bodyMatRef }: BuildingProps) {
  const rc = roofColor ?? (windowColor === "#ffcc88" ? "#b09070" : "#c8c0b0");
  const floorH = Math.max(4, h / 12); // approx floor height
  const floors = Math.floor(h / floorH);

  return (
    <group position={[position[0], position[1] + h / 2, position[2]]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial ref={bodyMatRef} color={color} roughness={0.85} metalness={0.04} />
      </mesh>
      {/* Base plinth — wider than body */}
      <mesh position={[0, -h / 2 + 2, 0]}>
        <boxGeometry args={[w + 2, 4, d + 2]} />
        <meshStandardMaterial color={rc} roughness={0.9} />
      </mesh>
      {/* Horizontal floor ledges every ~4 floors */}
      {Array.from({ length: Math.min(Math.floor(floors / 4), 8) }, (_, li) => {
        const ly = -h / 2 + floorH * 4 * (li + 1);
        return (
          <mesh key={li} position={[0, ly, 0]}>
            <boxGeometry args={[w + 1.0, 0.8, d + 1.0]} />
            <meshStandardMaterial color={rc} roughness={0.9} />
          </mesh>
        );
      })}
      {/* Roof parapet */}
      <mesh position={[0, h / 2 + 1.2, 0]}>
        <boxGeometry args={[w + 1, 2.4, d + 1]} />
        <meshStandardMaterial color={rc} roughness={0.9} />
      </mesh>
      {/* Rooftop mechanical penthouse */}
      {h > 60 && (
        <mesh position={[w * 0.2, h / 2 + 5, 0]}>
          <boxGeometry args={[w * 0.35, 8, d * 0.4]} />
          <meshStandardMaterial color="#444" roughness={0.7} />
        </mesh>
      )}
      {/* Rooftop water tank */}
      {h > 80 && (
        <mesh position={[-w * 0.25, h / 2 + 4, d * 0.2]}>
          <cylinderGeometry args={[w * 0.08, w * 0.08, 6, 8]} />
          <meshStandardMaterial color="#666" roughness={0.8} />
        </mesh>
      )}
      {/* Windows — emissive overlay planes (front / back / sides) */}
      <mesh position={[0, 0, d / 2 + 0.08]}>
        <planeGeometry args={[w - 2, h - 6]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.5} transparent opacity={0.25} alphaTest={0.01} />
      </mesh>
      <mesh position={[0, 0, -d / 2 - 0.08]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w - 2, h - 6]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.4} transparent opacity={0.20} alphaTest={0.01} />
      </mesh>
      <mesh position={[w / 2 + 0.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[d - 2, h - 6]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.4} transparent opacity={0.20} alphaTest={0.01} />
      </mesh>
      <mesh position={[-w / 2 - 0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d - 2, h - 6]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.35} transparent opacity={0.18} alphaTest={0.01} />
      </mesh>
    </group>
  );
}

// ─── Road grid helper ─────────────────────────────────────────────
// Warm sandy asphalt — natural packed-earth look, not pure black

function Road({ x1, x2, z, w = 7, axis = "x" }: {
  x1: number; x2: number; z: number; w?: number; axis?: "x" | "z";
}) {
  const len = Math.abs(x2 - x1);
  const cx = axis === "x" ? (x1 + x2) / 2 : x1;
  const cz = axis === "x" ? z : (x1 + x2) / 2;
  const rw = axis === "x" ? len : w;
  const rd = axis === "x" ? w : len;
  // Kerb width
  const kw = axis === "x" ? rw : w + 3;
  const kd = axis === "x" ? w + 3 : rd;
  return (
    <group>
      {/* Kerb / shoulder — slightly wider, light sandy border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.10, cz]}>
        <planeGeometry args={[kw, kd]} />
        <meshStandardMaterial color="#b8a880" roughness={1} />
      </mesh>
      {/* Road surface — warm worn asphalt, beige-grey */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.15, cz]}>
        <planeGeometry args={[rw, rd]} />
        <meshStandardMaterial color="#7a7060" roughness={1} />
      </mesh>
      {/* Worn centre marking — faded cream/white, not neon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.17, cz]}>
        <planeGeometry args={[axis === "x" ? rw * 0.9 : 0.6, axis === "x" ? 0.6 : rd * 0.9]} />
        <meshStandardMaterial color="#d8cca0" roughness={1} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Pavement block ───────────────────────────────────────────────

function Pavement({ position, w, d }: { position: [number, number, number]; w: number; d: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.12, position[2]]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color="#c0b090" roughness={1} />
    </mesh>
  );
}

// ─── Street lamp ──────────────────────────────────────────────────

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 16, 6]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 16.5, 0]}>
        <boxGeometry args={[0.4, 0.4, 2.5]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 16.3, 1.2]}>
        <boxGeometry args={[1.2, 0.6, 0.6]} />
        <meshStandardMaterial color="#ffeeaa" emissive="#ffdd88" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// ─── Park ─────────────────────────────────────────────────────────

function Park({ position, large = false }: { position: [number, number, number]; large?: boolean }) {
  const sz = large ? 80 : 50;
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
        <planeGeometry args={[sz, sz]} />
        <meshStandardMaterial color="#3a7a3a" roughness={1} transparent opacity={0.88} />
      </mesh>
      {/* Path cross */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
        <planeGeometry args={[sz, 4]} />
        <meshStandardMaterial color="#c8b89a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
        <planeGeometry args={[4, sz]} />
        <meshStandardMaterial color="#c8b89a" roughness={1} />
      </mesh>
      {/* Fountain */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[3, 4, 1.5, 12]} />
        <meshStandardMaterial color="#a0b0c8" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#88aacc" />
      </mesh>
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#aaccee" emissive="#4488aa" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
      {/* Benches */}
      {([[-10, 0, 5], [10, 0, -5], [0, 0, 14], [0, 0, -14]] as [number,number,number][]).map((off, i) => (
        <mesh key={i} position={[off[0], off[1] + 0.9, off[2]]}>
          <boxGeometry args={[5, 0.5, 1.5]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.8} />
        </mesh>
      ))}
      {/* Trees */}
      <PalmTree position={[-sz * 0.3, 0, -sz * 0.3]} />
      <PalmTree position={[sz * 0.3, 0, sz * 0.3]} />
      <PalmTree position={[-sz * 0.3, 0, sz * 0.3]} />
      <PalmTree position={[sz * 0.3, 0, -sz * 0.3]} />
      {large && <PalmTree position={[0, 0, -sz * 0.35]} />}
      {large && <PalmTree position={[0, 0, sz * 0.35]} />}
    </group>
  );
}

// ─── Coffee Shop ──────────────────────────────────────────────────

function CoffeeShop({ position, color = "#c8a060" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      {/* Main box */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[14, 8, 10]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Flat roof overhang */}
      <mesh position={[0, 8.5, -1]}>
        <boxGeometry args={[16, 0.6, 13]} />
        <meshStandardMaterial color="#8a6030" roughness={0.9} />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 7.5, -5.8]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[13, 0.3, 4]} />
        <meshStandardMaterial color="#cc4422" roughness={1} />
      </mesh>
      {/* Awning stripes */}
      {([-4, 0, 4] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 7.5, -5.9]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.2, 0.32, 4]} />
          <meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Large windows */}
      <mesh position={[0, 3.5, -5.1]}>
        <boxGeometry args={[10, 4.5, 0.2]} />
        <meshStandardMaterial color="#88ccff" emissive="#3388cc" emissiveIntensity={0.5} transparent opacity={0.85} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 7.0, -5.15]}>
        <boxGeometry args={[7, 1.5, 0.2]} />
        <meshStandardMaterial color="#3a1a00" emissive="#cc6600" emissiveIntensity={0.5} />
      </mesh>
      {/* Outdoor tables */}
      {([-4, 0, 4] as number[]).map((x, i) => (
        <group key={i} position={[x, 0, -8]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.2, 8]} />
            <meshStandardMaterial color="#6a4020" />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 2, 6]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          {/* Chairs */}
          {([[-2, 0, 0], [2, 0, 0]] as [number,number,number][]).map((c, ci) => (
            <mesh key={ci} position={c} >
              <boxGeometry args={[1.2, 0.15, 1.2]} />
              <meshStandardMaterial color="#8a5030" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Farm / Agricultural Field ────────────────────────────────────

function Farm({ position, side }: { position: [number, number, number]; side: "iran" | "israel" }) {
  const fieldColor = side === "iran" ? "#6a8a3a" : "#7aaa4a";
  const dirtColor  = side === "iran" ? "#8a6030" : "#9a7040";
  return (
    <group position={position}>
      {/* Field patches — 3×2 grid */}
      {([0, 1, 2] as number[]).map((col) =>
        ([0, 1] as number[]).map((row) => (
          <mesh key={`${col}-${row}`} rotation={[-Math.PI / 2, 0, 0]}
            position={[-45 + col * 45, 0.5, -22 + row * 44]}>
            <planeGeometry args={[42, 40]} />
            <meshStandardMaterial color={row % 2 === 0 ? fieldColor : dirtColor} roughness={1} />
          </mesh>
        ))
      )}
      {/* Crop rows on green patches */}
      {Array.from({ length: 8 }, (_, ri) => (
        <mesh key={ri} rotation={[-Math.PI / 2, 0, 0]}
          position={[-44 + ri * 12, 0.6, -22]}>
          <planeGeometry args={[1.5, 40]} />
          <meshStandardMaterial color="#2a5a1a" roughness={1} transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Barn */}
      <mesh position={[55, 5, 0]}>
        <boxGeometry args={[16, 10, 20]} />
        <meshStandardMaterial color="#8a3a1a" roughness={0.9} />
      </mesh>
      {/* Barn roof */}
      <mesh position={[55, 12, 0]}>
        <coneGeometry args={[13, 7, 4]} />
        <meshStandardMaterial color="#6a2a10" roughness={0.9} />
      </mesh>
      {/* Silo */}
      <mesh position={[68, 12, -6]}>
        <cylinderGeometry args={[4, 4, 24, 10]} />
        <meshStandardMaterial color="#c8bca8" roughness={0.8} />
      </mesh>
      <mesh position={[68, 24.5, -6]}>
        <coneGeometry args={[5, 5, 10]} />
        <meshStandardMaterial color="#a09080" roughness={0.8} />
      </mesh>
      {/* Fence lines */}
      {Array.from({ length: 10 }, (_, fi) => (
        <mesh key={fi} position={[-50 + fi * 12, 1, 23]}>
          <boxGeometry args={[1, 2, 0.4]} />
          <meshStandardMaterial color="#8a6030" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Rock cluster ─────────────────────────────────────────────────

function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.0, 0]} rotation={[0.2, 0.4, 0.1]}>
        <boxGeometry args={[3.5, 2, 3]} />
        <meshStandardMaterial color="#8a7a6a" roughness={1} />
      </mesh>
      <mesh position={[2.5, 0.7, 1]} rotation={[0.1, 0.8, 0.2]}>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="#7a6a5a" roughness={1} />
      </mesh>
      <mesh position={[-2, 0.5, -1]} rotation={[0.3, -0.3, 0]}>
        <boxGeometry args={[2.5, 1, 2.5]} />
        <meshStandardMaterial color="#9a8a78" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Dune mound ───────────────────────────────────────────────────

function DuneMound({ position, sx = 30, sy = 5, sz = 15 }: {
  position: [number, number, number]; sx?: number; sy?: number; sz?: number;
}) {
  return (
    <group position={position} scale={[sx, sy, sz]}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#c8b080" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── No-man's-land desert buffer ─────────────────────────────────

function DesertBuffer() {
  return (
    <group>
      <DuneMound position={[-240, 0, -760]} sx={70} sy={12} sz={36} />
      <DuneMound position={[160, 0, -600]} sx={56} sy={8} sz={28} />
      <DuneMound position={[-120, 0, -360]} sx={80} sy={14} sz={40} />
      <DuneMound position={[260, 0, -160]} sx={44} sy={10} sz={24} />
      <DuneMound position={[-280, 0, 80]} sx={60} sy={10} sz={32} />
      <DuneMound position={[100, 0, 300]} sx={90} sy={16} sz={44} />
      <DuneMound position={[-180, 0, 500]} sx={50} sy={8} sz={26} />
      <DuneMound position={[220, 0, 680]} sx={76} sy={12} sz={38} />
      <DuneMound position={[-300, 0, 900]} sx={40} sy={6} sz={20} />
      <DuneMound position={[120, 0, 1000]} sx={64} sy={10} sz={32} />
      <DuneMound position={[-60, 0, -900]} sx={48} sy={8} sz={24} />
      <DuneMound position={[200, 0, -1000]} sx={36} sy={6} sz={18} />
      <Rock position={[-100, 0, -420]} scale={1.2} />
      <Rock position={[140, 0, -260]} scale={0.8} />
      <Rock position={[-70, 0, -100]} scale={1.5} />
      <Rock position={[90, 0, 80]} scale={1.0} />
      <Rock position={[-130, 0, 200]} scale={1.3} />
      <Rock position={[60, 0, 320]} scale={0.9} />
      <Rock position={[-50, 0, 440]} scale={1.1} />
      <Rock position={[120, 0, -380]} scale={0.7} />
      <Rock position={[-160, 0, 360]} scale={1.4} />
      <Rock position={[30, 0, -150]} scale={1.0} />
    </group>
  );
}

// ─── Grand Mosque (large landmark) ───────────────────────────────

function GrandMosque({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wide courtyard ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <planeGeometry args={[110, 100]} />
        <meshStandardMaterial color="#d8ccb4" roughness={1} />
      </mesh>
      {/* Courtyard walls */}
      <mesh position={[0, 3, -50]}><boxGeometry args={[110, 6, 1.5]} /><meshStandardMaterial color="#e0d4bc" roughness={0.9} /></mesh>
      <mesh position={[0, 3, 50]}><boxGeometry args={[110, 6, 1.5]} /><meshStandardMaterial color="#e0d4bc" roughness={0.9} /></mesh>
      <mesh position={[-55, 3, 0]}><boxGeometry args={[1.5, 6, 100]} /><meshStandardMaterial color="#e0d4bc" roughness={0.9} /></mesh>
      <mesh position={[55, 3, 0]}><boxGeometry args={[1.5, 6, 100]} /><meshStandardMaterial color="#e0d4bc" roughness={0.9} /></mesh>
      {/* Main prayer hall */}
      <mesh position={[0, 9, 10]}>
        <boxGeometry args={[50, 18, 40]} />
        <meshStandardMaterial color="#ede2cc" roughness={0.85} />
      </mesh>
      {/* Side wings */}
      <mesh position={[-28, 6, 10]}><boxGeometry args={[6, 12, 34]} /><meshStandardMaterial color="#e4d8c0" roughness={0.85} /></mesh>
      <mesh position={[28, 6, 10]}><boxGeometry args={[6, 12, 34]} /><meshStandardMaterial color="#e4d8c0" roughness={0.85} /></mesh>
      {/* Central large dome */}
      <mesh position={[0, 22, 10]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[13, 20, 14]} />
        <meshStandardMaterial color="#2e7a3e" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Dome finial */}
      <mesh position={[0, 31.5, 10]}>
        <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 33.5, 10]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Smaller side domes */}
      {([-15, 15] as number[]).map((x, i) => (
        <group key={i}>
          <mesh position={[x, 18, 10]} scale={[1, 0.7, 1]}>
            <sphereGeometry args={[6.5, 14, 10]} />
            <meshStandardMaterial color="#3a8a4a" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* 4 corner towers */}
      {([-22, 22] as number[]).map((x) =>
        ([-18, 30] as number[]).map((z, zi) => (
          <group key={`${x}-${z}`}>
            <mesh position={[x, 22, z]}>
              <cylinderGeometry args={[2.0, 2.5, 44, 12]} />
              <meshStandardMaterial color="#ddd0b8" roughness={0.8} />
            </mesh>
            <mesh position={[x, 44, z]}>
              <cylinderGeometry args={[2.8, 2.0, 3.5, 12]} />
              <meshStandardMaterial color="#c8bca8" roughness={0.8} />
            </mesh>
            <mesh position={[x, 47, z]}>
              <coneGeometry args={[3, 6, 12]} />
              <meshStandardMaterial color="#2e7a3e" roughness={0.6} />
            </mesh>
            <mesh position={[x, 49.5, z]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
      {/* Entrance arch portal */}
      <mesh position={[0, 8, -10.3]}>
        <boxGeometry args={[14, 14, 1]} />
        <meshStandardMaterial color="#d4a870" roughness={0.8} />
      </mesh>
      <mesh position={[0, 15.5, -10.3]}>
        <cylinderGeometry args={[7, 7, 1.5, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#d4a870" roughness={0.8} />
      </mesh>
      {/* Decorative arch ring */}
      <mesh position={[0, 8, -10.4]} rotation={[0, 0, 0]}>
        <torusGeometry args={[5, 0.5, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#b08840" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─── Small Mosque ─────────────────────────────────────────────────

function Mosque({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[20, 10, 18]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
      </mesh>
      <mesh position={[-13, 3.5, 0]}><boxGeometry args={[6, 7, 14]} /><meshStandardMaterial color="#e0d4be" roughness={0.9} /></mesh>
      <mesh position={[13, 3.5, 0]}><boxGeometry args={[6, 7, 14]} /><meshStandardMaterial color="#e0d4be" roughness={0.9} /></mesh>
      <mesh position={[0, 13, 0]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[7, 16, 12]} />
        <meshStandardMaterial color="#3a8a4a" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 18.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 20, 0]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-13, 8.5, 0]} scale={[1, 0.7, 1]}><sphereGeometry args={[3.5, 12, 8]} /><meshStandardMaterial color="#4a9a5a" roughness={0.7} /></mesh>
      <mesh position={[13, 8.5, 0]} scale={[1, 0.7, 1]}><sphereGeometry args={[3.5, 12, 8]} /><meshStandardMaterial color="#4a9a5a" roughness={0.7} /></mesh>
      {/* Minarets */}
      {([-9, 9] as number[]).map((x) => (
        <group key={x}>
          <mesh position={[x, 16, -8]}>
            <cylinderGeometry args={[1.4, 1.8, 32, 10]} />
            <meshStandardMaterial color="#ddd0b8" roughness={0.8} />
          </mesh>
          <mesh position={[x, 33.5, -8]}>
            <cylinderGeometry args={[2.0, 1.4, 3, 10]} />
            <meshStandardMaterial color="#c8bca8" roughness={0.8} />
          </mesh>
          <mesh position={[x, 36.5, -8]}>
            <coneGeometry args={[2.0, 5, 10]} />
            <meshStandardMaterial color="#3a8a4a" roughness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 4, -9.2]}>
        <boxGeometry args={[6, 8, 0.6]} />
        <meshStandardMaterial color="#d4a870" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ─── Grand Synagogue (large landmark) ────────────────────────────

function GrandSynagogue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <planeGeometry args={[100, 90]} />
        <meshStandardMaterial color="#d8d0bc" roughness={1} />
      </mesh>
      {/* Steps */}
      {([0, 1, 2] as number[]).map((si) => (
        <mesh key={si} position={[0, si * 0.6, -22 - si * 1.2]}>
          <boxGeometry args={[34 - si * 2, 0.6, 2.5]} />
          <meshStandardMaterial color="#e0d8c8" roughness={0.85} />
        </mesh>
      ))}
      {/* Main building */}
      <mesh position={[0, 14, 5]}>
        <boxGeometry args={[40, 28, 30]} />
        <meshStandardMaterial color="#f4eed8" roughness={0.8} />
      </mesh>
      {/* Raised central section */}
      <mesh position={[0, 26, 5]}>
        <boxGeometry args={[24, 12, 22]} />
        <meshStandardMaterial color="#ece4d0" roughness={0.8} />
      </mesh>
      {/* Dome on central section */}
      <mesh position={[0, 37, 5]} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[10, 16, 12]} />
        <meshStandardMaterial color="#e0d4bc" roughness={0.75} metalness={0.05} />
      </mesh>
      {/* Dome lantern */}
      <mesh position={[0, 44.5, 5]}>
        <cylinderGeometry args={[1.5, 2, 5, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 47.5, 5]}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Side towers */}
      {([-18, 18] as number[]).map((x) => (
        <group key={x}>
          <mesh position={[x, 20, -10]}>
            <boxGeometry args={[8, 40, 8]} />
            <meshStandardMaterial color="#ece4d0" roughness={0.8} />
          </mesh>
          <mesh position={[x, 41, -10]}>
            <boxGeometry args={[8.5, 2, 8.5]} />
            <meshStandardMaterial color="#d4c8b0" roughness={0.8} />
          </mesh>
          {/* Tower top dome */}
          <mesh position={[x, 45, -10]} scale={[1, 0.7, 1]}>
            <sphereGeometry args={[5, 12, 8]} />
            <meshStandardMaterial color="#c8c0b0" roughness={0.75} />
          </mesh>
          {/* Star atop tower */}
          <mesh position={[x, 49, -10]}>
            <cylinderGeometry args={[0.3, 0.3, 3, 6]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Large Star of David facade — 3-axis cross layered */}
      {([0, Math.PI / 3, -Math.PI / 3] as number[]).map((rot, i) => (
        <mesh key={i} position={[0, 16, -20.2]} rotation={[0, 0, rot]}>
          <boxGeometry args={[0.6, 12, 0.5]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Entrance columns */}
      {([-10, -4, 4, 10] as number[]).map((xOff, i) => (
        <mesh key={i} position={[xOff, 10, -20.4]}>
          <cylinderGeometry args={[1.0, 1.2, 20, 10]} />
          <meshStandardMaterial color="#ece4d4" roughness={0.75} />
        </mesh>
      ))}
      {/* Arched windows front */}
      {([-13, 0, 13] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 12, -20.3]}>
          <boxGeometry args={[3.5, 8, 0.3]} />
          <meshStandardMaterial color="#99ccff" emissive="#4488cc" emissiveIntensity={0.5} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Side tall arched windows */}
      {([0] as number[]).map((_, i) => (
        <mesh key={i} position={[20.3, 14, 5]}>
          <boxGeometry args={[0.3, 10, 5]} />
          <meshStandardMaterial color="#99ccff" emissive="#4488cc" emissiveIntensity={0.4} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Synagogue (small) ────────────────────────────────────────────

function Synagogue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[22, 11, 16]} />
        <meshStandardMaterial color="#f0ead8" roughness={0.85} />
      </mesh>
      <mesh position={[0, 12, 0]}>
        <boxGeometry args={[22.5, 2, 16.5]} />
        <meshStandardMaterial color="#ddd5c0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[14, 5, 10]} />
        <meshStandardMaterial color="#e8e0cc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[14.5, 1, 10.5]} />
        <meshStandardMaterial color="#c8c0b0" roughness={0.8} />
      </mesh>
      {/* Star of David */}
      {([0, Math.PI / 3, -Math.PI / 3] as number[]).map((rot, i) => (
        <mesh key={i} position={[0, 8, -8.2]} rotation={[0, 0, rot]}>
          <boxGeometry args={[0.5, 8, 0.4]} />
          <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Columns */}
      {([-5, -1.5, 1.5, 5] as number[]).map((xOff, i) => (
        <mesh key={i} position={[xOff, 4.5, -8.3]}>
          <cylinderGeometry args={[0.7, 0.8, 9, 8]} />
          <meshStandardMaterial color="#e8e0d0" roughness={0.7} />
        </mesh>
      ))}
      {/* Windows */}
      {([-7, 0, 7] as number[]).map((xOff, i) => (
        <mesh key={i} position={[xOff, 6, -8.2]}>
          <boxGeometry args={[2.5, 5, 0.3]} />
          <meshStandardMaterial color="#99ccff" emissive="#4488cc" emissiveIntensity={0.4} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Iran Road Network ────────────────────────────────────────────

function IranRoads() {
  return (
    <group>
      {/* Main east-west boulevards */}
      <Road x1={-500} x2={-1560} z={-640} w={14} axis="x" />
      <Road x1={-500} x2={-1560} z={-1280} w={12} axis="x" />
      {/* Secondary east-west */}
      <Road x1={-520} x2={-1520} z={-400} w={9} axis="x" />
      <Road x1={-540} x2={-1400} z={-840} w={9} axis="x" />
      {/* Cross streets (north-south) */}
      <Road x1={-1060} x2={300} z={-1200} w={10} axis="z" />
      <Road x1={-1060} x2={300} z={-900} w={10} axis="z" />
      <Road x1={-1060} x2={300} z={-640} w={10} axis="z" />
      <Road x1={-1060} x2={300} z={-980} w={8} axis="z" />
      {/* City B north roads */}
      <Road x1={-520} x2={-1320} z={260} w={12} axis="x" />
      <Road x1={-520} x2={-1240} z={460} w={9} axis="x" />
      <Road x1={-1060} x2={100} z={-980} w={9} axis="z" />
      <Road x1={-500} x2={-1600} z={900} w={10} axis="x" />
      {/* Street lamps along main boulevard */}
      {([-580, -700, -840, -980, -1120, -1260, -1400] as number[]).map((x, i) => (
        <StreetLamp key={i} position={[x, 0, -614]} />
      ))}
      {([-580, -700, -840, -980, -1120, -1260, -1400] as number[]).map((x, i) => (
        <StreetLamp key={i + 10} position={[x, 0, -666]} />
      ))}
    </group>
  );
}

// ─── Israel Road Network ──────────────────────────────────────────

function IsraelRoads() {
  return (
    <group>
      {/* Main east-west boulevards */}
      <Road x1={500} x2={1560} z={-640} w={14} axis="x" />
      <Road x1={500} x2={1560} z={-1280} w={12} axis="x" />
      {/* Secondary east-west */}
      <Road x1={520} x2={1520} z={-400} w={9} axis="x" />
      <Road x1={540} x2={1400} z={-840} w={9} axis="x" />
      {/* Cross streets (north-south) */}
      <Road x1={-300} x2={1060} z={1200} w={10} axis="z" />
      <Road x1={-300} x2={1060} z={900} w={10} axis="z" />
      <Road x1={-300} x2={1060} z={640} w={10} axis="z" />
      <Road x1={-300} x2={1060} z={980} w={8} axis="z" />
      {/* City B north roads */}
      <Road x1={520} x2={1320} z={260} w={12} axis="x" />
      <Road x1={520} x2={1240} z={460} w={9} axis="x" />
      <Road x1={-100} x2={1060} z={980} w={9} axis="z" />
      <Road x1={500} x2={1600} z={900} w={10} axis="x" />
      {/* Street lamps */}
      {([580, 700, 840, 980, 1120, 1260, 1400] as number[]).map((x, i) => (
        <StreetLamp key={i} position={[x, 0, -614]} />
      ))}
      {([580, 700, 840, 980, 1120, 1260, 1400] as number[]).map((x, i) => (
        <StreetLamp key={i + 10} position={[x, 0, -666]} />
      ))}
    </group>
  );
}

// ─── Boundary wall with flags ─────────────────────────────────────
// Large flags mounted on a concrete perimeter wall along each outer edge

function IranBoundaryWall() {
  // West boundary — X ≈ -1880, flags face east (rotation Y = 0 = faces +Z by default,
  // rotate Y = -PI/2 so flags face inward toward +X / center)
  const zPositions = [-1200, -600, 0, 600, 1200];
  return (
    <group>
      {/* Concrete wall running Z = -1600 to 1600 */}
      <mesh position={[-1880, 8, 0]}>
        <boxGeometry args={[4, 16, 3200]} />
        <meshStandardMaterial color="#c8bca8" roughness={0.95} />
      </mesh>
      {/* Wall top ridge */}
      <mesh position={[-1880, 16.5, 0]}>
        <boxGeometry args={[5, 1.5, 3200]} />
        <meshStandardMaterial color="#b8ac98" roughness={1} />
      </mesh>
      {/* Iranian flags evenly spaced, facing inward (+X direction) */}
      {zPositions.map((z, i) => (
        <group key={i} position={[-1878, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Pole */}
          <mesh position={[0, 40, 0]}>
            <cylinderGeometry args={[0.8, 1.0, 80, 8]} />
            <meshStandardMaterial color="#888" metalness={0.4} />
          </mesh>
          {/* Green stripe */}
          <mesh position={[40, 72, 0]}>
            <boxGeometry args={[80, 27, 0.6]} />
            <meshStandardMaterial color="#239f40" />
          </mesh>
          {/* White stripe */}
          <mesh position={[40, 45, 0]}>
            <boxGeometry args={[80, 27, 0.6]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          {/* Red stripe */}
          <mesh position={[40, 18, 0]}>
            <boxGeometry args={[80, 27, 0.6]} />
            <meshStandardMaterial color="#c60000" />
          </mesh>
          {/* Crescent emblem on white band */}
          <mesh position={[35, 45, 0.5]}>
            <cylinderGeometry args={[8, 8, 0.6, 20]} />
            <meshStandardMaterial color="#c60000" />
          </mesh>
          <mesh position={[38, 46.5, 1.0]}>
            <cylinderGeometry args={[6.5, 6.5, 0.7, 20]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function IsraelBoundaryWall() {
  // East boundary — X ≈ +1880, flags face west (inward toward -X)
  const zPositions = [-1200, -600, 0, 600, 1200];
  return (
    <group>
      {/* Concrete wall */}
      <mesh position={[1880, 8, 0]}>
        <boxGeometry args={[4, 16, 3200]} />
        <meshStandardMaterial color="#d8d0be" roughness={0.95} />
      </mesh>
      <mesh position={[1880, 16.5, 0]}>
        <boxGeometry args={[5, 1.5, 3200]} />
        <meshStandardMaterial color="#c8c0ae" roughness={1} />
      </mesh>
      {/* Israeli flags facing inward (-X direction) */}
      {zPositions.map((z, i) => (
        <group key={i} position={[1878, 0, z]} rotation={[0, Math.PI / 2, 0]}>
          {/* Pole */}
          <mesh position={[0, 40, 0]}>
            <cylinderGeometry args={[0.8, 1.0, 80, 8]} />
            <meshStandardMaterial color="#888" metalness={0.4} />
          </mesh>
          {/* White field — proportional 8:11 flag (88 wide × 64 tall) */}
          <mesh position={[44, 52, 0]}>
            <boxGeometry args={[88, 64, 0.6]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          {/* Top blue stripe — 79% from flag bottom (Y=20+64×0.79≈71) */}
          <mesh position={[44, 71, 0.5]}>
            <boxGeometry args={[88, 9.5, 0.5]} />
            <meshStandardMaterial color="#0038b8" />
          </mesh>
          {/* Bottom blue stripe — 21% from flag bottom (Y=20+64×0.21≈33) */}
          <mesh position={[44, 33, 0.5]}>
            <boxGeometry args={[88, 9.5, 0.5]} />
            <meshStandardMaterial color="#0038b8" />
          </mesh>
          {/* Star of David centred */}
          <StarOfDavid cx={44} cy={52} cz={0.9} r={9} thickness={2.5} />
        </group>
      ))}
    </group>
  );
}

// ─── Iran Cities — decorations only (buildings via IranDamageableBuildings) ──

function IranCities() {
  return (
    <group>
      {/* ════ PAVEMENT ════ */}
      <Pavement position={[-1150, 0, -700]} w={1300} d={1400} />
      <Pavement position={[-1150, 0, 700]} w={1300} d={1400} />
      {/* NOTE: Buildings are rendered by IranDamageableBuildings component */}

      {/* ════ LANDMARKS ════ */}
      <GrandMosque position={[-1044, 0, -1240]} />
      <GrandMosque position={[-1400, 0, 400]} />
      <Mosque position={[-716, 0, -484]} />
      <Mosque position={[-1384, 0, -520]} />
      <Mosque position={[-1024, 0, 590]} />
      <Mosque position={[-544, 0, 610]} />
      <Mosque position={[-1276, 0, 970]} />
      <Mosque position={[-1560, 0, -240]} />
      <Mosque position={[-1680, 0, 310]} />
      <Mosque position={[-716, 0, -240]} />
      <Mosque position={[-900, 0, 800]} />
      <Mosque position={[-500, 0, 1100]} />

      {/* ════ COFFEE SHOPS ════ */}
      <CoffeeShop position={[-824, 0, -396]} color="#c8904a" />
      <CoffeeShop position={[-1164, 0, -516]} color="#b07840" />
      <CoffeeShop position={[-556, 0, -536]} color="#c07838" />
      <CoffeeShop position={[-716, 0, 610]} color="#c89050" />
      <CoffeeShop position={[-1250, 0, 160]} color="#b07840" />
      <CoffeeShop position={[-1440, 0, -96]} color="#c07838" />
      <CoffeeShop position={[-910, 0, 1156]} color="#b87838" />
      <CoffeeShop position={[-600, 0, 900]} color="#c07830" />

      {/* ════ PARKS ════ */}
      <Park position={[-1316, 0, -476]} large={true} />
      <Park position={[-616, 0, -964]} />
      <Park position={[-1510, 0, -690]} />
      <Park position={[-576, 0, 410]} />
      <Park position={[-1256, 0, 590]} large={true} />
      <Park position={[-1560, 0, 1090]} large={true} />
      <Park position={[-680, 0, 1240]} />
      <Park position={[-900, 0, -700]} large={true} />
      <Park position={[-1100, 0, 1200]} />

      {/* ════ PALMS & TREES ════ */}
      <PalmCluster position={[-884, 0, -344]} />
      <PalmCluster position={[-1364, 0, -784]} />
      <PalmCluster position={[-596, 0, -604]} />
      <PalmCluster position={[-1516, 0, -376]} />
      <PalmCluster position={[-1144, 0, 244]} />
      <PalmCluster position={[-550, 0, 550]} />
      <PalmCluster position={[-1064, 0, 984]} />
      <PalmCluster position={[-724, 0, 864]} />
      <PalmCluster position={[-516, 0, 936]} />
      <PalmCluster position={[-1680, 0, 444]} />
      <PalmCluster position={[-536, 0, 1176]} />
      <PalmCluster position={[-1400, 0, 1260]} />
      <PalmCluster position={[-750, 0, -1000]} />
      <PalmCluster position={[-1200, 0, -900]} />

      {/* ════ FARMS ════ */}
      <Farm position={[-1456, 0, 310]} side="iran" />
      <Farm position={[-1516, 0, 884]} side="iran" />
      <Farm position={[-1716, 0, 1220]} side="iran" />
      <Farm position={[-1720, 0, -1040]} side="iran" />
      <Farm position={[-600, 0, 1400]} side="iran" />
      <Farm position={[-1300, 0, 1500]} side="iran" />
    </group>
  );
}

// ─── Israel Cities — decorations only (buildings via IsraelDamageableBuildings) ──

function IsraelCities() {
  return (
    <group>
      {/* ════ FULL CITY PAVEMENT — entire Israel territory ════ */}
      <Pavement position={[1150, 0, -700]} w={1300} d={1400} />
      <Pavement position={[1150, 0, 700]} w={1300} d={1400} />
      {/* NOTE: Buildings are rendered by IsraelDamageableBuildings component */}

      {/* ════ LANDMARKS ════ */}
      <GrandSynagogue position={[1044, 0, -1240]} />
      <GrandSynagogue position={[1400, 0, 400]} />
      <Synagogue position={[716, 0, -484]} />
      <Synagogue position={[1384, 0, -520]} />
      <Synagogue position={[1024, 0, 590]} />
      <Synagogue position={[544, 0, 610]} />
      <Synagogue position={[1276, 0, 970]} />
      <Synagogue position={[1560, 0, -240]} />
      <Synagogue position={[1680, 0, 310]} />
      <Synagogue position={[716, 0, -240]} />
      <Synagogue position={[900, 0, 800]} />
      <Synagogue position={[500, 0, 1100]} />

      {/* ════ COFFEE SHOPS ════ */}
      <CoffeeShop position={[824, 0, -396]} color="#d4aa70" />
      <CoffeeShop position={[1164, 0, -516]} color="#c09858" />
      <CoffeeShop position={[556, 0, -536]} color="#c8a860" />
      <CoffeeShop position={[716, 0, 610]} color="#d4aa70" />
      <CoffeeShop position={[1250, 0, 160]} color="#c09858" />
      <CoffeeShop position={[1440, 0, -96]} color="#c8a860" />
      <CoffeeShop position={[910, 0, 1156]} color="#d0a858" />
      <CoffeeShop position={[600, 0, 900]} color="#c8a060" />

      {/* ════ PARKS ════ */}
      <Park position={[1316, 0, -476]} large={true} />
      <Park position={[616, 0, -964]} />
      <Park position={[1510, 0, -690]} />
      <Park position={[576, 0, 410]} />
      <Park position={[1256, 0, 590]} large={true} />
      <Park position={[1560, 0, 1090]} large={true} />
      <Park position={[680, 0, 1240]} />
      <Park position={[900, 0, -700]} large={true} />
      <Park position={[1100, 0, 1200]} />

      {/* ════ PALMS & TREES ════ */}
      <PalmCluster position={[884, 0, -344]} />
      <PalmCluster position={[1364, 0, -784]} />
      <PalmCluster position={[596, 0, -604]} />
      <PalmCluster position={[1516, 0, -376]} />
      <PalmCluster position={[1144, 0, 244]} />
      <PalmCluster position={[550, 0, 550]} />
      <PalmCluster position={[1064, 0, 984]} />
      <PalmCluster position={[724, 0, 864]} />
      <PalmCluster position={[516, 0, 936]} />
      <PalmCluster position={[1680, 0, 444]} />
      <PalmCluster position={[536, 0, 1176]} />
      <PalmCluster position={[1400, 0, 1260]} />
      <PalmCluster position={[750, 0, -1000]} />
      <PalmCluster position={[1200, 0, -900]} />

      {/* ════ FARMS ════ */}
      <Farm position={[1456, 0, 310]} side="israel" />
      <Farm position={[1516, 0, 884]} side="israel" />
      <Farm position={[1716, 0, 1220]} side="israel" />
      <Farm position={[1720, 0, -1040]} side="israel" />
      <Farm position={[600, 0, 1400]} side="israel" />
      <Farm position={[1300, 0, 1500]} side="israel" />
    </group>
  );
}

// ─── HUD overlay ─────────────────────────────────────────────────

const TIER_NAMES: Record<number, string> = {
  1: "SCOUT", 2: "FIGHTER", 3: "INTERCEPTOR", 4: "STEALTH", 5: "BOMBER"
};

const MATCH_DURATION = 5 * 60; // 5 minutes

function HUD({ side, score, tier }: { side: "iran" | "israel"; score: ScoreState; tier: number }) {
  const isIran = side === "iran";
  const [locked, setLocked] = useState(false);
  // Flash the reticle briefly when shooting
  const [firing, setFiring] = useState(false);
  const firingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Match timer
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const matchOver = timeLeft <= 0;

  useEffect(() => {
    const onChange = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  // Match countdown
  useEffect(() => {
    if (matchOver) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [matchOver]);

  // Listen for fire events via a custom DOM event dispatched from handleFire
  useEffect(() => {
    const onFire = () => {
      setFiring(true);
      if (firingTimer.current) clearTimeout(firingTimer.current);
      firingTimer.current = setTimeout(() => setFiring(false), 60);
    };
    window.addEventListener("gitwar-fire", onFire);
    return () => window.removeEventListener("gitwar-fire", onFire);
  }, []);

  const accentColor = isIran ? "#44dd66" : "#44aaff";
  const reticleColor = firing
    ? (isIran ? "rgba(255,180,0,0.95)" : "rgba(100,220,255,0.95)")
    : "rgba(255,255,255,0.82)";

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Side badge + tier */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4">
        <div
          className="flex flex-col gap-0.5 px-3 py-1.5 rounded text-xs font-bold text-white"
          style={{ background: isIran ? "rgba(35,159,64,0.75)" : "rgba(0,56,184,0.75)", fontFamily: "monospace" }}
        >
          <span>{isIran ? "🇮🇷 IRAN" : "🇮🇱 ISRAEL"}</span>
          <span style={{ color: accentColor, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            TIER {tier} · {TIER_NAMES[tier] ?? ""}
          </span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" }}>GITWAR</div>
      </div>

      {/* Score panel — top centre */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ fontFamily: "monospace" }}
      >
        <div className="flex gap-6 bg-black/65 border border-white/15 rounded-lg px-4 py-1.5">
          <span className="text-xs font-bold" style={{ color: "#44ff88" }}>
            🇮🇷 {score.iranDestroyed} bldg · {score.iranPoints} pts
          </span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-xs font-bold" style={{ color: "#88ccff" }}>
            🇮🇱 {score.israelDestroyed} bldg · {score.israelPoints} pts
          </span>
        </div>
        {/* Match timer */}
        <div
          className="px-3 py-0.5 rounded text-xs font-bold tracking-widest"
          style={{
            background: timeLeft <= 30 ? "rgba(200,30,30,0.8)" : "rgba(0,0,0,0.6)",
            color: timeLeft <= 30 ? "#ffaaaa" : "rgba(255,255,255,0.6)",
            border: timeLeft <= 30 ? "1px solid rgba(255,80,80,0.5)" : "1px solid rgba(255,255,255,0.1)",
            animation: timeLeft <= 10 && !matchOver ? "pulse 0.5s ease-in-out infinite alternate" : "none",
          }}
        >
          {matchOver ? "⏰ MATCH OVER" : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
        </div>
      </div>
      {/* Match-over overlay */}
      {matchOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-center bg-black/80 border border-white/20 rounded-2xl px-12 py-8">
            <div className="text-white text-5xl font-black mb-4">⏰ MATCH OVER</div>
            <div className="flex gap-12 justify-center">
              <div className="text-center">
                <div className="text-green-400 text-2xl font-black">{score.iranPoints}</div>
                <div className="text-white/50 text-sm">🇮🇷 IRAN</div>
                <div className="text-white/30 text-xs">{score.iranDestroyed} buildings</div>
              </div>
              <div className="text-white/20 text-3xl">vs</div>
              <div className="text-center">
                <div className="text-blue-400 text-2xl font-black">{score.israelPoints}</div>
                <div className="text-white/50 text-sm">🇮🇱 ISRAEL</div>
                <div className="text-white/30 text-xs">{score.israelDestroyed} buildings</div>
              </div>
            </div>
            <div className="mt-6 text-yellow-400 text-lg font-bold">
              {score.iranPoints > score.israelPoints ? "🇮🇷 IRAN WINS!" :
               score.israelPoints > score.iranPoints ? "🇮🇱 ISRAEL WINS!" : "🤝 DRAW!"}
            </div>
          </div>
        </div>
      )}

      {/* Click-to-fly prompt */}
      {!locked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ fontFamily: "sans-serif" }}>
          <div className="bg-black/60 border border-white/20 rounded-xl px-6 py-4 text-white text-sm">
            <div className="text-lg mb-1">🖱️ Click to fly</div>
            <div className="text-white/50 text-xs">Move mouse to steer · Space to boost · Hold click to fire · ESC to unlock</div>
          </div>
        </div>
      )}

      {/* Military reticle — only when pointer-locked */}
      {locked && (
        <div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 0, height: 0,
            transition: firing ? "none" : "opacity 0.1s",
          }}
        >
          {/* ── Outer ring ── */}
          <div style={{
            position: "absolute",
            width: 56, height: 56,
            borderRadius: "50%",
            border: `1.5px solid ${reticleColor.replace("0.82","0.28")}`,
            top: -28, left: -28,
          }} />

          {/* ── Four bracketed corners at 45° ── */}
          {[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sy], i) => (
            <div key={i} style={{
              position: "absolute",
              width: 10, height: 10,
              borderTop:    sy < 0 ? `2px solid ${reticleColor}` : "none",
              borderBottom: sy > 0 ? `2px solid ${reticleColor}` : "none",
              borderLeft:   sx < 0 ? `2px solid ${reticleColor}` : "none",
              borderRight:  sx > 0 ? `2px solid ${reticleColor}` : "none",
              top:  sy * 22 - 5,
              left: sx * 22 - 5,
            }} />
          ))}

          {/* ── Gap crosshair — 4 short lines with centre gap ── */}
          {/* Left arm */}
          <div style={{ position: "absolute", width: 12, height: 1.5, background: reticleColor, top: -0.75, left: -22 }} />
          {/* Right arm */}
          <div style={{ position: "absolute", width: 12, height: 1.5, background: reticleColor, top: -0.75, left: 10 }} />
          {/* Top arm */}
          <div style={{ position: "absolute", width: 1.5, height: 12, background: reticleColor, top: -22, left: -0.75 }} />
          {/* Bottom arm */}
          <div style={{ position: "absolute", width: 1.5, height: 12, background: reticleColor, top: 10, left: -0.75 }} />

          {/* ── Centre precision dot ── */}
          <div style={{
            position: "absolute",
            width: firing ? 5 : 3, height: firing ? 5 : 3,
            borderRadius: "50%",
            background: firing
              ? (isIran ? "#ffdd00" : "#00eeff")
              : reticleColor,
            top: firing ? -2.5 : -1.5,
            left: firing ? -2.5 : -1.5,
            boxShadow: firing
              ? `0 0 6px 2px ${isIran ? "#ff8800" : "#00ccff"}`
              : "none",
            transition: "all 0.04s",
          }} />

          {/* ── Tier tick marks on the ring (tier = number of ticks) ── */}
          {Array.from({ length: tier }, (_, i) => {
            const angle = (i / tier) * Math.PI * 2 - Math.PI / 2;
            const r = 28;
            const tx = Math.cos(angle) * r;
            const ty = Math.sin(angle) * r;
            return (
              <div key={i} style={{
                position: "absolute",
                width: 3, height: 3,
                borderRadius: "50%",
                background: accentColor,
                top: ty - 1.5,
                left: tx - 1.5,
                opacity: 0.7,
              }} />
            );
          })}

          {/* ── Speed lines — short dashes below reticle (immersion) ── */}
          {[0,1,2].map(i => (
            <div key={i} style={{
              position: "absolute",
              width: 1, height: 6 + i * 2,
              background: `rgba(255,255,255,${0.12 - i * 0.03})`,
              top: 34 + i * 7,
              left: (i - 1) * 8 - 0.5,
            }} />
          ))}
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center" style={{ fontFamily: "monospace" }}>
        Mouse — steer &nbsp;|&nbsp; Space — boost &nbsp;|&nbsp; {locked ? "Hold LMB — fire" : "Click — lock mouse"}
      </div>

      <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-green-400/30 text-6xl font-black pointer-events-none select-none" style={{ fontFamily: "sans-serif" }}>
        IRAN
      </div>
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2 text-blue-400/30 text-6xl font-black pointer-events-none select-none" style={{ fontFamily: "sans-serif" }}>
        ISRAEL
      </div>
    </div>
  );
}

// ─── DamageableCity helpers ───────────────────────────────────────

function IranDamageableBuildings() {
  return (
    <>
      {IRAN_BUILDINGS.map(def => (
        <DamageableBuilding key={def.id} def={def} />
      ))}
    </>
  );
}

function IsraelDamageableBuildings() {
  return (
    <>
      {ISRAEL_BUILDINGS.map(def => (
        <DamageableBuilding key={def.id} def={def} />
      ))}
    </>
  );
}

// ─── PlaneExplosion — pixel debris burst when plane hits a building ─

const EXPL_COUNT = 60;

interface ExplParticle { pos: THREE.Vector3; vel: THREE.Vector3; life: number; maxLife: number; }

function PlaneExplosion({ position, onDone }: { position: THREE.Vector3; onDone: () => void }) {
  const meshRef   = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<ExplParticle[]>([]);
  const done      = useRef(false);
  const _mat      = useRef(new THREE.Matrix4());
  const _scale    = useRef(new THREE.Vector3());
  const _q        = useRef(new THREE.Quaternion());

  // Spawn particles once on mount
  useState(() => {
    for (let i = 0; i < EXPL_COUNT; i++) {
      const speed  = 30 + Math.random() * 80;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.random() * Math.PI;
      const life   = 1.0 + Math.random() * 1.2;
      particles.current.push({
        pos: position.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6
        )),
        vel: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed * 0.6 + 10,
          Math.sin(phi) * Math.sin(theta) * speed,
        ),
        life, maxLife: life,
      });
    }
  });

  useFrame((_, delta) => {
    if (done.current) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    let anyAlive = false;
    for (let i = 0; i < EXPL_COUNT; i++) {
      const p = particles.current[i];
      if (!p || p.life <= 0) { _mat.current.makeScale(0,0,0); mesh.setMatrixAt(i, _mat.current); continue; }
      p.vel.y -= 50 * dt;
      p.pos.addScaledVector(p.vel, dt);
      if (p.pos.y < 0) { p.pos.y = 0; p.vel.y *= -0.2; p.vel.x *= 0.5; p.vel.z *= 0.5; }
      p.life -= dt;
      const t = Math.max(0, p.life / p.maxLife);
      const s = t * 2.5;
      _scale.current.set(s, s, s);
      _mat.current.compose(p.pos, _q.current, _scale.current);
      mesh.setMatrixAt(i, _mat.current);
      anyAlive = true;
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!anyAlive) { done.current = true; onDone(); }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, EXPL_COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={3} toneMapped={false} />
    </instancedMesh>
  );
}

// ─── Main WarMap ─────────────────────────────────────────────────

interface Props {
  side: "iran" | "israel";
  walletAddress: string;
  tier: PlaneTier;
}

const RESPAWN_DELAY = 3; // seconds

export default function WarMap({ side, walletAddress: _walletAddress, tier }: Props) {
  const planeGroupRef  = useRef<THREE.Group>(null);
  const fireQueueRef   = useRef<boolean>(false);
  const [score, setScore] = useState<ScoreState>({
    iranDestroyed: 0, iranPoints: 0,
    israelDestroyed: 0, israelPoints: 0,
  });

  // Crash / respawn state
  const [crashed, setCrashed]         = useState(false);
  const [exploding, setExploding]     = useState(false);
  const [respawnKey, setRespawnKey]   = useState(0);
  const explodePos                    = useRef(new THREE.Vector3());
  const respawnTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Screen shake on fire
  const shakeRef = useRef(0); // shake magnitude, decays over time
  const shakeFrameRef = useRef<number | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const handleCrash = useCallback(() => {
    if (crashed) return;
    if (planeGroupRef.current) explodePos.current.copy(planeGroupRef.current.position);
    setCrashed(true);
    setExploding(true);
    respawnTimer.current = setTimeout(() => {
      setExploding(false);
      setCrashed(false);
      setRespawnKey(k => k + 1);
    }, RESPAWN_DELAY * 1000);
  }, [crashed]);

  // Called every time the plane fires — causes a brief screen shake
  const handleFire = useCallback(() => {
    // Shake intensity scales with tier (tier 4 kicks harder)
    const intensity = [0, 1.2, 1.8, 2.4, 3.2, 0][tier] ?? 0;
    shakeRef.current = Math.max(shakeRef.current, intensity);

    const wrap = canvasWrapRef.current;
    if (!wrap) return;

    const tick = () => {
      const s = shakeRef.current;
      if (s < 0.05) {
        wrap.style.transform = "";
        shakeFrameRef.current = null;
        shakeRef.current = 0;
        return;
      }
      const dx = (Math.random() - 0.5) * s * 2;
      const dy = (Math.random() - 0.5) * s * 2;
      wrap.style.transform = `translate(${dx}px,${dy}px)`;
      shakeRef.current *= 0.78; // decay
      shakeFrameRef.current = requestAnimationFrame(tick);
    };

    if (!shakeFrameRef.current) {
      shakeFrameRef.current = requestAnimationFrame(tick);
    }
    // Notify HUD reticle to flash
    window.dispatchEvent(new Event("gitwar-fire"));
  }, [tier]);

  return (
    <div className="relative w-full h-full">
      <HUD side={side} score={score} tier={tier} />

      {/* Respawn countdown overlay */}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <div className="text-white text-4xl font-black mb-2" style={{ textShadow: "0 0 20px #ff4400" }}>
              💥 SHOT DOWN
            </div>
            <div className="text-orange-300 text-lg">Respawning...</div>
          </div>
        </div>
      )}

      {/* Canvas wrapper — receives CSS translate for screen shake */}
      <div ref={canvasWrapRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 800, 2000], fov: 65, near: 5, far: 14000 }}
        gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
        style={{ background: "#6a9fd8" }}
      >
        {/* Realistic flight-sim lighting */}
        <ambientLight color="#c8daf8" intensity={0.5} />
        <directionalLight color="#fff8e8" intensity={3.2} position={[2000, 3000, 1000]} castShadow={false} />
        <directionalLight color="#ffd080" intensity={0.6} position={[-1000, 400, 2000]} />
        <hemisphereLight args={["#7ab0e8", "#d4b87a", 0.7]} />
        <fog attach="fog" args={["#a8c4e0", 3000, 11000]} />

        {/* Sky dome — two-layer gradient-ish sky */}
        <mesh>
          <sphereGeometry args={[9000, 24, 12]} />
          <meshBasicMaterial color="#4a8fd4" side={THREE.BackSide} />
        </mesh>
        {/* Horizon haze layer */}
        <mesh rotation={[0, 0, 0]} position={[0, -800, 0]}>
          <cylinderGeometry args={[9000, 9000, 1800, 32, 1, true]} />
          <meshBasicMaterial color="#c8d8e8" side={THREE.BackSide} transparent opacity={0.55} />
        </mesh>
        {/* Sun disc */}
        <mesh position={[2000, 3200, -6000]}>
          <sphereGeometry args={[160, 12, 8]} />
          <meshBasicMaterial color="#fff8d0" />
        </mesh>
        <pointLight position={[2000, 3200, -6000]} color="#ffe8a0" intensity={0.4} distance={20000} />

        {/* Boundary dome — glowing edge */}
        <mesh>
          <sphereGeometry args={[3780, 32, 16]} />
          <meshBasicMaterial color="#88ccff" side={THREE.FrontSide} transparent opacity={0.03} />
        </mesh>

        <DesertGround />
        <Clouds />
        <Mountains side="iran" />
        <Mountains side="israel" />

        <DesertBuffer />

        <IranRoads />
        <IsraelRoads />

        {/* Non-building decorations from city components */}
        <IranCities />
        <IsraelCities />

        {/* Damageable buildings — registered with combat system */}
        <IranDamageableBuildings />
        <IsraelDamageableBuildings />

        {/* Boundary walls with national flags on the outer edges */}
        <IranBoundaryWall />
        <IsraelBoundaryWall />

        {/* Small in-city flags near capitals */}
        <IranFlag position={[-1200, 0, -600]} />
        <IsraelFlag position={[1200, 0, -600]} />

        {/* Plane — hidden while crashed, remounted on respawn */}
        {!crashed && (
          <PlayerPlane key={respawnKey} side={side} tier={tier} groupRef={planeGroupRef} fireQueueRef={fireQueueRef} />
        )}

        {/* Explosion debris at crash site */}
        {exploding && (
          <PlaneExplosion position={explodePos.current} onDone={() => setExploding(false)} />
        )}

        <CombatLayer
          planeRef={planeGroupRef}
          fireQueueRef={fireQueueRef}
          side={side}
          tier={tier}
          onScoreChange={setScore}
          onCrash={handleCrash}
          onFire={handleFire}
        />
      </Canvas>
      </div>
    </div>
  );
}
