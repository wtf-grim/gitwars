"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PlaneTier } from "./PlaneSelectModal";
import { Building } from "./WarMap";

// ─── Building Definitions ─────────────────────────────────────────

export interface BuildingDef {
  id: number;
  side: "iran" | "israel";
  position: [number, number, number];
  w: number;
  h: number;
  d: number;
  color: string;
  windowColor?: string;
}

// ─────────────────────────────────────────────────────────────────
// IRAN BUILDINGS DATA
// ─────────────────────────────────────────────────────────────────
const IC = ["#c8a87a", "#b09070", "#d4bc94", "#aa8860", "#be9f78", "#c4a882", "#b8906a", "#d0b888"];

export const IRAN_BUILDINGS: BuildingDef[] = [
  // Downtown Core Z: -700 to -540
  { id:0,  side:"iran", position:[-1560,0,-2560], w:90, h:550, d:90, color:IC[0] },
  { id:1,  side:"iran", position:[-1720,0,-2400], w:75, h:475, d:75, color:IC[1] },
  { id:2,  side:"iran", position:[-1860,0,-2620], w:85, h:500, d:85, color:IC[2] },
  { id:3,  side:"iran", position:[-2040,0,-2480], w:100, h:390, d:90, color:IC[3] },
  { id:4,  side:"iran", position:[-1432,0,-2700], w:65, h:325, d:70, color:IC[0] },
  { id:5,  side:"iran", position:[-2192,0,-2360], w:80, h:440, d:80, color:IC[4] },
  { id:6,  side:"iran", position:[-1352,0,-2460], w:70, h:360, d:70, color:IC[2] },
  { id:7,  side:"iran", position:[-1620,0,-2720], w:60, h:290, d:70, color:IC[6] },
  { id:8,  side:"iran", position:[-1820,0,-2192], w:80, h:320, d:80, color:IC[7] },
  { id:9,  side:"iran", position:[-2360,0,-2168], w:110, h:270, d:100, color:IC[5] },
  { id:10, side:"iran", position:[-2488,0,-2608], w:110, h:260, d:100, color:IC[7] },
  { id:11, side:"iran", position:[-1920,0,-2272], w:70, h:240, d:70, color:IC[0] },
  { id:12, side:"iran", position:[-2248,0,-2540], w:75, h:210, d:75, color:IC[3] },
  { id:13, side:"iran", position:[-2720,0,-2432], w:100, h:230, d:90, color:IC[6] },
  { id:14, side:"iran", position:[-2872,0,-2640], w:80, h:190, d:80, color:IC[1] },
  { id:15, side:"iran", position:[-2968,0,-2320], w:90, h:210, d:80, color:IC[4] },
  { id:16, side:"iran", position:[-1232,0,-2232], w:60, h:190, d:60, color:IC[2] },
  { id:17, side:"iran", position:[-1072,0,-2512], w:65, h:160, d:60, color:IC[0] },
  { id:18, side:"iran", position:[-1112,0,-2200], w:60, h:140, d:55, color:IC[5] },
  { id:19, side:"iran", position:[-3032,0,-2760], w:80, h:150, d:80, color:IC[1] },
  { id:20, side:"iran", position:[-3240,0,-2520], w:100, h:180, d:90, color:IC[3] },
  { id:21, side:"iran", position:[-3360,0,-2280], w:90, h:150, d:80, color:IC[5] },
  { id:22, side:"iran", position:[-3480,0,-2600], w:80, h:130, d:75, color:IC[7] },
  { id:23, side:"iran", position:[-1400,0,-2360], w:65, h:220, d:65, color:IC[4] },
  { id:24, side:"iran", position:[-1672,0,-2220], w:70, h:260, d:70, color:IC[3] },
  { id:25, side:"iran", position:[-1960,0,-2600], w:80, h:180, d:70, color:IC[5] },
  { id:26, side:"iran", position:[-2560,0,-2180], w:70, h:170, d:70, color:IC[2] },
  { id:27, side:"iran", position:[-2800,0,-2180], w:65, h:200, d:65, color:IC[0] },
  { id:28, side:"iran", position:[-3040,0,-2080], w:90, h:150, d:80, color:IC[6] },
  { id:29, side:"iran", position:[-3280,0,-2780], w:75, h:110, d:70, color:IC[1] },
  // Midtown Z: -540 to 0
  { id:30, side:"iran", position:[-1560,0,-1760], w:90, h:500, d:90, color:IC[0] },
  { id:31, side:"iran", position:[-1720,0,-1600], w:75, h:410, d:75, color:IC[1] },
  { id:32, side:"iran", position:[-1860,0,-1800], w:85, h:450, d:85, color:IC[2] },
  { id:33, side:"iran", position:[-2040,0,-1672], w:100, h:340, d:90, color:IC[3] },
  { id:34, side:"iran", position:[-1432,0,-1888], w:65, h:280, d:70, color:IC[0] },
  { id:35, side:"iran", position:[-2192,0,-1552], w:80, h:375, d:80, color:IC[4] },
  { id:36, side:"iran", position:[-1352,0,-1660], w:70, h:310, d:70, color:IC[2] },
  { id:37, side:"iran", position:[-1620,0,-1900], w:60, h:240, d:70, color:IC[6] },
  { id:38, side:"iran", position:[-1820,0,-1392], w:80, h:270, d:80, color:IC[7] },
  { id:39, side:"iran", position:[-2360,0,-1368], w:110, h:220, d:100, color:IC[5] },
  { id:40, side:"iran", position:[-2168,0,-1112], w:80, h:190, d:80, color:IC[1] },
  { id:41, side:"iran", position:[-1768,0,-1032], w:75, h:160, d:80, color:IC[3] },
  { id:42, side:"iran", position:[-1488,0,-1152], w:90, h:180, d:75, color:IC[6] },
  { id:43, side:"iran", position:[-1928,0,-1232], w:70, h:150, d:70, color:IC[0] },
  { id:44, side:"iran", position:[-2488,0,-1808], w:110, h:210, d:100, color:IC[7] },
  { id:45, side:"iran", position:[-2620,0,-1272], w:90, h:170, d:80, color:IC[4] },
  { id:46, side:"iran", position:[-1232,0,-1432], w:60, h:140, d:60, color:IC[2] },
  { id:47, side:"iran", position:[-2032,0,-1408], w:65, h:190, d:65, color:IC[5] },
  { id:48, side:"iran", position:[-2248,0,-1740], w:75, h:160, d:75, color:IC[3] },
  { id:49, side:"iran", position:[-1312,0,-1352], w:55, h:120, d:65, color:IC[1] },
  { id:50, side:"iran", position:[-2792,0,-1632], w:100, h:180, d:90, color:IC[6] },
  { id:51, side:"iran", position:[-2928,0,-1808], w:120, h:140, d:100, color:IC[6] },
  { id:52, side:"iran", position:[-3032,0,-2040], w:80, h:100, d:80, color:IC[1] },
  { id:53, side:"iran", position:[-2768,0,-1512], w:90, h:110, d:80, color:IC[0] },
  { id:54, side:"iran", position:[-1072,0,-1712], w:65, h:110, d:60, color:IC[0] },
  { id:55, side:"iran", position:[-1112,0,-1400], w:60, h:80, d:55, color:IC[5] },
  { id:56, side:"iran", position:[-1272,0,-2020], w:60, h:90, d:60, color:IC[2] },
  { id:57, side:"iran", position:[-1960,0,-752], w:100, h:90, d:70, color:IC[5] },
  { id:58, side:"iran", position:[-2288,0,-888], w:80, h:100, d:70, color:IC[3] },
  { id:59, side:"iran", position:[-1368,0,-888], w:70, h:80, d:60, color:IC[7] },
  { id:60, side:"iran", position:[-1660,0,-672], w:65, h:70, d:65, color:IC[4] },
  { id:61, side:"iran", position:[-3120,0,-1552], w:90, h:130, d:80, color:IC[2] },
  { id:62, side:"iran", position:[-3280,0,-1720], w:100, h:110, d:90, color:IC[5] },
  { id:63, side:"iran", position:[-3420,0,-1520], w:80, h:90, d:70, color:IC[0] },
  { id:64, side:"iran", position:[-3520,0,-1760], w:70, h:100, d:65, color:IC[3] },
  { id:65, side:"iran", position:[-3200,0,-1920], w:80, h:140, d:75, color:IC[6] },
  { id:66, side:"iran", position:[-3360,0,-1240], w:90, h:110, d:80, color:IC[4] },
  { id:67, side:"iran", position:[-3520,0,-1160], w:70, h:90, d:70, color:IC[7] },
  { id:68, side:"iran", position:[-3020,0,-1072], w:80, h:120, d:70, color:IC[1] },
  // City Center Z: 0 to +350
  { id:69, side:"iran", position:[-1128,0,360], w:70, h:210, d:70, color:IC[1] },
  { id:70, side:"iran", position:[-1280,0,460], w:80, h:260, d:80, color:IC[0] },
  { id:71, side:"iran", position:[-1472,0,632], w:75, h:220, d:70, color:IC[2] },
  { id:72, side:"iran", position:[-1152,0,728], w:65, h:180, d:65, color:IC[1] },
  { id:73, side:"iran", position:[-1712,0,408], w:90, h:240, d:80, color:IC[4] },
  { id:74, side:"iran", position:[-1952,0,632], w:70, h:190, d:70, color:IC[5] },
  { id:75, side:"iran", position:[-2168,0,848], w:80, h:160, d:75, color:IC[3] },
  { id:76, side:"iran", position:[-1592,0,1008], w:100, h:130, d:90, color:IC[7] },
  { id:77, side:"iran", position:[-1232,0,968], w:60, h:110, d:60, color:IC[0] },
  { id:78, side:"iran", position:[-1832,0,1168], w:90, h:120, d:80, color:IC[6] },
  { id:79, side:"iran", position:[-2328,0,568], w:110, h:150, d:100, color:IC[2] },
  { id:80, side:"iran", position:[-2488,0,928], w:80, h:100, d:70, color:IC[4] },
  { id:81, side:"iran", position:[-1072,0,648], w:55, h:90, d:60, color:IC[3] },
  { id:82, side:"iran", position:[-2008,0,340], w:70, h:140, d:70, color:IC[7] },
  { id:83, side:"iran", position:[-2620,0,700], w:90, h:120, d:80, color:IC[5] },
  { id:84, side:"iran", position:[-1392,0,1248], w:65, h:90, d:65, color:IC[1] },
  { id:85, side:"iran", position:[-1648,0,1352], w:80, h:80, d:70, color:IC[0] },
  { id:86, side:"iran", position:[-2800,0,272], w:100, h:140, d:90, color:IC[6] },
  { id:87, side:"iran", position:[-2980,0,520], w:90, h:110, d:80, color:IC[3] },
  { id:88, side:"iran", position:[-3120,0,820], w:80, h:130, d:75, color:IC[2] },
  { id:89, side:"iran", position:[-3280,0,380], w:100, h:100, d:90, color:IC[5] },
  { id:90, side:"iran", position:[-3420,0,700], w:80, h:90, d:70, color:IC[0] },
  { id:91, side:"iran", position:[-3520,0,940], w:70, h:80, d:65, color:IC[4] },
  { id:92, side:"iran", position:[-1032,0,160], w:60, h:100, d:60, color:IC[2] },
  { id:93, side:"iran", position:[-1072,0,432], w:55, h:120, d:55, color:IC[7] },
  { id:94, side:"iran", position:[-1880,0,72], w:70, h:150, d:70, color:IC[5] },
  { id:95, side:"iran", position:[-2160,0,168], w:80, h:180, d:75, color:IC[3] },
  { id:96, side:"iran", position:[-2432,0,88], w:90, h:140, d:80, color:IC[1] },
  { id:97, side:"iran", position:[-2660,0,1120], w:80, h:110, d:70, color:IC[4] },
  { id:98, side:"iran", position:[-2872,0,1248], w:90, h:100, d:80, color:IC[0] },
  { id:99, side:"iran", position:[-3048,0,1100], w:80, h:90, d:75, color:IC[7] },
  { id:100, side:"iran", position:[-3220,0,1312], w:100, h:80, d:90, color:IC[2] },
  { id:101, side:"iran", position:[-3392,0,1120], w:70, h:70, d:65, color:IC[5] },
  // South Zone Z: +350 to +700
  { id:102, side:"iran", position:[-1072,0,1552], w:60, h:90, d:60, color:IC[3] },
  { id:103, side:"iran", position:[-1480,0,1608], w:70, h:120, d:70, color:IC[5] },
  { id:104, side:"iran", position:[-1728,0,1792], w:90, h:150, d:80, color:IC[1] },
  { id:105, side:"iran", position:[-2008,0,1648], w:65, h:110, d:65, color:IC[3] },
  { id:106, side:"iran", position:[-2232,0,1848], w:80, h:130, d:80, color:IC[7] },
  { id:107, side:"iran", position:[-2408,0,1608], w:100, h:100, d:90, color:IC[4] },
  { id:108, side:"iran", position:[-1368,0,1888], w:60, h:80, d:60, color:IC[6] },
  { id:109, side:"iran", position:[-1888,0,2056], w:80, h:110, d:70, color:IC[2] },
  { id:110, side:"iran", position:[-1272,0,1780], w:55, h:70, d:55, color:IC[0] },
  { id:111, side:"iran", position:[-2608,0,1740], w:90, h:90, d:80, color:IC[2] },
  { id:112, side:"iran", position:[-2872,0,1952], w:80, h:80, d:70, color:IC[5] },
  { id:113, side:"iran", position:[-1620,0,2140], w:70, h:70, d:65, color:IC[7] },
  { id:114, side:"iran", position:[-1032,0,2080], w:60, h:80, d:60, color:IC[4] },
  { id:115, side:"iran", position:[-1192,0,2272], w:65, h:90, d:65, color:IC[1] },
  { id:116, side:"iran", position:[-1420,0,2432], w:75, h:110, d:70, color:IC[6] },
  { id:117, side:"iran", position:[-1672,0,2312], w:70, h:100, d:70, color:IC[0] },
  { id:118, side:"iran", position:[-1928,0,2472], w:80, h:90, d:75, color:IC[3] },
  { id:119, side:"iran", position:[-2152,0,2232], w:90, h:80, d:80, color:IC[2] },
  { id:120, side:"iran", position:[-2368,0,2368], w:70, h:70, d:65, color:IC[7] },
  { id:121, side:"iran", position:[-2592,0,2152], w:80, h:90, d:75, color:IC[5] },
  { id:122, side:"iran", position:[-2820,0,2272], w:90, h:80, d:80, color:IC[4] },
  { id:123, side:"iran", position:[-3032,0,2048], w:80, h:70, d:70, color:IC[1] },
  { id:124, side:"iran", position:[-3232,0,2272], w:90, h:80, d:80, color:IC[3] },
  { id:125, side:"iran", position:[-3392,0,1920], w:100, h:70, d:90, color:IC[6] },
  { id:126, side:"iran", position:[-3480,0,2192], w:70, h:60, d:65, color:IC[0] },
  { id:127, side:"iran", position:[-3032,0,2500], w:70, h:60, d:65, color:IC[4] },
  { id:128, side:"iran", position:[-2720,0,2560], w:80, h:70, d:70, color:IC[2] },
  { id:129, side:"iran", position:[-2400,0,2640], w:60, h:60, d:60, color:IC[7] },
  { id:130, side:"iran", position:[-2080,0,2632], w:70, h:70, d:65, color:IC[5] },
  { id:131, side:"iran", position:[-1760,0,2592], w:65, h:80, d:65, color:IC[1] },
  { id:132, side:"iran", position:[-1440,0,2592], w:60, h:60, d:60, color:IC[3] },
  { id:133, side:"iran", position:[-1112,0,2520], w:55, h:70, d:55, color:IC[6] },
  // West Dense Zone X: -700 to -900
  { id:134, side:"iran", position:[-2960,0,-980], w:100, h:160, d:90, color:IC[3] },
  { id:135, side:"iran", position:[-3120,0,-672], w:90, h:140, d:80, color:IC[5] },
  { id:136, side:"iran", position:[-3280,0,-888], w:110, h:120, d:100, color:IC[1] },
  { id:137, side:"iran", position:[-3432,0,-632], w:80, h:100, d:75, color:IC[6] },
  { id:138, side:"iran", position:[-3520,0,-440], w:70, h:90, d:65, color:IC[4] },
  { id:139, side:"iran", position:[-3040,0,-312], w:90, h:130, d:80, color:IC[2] },
  { id:140, side:"iran", position:[-3240,0,-112], w:100, h:110, d:90, color:IC[7] },
  { id:141, side:"iran", position:[-3420,0,-220], w:80, h:90, d:75, color:IC[0] },
  { id:142, side:"iran", position:[-2960,0,88], w:90, h:120, d:80, color:IC[3] },
  { id:143, side:"iran", position:[-3200,0,288], w:110, h:100, d:100, color:IC[5] },
  { id:144, side:"iran", position:[-3408,0,128], w:80, h:80, d:70, color:IC[1] },
  { id:145, side:"iran", position:[-3520,0,380], w:70, h:70, d:65, color:IC[4] },
  { id:146, side:"iran", position:[-2960,0,1512], w:100, h:90, d:90, color:IC[6] },
  { id:147, side:"iran", position:[-3160,0,1712], w:90, h:80, d:80, color:IC[3] },
  { id:148, side:"iran", position:[-3340,0,1528], w:80, h:70, d:75, color:IC[0] },
  { id:149, side:"iran", position:[-3480,0,1760], w:70, h:60, d:65, color:IC[7] },
  { id:150, side:"iran", position:[-3520,0,1472], w:75, h:70, d:70, color:IC[2] },
  // New Dense Zones (ids 160–199)
  { id:160, side:"iran", position:[-1920,0,-1600], w:100, h:450, d:100, color:IC[0] },
  { id:161, side:"iran", position:[-2080,0,-1800], w:90, h:400, d:90, color:IC[1] },
  { id:162, side:"iran", position:[-2240,0,-1520], w:110, h:500, d:110, color:IC[2] },
  { id:163, side:"iran", position:[-1960,0,-2000], w:95, h:350, d:95, color:IC[3] },
  { id:164, side:"iran", position:[-2400,0,-1680], w:85, h:300, d:85, color:IC[4] },
  { id:165, side:"iran", position:[-1720,0,-1900], w:80, h:250, d:80, color:IC[5] },
  { id:166, side:"iran", position:[-2600,0,-1400], w:75, h:225, d:75, color:IC[6] },
  { id:167, side:"iran", position:[-2100,0,-2200], w:90, h:400, d:90, color:IC[7] },
  { id:168, side:"iran", position:[-1800,0,-2400], w:70, h:200, d:70, color:IC[0] },
  { id:169, side:"iran", position:[-2300,0,-2100], w:80, h:300, d:80, color:IC[1] },
  { id:170, side:"iran", position:[-2500,0,-1900], w:95, h:375, d:95, color:IC[2] },
  { id:171, side:"iran", position:[-2700,0,-1700], w:85, h:275, d:85, color:IC[3] },
  { id:172, side:"iran", position:[-1720,0,-1200], w:105, h:475, d:105, color:IC[4] },
  { id:173, side:"iran", position:[-1880,0,-800], w:90, h:350, d:90, color:IC[5] },
  { id:174, side:"iran", position:[-2100,0,-600], w:80, h:250, d:80, color:IC[6] },
  { id:175, side:"iran", position:[-2320,0,-1000], w:75, h:200, d:75, color:IC[7] },
  { id:176, side:"iran", position:[-2560,0,-800], w:70, h:175, d:70, color:IC[0] },
  { id:177, side:"iran", position:[-1920,0,400], w:95, h:400, d:95, color:IC[1] },
  { id:178, side:"iran", position:[-2160,0,600], w:85, h:300, d:85, color:IC[2] },
  { id:179, side:"iran", position:[-2400,0,360], w:75, h:225, d:75, color:IC[3] },
  { id:180, side:"iran", position:[-2640,0,500], w:70, h:175, d:70, color:IC[4] },
  { id:181, side:"iran", position:[-1720,0,800], w:90, h:325, d:90, color:IC[5] },
  { id:182, side:"iran", position:[-1960,0,1000], w:80, h:250, d:80, color:IC[6] },
  { id:183, side:"iran", position:[-2200,0,840], w:95, h:350, d:95, color:IC[7] },
  { id:184, side:"iran", position:[-2440,0,1000], w:85, h:275, d:85, color:IC[0] },
  { id:185, side:"iran", position:[-2680,0,760], w:75, h:200, d:75, color:IC[1] },
  { id:186, side:"iran", position:[-1800,0,1400], w:70, h:175, d:70, color:IC[2] },
  { id:187, side:"iran", position:[-2040,0,1600], w:80, h:225, d:80, color:IC[3] },
  { id:188, side:"iran", position:[-2300,0,1440], w:90, h:275, d:90, color:IC[4] },
  { id:189, side:"iran", position:[-2540,0,1280], w:75, h:200, d:75, color:IC[5] },
  { id:190, side:"iran", position:[-1900,0,2000], w:70, h:150, d:70, color:IC[6] },
  { id:191, side:"iran", position:[-2140,0,2200], w:80, h:200, d:80, color:IC[7] },
  { id:192, side:"iran", position:[-2380,0,1960], w:85, h:250, d:85, color:IC[0] },
  { id:193, side:"iran", position:[-1200,0,-2000], w:90, h:325, d:90, color:IC[1] },
  { id:194, side:"iran", position:[-1400,0,-2200], w:80, h:275, d:80, color:IC[2] },
  { id:195, side:"iran", position:[-1600,0,-2100], w:95, h:375, d:95, color:IC[3] },
  { id:196, side:"iran", position:[-1300,0,-1800], w:85, h:300, d:85, color:IC[4] },
  { id:197, side:"iran", position:[-1100,0,-1600], w:75, h:250, d:75, color:IC[5] },
  { id:198, side:"iran", position:[-1000,0,-2400], w:70, h:200, d:70, color:IC[6] },
  { id:199, side:"iran", position:[-1500,0,-2600], w:80, h:225, d:80, color:IC[7] },
];

