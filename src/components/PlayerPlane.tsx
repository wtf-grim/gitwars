"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlaneTier } from "./PlaneSelectModal";

interface Props {
  side: "iran" | "israel";
  tier: PlaneTier;
  groupRef: React.RefObject<THREE.Group | null>;
  fireQueueRef: React.RefObject<boolean | null>;
}

// ─── Colour helpers ──────────────────────────────────────────────
function sideColors(side: "iran" | "israel") {
  return side === "iran"
    ? { body: "#4a7c4a", wing: "#3a6a3a", accent: "#cc3333" }
    : { body: "#3a5f9a", wing: "#2a4f8a", accent: "#aaccff" };
}

// ─── Tier 1: Scout Propeller Plane ──────────────────────────────
function Tier1Mesh({ side }: { side: "iran" | "israel" }) {
  const propRef = useRef<THREE.Group>(null);
  const { body, wing, accent } = sideColors(side);
  useFrame((_, delta) => {
    if (propRef.current) propRef.current.rotation.z += delta * 30;
  });
  return (
    <group rotation={[0, Math.PI, 0]}>
      <mesh><boxGeometry args={[1.2, 0.9, 5]} /><meshStandardMaterial color={body} emissive={body} emissiveIntensity={0.15} /></mesh>
      <mesh position={[0, 0, -3]}><boxGeometry args={[0.8, 0.6, 1.2]} /><meshStandardMaterial color={body} /></mesh>
      <mesh position={[0, 0, -3.7]}><boxGeometry args={[0.5, 0.4, 0.5]} /><meshStandardMaterial color={accent} /></mesh>
      <mesh position={[0, 0.55, -1.2]}><boxGeometry args={[0.7, 0.35, 1]} /><meshStandardMaterial color="#88ccff" emissive="#2277bb" emissiveIntensity={0.8} transparent opacity={0.8} /></mesh>
      <mesh position={[0, -0.1, 0]}><boxGeometry args={[9, 0.12, 2.2]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[-4.8, 0.15, 0.3]}><boxGeometry args={[0.6, 0.5, 0.8]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} /></mesh>
      <mesh position={[4.8, 0.15, 0.3]}><boxGeometry args={[0.6, 0.5, 0.8]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} /></mesh>
      <mesh position={[0, 0.8, 2.2]}><boxGeometry args={[0.12, 1.5, 1.2]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[0, 0.1, 2.3]}><boxGeometry args={[3.5, 0.1, 0.9]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[0, -0.3, 2.8]}><boxGeometry args={[0.5, 0.4, 0.3]} /><meshStandardMaterial color="#ff8800" emissive="#ff5500" emissiveIntensity={1.5} /></mesh>
      <pointLight position={[0, 0, 3.2]} color="#ff6600" intensity={5} distance={16} />
      <group ref={propRef} position={[0, 0, -4.1]}>
        <mesh><boxGeometry args={[0.3, 0.3, 0.2]} /><meshStandardMaterial color="#888" /></mesh>
        <mesh position={[0, 1.2, 0]}><boxGeometry args={[0.15, 2.4, 0.06]} /><meshStandardMaterial color="#555" /></mesh>
        <mesh position={[0, -1.2, 0]}><boxGeometry args={[0.15, 2.4, 0.06]} /><meshStandardMaterial color="#555" /></mesh>
      </group>
    </group>
  );
}

