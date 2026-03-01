"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
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

// ─── Desert Terrain ───────────────────────────────────────────────

function DesertGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[2000, 2000, 20, 20]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.9} metalness={0} />
      </mesh>
      {/* Iran side — darker sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-600, 0.05, 0]}>
        <planeGeometry args={[900, 2000]} />
        <meshStandardMaterial color="#b8965a" roughness={1} transparent opacity={0.55} />
      </mesh>
      {/* Israel side — Med coast lighter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[600, 0.05, 0]}>
        <planeGeometry args={[900, 2000]} />
        <meshStandardMaterial color="#d4b87a" roughness={1} transparent opacity={0.4} />
      </mesh>
      {/* No-man's-land centre — pale dry sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[400, 2000]} />
        <meshStandardMaterial color="#dfc99a" roughness={1} transparent opacity={0.5} />
      </mesh>
      {/* Border line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <planeGeometry args={[6, 2000]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function Mountains({ side }: { side: "iran" | "israel" }) {
  const x = side === "iran" ? -900 : 900;
  const color = side === "iran" ? "#8b7355" : "#9aab7a";
  const peaks = [-400, -200, 0, 200, 400];
  return (
    <group>
      {peaks.map((z, i) => (
        <mesh key={i} position={[x, 0, z]}>
          <coneGeometry args={[80 + (i % 3) * 30, 200 + (i % 2) * 100, 4]} />
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
  bodyMatRef?: React.RefObject<THREE.MeshStandardMaterial>;
}

export function Building({ position, w, h, d, color, windowColor = "#ffcc88", roofColor, bodyMatRef }: BuildingProps) {
  const rc = roofColor ?? (windowColor === "#ffcc88" ? "#b09070" : "#c8c0b0");

  return (
    <group position={[position[0], position[1] + h / 2, position[2]]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial ref={bodyMatRef} color={color} roughness={0.85} metalness={0.04} />
      </mesh>
      {/* Base band */}
      <mesh position={[0, -h / 2 + 1.5, 0]}>
        <boxGeometry args={[w + 0.3, 3, d + 0.3]} />
        <meshStandardMaterial color={rc} roughness={0.9} />
      </mesh>
      {/* Roof parapet */}
      <mesh position={[0, h / 2 + 0.9, 0]}>
        <boxGeometry args={[w + 0.5, 1.8, d + 0.5]} />
        <meshStandardMaterial color={rc} roughness={0.9} />
      </mesh>
      {/* Rooftop HVAC box */}
      {h > 30 && (
        <mesh position={[w * 0.22, h / 2 + 2.5, 0]}>
          <boxGeometry args={[3.5, 3, 3.5]} />
          <meshStandardMaterial color="#555" roughness={0.7} />
        </mesh>
      )}
      {/* Windows — 3 emissive overlay planes (front / back / sides) */}
      <mesh position={[0, 0, d / 2 + 0.07]}>
        <planeGeometry args={[w - 1, h - 4]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.45} transparent opacity={0.22} alphaTest={0.01} />
      </mesh>
      <mesh position={[0, 0, -d / 2 - 0.07]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w - 1, h - 4]} />
        <meshStandardMaterial color={windowColor} emissive={windowColor} emissiveIntensity={0.35} transparent opacity={0.18} alphaTest={0.01} />
      </mesh>
      <mesh position={[w / 2 + 0.07, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[d - 1, h - 4]} />
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
      <DuneMound position={[-120, 0, -380]} sx={35} sy={6} sz={18} />
      <DuneMound position={[80, 0, -300]} sx={28} sy={4} sz={14} />
      <DuneMound position={[-60, 0, -180]} sx={40} sy={7} sz={20} />
      <DuneMound position={[130, 0, -80]} sx={22} sy={5} sz={12} />
      <DuneMound position={[-140, 0, 40]} sx={30} sy={5} sz={16} />
      <DuneMound position={[50, 0, 150]} sx={45} sy={8} sz={22} />
      <DuneMound position={[-90, 0, 250]} sx={25} sy={4} sz={13} />
      <DuneMound position={[110, 0, 340]} sx={38} sy={6} sz={19} />
      <DuneMound position={[-150, 0, 450]} sx={20} sy={3} sz={10} />
      <DuneMound position={[60, 0, 500]} sx={32} sy={5} sz={16} />
      <DuneMound position={[-30, 0, -450]} sx={24} sy={4} sz={12} />
      <DuneMound position={[100, 0, -500]} sx={18} sy={3} sz={9} />
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
      {/* Main east-west boulevard */}
      <Road x1={-250} x2={-780} z={-320} w={10} axis="x" />
      {/* Secondary east-west */}
      <Road x1={-260} x2={-760} z={-200} w={7} axis="x" />
      <Road x1={-270} x2={-700} z={-420} w={7} axis="x" />
      {/* Cross streets (north-south): x1/x2 = z range, z param = x position */}
      <Road x1={-530} x2={150} z={-600} w={8} axis="z" />
      <Road x1={-530} x2={150} z={-450} w={8} axis="z" />
      <Road x1={-530} x2={150} z={-320} w={8} axis="z" />
      {/* City B roads */}
      <Road x1={-260} x2={-660} z={130} w={9} axis="x" />
      <Road x1={-260} x2={-620} z={230} w={7} axis="x" />
      <Road x1={-530} x2={50} z={-490} w={7} axis="z" />
      {/* Street lamps along main boulevard */}
      {([-290, -350, -420, -490, -560, -630, -700] as number[]).map((x, i) => (
        <StreetLamp key={i} position={[x, 0, -307]} />
      ))}
      {([-290, -350, -420, -490, -560, -630, -700] as number[]).map((x, i) => (
        <StreetLamp key={i + 10} position={[x, 0, -333]} />
      ))}
    </group>
  );
}

