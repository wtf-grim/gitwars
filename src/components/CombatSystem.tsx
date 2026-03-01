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
  { id:0,  side:"iran", position:[-780,0,-1280], w:36, h:220, d:36, color:IC[0] },
  { id:1,  side:"iran", position:[-860,0,-1200], w:30, h:190, d:30, color:IC[1] },
  { id:2,  side:"iran", position:[-930,0,-1310], w:34, h:200, d:34, color:IC[2] },
  { id:3,  side:"iran", position:[-1020,0,-1240], w:40, h:156, d:36, color:IC[3] },
  { id:4,  side:"iran", position:[-716,0,-1350], w:26, h:130, d:28, color:IC[0] },
  { id:5,  side:"iran", position:[-1096,0,-1180], w:32, h:176, d:32, color:IC[4] },
  { id:6,  side:"iran", position:[-676,0,-1230], w:28, h:144, d:28, color:IC[2] },
  { id:7,  side:"iran", position:[-810,0,-1360], w:24, h:116, d:28, color:IC[6] },
  { id:8,  side:"iran", position:[-910,0,-1096], w:32, h:128, d:32, color:IC[7] },
  { id:9,  side:"iran", position:[-1180,0,-1084], w:44, h:108, d:40, color:IC[5] },
  { id:10, side:"iran", position:[-1244,0,-1304], w:44, h:104, d:40, color:IC[7] },
  { id:11, side:"iran", position:[-960,0,-1136], w:28, h:96, d:28, color:IC[0] },
  { id:12, side:"iran", position:[-1124,0,-1270], w:30, h:84, d:30, color:IC[3] },
  { id:13, side:"iran", position:[-1360,0,-1216], w:40, h:92, d:36, color:IC[6] },
  { id:14, side:"iran", position:[-1436,0,-1320], w:32, h:76, d:32, color:IC[1] },
  { id:15, side:"iran", position:[-1484,0,-1160], w:36, h:84, d:32, color:IC[4] },
  { id:16, side:"iran", position:[-616,0,-1116], w:24, h:76, d:24, color:IC[2] },
  { id:17, side:"iran", position:[-536,0,-1256], w:26, h:64, d:24, color:IC[0] },
  { id:18, side:"iran", position:[-556,0,-1100], w:24, h:56, d:22, color:IC[5] },
  { id:19, side:"iran", position:[-1516,0,-1380], w:32, h:60, d:32, color:IC[1] },
  { id:20, side:"iran", position:[-1620,0,-1260], w:40, h:72, d:36, color:IC[3] },
  { id:21, side:"iran", position:[-1680,0,-1140], w:36, h:60, d:32, color:IC[5] },
  { id:22, side:"iran", position:[-1740,0,-1300], w:32, h:52, d:30, color:IC[7] },
  { id:23, side:"iran", position:[-700,0,-1180], w:26, h:88, d:26, color:IC[4] },
  { id:24, side:"iran", position:[-836,0,-1110], w:28, h:104, d:28, color:IC[3] },
  { id:25, side:"iran", position:[-980,0,-1300], w:32, h:72, d:28, color:IC[5] },
  { id:26, side:"iran", position:[-1280,0,-1090], w:28, h:68, d:28, color:IC[2] },
  { id:27, side:"iran", position:[-1400,0,-1090], w:26, h:80, d:26, color:IC[0] },
  { id:28, side:"iran", position:[-1520,0,-1040], w:36, h:60, d:32, color:IC[6] },
  { id:29, side:"iran", position:[-1640,0,-1390], w:30, h:44, d:28, color:IC[1] },
  // Midtown Z: -540 to 0
  { id:30, side:"iran", position:[-780,0,-880], w:36, h:200, d:36, color:IC[0] },
  { id:31, side:"iran", position:[-860,0,-800], w:30, h:164, d:30, color:IC[1] },
  { id:32, side:"iran", position:[-930,0,-900], w:34, h:180, d:34, color:IC[2] },
  { id:33, side:"iran", position:[-1020,0,-836], w:40, h:136, d:36, color:IC[3] },
  { id:34, side:"iran", position:[-716,0,-944], w:26, h:112, d:28, color:IC[0] },
  { id:35, side:"iran", position:[-1096,0,-776], w:32, h:150, d:32, color:IC[4] },
  { id:36, side:"iran", position:[-676,0,-830], w:28, h:124, d:28, color:IC[2] },
  { id:37, side:"iran", position:[-810,0,-950], w:24, h:96, d:28, color:IC[6] },
  { id:38, side:"iran", position:[-910,0,-696], w:32, h:108, d:32, color:IC[7] },
  { id:39, side:"iran", position:[-1180,0,-684], w:44, h:88, d:40, color:IC[5] },
  { id:40, side:"iran", position:[-1084,0,-556], w:32, h:76, d:32, color:IC[1] },
  { id:41, side:"iran", position:[-884,0,-516], w:30, h:64, d:32, color:IC[3] },
  { id:42, side:"iran", position:[-744,0,-576], w:36, h:72, d:30, color:IC[6] },
  { id:43, side:"iran", position:[-964,0,-616], w:28, h:60, d:28, color:IC[0] },
  { id:44, side:"iran", position:[-1244,0,-904], w:44, h:84, d:40, color:IC[7] },
  { id:45, side:"iran", position:[-1310,0,-636], w:36, h:68, d:32, color:IC[4] },
  { id:46, side:"iran", position:[-616,0,-716], w:24, h:56, d:24, color:IC[2] },
  { id:47, side:"iran", position:[-1016,0,-704], w:26, h:76, d:26, color:IC[5] },
  { id:48, side:"iran", position:[-1124,0,-870], w:30, h:64, d:30, color:IC[3] },
  { id:49, side:"iran", position:[-656,0,-676], w:22, h:48, d:26, color:IC[1] },
  { id:50, side:"iran", position:[-1396,0,-816], w:40, h:72, d:36, color:IC[6] },
  { id:51, side:"iran", position:[-1464,0,-904], w:48, h:56, d:40, color:IC[6] },
  { id:52, side:"iran", position:[-1516,0,-1020], w:32, h:40, d:32, color:IC[1] },
  { id:53, side:"iran", position:[-1384,0,-756], w:36, h:44, d:32, color:IC[0] },
  { id:54, side:"iran", position:[-536,0,-856], w:26, h:44, d:24, color:IC[0] },
  { id:55, side:"iran", position:[-556,0,-700], w:24, h:32, d:22, color:IC[5] },
  { id:56, side:"iran", position:[-636,0,-1010], w:24, h:36, d:24, color:IC[2] },
  { id:57, side:"iran", position:[-980,0,-376], w:40, h:36, d:28, color:IC[5] },
  { id:58, side:"iran", position:[-1144,0,-444], w:32, h:40, d:28, color:IC[3] },
  { id:59, side:"iran", position:[-684,0,-444], w:28, h:32, d:24, color:IC[7] },
  { id:60, side:"iran", position:[-830,0,-336], w:26, h:28, d:26, color:IC[4] },
  { id:61, side:"iran", position:[-1560,0,-776], w:36, h:52, d:32, color:IC[2] },
  { id:62, side:"iran", position:[-1640,0,-860], w:40, h:44, d:36, color:IC[5] },
  { id:63, side:"iran", position:[-1710,0,-760], w:32, h:36, d:28, color:IC[0] },
  { id:64, side:"iran", position:[-1760,0,-880], w:28, h:40, d:26, color:IC[3] },
  { id:65, side:"iran", position:[-1600,0,-960], w:32, h:56, d:30, color:IC[6] },
  { id:66, side:"iran", position:[-1680,0,-620], w:36, h:44, d:32, color:IC[4] },
  { id:67, side:"iran", position:[-1760,0,-580], w:28, h:36, d:28, color:IC[7] },
  { id:68, side:"iran", position:[-1510,0,-536], w:32, h:48, d:28, color:IC[1] },
  // City Center Z: 0 to +350
  { id:69, side:"iran", position:[-564,0,180], w:28, h:84, d:28, color:IC[1] },
  { id:70, side:"iran", position:[-640,0,230], w:32, h:104, d:32, color:IC[0] },
  { id:71, side:"iran", position:[-736,0,316], w:30, h:88, d:28, color:IC[2] },
  { id:72, side:"iran", position:[-576,0,364], w:26, h:72, d:26, color:IC[1] },
  { id:73, side:"iran", position:[-856,0,204], w:36, h:96, d:32, color:IC[4] },
  { id:74, side:"iran", position:[-976,0,316], w:28, h:76, d:28, color:IC[5] },
  { id:75, side:"iran", position:[-1084,0,424], w:32, h:64, d:30, color:IC[3] },
  { id:76, side:"iran", position:[-796,0,504], w:40, h:52, d:36, color:IC[7] },
  { id:77, side:"iran", position:[-616,0,484], w:24, h:44, d:24, color:IC[0] },
  { id:78, side:"iran", position:[-916,0,584], w:36, h:48, d:32, color:IC[6] },
  { id:79, side:"iran", position:[-1164,0,284], w:44, h:60, d:40, color:IC[2] },
  { id:80, side:"iran", position:[-1244,0,464], w:32, h:40, d:28, color:IC[4] },
  { id:81, side:"iran", position:[-536,0,324], w:22, h:36, d:24, color:IC[3] },
  { id:82, side:"iran", position:[-1004,0,170], w:28, h:56, d:28, color:IC[7] },
  { id:83, side:"iran", position:[-1310,0,350], w:36, h:48, d:32, color:IC[5] },
  { id:84, side:"iran", position:[-696,0,624], w:26, h:36, d:26, color:IC[1] },
  { id:85, side:"iran", position:[-824,0,676], w:32, h:32, d:28, color:IC[0] },
  { id:86, side:"iran", position:[-1400,0,136], w:40, h:56, d:36, color:IC[6] },
  { id:87, side:"iran", position:[-1490,0,260], w:36, h:44, d:32, color:IC[3] },
  { id:88, side:"iran", position:[-1560,0,410], w:32, h:52, d:30, color:IC[2] },
  { id:89, side:"iran", position:[-1640,0,190], w:40, h:40, d:36, color:IC[5] },
  { id:90, side:"iran", position:[-1710,0,350], w:32, h:36, d:28, color:IC[0] },
  { id:91, side:"iran", position:[-1760,0,470], w:28, h:32, d:26, color:IC[4] },
  { id:92, side:"iran", position:[-516,0,80], w:24, h:40, d:24, color:IC[2] },
  { id:93, side:"iran", position:[-536,0,216], w:22, h:48, d:22, color:IC[7] },
  { id:94, side:"iran", position:[-940,0,36], w:28, h:60, d:28, color:IC[5] },
  { id:95, side:"iran", position:[-1080,0,84], w:32, h:72, d:30, color:IC[3] },
  { id:96, side:"iran", position:[-1216,0,44], w:36, h:56, d:32, color:IC[1] },
  { id:97, side:"iran", position:[-1330,0,560], w:32, h:44, d:28, color:IC[4] },
  { id:98, side:"iran", position:[-1436,0,624], w:36, h:40, d:32, color:IC[0] },
  { id:99, side:"iran", position:[-1524,0,550], w:32, h:36, d:30, color:IC[7] },
  { id:100, side:"iran", position:[-1610,0,656], w:40, h:32, d:36, color:IC[2] },
  { id:101, side:"iran", position:[-1696,0,560], w:28, h:28, d:26, color:IC[5] },
  // South Zone Z: +350 to +700
  { id:102, side:"iran", position:[-536,0,776], w:24, h:36, d:24, color:IC[3] },
  { id:103, side:"iran", position:[-740,0,804], w:28, h:48, d:28, color:IC[5] },
  { id:104, side:"iran", position:[-864,0,896], w:36, h:60, d:32, color:IC[1] },
  { id:105, side:"iran", position:[-1004,0,824], w:26, h:44, d:26, color:IC[3] },
  { id:106, side:"iran", position:[-1116,0,924], w:32, h:52, d:32, color:IC[7] },
  { id:107, side:"iran", position:[-1204,0,804], w:40, h:40, d:36, color:IC[4] },
  { id:108, side:"iran", position:[-684,0,944], w:24, h:32, d:24, color:IC[6] },
  { id:109, side:"iran", position:[-944,0,1028], w:32, h:44, d:28, color:IC[2] },
  { id:110, side:"iran", position:[-636,0,890], w:22, h:28, d:22, color:IC[0] },
  { id:111, side:"iran", position:[-1304,0,870], w:36, h:36, d:32, color:IC[2] },
  { id:112, side:"iran", position:[-1436,0,976], w:32, h:32, d:28, color:IC[5] },
  { id:113, side:"iran", position:[-810,0,1070], w:28, h:28, d:26, color:IC[7] },
  { id:114, side:"iran", position:[-516,0,1040], w:24, h:32, d:24, color:IC[4] },
  { id:115, side:"iran", position:[-596,0,1136], w:26, h:36, d:26, color:IC[1] },
  { id:116, side:"iran", position:[-710,0,1216], w:30, h:44, d:28, color:IC[6] },
  { id:117, side:"iran", position:[-836,0,1156], w:28, h:40, d:28, color:IC[0] },
  { id:118, side:"iran", position:[-964,0,1236], w:32, h:36, d:30, color:IC[3] },
  { id:119, side:"iran", position:[-1076,0,1116], w:36, h:32, d:32, color:IC[2] },
  { id:120, side:"iran", position:[-1184,0,1184], w:28, h:28, d:26, color:IC[7] },
  { id:121, side:"iran", position:[-1296,0,1076], w:32, h:36, d:30, color:IC[5] },
  { id:122, side:"iran", position:[-1410,0,1136], w:36, h:32, d:32, color:IC[4] },
  { id:123, side:"iran", position:[-1516,0,1024], w:32, h:28, d:28, color:IC[1] },
  { id:124, side:"iran", position:[-1616,0,1136], w:36, h:32, d:32, color:IC[3] },
  { id:125, side:"iran", position:[-1696,0,960], w:40, h:28, d:36, color:IC[6] },
  { id:126, side:"iran", position:[-1740,0,1096], w:28, h:24, d:26, color:IC[0] },
  { id:127, side:"iran", position:[-1516,0,1250], w:28, h:24, d:26, color:IC[4] },
  { id:128, side:"iran", position:[-1360,0,1280], w:32, h:28, d:28, color:IC[2] },
  { id:129, side:"iran", position:[-1200,0,1320], w:24, h:24, d:24, color:IC[7] },
  { id:130, side:"iran", position:[-1040,0,1316], w:28, h:28, d:26, color:IC[5] },
  { id:131, side:"iran", position:[-880,0,1296], w:26, h:32, d:26, color:IC[1] },
  { id:132, side:"iran", position:[-720,0,1296], w:24, h:24, d:24, color:IC[3] },
  { id:133, side:"iran", position:[-556,0,1260], w:22, h:28, d:22, color:IC[6] },
  // West Dense Zone X: -700 to -900
  { id:134, side:"iran", position:[-1480,0,-490], w:40, h:64, d:36, color:IC[3] },
  { id:135, side:"iran", position:[-1560,0,-336], w:36, h:56, d:32, color:IC[5] },
  { id:136, side:"iran", position:[-1640,0,-444], w:44, h:48, d:40, color:IC[1] },
  { id:137, side:"iran", position:[-1716,0,-316], w:32, h:40, d:30, color:IC[6] },
  { id:138, side:"iran", position:[-1760,0,-220], w:28, h:36, d:26, color:IC[4] },
  { id:139, side:"iran", position:[-1520,0,-156], w:36, h:52, d:32, color:IC[2] },
  { id:140, side:"iran", position:[-1620,0,-56], w:40, h:44, d:36, color:IC[7] },
  { id:141, side:"iran", position:[-1710,0,-110], w:32, h:36, d:30, color:IC[0] },
  { id:142, side:"iran", position:[-1480,0,44], w:36, h:48, d:32, color:IC[3] },
  { id:143, side:"iran", position:[-1600,0,144], w:44, h:40, d:40, color:IC[5] },
  { id:144, side:"iran", position:[-1704,0,64], w:32, h:32, d:28, color:IC[1] },
  { id:145, side:"iran", position:[-1760,0,190], w:28, h:28, d:26, color:IC[4] },
  { id:146, side:"iran", position:[-1480,0,756], w:40, h:36, d:36, color:IC[6] },
  { id:147, side:"iran", position:[-1580,0,856], w:36, h:32, d:32, color:IC[3] },
  { id:148, side:"iran", position:[-1670,0,764], w:32, h:28, d:30, color:IC[0] },
  { id:149, side:"iran", position:[-1740,0,880], w:28, h:24, d:26, color:IC[7] },
  { id:150, side:"iran", position:[-1760,0,736], w:30, h:28, d:28, color:IC[2] },
  // New Dense Zones (ids 160–199)
  { id:160, side:"iran", position:[-960,0,-800], w:40, h:180, d:40, color:IC[0] },
  { id:161, side:"iran", position:[-1040,0,-900], w:36, h:160, d:36, color:IC[1] },
  { id:162, side:"iran", position:[-1120,0,-760], w:44, h:200, d:44, color:IC[2] },
  { id:163, side:"iran", position:[-980,0,-1000], w:38, h:140, d:38, color:IC[3] },
  { id:164, side:"iran", position:[-1200,0,-840], w:34, h:120, d:34, color:IC[4] },
  { id:165, side:"iran", position:[-860,0,-950], w:32, h:100, d:32, color:IC[5] },
  { id:166, side:"iran", position:[-1300,0,-700], w:30, h:90, d:30, color:IC[6] },
  { id:167, side:"iran", position:[-1050,0,-1100], w:36, h:160, d:36, color:IC[7] },
  { id:168, side:"iran", position:[-900,0,-1200], w:28, h:80, d:28, color:IC[0] },
  { id:169, side:"iran", position:[-1150,0,-1050], w:32, h:120, d:32, color:IC[1] },
  { id:170, side:"iran", position:[-1250,0,-950], w:38, h:150, d:38, color:IC[2] },
  { id:171, side:"iran", position:[-1350,0,-850], w:34, h:110, d:34, color:IC[3] },
  { id:172, side:"iran", position:[-860,0,-600], w:42, h:190, d:42, color:IC[4] },
  { id:173, side:"iran", position:[-940,0,-400], w:36, h:140, d:36, color:IC[5] },
  { id:174, side:"iran", position:[-1050,0,-300], w:32, h:100, d:32, color:IC[6] },
  { id:175, side:"iran", position:[-1160,0,-500], w:30, h:80, d:30, color:IC[7] },
  { id:176, side:"iran", position:[-1280,0,-400], w:28, h:70, d:28, color:IC[0] },
  { id:177, side:"iran", position:[-960,0,200], w:38, h:160, d:38, color:IC[1] },
  { id:178, side:"iran", position:[-1080,0,300], w:34, h:120, d:34, color:IC[2] },
  { id:179, side:"iran", position:[-1200,0,180], w:30, h:90, d:30, color:IC[3] },
  { id:180, side:"iran", position:[-1320,0,250], w:28, h:70, d:28, color:IC[4] },
  { id:181, side:"iran", position:[-860,0,400], w:36, h:130, d:36, color:IC[5] },
  { id:182, side:"iran", position:[-980,0,500], w:32, h:100, d:32, color:IC[6] },
  { id:183, side:"iran", position:[-1100,0,420], w:38, h:140, d:38, color:IC[7] },
  { id:184, side:"iran", position:[-1220,0,500], w:34, h:110, d:34, color:IC[0] },
  { id:185, side:"iran", position:[-1340,0,380], w:30, h:80, d:30, color:IC[1] },
  { id:186, side:"iran", position:[-900,0,700], w:28, h:70, d:28, color:IC[2] },
  { id:187, side:"iran", position:[-1020,0,800], w:32, h:90, d:32, color:IC[3] },
  { id:188, side:"iran", position:[-1150,0,720], w:36, h:110, d:36, color:IC[4] },
  { id:189, side:"iran", position:[-1270,0,640], w:30, h:80, d:30, color:IC[5] },
  { id:190, side:"iran", position:[-950,0,1000], w:28, h:60, d:28, color:IC[6] },
  { id:191, side:"iran", position:[-1070,0,1100], w:32, h:80, d:32, color:IC[7] },
  { id:192, side:"iran", position:[-1190,0,980], w:34, h:100, d:34, color:IC[0] },
  { id:193, side:"iran", position:[-600,0,-1000], w:36, h:130, d:36, color:IC[1] },
  { id:194, side:"iran", position:[-700,0,-1100], w:32, h:110, d:32, color:IC[2] },
  { id:195, side:"iran", position:[-800,0,-1050], w:38, h:150, d:38, color:IC[3] },
  { id:196, side:"iran", position:[-650,0,-900], w:34, h:120, d:34, color:IC[4] },
  { id:197, side:"iran", position:[-550,0,-800], w:30, h:100, d:30, color:IC[5] },
  { id:198, side:"iran", position:[-500,0,-1200], w:28, h:80, d:28, color:IC[6] },
  { id:199, side:"iran", position:[-750,0,-1300], w:32, h:90, d:32, color:IC[7] },
];