// ─── Tier 2: Light Fighter (twin-engine) ────────────────────────
function Tier2Mesh({ side, l1, l2 }: { side: "iran" | "israel"; l1: React.RefObject<THREE.PointLight | null>; l2: React.RefObject<THREE.PointLight | null> }) {
  const { body, wing, accent } = sideColors(side);
  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* Fuselage */}
      <mesh><boxGeometry args={[1.0, 0.8, 6]} /><meshStandardMaterial color={body} emissive={body} emissiveIntensity={0.2} /></mesh>
      {/* Nose */}
      <mesh position={[0, 0.1, -3.8]}><boxGeometry args={[0.6, 0.5, 1.8]} /><meshStandardMaterial color={body} /></mesh>
      <mesh position={[0, 0.15, -4.9]}><boxGeometry args={[0.3, 0.3, 0.5]} /><meshStandardMaterial color={accent} /></mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.55, -1.5]}><boxGeometry args={[0.65, 0.38, 1.2]} /><meshStandardMaterial color="#88ccff" emissive="#2277bb" emissiveIntensity={0.9} transparent opacity={0.8} /></mesh>
      {/* Swept wings */}
      <mesh position={[0, -0.05, 0.3]} rotation={[0, 0.25, 0]}><boxGeometry args={[10, 0.1, 2]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Wing tip tanks */}
      <mesh position={[-5.4, -0.05, 0.5]}><boxGeometry args={[0.4, 0.4, 2.5]} /><meshStandardMaterial color={accent} /></mesh>
      <mesh position={[5.4, -0.05, 0.5]}><boxGeometry args={[0.4, 0.4, 2.5]} /><meshStandardMaterial color={accent} /></mesh>
      {/* Tail fin */}
      <mesh position={[0, 1.0, 2.8]}><boxGeometry args={[0.1, 1.8, 1.4]} /><meshStandardMaterial color={wing} /></mesh>
      {/* H-stabs */}
      <mesh position={[0, 0.15, 3.0]}><boxGeometry args={[4.2, 0.1, 1.0]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Twin engine pods */}
      <mesh position={[-1.8, -0.5, 1.0]}><boxGeometry args={[0.7, 0.6, 3.5]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[1.8, -0.5, 1.0]}><boxGeometry args={[0.7, 0.6, 3.5]} /><meshStandardMaterial color="#333" /></mesh>
      {/* Engine exhaust glow */}
      <mesh position={[-1.8, -0.5, 3.0]}><boxGeometry args={[0.5, 0.45, 0.3]} /><meshStandardMaterial color="#ff8800" emissive="#ff5500" emissiveIntensity={2} /></mesh>
      <mesh position={[1.8, -0.5, 3.0]}><boxGeometry args={[0.5, 0.45, 0.3]} /><meshStandardMaterial color="#ff8800" emissive="#ff5500" emissiveIntensity={2} /></mesh>
      <pointLight ref={l1} position={[-1.8, -0.5, 3.6]} color="#ff6600" distance={18} />
      <pointLight ref={l2} position={[1.8, -0.5, 3.6]} color="#ff6600" distance={18} />
    </group>
  );
}

// ─── Tier 3: Strike Hawk (delta-wing interceptor) ────────────────
function Tier3Mesh({ side, l1 }: { side: "iran" | "israel"; l1: React.RefObject<THREE.PointLight | null> }) {
  const { body, wing, accent } = sideColors(side);
  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* Sleek fuselage */}
      <mesh><boxGeometry args={[0.9, 0.7, 7]} /><meshStandardMaterial color={body} emissive={body} emissiveIntensity={0.25} /></mesh>
      {/* Pointed nose */}
      <mesh position={[0, 0.1, -4.5]}><boxGeometry args={[0.5, 0.4, 2.5]} /><meshStandardMaterial color={body} /></mesh>
      <mesh position={[0, 0.15, -5.8]}><boxGeometry args={[0.2, 0.2, 0.6]} /><meshStandardMaterial color={accent} /></mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.5, -2]}><boxGeometry args={[0.6, 0.3, 1.4]} /><meshStandardMaterial color="#88ccff" emissive="#3399ff" emissiveIntensity={1.0} transparent opacity={0.75} /></mesh>
      {/* Delta wings — left */}
      <mesh position={[-3.5, -0.1, 0.5]} rotation={[0, -0.45, 0]}><boxGeometry args={[5.5, 0.09, 2.5]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Delta wings — right */}
      <mesh position={[3.5, -0.1, 0.5]} rotation={[0, 0.45, 0]}><boxGeometry args={[5.5, 0.09, 2.5]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Canards */}
      <mesh position={[-1.2, 0.1, -2.8]} rotation={[0, -0.2, 0]}><boxGeometry args={[1.8, 0.07, 0.7]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[1.2, 0.1, -2.8]} rotation={[0, 0.2, 0]}><boxGeometry args={[1.8, 0.07, 0.7]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Twin tall tail fins */}
      <mesh position={[-0.8, 0.9, 3.2]}><boxGeometry args={[0.09, 2.0, 1.5]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[0.8, 0.9, 3.2]}><boxGeometry args={[0.09, 2.0, 1.5]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Engine nozzle */}
      <mesh position={[0, -0.15, 3.8]}><boxGeometry args={[0.8, 0.7, 0.6]} /><meshStandardMaterial color="#ff9900" emissive="#ff5500" emissiveIntensity={2.5} /></mesh>
      <pointLight ref={l1} position={[0, -0.15, 4.5]} color="#ff6600" distance={22} />
      {/* Missiles */}
      <mesh position={[-4.5, -0.2, 0.5]}><boxGeometry args={[0.18, 0.18, 2.0]} /><meshStandardMaterial color="#888" /></mesh>
      <mesh position={[4.5, -0.2, 0.5]}><boxGeometry args={[0.18, 0.18, 2.0]} /><meshStandardMaterial color="#888" /></mesh>
    </group>
  );
}