// ─── Israel Road Network ──────────────────────────────────────────

function IsraelRoads() {
  return (
    <group>
      {/* Main east-west boulevard */}
      <Road x1={250} x2={780} z={-320} w={10} axis="x" />
      {/* Secondary east-west */}
      <Road x1={260} x2={760} z={-200} w={7} axis="x" />
      <Road x1={270} x2={700} z={-420} w={7} axis="x" />
      {/* Cross streets (north-south) */}
      <Road x1={-530} x2={150} z={600} w={8} axis="z" />
      <Road x1={-530} x2={150} z={450} w={8} axis="z" />
      <Road x1={-530} x2={150} z={320} w={8} axis="z" />
      {/* City B roads */}
      <Road x1={260} x2={660} z={130} w={9} axis="x" />
      <Road x1={260} x2={620} z={230} w={7} axis="x" />
      <Road x1={-530} x2={50} z={490} w={7} axis="z" />
      {/* Street lamps */}
      {([290, 350, 420, 490, 560, 630, 700] as number[]).map((x, i) => (
        <StreetLamp key={i} position={[x, 0, -307]} />
      ))}
      {([290, 350, 420, 490, 560, 630, 700] as number[]).map((x, i) => (
        <StreetLamp key={i + 10} position={[x, 0, -333]} />
      ))}
    </group>
  );
}

// ─── Boundary wall with flags ─────────────────────────────────────
// Large flags mounted on a concrete perimeter wall along each outer edge