// ─────────────────────────────────────────────────────────────────
// ISRAEL BUILDINGS DATA
// ─────────────────────────────────────────────────────────────────
const IS_C = ["#f0ead8","#e8e0cc","#ddd5c0","#ece4d4","#f4eed8","#e0d8c8","#eae2d0","#f0e8d4"];
const IS_W = "#aaddff";

export const ISRAEL_BUILDINGS: BuildingDef[] = [
  // Downtown Core Z: -700 to -540
  { id:200, side:"israel", position:[1560,0,-2560], w:90, h:550, d:90, color:IS_C[0], windowColor:IS_W },
  { id:201, side:"israel", position:[1720,0,-2400], w:75, h:475, d:75, color:IS_C[1], windowColor:IS_W },
  { id:202, side:"israel", position:[1860,0,-2620], w:85, h:500, d:85, color:IS_C[2], windowColor:IS_W },
  { id:203, side:"israel", position:[2040,0,-2480], w:100, h:390, d:90, color:IS_C[3], windowColor:IS_W },
  { id:204, side:"israel", position:[1432,0,-2700], w:65, h:325, d:70, color:IS_C[0], windowColor:IS_W },
  { id:205, side:"israel", position:[2192,0,-2360], w:80, h:440, d:80, color:IS_C[4], windowColor:IS_W },
  { id:206, side:"israel", position:[1352,0,-2460], w:70, h:360, d:70, color:IS_C[2], windowColor:IS_W },
  { id:207, side:"israel", position:[1620,0,-2720], w:60, h:290, d:70, color:IS_C[6], windowColor:IS_W },
  { id:208, side:"israel", position:[1820,0,-2192], w:80, h:320, d:80, color:IS_C[7], windowColor:IS_W },
  { id:209, side:"israel", position:[2360,0,-2168], w:110, h:270, d:100, color:IS_C[5], windowColor:IS_W },
  { id:210, side:"israel", position:[2488,0,-2608], w:110, h:260, d:100, color:IS_C[7], windowColor:IS_W },
  { id:211, side:"israel", position:[1920,0,-2272], w:70, h:240, d:70, color:IS_C[0], windowColor:IS_W },
  { id:212, side:"israel", position:[2248,0,-2540], w:75, h:210, d:75, color:IS_C[3], windowColor:IS_W },
  { id:213, side:"israel", position:[2720,0,-2432], w:100, h:230, d:90, color:IS_C[6], windowColor:IS_W },
  { id:214, side:"israel", position:[2872,0,-2640], w:80, h:190, d:80, color:IS_C[1], windowColor:IS_W },
  { id:215, side:"israel", position:[2968,0,-2320], w:90, h:210, d:80, color:IS_C[4], windowColor:IS_W },
  { id:216, side:"israel", position:[1232,0,-2232], w:60, h:190, d:60, color:IS_C[2], windowColor:IS_W },
  { id:217, side:"israel", position:[1072,0,-2512], w:65, h:160, d:60, color:IS_C[0], windowColor:IS_W },
  { id:218, side:"israel", position:[1112,0,-2200], w:60, h:140, d:55, color:IS_C[5], windowColor:IS_W },
  { id:219, side:"israel", position:[3032,0,-2760], w:80, h:150, d:80, color:IS_C[1], windowColor:IS_W },
  { id:220, side:"israel", position:[3240,0,-2520], w:100, h:180, d:90, color:IS_C[3], windowColor:IS_W },
  { id:221, side:"israel", position:[3360,0,-2280], w:90, h:150, d:80, color:IS_C[5], windowColor:IS_W },
  { id:222, side:"israel", position:[3480,0,-2600], w:80, h:130, d:75, color:IS_C[7], windowColor:IS_W },
  { id:223, side:"israel", position:[1400,0,-2360], w:65, h:220, d:65, color:IS_C[4], windowColor:IS_W },
  { id:224, side:"israel", position:[1672,0,-2220], w:70, h:260, d:70, color:IS_C[3], windowColor:IS_W },
  { id:225, side:"israel", position:[1960,0,-2600], w:80, h:180, d:70, color:IS_C[5], windowColor:IS_W },
  { id:226, side:"israel", position:[2560,0,-2180], w:70, h:170, d:70, color:IS_C[2], windowColor:IS_W },
  { id:227, side:"israel", position:[2800,0,-2180], w:65, h:200, d:65, color:IS_C[0], windowColor:IS_W },
  { id:228, side:"israel", position:[3040,0,-2080], w:90, h:150, d:80, color:IS_C[6], windowColor:IS_W },
  { id:229, side:"israel", position:[3280,0,-2780], w:75, h:110, d:70, color:IS_C[1], windowColor:IS_W },
  // Midtown Z: -540 to 0
  { id:230, side:"israel", position:[1560,0,-1760], w:90, h:525, d:90, color:IS_C[0], windowColor:IS_W },
  { id:231, side:"israel", position:[1720,0,-1600], w:75, h:420, d:75, color:IS_C[1], windowColor:IS_W },
  { id:232, side:"israel", position:[1860,0,-1800], w:85, h:460, d:85, color:IS_C[2], windowColor:IS_W },
  { id:233, side:"israel", position:[2040,0,-1672], w:100, h:350, d:90, color:IS_C[3], windowColor:IS_W },
  { id:234, side:"israel", position:[1432,0,-1888], w:65, h:290, d:70, color:IS_C[0], windowColor:IS_W },
  { id:235, side:"israel", position:[2192,0,-1552], w:80, h:380, d:80, color:IS_C[4], windowColor:IS_W },
  { id:236, side:"israel", position:[1352,0,-1660], w:70, h:320, d:70, color:IS_C[2], windowColor:IS_W },
  { id:237, side:"israel", position:[1620,0,-1900], w:60, h:250, d:70, color:IS_C[6], windowColor:IS_W },
  { id:238, side:"israel", position:[1820,0,-1392], w:80, h:280, d:80, color:IS_C[7], windowColor:IS_W },
  { id:239, side:"israel", position:[2360,0,-1368], w:110, h:230, d:100, color:IS_C[5], windowColor:IS_W },
  { id:240, side:"israel", position:[2168,0,-1112], w:80, h:200, d:80, color:IS_C[1], windowColor:IS_W },
  { id:241, side:"israel", position:[1768,0,-1032], w:75, h:170, d:80, color:IS_C[3], windowColor:IS_W },
  { id:242, side:"israel", position:[1488,0,-1152], w:90, h:190, d:75, color:IS_C[6], windowColor:IS_W },
  { id:243, side:"israel", position:[1928,0,-1232], w:70, h:160, d:70, color:IS_C[0], windowColor:IS_W },
  { id:244, side:"israel", position:[2488,0,-1808], w:110, h:220, d:100, color:IS_C[7], windowColor:IS_W },
  { id:245, side:"israel", position:[2620,0,-1272], w:90, h:180, d:80, color:IS_C[4], windowColor:IS_W },
  { id:246, side:"israel", position:[1232,0,-1432], w:60, h:150, d:60, color:IS_C[2], windowColor:IS_W },
  { id:247, side:"israel", position:[2032,0,-1408], w:65, h:200, d:65, color:IS_C[5], windowColor:IS_W },
  { id:248, side:"israel", position:[2248,0,-1740], w:75, h:170, d:75, color:IS_C[3], windowColor:IS_W },
  { id:249, side:"israel", position:[1312,0,-1352], w:55, h:130, d:65, color:IS_C[1], windowColor:IS_W },
  { id:250, side:"israel", position:[2792,0,-1632], w:100, h:190, d:90, color:IS_C[6], windowColor:IS_W },
  { id:251, side:"israel", position:[2928,0,-1808], w:120, h:150, d:100, color:IS_C[6], windowColor:IS_W },
  { id:252, side:"israel", position:[3032,0,-2040], w:80, h:100, d:80, color:IS_C[1], windowColor:IS_W },
  { id:253, side:"israel", position:[2768,0,-1512], w:90, h:120, d:80, color:IS_C[0], windowColor:IS_W },
  { id:254, side:"israel", position:[1072,0,-1712], w:65, h:110, d:60, color:IS_C[0], windowColor:IS_W },
  { id:255, side:"israel", position:[1112,0,-1400], w:60, h:80, d:55, color:IS_C[5], windowColor:IS_W },
  { id:256, side:"israel", position:[1272,0,-2020], w:60, h:90, d:60, color:IS_C[2], windowColor:IS_W },
  { id:257, side:"israel", position:[1960,0,-752], w:100, h:100, d:70, color:IS_C[5], windowColor:IS_W },
  { id:258, side:"israel", position:[2288,0,-888], w:80, h:110, d:70, color:IS_C[3], windowColor:IS_W },
  { id:259, side:"israel", position:[1368,0,-888], w:70, h:90, d:60, color:IS_C[7], windowColor:IS_W },
  { id:260, side:"israel", position:[1660,0,-672], w:65, h:70, d:65, color:IS_C[4], windowColor:IS_W },
  { id:261, side:"israel", position:[3120,0,-1552], w:90, h:130, d:80, color:IS_C[2], windowColor:IS_W },
  { id:262, side:"israel", position:[3280,0,-1720], w:100, h:110, d:90, color:IS_C[5], windowColor:IS_W },
  { id:263, side:"israel", position:[3420,0,-1520], w:80, h:90, d:70, color:IS_C[0], windowColor:IS_W },
  { id:264, side:"israel", position:[3520,0,-1760], w:70, h:100, d:65, color:IS_C[3], windowColor:IS_W },
  { id:265, side:"israel", position:[3200,0,-1920], w:80, h:140, d:75, color:IS_C[6], windowColor:IS_W },
  { id:266, side:"israel", position:[3360,0,-1240], w:90, h:110, d:80, color:IS_C[4], windowColor:IS_W },
  { id:267, side:"israel", position:[3520,0,-1160], w:70, h:90, d:70, color:IS_C[7], windowColor:IS_W },
  { id:268, side:"israel", position:[3020,0,-1072], w:80, h:120, d:70, color:IS_C[1], windowColor:IS_W },
  // City Center Z: 0 to +350
  { id:269, side:"israel", position:[1128,0,360], w:70, h:220, d:70, color:IS_C[1], windowColor:IS_W },
  { id:270, side:"israel", position:[1280,0,460], w:80, h:270, d:80, color:IS_C[0], windowColor:IS_W },
  { id:271, side:"israel", position:[1472,0,632], w:75, h:230, d:70, color:IS_C[2], windowColor:IS_W },
  { id:272, side:"israel", position:[1152,0,728], w:65, h:190, d:65, color:IS_C[1], windowColor:IS_W },
  { id:273, side:"israel", position:[1712,0,408], w:90, h:250, d:80, color:IS_C[4], windowColor:IS_W },
  { id:274, side:"israel", position:[1952,0,632], w:70, h:200, d:70, color:IS_C[5], windowColor:IS_W },
  { id:275, side:"israel", position:[2168,0,848], w:80, h:170, d:75, color:IS_C[3], windowColor:IS_W },
  { id:276, side:"israel", position:[1592,0,1008], w:100, h:140, d:90, color:IS_C[7], windowColor:IS_W },
  { id:277, side:"israel", position:[1232,0,968], w:60, h:120, d:60, color:IS_C[0], windowColor:IS_W },
  { id:278, side:"israel", position:[1832,0,1168], w:90, h:130, d:80, color:IS_C[6], windowColor:IS_W },
  { id:279, side:"israel", position:[2328,0,568], w:110, h:160, d:100, color:IS_C[2], windowColor:IS_W },
  { id:280, side:"israel", position:[2488,0,928], w:80, h:110, d:70, color:IS_C[4], windowColor:IS_W },
  { id:281, side:"israel", position:[1072,0,648], w:55, h:100, d:60, color:IS_C[3], windowColor:IS_W },
  { id:282, side:"israel", position:[2008,0,340], w:70, h:150, d:70, color:IS_C[7], windowColor:IS_W },
  { id:283, side:"israel", position:[2620,0,700], w:90, h:130, d:80, color:IS_C[5], windowColor:IS_W },
  { id:284, side:"israel", position:[1392,0,1248], w:65, h:100, d:65, color:IS_C[1], windowColor:IS_W },
  { id:285, side:"israel", position:[1648,0,1352], w:80, h:90, d:70, color:IS_C[0], windowColor:IS_W },
  { id:286, side:"israel", position:[2800,0,272], w:100, h:140, d:90, color:IS_C[6], windowColor:IS_W },
  { id:287, side:"israel", position:[2980,0,520], w:90, h:110, d:80, color:IS_C[3], windowColor:IS_W },
  { id:288, side:"israel", position:[3120,0,820], w:80, h:130, d:75, color:IS_C[2], windowColor:IS_W },
  { id:289, side:"israel", position:[3280,0,380], w:100, h:100, d:90, color:IS_C[5], windowColor:IS_W },
  { id:290, side:"israel", position:[3420,0,700], w:80, h:90, d:70, color:IS_C[0], windowColor:IS_W },
  { id:291, side:"israel", position:[3520,0,940], w:70, h:80, d:65, color:IS_C[4], windowColor:IS_W },
  { id:292, side:"israel", position:[1032,0,160], w:60, h:100, d:60, color:IS_C[2], windowColor:IS_W },
  { id:293, side:"israel", position:[1072,0,432], w:55, h:120, d:55, color:IS_C[7], windowColor:IS_W },
  { id:294, side:"israel", position:[1880,0,72], w:70, h:150, d:70, color:IS_C[5], windowColor:IS_W },
  { id:295, side:"israel", position:[2160,0,168], w:80, h:180, d:75, color:IS_C[3], windowColor:IS_W },
  { id:296, side:"israel", position:[2432,0,88], w:90, h:140, d:80, color:IS_C[1], windowColor:IS_W },
  { id:297, side:"israel", position:[2660,0,1120], w:80, h:110, d:70, color:IS_C[4], windowColor:IS_W },
  { id:298, side:"israel", position:[2872,0,1248], w:90, h:100, d:80, color:IS_C[0], windowColor:IS_W },
  { id:299, side:"israel", position:[3048,0,1100], w:80, h:90, d:75, color:IS_C[7], windowColor:IS_W },
  { id:300, side:"israel", position:[3220,0,1312], w:100, h:80, d:90, color:IS_C[2], windowColor:IS_W },
  { id:301, side:"israel", position:[3392,0,1120], w:70, h:70, d:65, color:IS_C[5], windowColor:IS_W },
  // South Zone Z: +350 to +700
  { id:302, side:"israel", position:[1072,0,1552], w:60, h:100, d:60, color:IS_C[3], windowColor:IS_W },
  { id:303, side:"israel", position:[1480,0,1608], w:70, h:130, d:70, color:IS_C[5], windowColor:IS_W },
  { id:304, side:"israel", position:[1728,0,1792], w:90, h:160, d:80, color:IS_C[1], windowColor:IS_W },
  { id:305, side:"israel", position:[2008,0,1648], w:65, h:120, d:65, color:IS_C[3], windowColor:IS_W },
  { id:306, side:"israel", position:[2232,0,1848], w:80, h:140, d:80, color:IS_C[7], windowColor:IS_W },
  { id:307, side:"israel", position:[2408,0,1608], w:100, h:110, d:90, color:IS_C[4], windowColor:IS_W },
  { id:308, side:"israel", position:[1368,0,1888], w:60, h:90, d:60, color:IS_C[6], windowColor:IS_W },
  { id:309, side:"israel", position:[1888,0,2056], w:80, h:120, d:70, color:IS_C[2], windowColor:IS_W },
  { id:310, side:"israel", position:[1272,0,1780], w:55, h:80, d:55, color:IS_C[0], windowColor:IS_W },
  { id:311, side:"israel", position:[2608,0,1740], w:90, h:100, d:80, color:IS_C[2], windowColor:IS_W },
  { id:312, side:"israel", position:[2872,0,1952], w:80, h:90, d:70, color:IS_C[5], windowColor:IS_W },
  { id:313, side:"israel", position:[1620,0,2140], w:70, h:80, d:65, color:IS_C[7], windowColor:IS_W },
  { id:314, side:"israel", position:[1032,0,2080], w:60, h:80, d:60, color:IS_C[4], windowColor:IS_W },
  { id:315, side:"israel", position:[1192,0,2272], w:65, h:90, d:65, color:IS_C[1], windowColor:IS_W },
  { id:316, side:"israel", position:[1420,0,2432], w:75, h:110, d:70, color:IS_C[6], windowColor:IS_W },
  { id:317, side:"israel", position:[1672,0,2312], w:70, h:100, d:70, color:IS_C[0], windowColor:IS_W },
  { id:318, side:"israel", position:[1928,0,2472], w:80, h:90, d:75, color:IS_C[3], windowColor:IS_W },
  { id:319, side:"israel", position:[2152,0,2232], w:90, h:80, d:80, color:IS_C[2], windowColor:IS_W },
  { id:320, side:"israel", position:[2368,0,2368], w:70, h:70, d:65, color:IS_C[7], windowColor:IS_W },
  { id:321, side:"israel", position:[2592,0,2152], w:80, h:90, d:75, color:IS_C[5], windowColor:IS_W },
  { id:322, side:"israel", position:[2820,0,2272], w:90, h:80, d:80, color:IS_C[4], windowColor:IS_W },
  { id:323, side:"israel", position:[3032,0,2048], w:80, h:70, d:70, color:IS_C[1], windowColor:IS_W },
  { id:324, side:"israel", position:[3232,0,2272], w:90, h:80, d:80, color:IS_C[3], windowColor:IS_W },
  { id:325, side:"israel", position:[3392,0,1920], w:100, h:70, d:90, color:IS_C[6], windowColor:IS_W },
  { id:326, side:"israel", position:[3480,0,2192], w:70, h:60, d:65, color:IS_C[0], windowColor:IS_W },
  { id:327, side:"israel", position:[3032,0,2500], w:70, h:60, d:65, color:IS_C[4], windowColor:IS_W },
  { id:328, side:"israel", position:[2720,0,2560], w:80, h:70, d:70, color:IS_C[2], windowColor:IS_W },
  { id:329, side:"israel", position:[2400,0,2640], w:60, h:60, d:60, color:IS_C[7], windowColor:IS_W },
  { id:330, side:"israel", position:[2080,0,2632], w:70, h:70, d:65, color:IS_C[5], windowColor:IS_W },
  { id:331, side:"israel", position:[1760,0,2592], w:65, h:80, d:65, color:IS_C[1], windowColor:IS_W },
  { id:332, side:"israel", position:[1440,0,2592], w:60, h:60, d:60, color:IS_C[3], windowColor:IS_W },
  { id:333, side:"israel", position:[1112,0,2520], w:55, h:70, d:55, color:IS_C[6], windowColor:IS_W },
  // East Dense Zone X: +700 to +900
  { id:334, side:"israel", position:[2960,0,-980], w:100, h:160, d:90, color:IS_C[3], windowColor:IS_W },
  { id:335, side:"israel", position:[3120,0,-672], w:90, h:140, d:80, color:IS_C[5], windowColor:IS_W },
  { id:336, side:"israel", position:[3280,0,-888], w:110, h:120, d:100, color:IS_C[1], windowColor:IS_W },
  { id:337, side:"israel", position:[3432,0,-632], w:80, h:100, d:75, color:IS_C[6], windowColor:IS_W },
  { id:338, side:"israel", position:[3520,0,-440], w:70, h:90, d:65, color:IS_C[4], windowColor:IS_W },
  { id:339, side:"israel", position:[3040,0,-312], w:90, h:130, d:80, color:IS_C[2], windowColor:IS_W },
  { id:340, side:"israel", position:[3240,0,-112], w:100, h:110, d:90, color:IS_C[7], windowColor:IS_W },
  { id:341, side:"israel", position:[3420,0,-220], w:80, h:90, d:75, color:IS_C[0], windowColor:IS_W },
  { id:342, side:"israel", position:[2960,0,88], w:90, h:120, d:80, color:IS_C[3], windowColor:IS_W },
  { id:343, side:"israel", position:[3200,0,288], w:110, h:100, d:100, color:IS_C[5], windowColor:IS_W },
  { id:344, side:"israel", position:[3408,0,128], w:80, h:80, d:70, color:IS_C[1], windowColor:IS_W },
  { id:345, side:"israel", position:[3520,0,380], w:70, h:70, d:65, color:IS_C[4], windowColor:IS_W },
  { id:346, side:"israel", position:[2960,0,1512], w:100, h:90, d:90, color:IS_C[6], windowColor:IS_W },
  { id:347, side:"israel", position:[3160,0,1712], w:90, h:80, d:80, color:IS_C[3], windowColor:IS_W },
  { id:348, side:"israel", position:[3340,0,1528], w:80, h:70, d:75, color:IS_C[0], windowColor:IS_W },
  { id:349, side:"israel", position:[3480,0,1760], w:70, h:60, d:65, color:IS_C[7], windowColor:IS_W },
  { id:350, side:"israel", position:[3520,0,1472], w:75, h:70, d:70, color:IS_C[2], windowColor:IS_W },
  // New Dense Zones (ids 360–399)
  { id:360, side:"israel", position:[1920,0,-1600], w:100, h:450, d:100, color:IS_C[0], windowColor:IS_W },
  { id:361, side:"israel", position:[2080,0,-1800], w:90, h:400, d:90, color:IS_C[1], windowColor:IS_W },
  { id:362, side:"israel", position:[2240,0,-1520], w:110, h:500, d:110, color:IS_C[2], windowColor:IS_W },
  { id:363, side:"israel", position:[1960,0,-2000], w:95, h:350, d:95, color:IS_C[3], windowColor:IS_W },
  { id:364, side:"israel", position:[2400,0,-1680], w:85, h:300, d:85, color:IS_C[4], windowColor:IS_W },
  { id:365, side:"israel", position:[1720,0,-1900], w:80, h:250, d:80, color:IS_C[5], windowColor:IS_W },
  { id:366, side:"israel", position:[2600,0,-1400], w:75, h:225, d:75, color:IS_C[6], windowColor:IS_W },
  { id:367, side:"israel", position:[2100,0,-2200], w:90, h:400, d:90, color:IS_C[7], windowColor:IS_W },
  { id:368, side:"israel", position:[1800,0,-2400], w:70, h:200, d:70, color:IS_C[0], windowColor:IS_W },
  { id:369, side:"israel", position:[2300,0,-2100], w:80, h:300, d:80, color:IS_C[1], windowColor:IS_W },
  { id:370, side:"israel", position:[2500,0,-1900], w:95, h:375, d:95, color:IS_C[2], windowColor:IS_W },
  { id:371, side:"israel", position:[2700,0,-1700], w:85, h:275, d:85, color:IS_C[3], windowColor:IS_W },
  { id:372, side:"israel", position:[1720,0,-1200], w:105, h:475, d:105, color:IS_C[4], windowColor:IS_W },
  { id:373, side:"israel", position:[1880,0,-800], w:90, h:350, d:90, color:IS_C[5], windowColor:IS_W },
  { id:374, side:"israel", position:[2100,0,-600], w:80, h:250, d:80, color:IS_C[6], windowColor:IS_W },
  { id:375, side:"israel", position:[2320,0,-1000], w:75, h:200, d:75, color:IS_C[7], windowColor:IS_W },
  { id:376, side:"israel", position:[2560,0,-800], w:70, h:175, d:70, color:IS_C[0], windowColor:IS_W },
  { id:377, side:"israel", position:[1920,0,400], w:95, h:400, d:95, color:IS_C[1], windowColor:IS_W },
  { id:378, side:"israel", position:[2160,0,600], w:85, h:300, d:85, color:IS_C[2], windowColor:IS_W },
  { id:379, side:"israel", position:[2400,0,360], w:75, h:225, d:75, color:IS_C[3], windowColor:IS_W },
  { id:380, side:"israel", position:[2640,0,500], w:70, h:175, d:70, color:IS_C[4], windowColor:IS_W },
  { id:381, side:"israel", position:[1720,0,800], w:90, h:325, d:90, color:IS_C[5], windowColor:IS_W },
  { id:382, side:"israel", position:[1960,0,1000], w:80, h:250, d:80, color:IS_C[6], windowColor:IS_W },
  { id:383, side:"israel", position:[2200,0,840], w:95, h:350, d:95, color:IS_C[7], windowColor:IS_W },
  { id:384, side:"israel", position:[2440,0,1000], w:85, h:275, d:85, color:IS_C[0], windowColor:IS_W },
  { id:385, side:"israel", position:[2680,0,760], w:75, h:200, d:75, color:IS_C[1], windowColor:IS_W },
  { id:386, side:"israel", position:[1800,0,1400], w:70, h:175, d:70, color:IS_C[2], windowColor:IS_W },
  { id:387, side:"israel", position:[2040,0,1600], w:80, h:225, d:80, color:IS_C[3], windowColor:IS_W },
  { id:388, side:"israel", position:[2300,0,1440], w:90, h:275, d:90, color:IS_C[4], windowColor:IS_W },
  { id:389, side:"israel", position:[2540,0,1280], w:75, h:200, d:75, color:IS_C[5], windowColor:IS_W },
  { id:390, side:"israel", position:[1900,0,2000], w:70, h:150, d:70, color:IS_C[6], windowColor:IS_W },
  { id:391, side:"israel", position:[2140,0,2200], w:80, h:200, d:80, color:IS_C[7], windowColor:IS_W },
  { id:392, side:"israel", position:[2380,0,1960], w:85, h:250, d:85, color:IS_C[0], windowColor:IS_W },
  { id:393, side:"israel", position:[1200,0,-2000], w:90, h:325, d:90, color:IS_C[1], windowColor:IS_W },
  { id:394, side:"israel", position:[1400,0,-2200], w:80, h:275, d:80, color:IS_C[2], windowColor:IS_W },
  { id:395, side:"israel", position:[1600,0,-2100], w:95, h:375, d:95, color:IS_C[3], windowColor:IS_W },
  { id:396, side:"israel", position:[1300,0,-1800], w:85, h:300, d:85, color:IS_C[4], windowColor:IS_W },
  { id:397, side:"israel", position:[1100,0,-1600], w:75, h:250, d:75, color:IS_C[5], windowColor:IS_W },
  { id:398, side:"israel", position:[1000,0,-2400], w:70, h:200, d:70, color:IS_C[6], windowColor:IS_W },
  { id:399, side:"israel", position:[1500,0,-2600], w:80, h:225, d:80, color:IS_C[7], windowColor:IS_W },
  // Extended north/south fill (ids 400–459)
  { id:400, side:"israel", position:[1200,0,-3000], w:90, h:300, d:90, color:IS_C[0], windowColor:IS_W },
  { id:401, side:"israel", position:[1600,0,-3200], w:80, h:260, d:80, color:IS_C[1], windowColor:IS_W },
  { id:402, side:"israel", position:[2000,0,-3100], w:100, h:350, d:100, color:IS_C[2], windowColor:IS_W },
  { id:403, side:"israel", position:[2400,0,-2900], w:75, h:280, d:75, color:IS_C[3], windowColor:IS_W },
  { id:404, side:"israel", position:[1400,0,-3400], w:85, h:220, d:85, color:IS_C[4], windowColor:IS_W },
  { id:405, side:"israel", position:[1800,0,-3600], w:70, h:200, d:70, color:IS_C[5], windowColor:IS_W },
  { id:406, side:"israel", position:[2200,0,-3400], w:90, h:240, d:90, color:IS_C[6], windowColor:IS_W },
  { id:407, side:"israel", position:[2600,0,-3200], w:80, h:180, d:80, color:IS_C[7], windowColor:IS_W },
  { id:408, side:"israel", position:[1000,0,-3200], w:70, h:200, d:70, color:IS_C[0], windowColor:IS_W },
  { id:409, side:"israel", position:[2800,0,-2800], w:85, h:160, d:85, color:IS_C[1], windowColor:IS_W },
  { id:410, side:"israel", position:[1200,0,2800], w:90, h:280, d:90, color:IS_C[2], windowColor:IS_W },
  { id:411, side:"israel", position:[1600,0,3000], w:80, h:240, d:80, color:IS_C[3], windowColor:IS_W },
  { id:412, side:"israel", position:[2000,0,2900], w:100, h:320, d:100, color:IS_C[4], windowColor:IS_W },
  { id:413, side:"israel", position:[2400,0,2700], w:75, h:260, d:75, color:IS_C[5], windowColor:IS_W },
  { id:414, side:"israel", position:[1400,0,3200], w:85, h:200, d:85, color:IS_C[6], windowColor:IS_W },
  { id:415, side:"israel", position:[1800,0,3400], w:70, h:180, d:70, color:IS_C[7], windowColor:IS_W },
  { id:416, side:"israel", position:[2200,0,3200], w:90, h:220, d:90, color:IS_C[0], windowColor:IS_W },
  { id:417, side:"israel", position:[2600,0,3000], w:80, h:160, d:80, color:IS_C[1], windowColor:IS_W },
  { id:418, side:"israel", position:[1000,0,3000], w:70, h:180, d:70, color:IS_C[2], windowColor:IS_W },
  { id:419, side:"israel", position:[2800,0,2600], w:85, h:150, d:85, color:IS_C[3], windowColor:IS_W },
  { id:420, side:"israel", position:[3000,0,-1600], w:90, h:200, d:90, color:IS_C[4], windowColor:IS_W },
  { id:421, side:"israel", position:[3200,0,-800], w:80, h:180, d:80, color:IS_C[5], windowColor:IS_W },
  { id:422, side:"israel", position:[3000,0,0], w:100, h:220, d:100, color:IS_C[6], windowColor:IS_W },
  { id:423, side:"israel", position:[3200,0,800], w:75, h:160, d:75, color:IS_C[7], windowColor:IS_W },
  { id:424, side:"israel", position:[3000,0,1600], w:85, h:180, d:85, color:IS_C[0], windowColor:IS_W },
  { id:425, side:"israel", position:[3400,0,-1200], w:70, h:150, d:70, color:IS_C[1], windowColor:IS_W },
  { id:426, side:"israel", position:[3400,0,400], w:80, h:160, d:80, color:IS_C[2], windowColor:IS_W },
  { id:427, side:"israel", position:[3400,0,1600], w:70, h:140, d:70, color:IS_C[3], windowColor:IS_W },
  { id:428, side:"israel", position:[2600,0,-1200], w:95, h:260, d:95, color:IS_C[4], windowColor:IS_W },
  { id:429, side:"israel", position:[2800,0,400], w:85, h:220, d:85, color:IS_C[5], windowColor:IS_W },
];