// ─────────────────────────────────────────────────────────────────
// ISRAEL BUILDINGS DATA
// ─────────────────────────────────────────────────────────────────
const IS_C = ["#f0ead8","#e8e0cc","#ddd5c0","#ece4d4","#f4eed8","#e0d8c8","#eae2d0","#f0e8d4"];
const IS_W = "#aaddff";

export const ISRAEL_BUILDINGS: BuildingDef[] = [
  // Downtown Core Z: -700 to -540
  { id:200, side:"israel", position:[780,0,-1280], w:36, h:220, d:36, color:IS_C[0], windowColor:IS_W },
  { id:201, side:"israel", position:[860,0,-1200], w:30, h:190, d:30, color:IS_C[1], windowColor:IS_W },
  { id:202, side:"israel", position:[930,0,-1310], w:34, h:200, d:34, color:IS_C[2], windowColor:IS_W },
  { id:203, side:"israel", position:[1020,0,-1240], w:40, h:156, d:36, color:IS_C[3], windowColor:IS_W },
  { id:204, side:"israel", position:[716,0,-1350], w:26, h:130, d:28, color:IS_C[0], windowColor:IS_W },
  { id:205, side:"israel", position:[1096,0,-1180], w:32, h:176, d:32, color:IS_C[4], windowColor:IS_W },
  { id:206, side:"israel", position:[676,0,-1230], w:28, h:144, d:28, color:IS_C[2], windowColor:IS_W },
  { id:207, side:"israel", position:[810,0,-1360], w:24, h:116, d:28, color:IS_C[6], windowColor:IS_W },
  { id:208, side:"israel", position:[910,0,-1096], w:32, h:128, d:32, color:IS_C[7], windowColor:IS_W },
  { id:209, side:"israel", position:[1180,0,-1084], w:44, h:108, d:40, color:IS_C[5], windowColor:IS_W },
  { id:210, side:"israel", position:[1244,0,-1304], w:44, h:104, d:40, color:IS_C[7], windowColor:IS_W },
  { id:211, side:"israel", position:[960,0,-1136], w:28, h:96, d:28, color:IS_C[0], windowColor:IS_W },
  { id:212, side:"israel", position:[1124,0,-1270], w:30, h:84, d:30, color:IS_C[3], windowColor:IS_W },
  { id:213, side:"israel", position:[1360,0,-1216], w:40, h:92, d:36, color:IS_C[6], windowColor:IS_W },
  { id:214, side:"israel", position:[1436,0,-1320], w:32, h:76, d:32, color:IS_C[1], windowColor:IS_W },
  { id:215, side:"israel", position:[1484,0,-1160], w:36, h:84, d:32, color:IS_C[4], windowColor:IS_W },
  { id:216, side:"israel", position:[616,0,-1116], w:24, h:76, d:24, color:IS_C[2], windowColor:IS_W },
  { id:217, side:"israel", position:[536,0,-1256], w:26, h:64, d:24, color:IS_C[0], windowColor:IS_W },
  { id:218, side:"israel", position:[556,0,-1100], w:24, h:56, d:22, color:IS_C[5], windowColor:IS_W },
  { id:219, side:"israel", position:[1516,0,-1380], w:32, h:60, d:32, color:IS_C[1], windowColor:IS_W },
  { id:220, side:"israel", position:[1620,0,-1260], w:40, h:72, d:36, color:IS_C[3], windowColor:IS_W },
  { id:221, side:"israel", position:[1680,0,-1140], w:36, h:60, d:32, color:IS_C[5], windowColor:IS_W },
  { id:222, side:"israel", position:[1740,0,-1300], w:32, h:52, d:30, color:IS_C[7], windowColor:IS_W },
  { id:223, side:"israel", position:[700,0,-1180], w:26, h:88, d:26, color:IS_C[4], windowColor:IS_W },
  { id:224, side:"israel", position:[836,0,-1110], w:28, h:104, d:28, color:IS_C[3], windowColor:IS_W },
  { id:225, side:"israel", position:[980,0,-1300], w:32, h:72, d:28, color:IS_C[5], windowColor:IS_W },
  { id:226, side:"israel", position:[1280,0,-1090], w:28, h:68, d:28, color:IS_C[2], windowColor:IS_W },
  { id:227, side:"israel", position:[1400,0,-1090], w:26, h:80, d:26, color:IS_C[0], windowColor:IS_W },
  { id:228, side:"israel", position:[1520,0,-1040], w:36, h:60, d:32, color:IS_C[6], windowColor:IS_W },
  { id:229, side:"israel", position:[1640,0,-1390], w:30, h:44, d:28, color:IS_C[1], windowColor:IS_W },
  // Midtown Z: -540 to 0
  { id:230, side:"israel", position:[780,0,-880], w:36, h:210, d:36, color:IS_C[0], windowColor:IS_W },
  { id:231, side:"israel", position:[860,0,-800], w:30, h:168, d:30, color:IS_C[1], windowColor:IS_W },
  { id:232, side:"israel", position:[930,0,-900], w:34, h:184, d:34, color:IS_C[2], windowColor:IS_W },
  { id:233, side:"israel", position:[1020,0,-836], w:40, h:140, d:36, color:IS_C[3], windowColor:IS_W },
  { id:234, side:"israel", position:[716,0,-944], w:26, h:116, d:28, color:IS_C[0], windowColor:IS_W },
  { id:235, side:"israel", position:[1096,0,-776], w:32, h:152, d:32, color:IS_C[4], windowColor:IS_W },
  { id:236, side:"israel", position:[676,0,-830], w:28, h:128, d:28, color:IS_C[2], windowColor:IS_W },
  { id:237, side:"israel", position:[810,0,-950], w:24, h:100, d:28, color:IS_C[6], windowColor:IS_W },
  { id:238, side:"israel", position:[910,0,-696], w:32, h:112, d:32, color:IS_C[7], windowColor:IS_W },
  { id:239, side:"israel", position:[1180,0,-684], w:44, h:92, d:40, color:IS_C[5], windowColor:IS_W },
  { id:240, side:"israel", position:[1084,0,-556], w:32, h:80, d:32, color:IS_C[1], windowColor:IS_W },
  { id:241, side:"israel", position:[884,0,-516], w:30, h:68, d:32, color:IS_C[3], windowColor:IS_W },
  { id:242, side:"israel", position:[744,0,-576], w:36, h:76, d:30, color:IS_C[6], windowColor:IS_W },
  { id:243, side:"israel", position:[964,0,-616], w:28, h:64, d:28, color:IS_C[0], windowColor:IS_W },
  { id:244, side:"israel", position:[1244,0,-904], w:44, h:88, d:40, color:IS_C[7], windowColor:IS_W },
  { id:245, side:"israel", position:[1310,0,-636], w:36, h:72, d:32, color:IS_C[4], windowColor:IS_W },
  { id:246, side:"israel", position:[616,0,-716], w:24, h:60, d:24, color:IS_C[2], windowColor:IS_W },
  { id:247, side:"israel", position:[1016,0,-704], w:26, h:80, d:26, color:IS_C[5], windowColor:IS_W },
  { id:248, side:"israel", position:[1124,0,-870], w:30, h:68, d:30, color:IS_C[3], windowColor:IS_W },
  { id:249, side:"israel", position:[656,0,-676], w:22, h:52, d:26, color:IS_C[1], windowColor:IS_W },
  { id:250, side:"israel", position:[1396,0,-816], w:40, h:76, d:36, color:IS_C[6], windowColor:IS_W },
  { id:251, side:"israel", position:[1464,0,-904], w:48, h:60, d:40, color:IS_C[6], windowColor:IS_W },
  { id:252, side:"israel", position:[1516,0,-1020], w:32, h:40, d:32, color:IS_C[1], windowColor:IS_W },
  { id:253, side:"israel", position:[1384,0,-756], w:36, h:48, d:32, color:IS_C[0], windowColor:IS_W },
  { id:254, side:"israel", position:[536,0,-856], w:26, h:44, d:24, color:IS_C[0], windowColor:IS_W },
  { id:255, side:"israel", position:[556,0,-700], w:24, h:32, d:22, color:IS_C[5], windowColor:IS_W },
  { id:256, side:"israel", position:[636,0,-1010], w:24, h:36, d:24, color:IS_C[2], windowColor:IS_W },
  { id:257, side:"israel", position:[980,0,-376], w:40, h:40, d:28, color:IS_C[5], windowColor:IS_W },
  { id:258, side:"israel", position:[1144,0,-444], w:32, h:44, d:28, color:IS_C[3], windowColor:IS_W },
  { id:259, side:"israel", position:[684,0,-444], w:28, h:36, d:24, color:IS_C[7], windowColor:IS_W },
  { id:260, side:"israel", position:[830,0,-336], w:26, h:28, d:26, color:IS_C[4], windowColor:IS_W },
  { id:261, side:"israel", position:[1560,0,-776], w:36, h:52, d:32, color:IS_C[2], windowColor:IS_W },
  { id:262, side:"israel", position:[1640,0,-860], w:40, h:44, d:36, color:IS_C[5], windowColor:IS_W },
  { id:263, side:"israel", position:[1710,0,-760], w:32, h:36, d:28, color:IS_C[0], windowColor:IS_W },
  { id:264, side:"israel", position:[1760,0,-880], w:28, h:40, d:26, color:IS_C[3], windowColor:IS_W },
  { id:265, side:"israel", position:[1600,0,-960], w:32, h:56, d:30, color:IS_C[6], windowColor:IS_W },
  { id:266, side:"israel", position:[1680,0,-620], w:36, h:44, d:32, color:IS_C[4], windowColor:IS_W },
  { id:267, side:"israel", position:[1760,0,-580], w:28, h:36, d:28, color:IS_C[7], windowColor:IS_W },
  { id:268, side:"israel", position:[1510,0,-536], w:32, h:48, d:28, color:IS_C[1], windowColor:IS_W },
  // City Center Z: 0 to +350
  { id:269, side:"israel", position:[564,0,180], w:28, h:88, d:28, color:IS_C[1], windowColor:IS_W },
  { id:270, side:"israel", position:[640,0,230], w:32, h:108, d:32, color:IS_C[0], windowColor:IS_W },
  { id:271, side:"israel", position:[736,0,316], w:30, h:92, d:28, color:IS_C[2], windowColor:IS_W },
  { id:272, side:"israel", position:[576,0,364], w:26, h:76, d:26, color:IS_C[1], windowColor:IS_W },
  { id:273, side:"israel", position:[856,0,204], w:36, h:100, d:32, color:IS_C[4], windowColor:IS_W },
  { id:274, side:"israel", position:[976,0,316], w:28, h:80, d:28, color:IS_C[5], windowColor:IS_W },
  { id:275, side:"israel", position:[1084,0,424], w:32, h:68, d:30, color:IS_C[3], windowColor:IS_W },
  { id:276, side:"israel", position:[796,0,504], w:40, h:56, d:36, color:IS_C[7], windowColor:IS_W },
  { id:277, side:"israel", position:[616,0,484], w:24, h:48, d:24, color:IS_C[0], windowColor:IS_W },
  { id:278, side:"israel", position:[916,0,584], w:36, h:52, d:32, color:IS_C[6], windowColor:IS_W },
  { id:279, side:"israel", position:[1164,0,284], w:44, h:64, d:40, color:IS_C[2], windowColor:IS_W },
  { id:280, side:"israel", position:[1244,0,464], w:32, h:44, d:28, color:IS_C[4], windowColor:IS_W },
  { id:281, side:"israel", position:[536,0,324], w:22, h:40, d:24, color:IS_C[3], windowColor:IS_W },
  { id:282, side:"israel", position:[1004,0,170], w:28, h:60, d:28, color:IS_C[7], windowColor:IS_W },
  { id:283, side:"israel", position:[1310,0,350], w:36, h:52, d:32, color:IS_C[5], windowColor:IS_W },
  { id:284, side:"israel", position:[696,0,624], w:26, h:40, d:26, color:IS_C[1], windowColor:IS_W },
  { id:285, side:"israel", position:[824,0,676], w:32, h:36, d:28, color:IS_C[0], windowColor:IS_W },
  { id:286, side:"israel", position:[1400,0,136], w:40, h:56, d:36, color:IS_C[6], windowColor:IS_W },
  { id:287, side:"israel", position:[1490,0,260], w:36, h:44, d:32, color:IS_C[3], windowColor:IS_W },
  { id:288, side:"israel", position:[1560,0,410], w:32, h:52, d:30, color:IS_C[2], windowColor:IS_W },
  { id:289, side:"israel", position:[1640,0,190], w:40, h:40, d:36, color:IS_C[5], windowColor:IS_W },
  { id:290, side:"israel", position:[1710,0,350], w:32, h:36, d:28, color:IS_C[0], windowColor:IS_W },
  { id:291, side:"israel", position:[1760,0,470], w:28, h:32, d:26, color:IS_C[4], windowColor:IS_W },
  { id:292, side:"israel", position:[516,0,80], w:24, h:40, d:24, color:IS_C[2], windowColor:IS_W },
  { id:293, side:"israel", position:[536,0,216], w:22, h:48, d:22, color:IS_C[7], windowColor:IS_W },
  { id:294, side:"israel", position:[940,0,36], w:28, h:60, d:28, color:IS_C[5], windowColor:IS_W },
  { id:295, side:"israel", position:[1080,0,84], w:32, h:72, d:30, color:IS_C[3], windowColor:IS_W },
  { id:296, side:"israel", position:[1216,0,44], w:36, h:56, d:32, color:IS_C[1], windowColor:IS_W },
  { id:297, side:"israel", position:[1330,0,560], w:32, h:44, d:28, color:IS_C[4], windowColor:IS_W },
  { id:298, side:"israel", position:[1436,0,624], w:36, h:40, d:32, color:IS_C[0], windowColor:IS_W },
  { id:299, side:"israel", position:[1524,0,550], w:32, h:36, d:30, color:IS_C[7], windowColor:IS_W },
  { id:300, side:"israel", position:[1610,0,656], w:40, h:32, d:36, color:IS_C[2], windowColor:IS_W },
  { id:301, side:"israel", position:[1696,0,560], w:28, h:28, d:26, color:IS_C[5], windowColor:IS_W },
  // South Zone Z: +350 to +700
  { id:302, side:"israel", position:[536,0,776], w:24, h:40, d:24, color:IS_C[3], windowColor:IS_W },
  { id:303, side:"israel", position:[740,0,804], w:28, h:52, d:28, color:IS_C[5], windowColor:IS_W },
  { id:304, side:"israel", position:[864,0,896], w:36, h:64, d:32, color:IS_C[1], windowColor:IS_W },
  { id:305, side:"israel", position:[1004,0,824], w:26, h:48, d:26, color:IS_C[3], windowColor:IS_W },
  { id:306, side:"israel", position:[1116,0,924], w:32, h:56, d:32, color:IS_C[7], windowColor:IS_W },
  { id:307, side:"israel", position:[1204,0,804], w:40, h:44, d:36, color:IS_C[4], windowColor:IS_W },
  { id:308, side:"israel", position:[684,0,944], w:24, h:36, d:24, color:IS_C[6], windowColor:IS_W },
  { id:309, side:"israel", position:[944,0,1028], w:32, h:48, d:28, color:IS_C[2], windowColor:IS_W },
  { id:310, side:"israel", position:[636,0,890], w:22, h:32, d:22, color:IS_C[0], windowColor:IS_W },
  { id:311, side:"israel", position:[1304,0,870], w:36, h:40, d:32, color:IS_C[2], windowColor:IS_W },
  { id:312, side:"israel", position:[1436,0,976], w:32, h:36, d:28, color:IS_C[5], windowColor:IS_W },
  { id:313, side:"israel", position:[810,0,1070], w:28, h:32, d:26, color:IS_C[7], windowColor:IS_W },
  { id:314, side:"israel", position:[516,0,1040], w:24, h:32, d:24, color:IS_C[4], windowColor:IS_W },
  { id:315, side:"israel", position:[596,0,1136], w:26, h:36, d:26, color:IS_C[1], windowColor:IS_W },
  { id:316, side:"israel", position:[710,0,1216], w:30, h:44, d:28, color:IS_C[6], windowColor:IS_W },
  { id:317, side:"israel", position:[836,0,1156], w:28, h:40, d:28, color:IS_C[0], windowColor:IS_W },
  { id:318, side:"israel", position:[964,0,1236], w:32, h:36, d:30, color:IS_C[3], windowColor:IS_W },
  { id:319, side:"israel", position:[1076,0,1116], w:36, h:32, d:32, color:IS_C[2], windowColor:IS_W },
  { id:320, side:"israel", position:[1184,0,1184], w:28, h:28, d:26, color:IS_C[7], windowColor:IS_W },
  { id:321, side:"israel", position:[1296,0,1076], w:32, h:36, d:30, color:IS_C[5], windowColor:IS_W },
  { id:322, side:"israel", position:[1410,0,1136], w:36, h:32, d:32, color:IS_C[4], windowColor:IS_W },
  { id:323, side:"israel", position:[1516,0,1024], w:32, h:28, d:28, color:IS_C[1], windowColor:IS_W },
  { id:324, side:"israel", position:[1616,0,1136], w:36, h:32, d:32, color:IS_C[3], windowColor:IS_W },
  { id:325, side:"israel", position:[1696,0,960], w:40, h:28, d:36, color:IS_C[6], windowColor:IS_W },
  { id:326, side:"israel", position:[1740,0,1096], w:28, h:24, d:26, color:IS_C[0], windowColor:IS_W },
  { id:327, side:"israel", position:[1516,0,1250], w:28, h:24, d:26, color:IS_C[4], windowColor:IS_W },
  { id:328, side:"israel", position:[1360,0,1280], w:32, h:28, d:28, color:IS_C[2], windowColor:IS_W },
  { id:329, side:"israel", position:[1200,0,1320], w:24, h:24, d:24, color:IS_C[7], windowColor:IS_W },
  { id:330, side:"israel", position:[1040,0,1316], w:28, h:28, d:26, color:IS_C[5], windowColor:IS_W },
  { id:331, side:"israel", position:[880,0,1296], w:26, h:32, d:26, color:IS_C[1], windowColor:IS_W },
  { id:332, side:"israel", position:[720,0,1296], w:24, h:24, d:24, color:IS_C[3], windowColor:IS_W },
  { id:333, side:"israel", position:[556,0,1260], w:22, h:28, d:22, color:IS_C[6], windowColor:IS_W },
  // East Dense Zone X: +700 to +900
  { id:334, side:"israel", position:[1480,0,-490], w:40, h:64, d:36, color:IS_C[3], windowColor:IS_W },
  { id:335, side:"israel", position:[1560,0,-336], w:36, h:56, d:32, color:IS_C[5], windowColor:IS_W },
  { id:336, side:"israel", position:[1640,0,-444], w:44, h:48, d:40, color:IS_C[1], windowColor:IS_W },
  { id:337, side:"israel", position:[1716,0,-316], w:32, h:40, d:30, color:IS_C[6], windowColor:IS_W },
  { id:338, side:"israel", position:[1760,0,-220], w:28, h:36, d:26, color:IS_C[4], windowColor:IS_W },
  { id:339, side:"israel", position:[1520,0,-156], w:36, h:52, d:32, color:IS_C[2], windowColor:IS_W },
  { id:340, side:"israel", position:[1620,0,-56], w:40, h:44, d:36, color:IS_C[7], windowColor:IS_W },
  { id:341, side:"israel", position:[1710,0,-110], w:32, h:36, d:30, color:IS_C[0], windowColor:IS_W },
  { id:342, side:"israel", position:[1480,0,44], w:36, h:48, d:32, color:IS_C[3], windowColor:IS_W },
  { id:343, side:"israel", position:[1600,0,144], w:44, h:40, d:40, color:IS_C[5], windowColor:IS_W },
  { id:344, side:"israel", position:[1704,0,64], w:32, h:32, d:28, color:IS_C[1], windowColor:IS_W },
  { id:345, side:"israel", position:[1760,0,190], w:28, h:28, d:26, color:IS_C[4], windowColor:IS_W },
  { id:346, side:"israel", position:[1480,0,756], w:40, h:36, d:36, color:IS_C[6], windowColor:IS_W },
  { id:347, side:"israel", position:[1580,0,856], w:36, h:32, d:32, color:IS_C[3], windowColor:IS_W },
  { id:348, side:"israel", position:[1670,0,764], w:32, h:28, d:30, color:IS_C[0], windowColor:IS_W },
  { id:349, side:"israel", position:[1740,0,880], w:28, h:24, d:26, color:IS_C[7], windowColor:IS_W },
  { id:350, side:"israel", position:[1760,0,736], w:30, h:28, d:28, color:IS_C[2], windowColor:IS_W },
  // New Dense Zones (ids 360–399)
  { id:360, side:"israel", position:[960,0,-800], w:40, h:180, d:40, color:IS_C[0], windowColor:IS_W },
  { id:361, side:"israel", position:[1040,0,-900], w:36, h:160, d:36, color:IS_C[1], windowColor:IS_W },
  { id:362, side:"israel", position:[1120,0,-760], w:44, h:200, d:44, color:IS_C[2], windowColor:IS_W },
  { id:363, side:"israel", position:[980,0,-1000], w:38, h:140, d:38, color:IS_C[3], windowColor:IS_W },
  { id:364, side:"israel", position:[1200,0,-840], w:34, h:120, d:34, color:IS_C[4], windowColor:IS_W },
  { id:365, side:"israel", position:[860,0,-950], w:32, h:100, d:32, color:IS_C[5], windowColor:IS_W },
  { id:366, side:"israel", position:[1300,0,-700], w:30, h:90, d:30, color:IS_C[6], windowColor:IS_W },
  { id:367, side:"israel", position:[1050,0,-1100], w:36, h:160, d:36, color:IS_C[7], windowColor:IS_W },
  { id:368, side:"israel", position:[900,0,-1200], w:28, h:80, d:28, color:IS_C[0], windowColor:IS_W },
  { id:369, side:"israel", position:[1150,0,-1050], w:32, h:120, d:32, color:IS_C[1], windowColor:IS_W },
  { id:370, side:"israel", position:[1250,0,-950], w:38, h:150, d:38, color:IS_C[2], windowColor:IS_W },
  { id:371, side:"israel", position:[1350,0,-850], w:34, h:110, d:34, color:IS_C[3], windowColor:IS_W },
  { id:372, side:"israel", position:[860,0,-600], w:42, h:190, d:42, color:IS_C[4], windowColor:IS_W },
  { id:373, side:"israel", position:[940,0,-400], w:36, h:140, d:36, color:IS_C[5], windowColor:IS_W },
  { id:374, side:"israel", position:[1050,0,-300], w:32, h:100, d:32, color:IS_C[6], windowColor:IS_W },
  { id:375, side:"israel", position:[1160,0,-500], w:30, h:80, d:30, color:IS_C[7], windowColor:IS_W },
  { id:376, side:"israel", position:[1280,0,-400], w:28, h:70, d:28, color:IS_C[0], windowColor:IS_W },
  { id:377, side:"israel", position:[960,0,200], w:38, h:160, d:38, color:IS_C[1], windowColor:IS_W },
  { id:378, side:"israel", position:[1080,0,300], w:34, h:120, d:34, color:IS_C[2], windowColor:IS_W },
  { id:379, side:"israel", position:[1200,0,180], w:30, h:90, d:30, color:IS_C[3], windowColor:IS_W },
  { id:380, side:"israel", position:[1320,0,250], w:28, h:70, d:28, color:IS_C[4], windowColor:IS_W },
  { id:381, side:"israel", position:[860,0,400], w:36, h:130, d:36, color:IS_C[5], windowColor:IS_W },
  { id:382, side:"israel", position:[980,0,500], w:32, h:100, d:32, color:IS_C[6], windowColor:IS_W },
  { id:383, side:"israel", position:[1100,0,420], w:38, h:140, d:38, color:IS_C[7], windowColor:IS_W },
  { id:384, side:"israel", position:[1220,0,500], w:34, h:110, d:34, color:IS_C[0], windowColor:IS_W },
  { id:385, side:"israel", position:[1340,0,380], w:30, h:80, d:30, color:IS_C[1], windowColor:IS_W },
  { id:386, side:"israel", position:[900,0,700], w:28, h:70, d:28, color:IS_C[2], windowColor:IS_W },
  { id:387, side:"israel", position:[1020,0,800], w:32, h:90, d:32, color:IS_C[3], windowColor:IS_W },
  { id:388, side:"israel", position:[1150,0,720], w:36, h:110, d:36, color:IS_C[4], windowColor:IS_W },
  { id:389, side:"israel", position:[1270,0,640], w:30, h:80, d:30, color:IS_C[5], windowColor:IS_W },
  { id:390, side:"israel", position:[950,0,1000], w:28, h:60, d:28, color:IS_C[6], windowColor:IS_W },
  { id:391, side:"israel", position:[1070,0,1100], w:32, h:80, d:32, color:IS_C[7], windowColor:IS_W },
  { id:392, side:"israel", position:[1190,0,980], w:34, h:100, d:34, color:IS_C[0], windowColor:IS_W },
  { id:393, side:"israel", position:[600,0,-1000], w:36, h:130, d:36, color:IS_C[1], windowColor:IS_W },
  { id:394, side:"israel", position:[700,0,-1100], w:32, h:110, d:32, color:IS_C[2], windowColor:IS_W },
  { id:395, side:"israel", position:[800,0,-1050], w:38, h:150, d:38, color:IS_C[3], windowColor:IS_W },
  { id:396, side:"israel", position:[650,0,-900], w:34, h:120, d:34, color:IS_C[4], windowColor:IS_W },
  { id:397, side:"israel", position:[550,0,-800], w:30, h:100, d:30, color:IS_C[5], windowColor:IS_W },
  { id:398, side:"israel", position:[500,0,-1200], w:28, h:80, d:28, color:IS_C[6], windowColor:IS_W },
  { id:399, side:"israel", position:[750,0,-1300], w:32, h:90, d:32, color:IS_C[7], windowColor:IS_W },
];

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