function IranBoundaryWall() {
  // West boundary — X ≈ -940, flags face east (rotation Y = 0 = faces +Z by default,
  // rotate Y = -PI/2 so flags face inward toward +X / center)
  const zPositions = [-600, -300, 0, 300, 600];
  return (
    <group>
      {/* Concrete wall running Z = -800 to 800 */}
      <mesh position={[-940, 8, 0]}>
        <boxGeometry args={[4, 16, 1600]} />
        <meshStandardMaterial color="#c8bca8" roughness={0.95} />
      </mesh>
      {/* Wall top ridge */}
      <mesh position={[-940, 16.5, 0]}>
        <boxGeometry args={[5, 1.5, 1600]} />
        <meshStandardMaterial color="#b8ac98" roughness={1} />
      </mesh>
      {/* Iranian flags evenly spaced, facing inward (+X direction) */}
      {zPositions.map((z, i) => (
        <group key={i} position={[-938, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
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
  // East boundary — X ≈ +940, flags face west (inward toward -X)
  const zPositions = [-600, -300, 0, 300, 600];
  return (
    <group>
      {/* Concrete wall */}
      <mesh position={[940, 8, 0]}>
        <boxGeometry args={[4, 16, 1600]} />
        <meshStandardMaterial color="#d8d0be" roughness={0.95} />
      </mesh>
      <mesh position={[940, 16.5, 0]}>
        <boxGeometry args={[5, 1.5, 1600]} />
        <meshStandardMaterial color="#c8c0ae" roughness={1} />
      </mesh>
      {/* Israeli flags facing inward (-X direction) */}
      {zPositions.map((z, i) => (
        <group key={i} position={[938, 0, z]} rotation={[0, Math.PI / 2, 0]}>
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
      <Pavement position={[-575, 0, -350]} w={650} d={700} />
      <Pavement position={[-575, 0, 350]} w={650} d={700} />
      {/* NOTE: Buildings are rendered by IranDamageableBuildings component */}

      {/* ════ LANDMARKS ════ */}
      <GrandMosque position={[-522, 0, -620]} />
      <Mosque position={[-358, 0, -242]} />
      <Mosque position={[-692, 0, -260]} />
      <Mosque position={[-512, 0, 295]} />
      <Mosque position={[-272, 0, 305]} />
      <Mosque position={[-638, 0, 485]} />
      <Mosque position={[-780, 0, -120]} />
      <Mosque position={[-840, 0, 155]} />

      {/* ════ COFFEE SHOPS ════ */}
      <CoffeeShop position={[-412, 0, -198]} color="#c8904a" />
      <CoffeeShop position={[-582, 0, -258]} color="#b07840" />
      <CoffeeShop position={[-278, 0, -268]} color="#c07838" />
      <CoffeeShop position={[-358, 0, 305]} color="#c89050" />
      <CoffeeShop position={[-625, 0, 80]} color="#b07840" />
      <CoffeeShop position={[-720, 0, -48]} color="#c07838" />
      <CoffeeShop position={[-455, 0, 578]} color="#b87838" />

      {/* ════ PARKS ════ */}
      <Park position={[-658, 0, -238]} large={true} />
      <Park position={[-308, 0, -482]} />
      <Park position={[-755, 0, -345]} />
      <Park position={[-288, 0, 205]} />
      <Park position={[-628, 0, 295]} large={true} />
      <Park position={[-780, 0, 545]} large={true} />
      <Park position={[-340, 0, 620]} />

      {/* ════ PALMS & TREES ════ */}
      <PalmCluster position={[-442, 0, -172]} />
      <PalmCluster position={[-682, 0, -392]} />
      <PalmCluster position={[-298, 0, -302]} />
      <PalmCluster position={[-758, 0, -188]} />
      <PalmCluster position={[-572, 0, 122]} />
      <PalmCluster position={[-275, 0, 275]} />
      <PalmCluster position={[-532, 0, 492]} />
      <PalmCluster position={[-362, 0, 432]} />
      <PalmCluster position={[-258, 0, 468]} />
      <PalmCluster position={[-840, 0, 222]} />
      <PalmCluster position={[-268, 0, 588]} />
      <PalmCluster position={[-700, 0, 630]} />

      {/* ════ FARMS ════ */}
      <Farm position={[-728, 0, 155]} side="iran" />
      <Farm position={[-758, 0, 442]} side="iran" />
      <Farm position={[-858, 0, 610]} side="iran" />
      <Farm position={[-860, 0, -520]} side="iran" />
    </group>
  );
}

// ─── Israel Cities — decorations only (buildings via IsraelDamageableBuildings) ──

function IsraelCities() {
  return (
    <group>
      {/* ════ FULL CITY PAVEMENT — entire Israel territory ════ */}
      <Pavement position={[575, 0, -350]} w={650} d={700} />
      <Pavement position={[575, 0, 350]} w={650} d={700} />
      {/* NOTE: Buildings are rendered by IsraelDamageableBuildings component */}

      {/* ════ LANDMARKS ════ */}
      <GrandSynagogue position={[522, 0, -620]} />
      <Synagogue position={[358, 0, -242]} />
      <Synagogue position={[692, 0, -260]} />
      <Synagogue position={[512, 0, 295]} />
      <Synagogue position={[272, 0, 305]} />
      <Synagogue position={[638, 0, 485]} />
      <Synagogue position={[780, 0, -120]} />
      <Synagogue position={[840, 0, 155]} />

      {/* ════ COFFEE SHOPS ════ */}
      <CoffeeShop position={[412, 0, -198]} color="#d4aa70" />
      <CoffeeShop position={[582, 0, -258]} color="#c09858" />
      <CoffeeShop position={[278, 0, -268]} color="#c8a860" />
      <CoffeeShop position={[358, 0, 305]} color="#d4aa70" />
      <CoffeeShop position={[625, 0, 80]} color="#c09858" />
      <CoffeeShop position={[720, 0, -48]} color="#c8a860" />
      <CoffeeShop position={[455, 0, 578]} color="#d0a858" />

      {/* ════ PARKS ════ */}
      <Park position={[658, 0, -238]} large={true} />
      <Park position={[308, 0, -482]} />
      <Park position={[755, 0, -345]} />
      <Park position={[288, 0, 205]} />
      <Park position={[628, 0, 295]} large={true} />
      <Park position={[780, 0, 545]} large={true} />
      <Park position={[340, 0, 620]} />

      {/* ════ PALMS & TREES ════ */}
      <PalmCluster position={[442, 0, -172]} />
      <PalmCluster position={[682, 0, -392]} />
      <PalmCluster position={[298, 0, -302]} />
      <PalmCluster position={[758, 0, -188]} />
      <PalmCluster position={[572, 0, 122]} />
      <PalmCluster position={[275, 0, 275]} />
      <PalmCluster position={[532, 0, 492]} />
      <PalmCluster position={[362, 0, 432]} />
      <PalmCluster position={[258, 0, 468]} />
      <PalmCluster position={[840, 0, 222]} />
      <PalmCluster position={[268, 0, 588]} />
      <PalmCluster position={[700, 0, 630]} />

      {/* ════ FARMS ════ */}
      <Farm position={[728, 0, 155]} side="israel" />
      <Farm position={[758, 0, 442]} side="israel" />
      <Farm position={[858, 0, 610]} side="israel" />
      <Farm position={[860, 0, -520]} side="israel" />
    </group>
  );
}

// ─── HUD overlay ─────────────────────────────────────────────────

function HUD({ side, score }: { side: "iran" | "israel"; score: ScoreState }) {
  const isIran = side === "iran";
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const onChange = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Side badge + GITWAR title */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4">
        <div
          className="px-3 py-1 rounded text-xs font-bold text-white"
          style={{ background: isIran ? "rgba(35,159,64,0.7)" : "rgba(0,56,184,0.7)", fontFamily: "sans-serif" }}
        >
          {isIran ? "🇮🇷 IRAN" : "🇮🇱 ISRAEL"}
        </div>
        <div className="text-white/50 text-xs" style={{ fontFamily: "sans-serif" }}>GITWAR</div>
      </div>

      {/* Score panel — top centre */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-6 bg-black/55 border border-white/10 rounded-lg px-4 py-1.5"
        style={{ fontFamily: "sans-serif" }}
      >
        <span className="text-xs font-bold" style={{ color: "#44ff88" }}>
          🇮🇷 {score.iranDestroyed} destroyed · {score.iranPoints} pts
        </span>
        <span className="text-white/30 text-xs">|</span>
        <span className="text-xs font-bold" style={{ color: "#88ccff" }}>
          🇮🇱 {score.israelDestroyed} destroyed · {score.israelPoints} pts
        </span>
      </div>

      {/* Click-to-fly prompt */}
      {!locked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ fontFamily: "sans-serif" }}>
          <div className="bg-black/60 border border-white/20 rounded-xl px-6 py-4 text-white text-sm">
            <div className="text-lg mb-1">🖱️ Click to fly</div>
            <div className="text-white/50 text-xs">Move mouse to steer · Space to boost · Click to shoot · ESC to unlock</div>
          </div>
        </div>
      )}

      {/* Crosshair — only when locked */}
      {locked && (
        <div
          className="absolute"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 0, height: 0 }}
        >
          {/* Horizontal */}
          <div style={{ position: "absolute", width: 22, height: 2, background: "rgba(255,255,255,0.75)", top: -1, left: -11 }} />
          {/* Vertical */}
          <div style={{ position: "absolute", width: 2, height: 22, background: "rgba(255,255,255,0.75)", top: -11, left: -1 }} />
          {/* Centre dot circle */}
          <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.55)", top: -4, left: -4 }} />
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center" style={{ fontFamily: "sans-serif" }}>
        Mouse — steer &nbsp;|&nbsp; Space — boost &nbsp;|&nbsp; Click — {locked ? "shoot" : "lock mouse"}
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

// ─── Main WarMap ─────────────────────────────────────────────────

interface Props {
  side: "iran" | "israel";
  walletAddress: string;
  tier: PlaneTier;
}

export default function WarMap({ side, walletAddress: _walletAddress, tier }: Props) {
  const planeGroupRef = useRef<THREE.Group>(null);
  const fireQueueRef  = useRef<boolean>(false);
  const [score, setScore] = useState<ScoreState>({
    iranDestroyed: 0, iranPoints: 0,
    israelDestroyed: 0, israelPoints: 0,
  });

  return (
    <div className="relative w-full h-full">
      <HUD side={side} score={score} />
      <Canvas
        camera={{ position: [0, 120, 300], fov: 65, near: 0.5, far: 3000 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
        style={{ background: "#c8d4e8" }}
      >
        <ambientLight color="#ffe8c0" intensity={0.8} />
        <directionalLight color="#fff5e0" intensity={2.5} position={[500, 800, 200]} castShadow={false} />
        <hemisphereLight args={["#b0c8f0", "#c8a96e", 0.6]} />
        <fog attach="fog" args={["#d4c4a0", 800, 1800]} />

        {/* Sky dome */}
        <mesh>
          <sphereGeometry args={[1600, 16, 8]} />
          <meshBasicMaterial color="#87b4d8" side={THREE.BackSide} />
        </mesh>

        <DesertGround />
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
        <IranFlag position={[-600, 0, -300]} />
        <IsraelFlag position={[600, 0, -300]} />

        <PlayerPlane side={side} tier={tier} groupRef={planeGroupRef} fireQueueRef={fireQueueRef} />
        <CombatLayer
          planeRef={planeGroupRef}
          fireQueueRef={fireQueueRef}
          side={side}
          tier={tier}
          onScoreChange={setScore}
        />
      </Canvas>
    </div>
  );
}