// ─── Iran Extended Fill ───────────────────────────────────────────────────────
// Additional buildings covering the expanded map (ids 500–559)
IRAN_BUILDINGS.push(
  { id:500, side:"iran", position:[-1200,0,-3000], w:90, h:300, d:90, color:IC[0] },
  { id:501, side:"iran", position:[-1600,0,-3200], w:80, h:260, d:80, color:IC[1] },
  { id:502, side:"iran", position:[-2000,0,-3100], w:100, h:350, d:100, color:IC[2] },
  { id:503, side:"iran", position:[-2400,0,-2900], w:75, h:280, d:75, color:IC[3] },
  { id:504, side:"iran", position:[-1400,0,-3400], w:85, h:220, d:85, color:IC[4] },
  { id:505, side:"iran", position:[-1800,0,-3600], w:70, h:200, d:70, color:IC[5] },
  { id:506, side:"iran", position:[-2200,0,-3400], w:90, h:240, d:90, color:IC[6] },
  { id:507, side:"iran", position:[-2600,0,-3200], w:80, h:180, d:80, color:IC[7] },
  { id:508, side:"iran", position:[-1000,0,-3200], w:70, h:200, d:70, color:IC[0] },
  { id:509, side:"iran", position:[-2800,0,-2800], w:85, h:160, d:85, color:IC[1] },
  { id:510, side:"iran", position:[-1200,0,2800], w:90, h:280, d:90, color:IC[2] },
  { id:511, side:"iran", position:[-1600,0,3000], w:80, h:240, d:80, color:IC[3] },
  { id:512, side:"iran", position:[-2000,0,2900], w:100, h:320, d:100, color:IC[4] },
  { id:513, side:"iran", position:[-2400,0,2700], w:75, h:260, d:75, color:IC[5] },
  { id:514, side:"iran", position:[-1400,0,3200], w:85, h:200, d:85, color:IC[6] },
  { id:515, side:"iran", position:[-1800,0,3400], w:70, h:180, d:70, color:IC[7] },
  { id:516, side:"iran", position:[-2200,0,3200], w:90, h:220, d:90, color:IC[0] },
  { id:517, side:"iran", position:[-2600,0,3000], w:80, h:160, d:80, color:IC[1] },
  { id:518, side:"iran", position:[-1000,0,3000], w:70, h:180, d:70, color:IC[2] },
  { id:519, side:"iran", position:[-2800,0,2600], w:85, h:150, d:85, color:IC[3] },
  { id:520, side:"iran", position:[-3000,0,-1600], w:90, h:200, d:90, color:IC[4] },
  { id:521, side:"iran", position:[-3200,0,-800], w:80, h:180, d:80, color:IC[5] },
  { id:522, side:"iran", position:[-3000,0,0], w:100, h:220, d:100, color:IC[6] },
  { id:523, side:"iran", position:[-3200,0,800], w:75, h:160, d:75, color:IC[7] },
  { id:524, side:"iran", position:[-3000,0,1600], w:85, h:180, d:85, color:IC[0] },
  { id:525, side:"iran", position:[-3400,0,-1200], w:70, h:150, d:70, color:IC[1] },
  { id:526, side:"iran", position:[-3400,0,400], w:80, h:160, d:80, color:IC[2] },
  { id:527, side:"iran", position:[-3400,0,1600], w:70, h:140, d:70, color:IC[3] },
  { id:528, side:"iran", position:[-2600,0,-1200], w:95, h:260, d:95, color:IC[4] },
  { id:529, side:"iran", position:[-2800,0,400], w:85, h:220, d:85, color:IC[5] },
);