// ─── Tier 4: F-16 Viper ───────────────────────────────────────────
function Tier4Mesh({ side, l1 }: { side: "iran" | "israel"; l1: React.RefObject<THREE.PointLight | null> }) {
  const { body, wing, accent } = sideColors(side);
  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* Long sleek fuselage */}
      <mesh><boxGeometry args={[0.85, 0.7, 8.5]} /><meshStandardMaterial color={body} emissive={body} emissiveIntensity={0.3} /></mesh>
      {/* Spine hump */}
      <mesh position={[0, 0.5, -1.0]}><boxGeometry args={[0.6, 0.4, 3.5]} /><meshStandardMaterial color={body} /></mesh>
      {/* Sharp nose */}
      <mesh position={[0, 0.1, -5.5]}><boxGeometry args={[0.4, 0.35, 3.0]} /><meshStandardMaterial color={body} /></mesh>
      <mesh position={[0, 0.12, -7.2]}><boxGeometry args={[0.15, 0.15, 0.8]} /><meshStandardMaterial color={accent} /></mesh>
      {/* Bubble canopy */}
      <mesh position={[0, 0.65, -2.5]}><boxGeometry args={[0.65, 0.4, 1.6]} /><meshStandardMaterial color="#99ddff" emissive="#4499ff" emissiveIntensity={1.2} transparent opacity={0.7} /></mesh>
      {/* Cropped delta wings */}
      <mesh position={[-3.2, -0.1, 0.5]} rotation={[0, -0.35, 0]}><boxGeometry args={[5.0, 0.09, 2.2]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[3.2, -0.1, 0.5]} rotation={[0, 0.35, 0]}><boxGeometry args={[5.0, 0.09, 2.2]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Strakes / LEX */}
      <mesh position={[-0.7, 0.0, -1.5]} rotation={[0, -0.6, 0]}><boxGeometry args={[1.0, 0.07, 3.0]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[0.7, 0.0, -1.5]} rotation={[0, 0.6, 0]}><boxGeometry args={[1.0, 0.07, 3.0]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Single tall tail fin */}
      <mesh position={[0, 1.2, 3.8]}><boxGeometry args={[0.1, 2.4, 1.8]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Ventral strakes */}
      <mesh position={[-0.6, -0.5, 3.0]}><boxGeometry args={[0.08, 0.9, 1.4]} /><meshStandardMaterial color={wing} /></mesh>
      <mesh position={[0.6, -0.5, 3.0]}><boxGeometry args={[0.08, 0.9, 1.4]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Intake */}
      <mesh position={[0, -0.4, -1.0]}><boxGeometry args={[1.0, 0.5, 1.5]} /><meshStandardMaterial color="#222" /></mesh>
      {/* Afterburner */}
      <mesh position={[0, -0.0, 4.6]}><boxGeometry args={[0.75, 0.65, 0.5]} /><meshStandardMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={3} /></mesh>
      <mesh position={[0, -0.0, 5.1]}><boxGeometry args={[0.5, 0.45, 0.5]} /><meshStandardMaterial color="#ffffff" emissive="#ffee00" emissiveIntensity={4} /></mesh>
      <pointLight ref={l1} position={[0, 0, 5.8]} color="#ff8800" distance={30} />
      {/* Wing-tip missiles */}
      <mesh position={[-5.3, -0.15, 0.4]}><boxGeometry args={[0.15, 0.15, 2.2]} /><meshStandardMaterial color="#777" /></mesh>
      <mesh position={[5.3, -0.15, 0.4]}><boxGeometry args={[0.15, 0.15, 2.2]} /><meshStandardMaterial color="#777" /></mesh>
      {/* Under-wing ordnance */}
      <mesh position={[-2.5, -0.4, 0.3]}><boxGeometry args={[0.2, 0.2, 2.5]} /><meshStandardMaterial color="#556" /></mesh>
      <mesh position={[2.5, -0.4, 0.3]}><boxGeometry args={[0.2, 0.2, 2.5]} /><meshStandardMaterial color="#556" /></mesh>
    </group>
  );
}