interface BuildingDamageState {
  hp: number;
  stage: 0 | 1 | 2 | 3;
  destroyed: boolean;
}

// Module-level damage map — keyed by building id
export const damageMap = new Map<number, BuildingDamageState>();
ALL_BUILDINGS.forEach(b => {
  damageMap.set(b.id, { hp: 100, stage: 0, destroyed: false });
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

function applyDamage(
  rec: BuildingRecord,
  dmg: number,
  score: React.MutableRefObject<ScoreState>,
  onScoreChange: (s: ScoreState) => void
) {
  const entry = damageMap.get(rec.id);
  if (!entry || entry.destroyed) return;

  entry.hp -= dmg;

  const prevStage = entry.stage;

  if (entry.hp <= 0) {
    entry.hp = 0;
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
  } else if (entry.hp <= 33) {
    entry.stage = 2;
  } else if (entry.hp <= 66) {
    entry.stage = 1;
  }

  // Push visual changes imperatively — no per-frame polling needed
  if (entry.stage !== prevStage) {
    _applyBuildingVisuals(rec.id, entry.stage, rec.color, rec.w, rec.h, rec.d);
  }
}

function _applyBuildingVisuals(id: number, stage: 0|1|2|3, color: string, w: number, h: number, d: number) {
  const refs = buildingRefs.get(id);
  if (!refs) return;
  refs.setStage(stage);
  const trigger = debrisTriggers.get(id);
  if (trigger) trigger(stage, w, h, d);
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
      applyDamage(rec, scaled, score, onScoreChange);
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
  const _planeSize    = new THREE.Vector3(12, 4, 12);
  const crashed       = useRef(false);

  void side; // side used for future PvP targeting, available in scope

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const plane = planeRef.current;
    if (!plane) {
      // Plane is unmounted (respawning) — reset crash lock for the new plane
      crashed.current = false;
      return;
    }

    const bulletMesh = bulletMeshRef.current;
    const bombMesh   = bombMeshRef.current;

    // ── Plane-building crash detection ──────────────────────────
    if (!crashed.current) {
      _planeBox.current.setFromCenterAndSize(plane.position, _planeSize);
      for (const id of _nearbyBuildingIds(plane.position)) {
        const rec = _registryById.get(id);
        if (rec && !damageMap.get(rec.id)?.destroyed && rec.box.intersectsBox(_planeBox.current)) {
          crashed.current = true;
          onCrash();
          break;
        }
      }
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
            applyDamage(rec, p.damage, score, onScoreChange);
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

  const debrisTriggerRef = useRef<(stage: number, w: number, h: number, d: number) => void>(null!);

  useEffect(() => {
    buildingRefs.set(def.id, {
      matRef:   bodyMatRef as React.RefObject<THREE.MeshStandardMaterial>,
      groupRef: groupRef   as React.RefObject<THREE.Group>,
      setSmoke: setShowSmoke,
      setStage: setStage as (s: 0|1|2|3) => void,
    });
    debrisTriggers.set(def.id, (s, w, h, d) => {
      if (debrisTriggerRef.current) debrisTriggerRef.current(s, w, h, d);
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

function DamageHoles({ position, w, h, d, stage, id }: DamageHolesProps) {
  if (stage === 0) return null;

  const rand = seededRand(id * 7919);
  const px = position[0], py = position[1] + h / 2, pz = position[2];

  // Generate hole positions — more holes per higher stage
  const holeCount = stage === 3 ? 18 : stage === 2 ? 10 : 5;
  const holes: React.ReactElement[] = [];

  for (let i = 0; i < holeCount; i++) {
    // Random position on one of the 4 faces
    const face = Math.floor(rand() * 4);
    const holeW = 1.5 + rand() * (stage === 3 ? 4.5 : 2.5);
    const holeH = 1.5 + rand() * (stage === 3 ? 5.0 : 3.0);

    let hx = 0, hy = 0, hz = 0;
    if (face === 0) {      // front
      hx = (rand() - 0.5) * (w - holeW - 1);
      hy = py + (rand() - 0.5) * (h - holeH - 2);
      hz = pz + d / 2 - 0.3;
    } else if (face === 1) { // back
      hx = (rand() - 0.5) * (w - holeW - 1);
      hy = py + (rand() - 0.5) * (h - holeH - 2);
      hz = pz - d / 2 + 0.3;
    } else if (face === 2) { // left
      hx = px - w / 2 + 0.3;
      hy = py + (rand() - 0.5) * (h - holeH - 2);
      hz = (rand() - 0.5) * (d - holeW - 1) + pz;
    } else {               // right
      hx = px + w / 2 - 0.3;
      hy = py + (rand() - 0.5) * (h - holeH - 2);
      hz = (rand() - 0.5) * (d - holeW - 1) + pz;
    }

    // Depth of the hole punched into the wall
    const depth = 1.2 + rand() * 1.5;
    const rotation: [number, number, number] = face <= 1 ? [0, 0, 0] : [0, Math.PI / 2, 0];
    const holeSize: [number, number, number] = [
      face <= 1 ? holeW : depth,
      holeH,
      face <= 1 ? depth : holeW,
    ];

    holes.push(
      <mesh key={i} position={[hx, hy, hz]} rotation={rotation}>
        <boxGeometry args={holeSize} />
        <meshStandardMaterial color="#0d0a08" roughness={1} />
      </mesh>
    );

    // Exposed rebar / broken interior — small dark slab protruding
    if (rand() < 0.6) {
      holes.push(
        <mesh key={`r${i}`} position={[hx + (rand() - 0.5) * holeW * 0.5, hy + (rand() - 0.5) * holeH * 0.5, hz]}>
          <boxGeometry args={[0.3 + rand() * 0.5, holeH * 0.8, 0.3 + rand() * 0.5]} />
          <meshStandardMaterial color="#1a1410" roughness={1} />
        </mesh>
      );
    }
  }

  // Stage 3: collapse — body shrinks to a stump, jagged top edge
  if (stage === 3) {
    const stumpH = h * 0.28;
    return (
      <group>
        {/* Replace building body with a low stump */}
        <mesh position={[px, stumpH / 2, pz]}>
          <boxGeometry args={[w, stumpH, d]} />
          <meshStandardMaterial color="#2a2420" roughness={1} />
        </mesh>
        {/* Jagged broken top chunks */}
        {Array.from({ length: 6 }, (_, ji) => {
          const jx = px + (seededRand(id + ji * 13)() - 0.5) * (w * 0.7);
          const jz = pz + (seededRand(id + ji * 17)() - 0.5) * (d * 0.7);
          const jh = stumpH + seededRand(id + ji * 5)() * h * 0.18;
          const jw = 1.5 + seededRand(id + ji * 3)() * 3;
          return (
            <mesh key={ji} position={[jx, jh, jz]}>
              <boxGeometry args={[jw, 2 + seededRand(id + ji)() * 4, jw * 0.8]} />
              <meshStandardMaterial color="#1e1a16" roughness={1} />
            </mesh>
          );
        })}
        {/* Rubble pile at base */}
        {Array.from({ length: 8 }, (_, ri) => {
          const r = seededRand(id + ri * 11);
          return (
            <mesh key={`rb${ri}`} position={[px + (r() - 0.5) * w * 1.1, 0.4 + r() * 0.8, pz + (r() - 0.5) * d * 1.1]}
              rotation={[r() * 0.8, r() * Math.PI, r() * 0.6]}>
              <boxGeometry args={[1 + r() * 3, 0.5 + r() * 1.5, 1 + r() * 2.5]} />
              <meshStandardMaterial color="#2e2820" roughness={1} />
            </mesh>
          );
        })}
        {holes}
      </group>
    );
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
  triggerRef: React.MutableRefObject<(stage: number, w: number, h: number, d: number) => void>;
}

function BuildingDebris({ position, color, triggerRef }: BuildingDebrisProps) {
  const meshFacade  = useRef<THREE.InstancedMesh>(null); // painted surface chunks
  const meshConcrete= useRef<THREE.InstancedMesh>(null); // dark raw concrete
  const meshRebar   = useRef<THREE.InstancedMesh>(null); // thin metal rods
  const meshGlass   = useRef<THREE.InstancedMesh>(null); // bright glass shards
  const meshBrick   = useRef<THREE.InstancedMesh>(null); // brick/mortar chunks
  const particles   = useRef<DebrisParticle[]>([]);
  const hasActive   = useRef(false);

  triggerRef.current = (stage: number, w: number, h: number, d: number) => {
    // More particles at higher stages — finer, denser burst
    const count = stage === 3 ? 128 : stage === 2 ? 72 : 40;
    const px = position[0], pz = position[2];

    const face = Math.floor(Math.random() * 4);
    const fx = face === 2 ? -w / 2 : face === 3 ? w / 2 : 0;
    const fz = face === 0 ? d / 2  : face === 1 ? -d / 2 : 0;

    for (let i = 0; i < count; i++) {
      const spreadX = face < 2 ? (Math.random() - 0.5) * w * 0.95 : (Math.random() - 0.5) * 0.6;
      const spreadZ = face >= 2 ? (Math.random() - 0.5) * d * 0.95 : (Math.random() - 0.5) * 0.6;
      const ry = 1.5 + Math.random() * (stage === 3 ? h * 0.98 : h * 0.6);

      const outX = fx !== 0 ? (fx / Math.abs(fx)) * (10 + Math.random() * 32) : (Math.random() - 0.5) * 22;
      const outZ = fz !== 0 ? (fz / Math.abs(fz)) * (10 + Math.random() * 32) : (Math.random() - 0.5) * 22;
      const lateralX = face < 2 ? (Math.random() - 0.5) * 24 : outX;
      const lateralZ = face >= 2 ? (Math.random() - 0.5) * 24 : outZ;
      const upward   = 4 + Math.random() * (stage === 3 ? 48 : 28);

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
export const debrisTriggers = new Map<number, (stage: number, w: number, h: number, d: number) => void>();