export const ALL_BUILDINGS: BuildingDef[] = [...IRAN_BUILDINGS, ...ISRAEL_BUILDINGS];

// ─── Building Registry (module-level AABB, no React) ─────────────

interface BuildingRecord extends BuildingDef {
  pointValue: number;
  box: THREE.Box3;
}

const BUILDING_REGISTRY: BuildingRecord[] = ALL_BUILDINGS.map(def => ({
  ...def,
  pointValue: Math.max(10, Math.floor(def.h / 10) * 10),
  box: new THREE.Box3(
    new THREE.Vector3(def.position[0] - def.w / 2, 0, def.position[2] - def.d / 2),
    new THREE.Vector3(def.position[0] + def.w / 2, def.h, def.position[2] + def.d / 2)
  ),
}));

// ─── Damage State ─────────────────────────────────────────────────

// Zone-based HP: top/mid/base each have independent structural health
interface BuildingDamageState {
  hp: number;       // overall 0-100
  hpTop: number;    // top third — 0-100
  hpMid: number;    // middle third — 0-100
  hpBase: number;   // bottom third — 0-100
  stage: 0 | 1 | 2 | 3;
  destroyed: boolean;
}

// Module-level damage map — keyed by building id
export const damageMap = new Map<number, BuildingDamageState>();
ALL_BUILDINGS.forEach(b => {
  damageMap.set(b.id, { hp: 100, hpTop: 100, hpMid: 100, hpBase: 100, stage: 0, destroyed: false });
});