// ─── Tier 5: B-52 Hammer (Strategic Bomber) ──────────────────────
function Tier5Mesh({ side, l1, l2, l3, l4 }: { side: "iran" | "israel"; l1: React.RefObject<THREE.PointLight | null>; l2: React.RefObject<THREE.PointLight | null>; l3: React.RefObject<THREE.PointLight | null>; l4: React.RefObject<THREE.PointLight | null> }) {
  const { body, wing, accent } = sideColors(side);
  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* Wide boxy fuselage */}
      <mesh><boxGeometry args={[2.2, 1.6, 9]} /><meshStandardMaterial color={body} emissive={body} emissiveIntensity={0.15} /></mesh>
      {/* Blunt nose dome */}
      <mesh position={[0, 0.2, -5.0]}><boxGeometry args={[1.6, 1.3, 1.5]} /><meshStandardMaterial color={body} /></mesh>
      <mesh position={[0, 0.25, -5.9]}><boxGeometry args={[1.0, 0.9, 0.7]} /><meshStandardMaterial color={accent} /></mesh>
      {/* Cockpit row */}
      <mesh position={[0, 0.85, -4.2]}><boxGeometry args={[1.4, 0.4, 1.0]} /><meshStandardMaterial color="#88ccff" emissive="#2266aa" emissiveIntensity={0.7} transparent opacity={0.8} /></mesh>
      {/* Massive straight wings */}
      <mesh position={[0, -0.2, 1.0]}><boxGeometry args={[28, 0.25, 4.5]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Dihedral droop — left */}
      <mesh position={[-14.5, -1.0, 0.8]} rotation={[0, 0, 0.12]}><boxGeometry args={[4.0, 0.22, 4.2]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Dihedral droop — right */}
      <mesh position={[14.5, -1.0, 0.8]} rotation={[0, 0, -0.12]}><boxGeometry args={[4.0, 0.22, 4.2]} /><meshStandardMaterial color={wing} /></mesh>
      {/* Tall tail fin */}
      <mesh position={[0, 2.5, 4.2]}><boxGeometry args={[0.2, 4.0, 2.5]} /><meshStandardMaterial color={wing} /></mesh>
      {/* H-stabs */}
      <mesh position={[0, 0.3, 4.5]}><boxGeometry args={[10, 0.2, 2.2]} /><meshStandardMaterial color={wing} /></mesh>
      {/* 4 engine pods (paired under wings) */}
      {([-9, -5, 5, 9] as number[]).map((x, i) => (
        <group key={i} position={[x, -1.2, 1.0]}>
          <mesh><boxGeometry args={[0.9, 0.7, 4.0]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
          <mesh position={[0, 0, -2.5]}><boxGeometry args={[0.6, 0.5, 0.5]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, 0, 2.2]}><boxGeometry args={[0.7, 0.6, 0.4]} /><meshStandardMaterial color="#ff9900" emissive="#ff5500" emissiveIntensity={2.5} /></mesh>
        </group>
      ))}
      <pointLight ref={l1} position={[-9, -1.2, 3.5]} color="#ff7700" distance={25} />
      <pointLight ref={l2} position={[-5, -1.2, 3.5]} color="#ff7700" distance={25} />
      <pointLight ref={l3} position={[5, -1.2, 3.5]} color="#ff7700" distance={25} />
      <pointLight ref={l4} position={[9, -1.2, 3.5]} color="#ff7700" distance={25} />
      {/* Bomb bay doors (closed) */}
      <mesh position={[0, -0.95, 0.5]}><boxGeometry args={[1.5, 0.15, 5.0]} /><meshStandardMaterial color="#1a1a2e" emissive="#0000ff" emissiveIntensity={0.1} /></mesh>
      {/* Under-wing pylons / bombs */}
      {([-11, -7, 7, 11] as number[]).map((x, i) => (
        <mesh key={i} position={[x, -1.6, 0.8]}>
          <boxGeometry args={[0.3, 0.5, 2.5]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Dispatcher ──────────────────────────────────────────────────
interface AirplaneMeshProps {
  side: "iran" | "israel";
  tier: PlaneTier;
  lightRefs: React.RefObject<THREE.PointLight | null>[];
}
function AirplaneMesh({ side, tier, lightRefs }: AirplaneMeshProps) {
  switch (tier) {
    case 1: return <Tier1Mesh side={side} />;
    case 2: return <Tier2Mesh side={side} l1={lightRefs[0]} l2={lightRefs[1]} />;
    case 3: return <Tier3Mesh side={side} l1={lightRefs[0]} />;
    case 4: return <Tier4Mesh side={side} l1={lightRefs[0]} />;
    case 5: return <Tier5Mesh side={side} l1={lightRefs[0]} l2={lightRefs[1]} l3={lightRefs[2]} l4={lightRefs[3]} />;
  }
}

// ─── Flight constants (scale with tier) ───────────────────────────
const TIER_SPEED:  Record<PlaneTier, number> = { 1: 140, 2: 180, 3: 230, 4: 290, 5: 200 };
const TIER_BOOST:  Record<PlaneTier, number> = { 1: 320, 2: 400, 3: 500, 4: 620, 5: 440 };
// Camera distance also scales (bomber needs more room)
const TIER_CAM_BACK: Record<PlaneTier, number> = { 1: 60, 2: 68, 3: 76, 4: 85, 5: 120 };
const TIER_CAM_UP:   Record<PlaneTier, number> = { 1: 18, 2: 22, 3: 26, 4: 30, 5: 40 };

const MOUSE_YAW   = 0.0018;
const MOUSE_PITCH = 0.0018;
const MAX_BANK    = 0.9;
const BANK_SPEED  = 6.0;
const MAP_BOUND   = 1900;   // expanded to match 2x building spread
const MIN_HEIGHT  = 8;
const MAX_HEIGHT  = 900;
const CAM_SMOOTH  = 6;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ─── PlayerPlane ─────────────────────────────────────────────────
export default function PlayerPlane({ side, tier, groupRef, fireQueueRef }: Props) {
  const { camera, gl } = useThree();

  const yaw        = useRef(side === "iran" ? -Math.PI / 2 : Math.PI / 2);
  const pitch      = useRef(0);
  const roll       = useRef(0);
  const camRigQ    = useRef(new THREE.Quaternion());
  const boost      = useRef(false);
  const mouseDelta = useRef({ x: 0, y: 0 });
  const locked     = useRef(false);

  // Light refs for engine flicker — created here, passed to AirplaneMesh
  const lr0 = useRef<THREE.PointLight>(null);
  const lr1 = useRef<THREE.PointLight>(null);
  const lr2 = useRef<THREE.PointLight>(null);
  const lr3 = useRef<THREE.PointLight>(null);
  const lightRefs = [lr0, lr1, lr2, lr3];

  useEffect(() => {
    const canvas = gl.domElement;
    const onClick = () => {
      if (!locked.current) {
        canvas.requestPointerLock();
      } else {
        fireQueueRef.current = true;
      }
    };
    const onLockChange = () => { locked.current = document.pointerLockElement === canvas; };
    const onMouseMove  = (e: MouseEvent) => {
      if (!locked.current) return;
      mouseDelta.current.x += e.movementX;
      mouseDelta.current.y += e.movementY;
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.code === "Space") boost.current = true; };
    const onKeyUp   = (e: KeyboardEvent) => { if (e.code === "Space") boost.current = false; };

    canvas.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onLockChange);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    return () => {
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onLockChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
  }, [gl]);

  useFrame(({ clock }, delta) => {
    const plane = groupRef.current;
    if (!plane) return;
    const dt = Math.min(delta, 0.05);

    const yawDelta = mouseDelta.current.x * MOUSE_YAW;
    yaw.current   -= yawDelta;
    pitch.current += mouseDelta.current.y * MOUSE_PITCH;
    mouseDelta.current.x = 0;
    mouseDelta.current.y = 0;

    pitch.current = clamp(pitch.current, -1.1, 1.1);

    const targetRoll = clamp(yawDelta / (MOUSE_YAW * 10), -1, 1) * MAX_BANK;
    roll.current += (targetRoll - roll.current) * Math.min(1, BANK_SPEED * dt);

    plane.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, roll.current, "YXZ"));

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(plane.quaternion);
    const speed = (boost.current ? TIER_BOOST[tier] : TIER_SPEED[tier]) * dt;
    plane.position.addScaledVector(forward, speed);

    plane.position.x = clamp(plane.position.x, -MAP_BOUND, MAP_BOUND);
    plane.position.z = clamp(plane.position.z, -MAP_BOUND, MAP_BOUND);
    plane.position.y = clamp(plane.position.y, MIN_HEIGHT, MAX_HEIGHT);

    const slerpT = 1 - Math.exp(-CAM_SMOOTH * dt);
    camRigQ.current.slerp(plane.quaternion, slerpT);

    const camBack = new THREE.Vector3(0, 0, -1).applyQuaternion(camRigQ.current);
    const camUp   = new THREE.Vector3(0, 1, 0).applyQuaternion(camRigQ.current);
    const camPos  = plane.position.clone()
      .addScaledVector(camBack, TIER_CAM_BACK[tier])
      .addScaledVector(camUp,   TIER_CAM_UP[tier]);

    camera.position.copy(camPos);
    camera.lookAt(plane.position.clone().addScaledVector(forward, 40));

    // Engine light flicker — merged from tier sub-components (saves 3-4 useFrame registrations)
    const t = clock.getElapsedTime();
    if (tier === 2) {
      const flicker = (0.8 + Math.sin(t * 20) * 0.2) * 6;
      if (lr0.current) lr0.current.intensity = flicker;
      if (lr1.current) lr1.current.intensity = flicker;
    } else if (tier === 3) {
      if (lr0.current) lr0.current.intensity = 7 + Math.sin(t * 15) * 2;
    } else if (tier === 4) {
      if (lr0.current) lr0.current.intensity = 12 + Math.sin(t * 18) * 3;
    } else if (tier === 5) {
      const f = (o: number) => 8 + Math.sin(t * 12 + o) * 2;
      if (lr0.current) lr0.current.intensity = f(0);
      if (lr1.current) lr1.current.intensity = f(1);
      if (lr2.current) lr2.current.intensity = f(2);
      if (lr3.current) lr3.current.intensity = f(3);
    }
  });

  const spawnX = side === "iran" ? -600 : 600;

  return (
    <group ref={groupRef as React.RefObject<THREE.Group>} position={[spawnX, 120, 0]}>
      <AirplaneMesh side={side} tier={tier} lightRefs={lightRefs} />
      <pointLight
        color={side === "iran" ? "#66ff44" : "#4488ff"}
        intensity={3}
        distance={tier >= 4 ? 60 : 35}
      />
    </group>
  );
}