// ─── Building visual refs (registered by DamageableBuilding on mount) ────────
// Allows applyDamage to imperatively update materials — zero per-frame polling

interface BuildingVisualRef {
  matRef: React.RefObject<THREE.MeshStandardMaterial | null>;
  groupRef: React.RefObject<THREE.Group | null>;
  setSmoke: (v: boolean) => void;
  setStage: (s: 0|1|2|3) => void;
}

export const buildingRefs = new Map<number, BuildingVisualRef>();

// ─── Spatial grid for fast collision (cell = 200×200 world units) ────────────

const CELL_SIZE = 200;

function _cellKey(x: number, z: number) {
  return `${Math.floor(x / CELL_SIZE)},${Math.floor(z / CELL_SIZE)}`;
}

const _spatialGrid = new Map<string, number[]>(); // key → building ids
const _registryById = new Map<number, BuildingRecord>(); // fast id lookup
for (const b of BUILDING_REGISTRY) {
  _registryById.set(b.id, b);
  const key = _cellKey(b.position[0], b.position[2]);
  if (!_spatialGrid.has(key)) _spatialGrid.set(key, []);
  _spatialGrid.get(key)!.push(b.id);
}

function _nearbyBuildingIds(pos: THREE.Vector3): number[] {
  const ids: number[] = [];
  const cx = Math.floor(pos.x / CELL_SIZE);
  const cz = Math.floor(pos.z / CELL_SIZE);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const cell = _spatialGrid.get(`${cx + dx},${cz + dz}`);
      if (cell) for (const id of cell) ids.push(id);
    }
  }
  return ids;
}

// ─── Score type ───────────────────────────────────────────────────

export interface ScoreState {
  iranDestroyed: number;
  iranPoints: number;
  israelDestroyed: number;
  israelPoints: number;
}

// ─── Projectile ───────────────────────────────────────────────────

interface Projectile {
  id: number;
  type: "bullet" | "bomb";
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  distanceTraveled: number;
  maxRange: number;
  damage: number;
  blastRadius: number;
  active: boolean;
  instanceSlot: number;
}

// ─── Combat constants ─────────────────────────────────────────────

// Fire cooldown in ms — each tier fires faster than the previous
const FIRE_COOLDOWN: Record<PlaneTier, number> = { 1: 280, 2: 160, 3: 90, 4: 45, 5: 900 };
// Damage per hit — higher tiers punch harder
const TIER_DAMAGE:   Record<PlaneTier, number> = { 1: 20,  2: 35,  3: 50,  4: 70,  5: 150 };
// Per-tier bullet speed — higher tiers fire faster rounds
const BULLET_SPEED_TIER: Record<PlaneTier, number> = { 1: 650, 2: 750, 3: 870, 4: 1020, 5: 0 };
const BULLET_RANGE: Record<PlaneTier, number>  = { 1: 900, 2: 1200, 3: 1500, 4: 1900, 5: 0 };
// Per-tier bullet cross-section scale (higher = fatter tracer = more visual weight)
const BULLET_SCALE_TIER: Record<PlaneTier, number> = { 1: 0.7, 2: 0.9, 3: 1.1, 4: 1.35, 5: 1.0 };
const BOMB_BLAST_RADIUS = 35;
const MAX_BULLETS = 80;
const MAX_BOMBS   = 8;

// ─── Helpers ─────────────────────────────────────────────────────

function darkenHex(hex: string, amount: number): string {
  const c = new THREE.Color(hex);
  c.r = Math.max(0, c.r - amount);
  c.g = Math.max(0, c.g - amount);
  c.b = Math.max(0, c.b - amount);
  return `#${c.getHexString()}`;
}

const _zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

function zeroSlot(mesh: THREE.InstancedMesh | null, slot: number) {
  if (!mesh) return;
  mesh.setMatrixAt(slot, _zeroMatrix);
  mesh.instanceMatrix.needsUpdate = true;
}

// ─── applyDamage ──────────────────────────────────────────────────

// hitY = world Y where bullet struck (0 = ground level, rec.h = top)
function applyDamage(
  rec: BuildingRecord,
  dmg: number,
  hitY: number,
  score: React.MutableRefObject<ScoreState>,
  onScoreChange: (s: ScoreState) => void
) {
  const entry = damageMap.get(rec.id);
  if (!entry || entry.destroyed) return;

  // Determine which vertical zone was hit
  const relY = Math.max(0, Math.min(hitY, rec.h)); // clamp to building height
  const zoneT = relY / rec.h; // 0=base, 1=top
  let zone: "top" | "mid" | "base";
  if      (zoneT > 0.66) zone = "top";
  else if (zoneT > 0.33) zone = "mid";
  else                   zone = "base";

  // Apply damage to the struck zone
  if      (zone === "top")  entry.hpTop  = Math.max(0, entry.hpTop  - dmg);
  else if (zone === "mid")  entry.hpMid  = Math.max(0, entry.hpMid  - dmg);
  else                      entry.hpBase = Math.max(0, entry.hpBase - dmg);

  // Overall HP = weighted average — base damage is more structurally severe
  entry.hp = entry.hpTop * 0.25 + entry.hpMid * 0.35 + entry.hpBase * 0.40;

  const prevStage = entry.stage;

  // Cascade: if base collapses the whole building falls
  if (entry.hpBase <= 0 || entry.hp <= 5) {
    entry.hp = 0; entry.hpTop = 0; entry.hpMid = 0; entry.hpBase = 0;
    entry.stage = 3;
    entry.destroyed = true;
    if (rec.side === "iran") {
      score.current.iranDestroyed++;
      score.current.iranPoints += rec.pointValue;
    } else {
      score.current.israelDestroyed++;
      score.current.israelPoints += rec.pointValue;
    }
    onScoreChange({ ...score.current });
  } else if (entry.hpMid <= 20 || entry.hp <= 33) {
    entry.stage = 2;
  } else if (entry.hp <= 66) {
    entry.stage = 1;
  }

  // Always trigger zonal debris at the hit point, even mid-stage
  _applyBuildingVisuals(rec.id, entry.stage, prevStage, rec.color, rec.w, rec.h, rec.d, zone, zoneT);
}

function _applyBuildingVisuals(
  id: number,
  stage: 0|1|2|3,
  prevStage: 0|1|2|3,
  color: string,
  w: number,
  h: number,
  d: number,
  zone: "top"|"mid"|"base",
  zoneT: number
) {
  const refs = buildingRefs.get(id);
  if (!refs) return;
  if (stage !== prevStage) refs.setStage(stage);
  // Always fire debris at hit zone — even without stage change (every bullet makes bricks fly)
  const trigger = debrisTriggers.get(id);
  if (trigger) trigger(stage, w, h, d, zone, zoneT);
  if (stage >= 2) refs.setSmoke(true);
}

// ─── Bomb blast ───────────────────────────────────────────────────

function applyBombBlast(
  bomb: Projectile,
  score: React.MutableRefObject<ScoreState>,
  onScoreChange: (s: ScoreState) => void
) {
  const center = new THREE.Vector3(bomb.position.x, 0, bomb.position.z);
  for (const rec of BUILDING_REGISTRY) {
    const bCenter = new THREE.Vector3(rec.position[0], 0, rec.position[2]);
    const dist = center.distanceTo(bCenter);
    if (dist < bomb.blastRadius) {
      const scaled = bomb.damage * (1 - dist / bomb.blastRadius);
      // Bomb hits at ground level — collapses base
      applyDamage(rec, scaled, 2, score, onScoreChange);
    }
  }
}

// ─── Spawn projectile ─────────────────────────────────────────────

let _nextProjId = 0;

function spawnProjectile(
  plane: THREE.Group,
  tier: PlaneTier,
  projectiles: React.MutableRefObject<Projectile[]>,
  bulletSlots: boolean[],
  bombSlots: boolean[]
): void {
  const isBomb = tier === 5;
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(plane.quaternion);

  let slot = -1;
  const pool = isBomb ? bombSlots : bulletSlots;
  for (let i = 0; i < pool.length; i++) {
    if (!pool[i]) { slot = i; pool[i] = true; break; }
  }
  if (slot === -1) return; // pool exhausted

  const spawnPos = isBomb
    ? plane.position.clone().add(new THREE.Vector3(0, -4, 0))
    : plane.position.clone().addScaledVector(forward, 22);

  const velocity = isBomb
    ? forward.clone().multiplyScalar(50).add(new THREE.Vector3(0, -8, 0))
    : forward.clone().multiplyScalar(BULLET_SPEED_TIER[tier]);

  projectiles.current.push({
    id: _nextProjId++,
    type: isBomb ? "bomb" : "bullet",
    position: spawnPos,
    velocity,
    distanceTraveled: 0,
    maxRange: isBomb ? 800 : BULLET_RANGE[tier],
    damage: TIER_DAMAGE[tier],
    blastRadius: isBomb ? BOMB_BLAST_RADIUS : 0,
    active: true,
    instanceSlot: slot,
  });
}

// ─── useCombatSystem ─────────────────────────────────────────────

function useCombatSystem(
  planeRef: React.RefObject<THREE.Group | null>,
  bulletMeshRef: React.RefObject<THREE.InstancedMesh | null>,
  bombMeshRef: React.RefObject<THREE.InstancedMesh | null>,
  fireQueueRef: React.RefObject<boolean | null>,
  muzzleFlashRef: React.RefObject<THREE.PointLight | null>,
  side: "iran" | "israel",
  tier: PlaneTier,
  onScoreChange: (s: ScoreState) => void,
  onCrash: () => void,
  onFire: () => void
) {
  const projectiles   = useRef<Projectile[]>([]);
  const score         = useRef<ScoreState>({ iranDestroyed: 0, iranPoints: 0, israelDestroyed: 0, israelPoints: 0 });
  const lastFired     = useRef(0);
  const bulletSlots   = useRef<boolean[]>(Array(MAX_BULLETS).fill(false));
  const bombSlots     = useRef<boolean[]>(Array(MAX_BOMBS).fill(false));
  const _pBox         = useRef(new THREE.Box3());
  const _pSize        = new THREE.Vector3(0.6, 0.6, 2.5);
  const _planeBox     = useRef(new THREE.Box3());
  // Tight hitbox — just the fuselage core. Wings clip but don't crash.
  const _planeSize    = new THREE.Vector3(6, 3, 6);
  const crashed       = useRef(false);
  const prevPlanePos  = useRef(new THREE.Vector3());

  void side; // side used for future PvP targeting, available in scope

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const plane = planeRef.current;
    if (!plane) {
      crashed.current = false;
      return;
    }

    const bulletMesh = bulletMeshRef.current;
    const bombMesh   = bombMeshRef.current;

    // ── Plane-building collision: slide/deflect, only crash on hard direct hit ──
    if (!crashed.current) {
      _planeBox.current.setFromCenterAndSize(plane.position, _planeSize);
      for (const id of _nearbyBuildingIds(plane.position)) {
        const rec = _registryById.get(id);
        const entry = damageMap.get(rec?.id ?? -1);
        if (!rec || entry?.destroyed) continue;
        if (!rec.box.intersectsBox(_planeBox.current)) continue;

        // Compute overlap depth on each axis to find smallest push axis
        const bMin = rec.box.min, bMax = rec.box.max;
        const pp = plane.position;
        const overlapX = Math.min(pp.x - bMin.x, bMax.x - pp.x);
        const overlapY = Math.min(pp.y - bMin.y, bMax.y - pp.y);
        const overlapZ = Math.min(pp.z - bMin.z, bMax.z - pp.z);

        // Penetration speed — how fast were we moving into the building last frame
        const moveDir = pp.clone().sub(prevPlanePos.current);
        const speed = moveDir.length() / dt;

        if (speed > 220) {
          // High-speed direct impact → crash
          crashed.current = true;
          onCrash();
          break;
        } else {
          // Soft collision → push plane out on smallest overlap axis
          const minOverlap = Math.min(Math.abs(overlapX), Math.abs(overlapY), Math.abs(overlapZ));
          if (minOverlap === Math.abs(overlapY)) {
            plane.position.y += pp.y < (bMin.y + bMax.y) / 2 ? -(overlapY + 4) : (overlapY + 4);
          } else if (minOverlap === Math.abs(overlapX)) {
            plane.position.x += pp.x < (bMin.x + bMax.x) / 2 ? -(overlapX + 4) : (overlapX + 4);
          } else {
            plane.position.z += pp.z < (bMin.z + bMax.z) / 2 ? -(overlapZ + 4) : (overlapZ + 4);
          }
          break;
        }
      }
      prevPlanePos.current.copy(plane.position);
    }

    // ── Fire ────────────────────────────────────────────────────
    const nowMs = clock.getElapsedTime() * 1000;
    if (fireQueueRef.current && nowMs - lastFired.current >= FIRE_COOLDOWN[tier]) {
      fireQueueRef.current = false;
      lastFired.current = nowMs;
      spawnProjectile(plane, tier, projectiles, bulletSlots.current, bombSlots.current);
      // Muzzle flash — snap to plane position then spike intensity
      const flash = muzzleFlashRef.current;
      if (flash) {
        flash.position.copy(plane.position);
        flash.intensity = 55 + tier * 18;
        setTimeout(() => { if (flash) flash.intensity = 0; }, 40);
      }
      onFire();
    }

    // ── Update projectiles ──────────────────────────────────────
    const _mat = new THREE.Matrix4();
    const _quat = new THREE.Quaternion();

    for (const p of projectiles.current) {
      if (!p.active) continue;

      if (p.type === "bomb") {
        p.velocity.y -= 98 * dt; // gravity
      }

      p.position.addScaledVector(p.velocity, dt);
      p.distanceTraveled += p.velocity.length() * dt;

      // Despawn conditions
      if (p.distanceTraveled > p.maxRange || p.position.y < -5) {
        if (p.type === "bomb" && p.position.y <= 0) {
          applyBombBlast(p, score, onScoreChange);
        }
        p.active = false;
        const pool = p.type === "bullet" ? bulletSlots.current : bombSlots.current;
        pool[p.instanceSlot] = false;
        const mesh = p.type === "bullet" ? bulletMesh : bombMesh;
        zeroSlot(mesh, p.instanceSlot);
        continue;
      }

      // Bullet AABB hit test — spatial grid reduces checks from 302 → ~10-20
      if (p.type === "bullet") {
        _pBox.current.setFromCenterAndSize(p.position, _pSize);
        let hit = false;
        for (const id of _nearbyBuildingIds(p.position)) {
          const rec = _registryById.get(id);
          if (rec && rec.box.intersectsBox(_pBox.current)) {
            // Hit Y relative to building base — used for zonal physics crumble
            const hitY = p.position.y - rec.position[1];
            applyDamage(rec, p.damage, hitY, score, onScoreChange);
            p.active = false;
            bulletSlots.current[p.instanceSlot] = false;
            zeroSlot(bulletMesh, p.instanceSlot);
            hit = true;
            break;
          }
        }
        if (hit) continue;
      }

      // Update instance matrix
      const mesh = p.type === "bullet" ? bulletMesh : bombMesh;
      if (mesh) {
        // Orient bullet along velocity
        if (p.velocity.lengthSq() > 0.01) {
          const dir = p.velocity.clone().normalize();
          _quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        }
        // Scale tracer by tier — higher tier = fatter, more visible round
        const bs = p.type === "bullet" ? BULLET_SCALE_TIER[tier] : 1.0;
        _mat.compose(p.position, _quat, new THREE.Vector3(bs, bs, bs));
        mesh.setMatrixAt(p.instanceSlot, _mat);
        mesh.instanceMatrix.needsUpdate = true;
      }
    }

    // Prune inactive projectiles when list gets large
    if (projectiles.current.length > 80) {
      projectiles.current = projectiles.current.filter(p => p.active);
    }
  });
}

// ─── CombatLayer (R3F component, goes inside Canvas) ─────────────

export interface CombatLayerProps {
  planeRef: React.RefObject<THREE.Group | null>;
  fireQueueRef: React.RefObject<boolean | null>;
  side: "iran" | "israel";
  tier: PlaneTier;
  onScoreChange: (s: ScoreState) => void;
  onCrash: () => void;
  onFire: () => void;
}

export function CombatLayer({ planeRef, fireQueueRef, side, tier, onScoreChange, onCrash, onFire }: CombatLayerProps) {
  const bulletMeshRef  = useRef<THREE.InstancedMesh>(null);
  const bombMeshRef    = useRef<THREE.InstancedMesh>(null);
  const muzzleFlashRef = useRef<THREE.PointLight | null>(null);

  useCombatSystem(planeRef, bulletMeshRef, bombMeshRef, fireQueueRef, muzzleFlashRef, side, tier, onScoreChange, onCrash, onFire);

  const bulletColor  = side === "iran" ? "#ff6600" : "#88ccff";
  const muzzleColor  = side === "iran" ? "#ffaa00" : "#aaddff";

  return (
    <>
      {/* Muzzle flash — positioned via useCombatSystem when fired */}
      <pointLight
        ref={muzzleFlashRef}
        color={muzzleColor}
        intensity={0}
        distance={90}
        decay={2}
      />

      {/* Bullet pool — elongated tracer rod, highly emissive */}
      <instancedMesh ref={bulletMeshRef} args={[undefined, undefined, MAX_BULLETS]} frustumCulled={false}>
        <boxGeometry args={[0.28, 0.28, 3.6]} />
        <meshStandardMaterial
          color={bulletColor}
          emissive={bulletColor}
          emissiveIntensity={8}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Bomb pool */}
      <instancedMesh ref={bombMeshRef} args={[undefined, undefined, MAX_BOMBS]} frustumCulled={false}>
        <boxGeometry args={[1.2, 2.0, 1.2]} />
        <meshStandardMaterial
          color="#1a1a2a"
          emissive="#443300"
          emissiveIntensity={0.8}
        />
      </instancedMesh>
    </>
  );
}

// ─── DamageableBuilding ───────────────────────────────────────────

interface DamageableBuildingProps {
  def: BuildingDef;
}

export function DamageableBuilding({ def }: DamageableBuildingProps) {
  const groupRef   = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const [showSmoke, setShowSmoke]   = useState(false);
  const [stage, setStage]           = useState<0|1|2|3>(0);

  const debrisTriggerRef = useRef<(stage: number, w: number, h: number, d: number, zone: "top"|"mid"|"base", zoneT: number) => void>(null!);

  useEffect(() => {
    buildingRefs.set(def.id, {
      matRef:   bodyMatRef as React.RefObject<THREE.MeshStandardMaterial>,
      groupRef: groupRef   as React.RefObject<THREE.Group>,
      setSmoke: setShowSmoke,
      setStage: setStage as (s: 0|1|2|3) => void,
    });
    debrisTriggers.set(def.id, (s, w, h, d, zone, zoneT) => {
      if (debrisTriggerRef.current) debrisTriggerRef.current(s, w, h, d, zone, zoneT);
    });
    return () => {
      buildingRefs.delete(def.id);
      debrisTriggers.delete(def.id);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.id]);

  return (
    <group ref={groupRef}>
      {/* Hide the original building at stage 3 — DamageHoles renders the stump */}
      {stage < 3 && (
        <Building
          position={def.position}
          w={def.w}
          h={def.h}
          d={def.d}
          color={def.color}
          windowColor={def.windowColor}
          bodyMatRef={bodyMatRef}
        />
      )}
      <DamageHoles
        position={def.position}
        w={def.w}
        h={def.h}
        d={def.d}
        stage={stage}
        id={def.id}
      />
      {showSmoke && <SmokeOverlay position={def.position} h={def.h} />}
      <BuildingDebris
        position={def.position}
        color={def.color}
        triggerRef={debrisTriggerRef}
      />
    </group>
  );
}

// ─── SmokeOverlay ─────────────────────────────────────────────────

function SmokeOverlay({ position, h }: { position: [number, number, number]; h: number }) {
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[1.5, h * 0.6, 0.5]}>
        <boxGeometry args={[3.5, 5, 3.5]} />
        <meshStandardMaterial color="#0a0a0a" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[-1.8, h * 0.72, -0.5]}>
        <boxGeometry args={[2.8, 4, 2.8]} />
        <meshStandardMaterial color="#141414" transparent opacity={0.45} depthWrite={false} />
      </mesh>
      <mesh position={[0.5, h * 0.85, 1.0]}>
        <boxGeometry args={[2.2, 3.5, 2.2]} />
        <meshStandardMaterial color="#1a1010" transparent opacity={0.38} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── DamageHoles — dark recessed voids that appear on the building ───
// Seeded positions so each building has a deterministic hole pattern

function seededRand(seed: number) {
  // Simple LCG
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

interface DamageHolesProps {
  position: [number, number, number];
  w: number; h: number; d: number;
  stage: 0|1|2|3;
  id: number;
}

// Helper: punch a hole at a specific Y range on the building facade
function makeHoles(
  rand: () => number,
  px: number, pz: number,
  w: number, h: number, d: number,
  baseY: number, topY: number,   // Y range within which holes can appear
  count: number,
  stage: number,
  keyPrefix: string
): React.ReactElement[] {
  const holes: React.ReactElement[] = [];
  const rangeH = topY - baseY;
  if (rangeH < 2) return holes;

  for (let i = 0; i < count; i++) {
    const face = Math.floor(rand() * 4);
    const holeW = 2 + rand() * (stage === 3 ? 8 : 5);
    const holeH = 2 + rand() * (stage === 3 ? 10 : 6);

    // Vertical position within the zone
    const hy = baseY + holeH / 2 + rand() * Math.max(0, rangeH - holeH);
    const depth = 2 + rand() * 3;

    let hx = 0, hz = 0;
    const rotation: [number, number, number] = face <= 1 ? [0, 0, 0] : [0, Math.PI / 2, 0];
    if (face === 0) {
      hx = px + (rand() - 0.5) * (w - holeW - 1);
      hz = pz + d / 2 - 0.3;
    } else if (face === 1) {
      hx = px + (rand() - 0.5) * (w - holeW - 1);
      hz = pz - d / 2 + 0.3;
    } else if (face === 2) {
      hx = px - w / 2 + 0.3;
      hz = pz + (rand() - 0.5) * (d - holeW - 1);
    } else {
      hx = px + w / 2 - 0.3;
      hz = pz + (rand() - 0.5) * (d - holeW - 1);
    }

    const holeSize: [number, number, number] = [
      face <= 1 ? holeW : depth,
      holeH,
      face <= 1 ? depth : holeW,
    ];

    holes.push(
      <mesh key={`${keyPrefix}h${i}`} position={[hx, hy, hz]} rotation={rotation}>
        <boxGeometry args={holeSize} />
        <meshStandardMaterial color="#0d0a08" roughness={1} />
      </mesh>
    );
    // Exposed twisted rebar stub
    if (rand() < 0.55) {
      const rx = hx + (rand() - 0.5) * holeW * 0.4;
      const ry = hy + (rand() - 0.5) * holeH * 0.4;
      const rlen = 1.5 + rand() * 4;
      holes.push(
        <mesh key={`${keyPrefix}rb${i}`} position={[rx, ry, hz]}
          rotation={[rand() * 0.5, rand() * Math.PI, rand() * 0.5]}>
          <boxGeometry args={[0.3 + rand() * 0.4, rlen, 0.3 + rand() * 0.4]} />
          <meshStandardMaterial color="#1a1410" metalness={0.5} roughness={0.6} />
        </mesh>
      );
    }
    // Dangling broken floor slab visible through hole
    if (rand() < 0.35 && holeH > 4) {
      holes.push(
        <mesh key={`${keyPrefix}sl${i}`} position={[hx, hy + holeH * 0.35, hz + (face <= 1 ? -depth * 0.6 : 0)]}
          rotation={[rand() * 0.3 - 0.15, 0, rand() * 0.3 - 0.15]}>
          <boxGeometry args={[holeW * 0.9, 0.8 + rand() * 0.6, depth * 0.7]} />
          <meshStandardMaterial color="#2a2420" roughness={1} />
        </mesh>
      );
    }
  }
  return holes;
}

function DamageHoles({ position, w, h, d, stage, id }: DamageHolesProps) {
  if (stage === 0) return null;

  const rand = seededRand(id * 7919);
  const px = position[0], pz = position[2];

  // ── STAGE 3: Full structural collapse ─────────────────────────
  if (stage === 3) {
    // Determine collapse style based on which zone took lethal damage
    const entry = damageMap.get(id);
    const baseKilled  = entry ? entry.hpBase <= 0 : false;
    const midKilled   = entry ? entry.hpMid  <= 0 : false;

    if (baseKilled) {
      // BASE COLLAPSE: full pancake — building crumbles straight down
      const rubbleH = h * 0.12; // almost flat pile
      const rubbleElements: React.ReactElement[] = [];
      // Main compressed rubble slab
      rubbleElements.push(
        <mesh key="pancake" position={[px, rubbleH / 2, pz]}>
          <boxGeometry args={[w * 1.3, rubbleH, d * 1.3]} />
          <meshStandardMaterial color="#2a2420" roughness={1} />
        </mesh>
      );
      // Scattered large slabs that slid outward
      for (let si = 0; si < 12; si++) {
        const sr = seededRand(id + si * 37);
        const angle = sr() * Math.PI * 2;
        const dist  = w * 0.5 + sr() * w * 0.8;
        const slabW = 3 + sr() * (w * 0.4);
        const slabH = 0.8 + sr() * 3;
        rubbleElements.push(
          <mesh key={`slab${si}`}
            position={[px + Math.cos(angle) * dist, slabH / 2, pz + Math.sin(angle) * dist]}
            rotation={[sr() * 0.4, sr() * Math.PI, sr() * 0.4]}>
            <boxGeometry args={[slabW, slabH, slabW * (0.4 + sr() * 0.6)]} />
            <meshStandardMaterial color="#2e2820" roughness={1} />
          </mesh>
        );
      }
      return <group>{rubbleElements}</group>;
    } else if (midKilled) {
      // MID COLLAPSE: building snaps at mid-point — top half tilts/falls
      const bottomH = h * 0.5;
      const topH    = h * 0.5;
      const tiltAng = (seededRand(id)() - 0.5) * 0.6; // tilt direction
      return (
        <group>
          {/* Standing lower half */}
          <mesh position={[px, bottomH / 2, pz]}>
            <boxGeometry args={[w, bottomH, d]} />
            <meshStandardMaterial color="#2a2420" roughness={1} />
          </mesh>
          {/* Cracked top — tilted/fallen */}
          <mesh position={[px + Math.sin(tiltAng) * topH * 0.5, bottomH + topH * 0.35, pz]}
            rotation={[0, 0, tiltAng]}>
            <boxGeometry args={[w * 0.9, topH, d * 0.9]} />
            <meshStandardMaterial color="#1e1a16" roughness={1} />
          </mesh>
          {/* Rubble at snap point */}
          {Array.from({ length: 8 }, (_, ri) => {
            const r = seededRand(id + ri * 19);
            return (
              <mesh key={`mi${ri}`}
                position={[px + (r() - 0.5) * w * 1.2, bottomH - 1 + r() * 4, pz + (r() - 0.5) * d * 1.2]}
                rotation={[r() * 0.8, r() * Math.PI, r() * 0.8]}>
                <boxGeometry args={[2 + r() * 5, 1 + r() * 3, 2 + r() * 4]} />
                <meshStandardMaterial color="#2e2820" roughness={1} />
              </mesh>
            );
          })}
        </group>
      );
    } else {
      // TOP COLLAPSE: upper floors blown off, lower body intact with jagged top
      const stumpH = h * 0.45;
      return (
        <group>
          <mesh position={[px, stumpH / 2, pz]}>
            <boxGeometry args={[w, stumpH, d]} />
            <meshStandardMaterial color="#2a2420" roughness={1} />
          </mesh>
          {/* Jagged broken parapet */}
          {Array.from({ length: 8 }, (_, ji) => {
            const jx = px + (seededRand(id + ji * 13)() - 0.5) * (w * 0.75);
            const jz = pz + (seededRand(id + ji * 17)() - 0.5) * (d * 0.75);
            const jh = stumpH + seededRand(id + ji * 5)() * h * 0.12;
            const jw = 3 + seededRand(id + ji * 3)() * 6;
            return (
              <mesh key={`top${ji}`} position={[jx, jh, jz]}>
                <boxGeometry args={[jw, 3 + seededRand(id + ji)() * 6, jw * 0.7]} />
                <meshStandardMaterial color="#1e1a16" roughness={1} />
              </mesh>
            );
          })}
          {/* Scattered upper debris around base */}
          {Array.from({ length: 10 }, (_, ri) => {
            const r = seededRand(id + ri * 11);
            return (
              <mesh key={`rb${ri}`}
                position={[px + (r() - 0.5) * w * 1.4, 0.6 + r() * 1.5, pz + (r() - 0.5) * d * 1.4]}
                rotation={[r() * 0.8, r() * Math.PI, r() * 0.6]}>
                <boxGeometry args={[1.5 + r() * 4, 0.8 + r() * 2, 1.5 + r() * 3.5]} />
                <meshStandardMaterial color="#2e2820" roughness={1} />
              </mesh>
            );
          })}
          {makeHoles(rand, px, pz, w, h, d, 0, stumpH, 8, stage, "tp")}
        </group>
      );
    }
  }

  // ── STAGES 1 & 2: Zonal blast holes in the correct section ─────
  const holes: React.ReactElement[] = [];
  const entry = damageMap.get(id);

  // Holes in whichever zones have taken damage
  if (entry && entry.hpTop < 90) {
    const topCount = Math.floor((1 - entry.hpTop / 100) * 6) + 1;
    holes.push(...makeHoles(rand, px, pz, w, h, d, h * 0.66, h, topCount, stage, "t"));
  }
  if (entry && entry.hpMid < 90) {
    const midCount = Math.floor((1 - entry.hpMid / 100) * 6) + 1;
    holes.push(...makeHoles(rand, px, pz, w, h, d, h * 0.33, h * 0.66, midCount, stage, "m"));
  }
  if (entry && entry.hpBase < 90) {
    const baseCount = Math.floor((1 - entry.hpBase / 100) * 6) + 1;
    holes.push(...makeHoles(rand, px, pz, w, h, d, 0, h * 0.33, baseCount, stage, "b"));
  }

  return <group>{holes}</group>;
}

// ─── BuildingDebris — fine tumbling pixel chunks with 4 material types ──

const DEBRIS_CAP = 128; // per material type

// Debris material types
// 0 = building facade colour (painted concrete)
// 1 = raw concrete / dark interior
// 2 = rebar rod (thin elongated dark metal)
// 3 = glass shard (thin, bright, blue-tinted)
// 4 = brick / mortar dust (classic rectangular brick proportions)
interface DebrisParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  axis: THREE.Vector3;
  spin: number;
  angle: number;
  // Explicit per-axis scale so slabs, rods, shards look distinct
  sx: number; sy: number; sz: number;
  life: number;
  maxLife: number;
  kind: 0 | 1 | 2 | 3 | 4;
}

interface BuildingDebrisProps {
  position: [number, number, number];
  color: string;
  triggerRef: React.MutableRefObject<(stage: number, w: number, h: number, d: number, zone: "top"|"mid"|"base", zoneT: number) => void>;
}

function BuildingDebris({ position, color, triggerRef }: BuildingDebrisProps) {
  const meshFacade  = useRef<THREE.InstancedMesh>(null);
  const meshConcrete= useRef<THREE.InstancedMesh>(null);
  const meshRebar   = useRef<THREE.InstancedMesh>(null);
  const meshGlass   = useRef<THREE.InstancedMesh>(null);
  const meshBrick   = useRef<THREE.InstancedMesh>(null);
  const particles   = useRef<DebrisParticle[]>([]);
  const hasActive   = useRef(false);

  triggerRef.current = (stage: number, w: number, h: number, d: number, zone: "top"|"mid"|"base", zoneT: number) => {
    // Particle count: full collapse = more, single-zone hit = fewer but always some
    const isFullCollapse = stage === 3;
    const count = isFullCollapse ? 120 : stage === 2 ? 60 : 28;
    const px = position[0], pz = position[2];

    const face = Math.floor(Math.random() * 4);
    const fx = face === 2 ? -w / 2 : face === 3 ? w / 2 : 0;
    const fz = face === 0 ? d / 2  : face === 1 ? -d / 2 : 0;

    // Spawn height centred on the hit zone — this is the key physics realism fix:
    // top hit → debris at top, base hit → debris at bottom
    const zoneBaseY = zoneT > 0.66 ? h * 0.66 : zoneT > 0.33 ? h * 0.33 : 0;
    const zoneSpan  = isFullCollapse ? h : h / 3;

    for (let i = 0; i < count; i++) {
      const spreadX = face < 2 ? (Math.random() - 0.5) * w * 0.95 : (Math.random() - 0.5) * 1.5;
      const spreadZ = face >= 2 ? (Math.random() - 0.5) * d * 0.95 : (Math.random() - 0.5) * 1.5;
      // Spawn within the struck zone's vertical range
      const ry = zoneBaseY + 2 + Math.random() * (zoneSpan - 2);

      const outX = fx !== 0 ? (fx / Math.abs(fx)) * (15 + Math.random() * 45) : (Math.random() - 0.5) * 30;
      const outZ = fz !== 0 ? (fz / Math.abs(fz)) * (15 + Math.random() * 45) : (Math.random() - 0.5) * 30;
      const lateralX = face < 2 ? (Math.random() - 0.5) * 35 : outX;
      const lateralZ = face >= 2 ? (Math.random() - 0.5) * 35 : outZ;
      // Physics: top-zone hits → high arc; base hits → mostly outward + some downward cascade
      const upward = zone === "top"
        ? 20 + Math.random() * 60          // top bricks fly high
        : zone === "mid"
          ? 8 + Math.random() * 40         // mid bricks moderate arc
          : -5 + Math.random() * 30;       // base bricks: some go down (pancake), some out

      // Determine chunk type — weighted distribution
      const roll = Math.random();
      let kind: 0|1|2|3|4;
      if      (roll < 0.30) kind = 0; // facade colour
      else if (roll < 0.55) kind = 4; // brick/mortar
      else if (roll < 0.75) kind = 1; // concrete
      else if (roll < 0.88) kind = 2; // rebar rod
      else                  kind = 3; // glass shard

      // Per-kind size — very fine granularity
      let sx = 1, sy = 1, sz = 1;
      if (kind === 0) {
        // Painted facade: flat-ish tiles and brick chips, 3 sub-sizes
        const r = Math.random();
        if (r < 0.50) {
          // Fine chip: ~0.18–0.35
          const b = 0.18 + Math.random() * 0.17;
          sx = b; sy = b * (0.4 + Math.random() * 0.4); sz = b;
        } else if (r < 0.82) {
          // Medium slab: ~0.4–0.75
          const b = 0.4 + Math.random() * 0.35;
          sx = b; sy = b * (0.25 + Math.random() * 0.35); sz = b * (0.6 + Math.random() * 0.5);
        } else {
          // Large facade chunk: ~0.8–1.3
          const b = 0.8 + Math.random() * 0.5;
          sx = b; sy = b * (0.2 + Math.random() * 0.3); sz = b * (0.7 + Math.random() * 0.6);
        }
      } else if (kind === 1) {
        // Raw concrete: blockier, more cubic
        const b = 0.22 + Math.random() * 0.55;
        sx = b * (0.7 + Math.random() * 0.6);
        sy = b * (0.7 + Math.random() * 0.6);
        sz = b * (0.7 + Math.random() * 0.6);
      } else if (kind === 2) {
        // Rebar rod: very thin, long
        const len = 0.8 + Math.random() * 1.4;
        const thick = 0.04 + Math.random() * 0.07;
        sx = thick; sy = len; sz = thick;
      } else if (kind === 3) {
        // Glass shard: thin flat triangular-ish sliver
        const w2 = 0.12 + Math.random() * 0.35;
        const h2 = 0.35 + Math.random() * 0.6;
        sx = w2; sy = h2; sz = 0.03 + Math.random() * 0.04;
      } else {
        // Brick-shaped: rectangular, 2:1:0.5 ratio (classic brick proportions)
        const brickLen = 0.35 + Math.random() * 0.45; // 35-80 units scaled
        sx = brickLen * 2.0; sy = brickLen; sz = brickLen * 0.5;
      }

      const life = kind === 3
        ? 0.9 + Math.random() * 0.8   // glass disappears faster
        : kind === 2
          ? 2.2 + Math.random() * 1.0 // rebar stays longer
          : 1.4 + Math.random() * 1.4;

      particles.current.push({
        pos: new THREE.Vector3(px + fx + spreadX, ry, pz + fz + spreadZ),
        vel: new THREE.Vector3(lateralX, upward, lateralZ),
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        spin: kind === 3
          ? (Math.random() - 0.5) * 18 // glass spins fast
          : kind === 2
            ? (Math.random() - 0.5) * 5 // rebar spins slow
            : (Math.random() - 0.5) * 10,
        angle: Math.random() * Math.PI * 2,
        sx, sy, sz,
        life,
        maxLife: life,
        kind,
      });
    }
    // Keep newest — cap total pool
    if (particles.current.length > DEBRIS_CAP * 4) {
      particles.current = particles.current.slice(-DEBRIS_CAP * 4);
    }
    hasActive.current = true;
  };

  const _mat  = useRef(new THREE.Matrix4());
  const _q    = useRef(new THREE.Quaternion());
  const _axis = useRef(new THREE.Vector3());
  const _sc   = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!hasActive.current) return;
    const mF = meshFacade.current;
    const mC = meshConcrete.current;
    const mR = meshRebar.current;
    const mG = meshGlass.current;
    const mB = meshBrick.current;
    if (!mF || !mC || !mR || !mG || !mB) return;
    const dt = Math.min(delta, 0.05);

    let fi = 0, ci = 0, ri = 0, gi = 0, bi = 0, anyAlive = false;

    for (const p of particles.current) {
      if (p.life <= 0) continue;

      p.vel.y -= 55 * dt;
      p.pos.addScaledVector(p.vel, dt);
      if (p.pos.y < 0) {
        p.pos.y = 0;
        p.vel.y *= -0.15;
        p.vel.x *= 0.5;
        p.vel.z *= 0.5;
        p.spin  *= 0.3;
      }
      p.angle += p.spin * dt;
      p.life  -= dt;

      const t = Math.max(0, p.life / p.maxLife);
      // Glass fades in last 50%, others last 25%
      const shrinkThreshold = p.kind === 3 ? 0.5 : 0.25;
      const scale = t < shrinkThreshold ? t / shrinkThreshold : 1.0;
      _sc.current.set(p.sx * scale, p.sy * scale, p.sz * scale);
      _axis.current.copy(p.axis);
      _q.current.setFromAxisAngle(_axis.current, p.angle);
      _mat.current.compose(p.pos, _q.current, _sc.current);

      if      (p.kind === 0 && fi < DEBRIS_CAP) { mF.setMatrixAt(fi++, _mat.current); }
      else if (p.kind === 1 && ci < DEBRIS_CAP) { mC.setMatrixAt(ci++, _mat.current); }
      else if (p.kind === 2 && ri < DEBRIS_CAP) { mR.setMatrixAt(ri++, _mat.current); }
      else if (p.kind === 3 && gi < DEBRIS_CAP) { mG.setMatrixAt(gi++, _mat.current); }
      else if (p.kind === 4 && bi < DEBRIS_CAP) { mB.setMatrixAt(bi++, _mat.current); }
      anyAlive = true;
    }

    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = fi; i < DEBRIS_CAP; i++) mF.setMatrixAt(i, zero);
    for (let i = ci; i < DEBRIS_CAP; i++) mC.setMatrixAt(i, zero);
    for (let i = ri; i < DEBRIS_CAP; i++) mR.setMatrixAt(i, zero);
    for (let i = gi; i < DEBRIS_CAP; i++) mG.setMatrixAt(i, zero);
    for (let i = bi; i < DEBRIS_CAP; i++) mB.setMatrixAt(i, zero);
    mF.instanceMatrix.needsUpdate = true;
    mC.instanceMatrix.needsUpdate = true;
    mR.instanceMatrix.needsUpdate = true;
    mG.instanceMatrix.needsUpdate = true;
    mB.instanceMatrix.needsUpdate = true;
    hasActive.current = anyAlive;

    if (!anyAlive) particles.current = [];
  });

  return (
    <>
      {/* Facade — painted surface colour */}
      <instancedMesh ref={meshFacade} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </instancedMesh>
      {/* Raw concrete — dark grey */}
      <instancedMesh ref={meshConcrete} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a3530" roughness={0.95} />
      </instancedMesh>
      {/* Rebar — thin dark metallic rods */}
      <instancedMesh ref={meshRebar} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1510" roughness={0.6} metalness={0.7} />
      </instancedMesh>
      {/* Glass shards — bright slightly emissive */}
      <instancedMesh ref={meshGlass} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#c8e4ff"
          emissive="#88bbee"
          emissiveIntensity={0.6}
          transparent
          opacity={0.75}
          roughness={0.05}
          metalness={0.1}
          depthWrite={false}
        />
      </instancedMesh>
      {/* Brick chunks — classic rectangular brick proportions */}
      <instancedMesh ref={meshBrick} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </instancedMesh>
    </>
  );
}

// Module-level map so _applyBuildingVisuals can trigger debris directly
export const debrisTriggers = new Map<number, (stage: number, w: number, h: number, d: number, zone: "top"|"mid"|"base", zoneT: number) => void>();
