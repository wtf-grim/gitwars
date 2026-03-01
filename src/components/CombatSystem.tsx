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
  { id:0,  side:"iran", position:[-390,0,-640], w:18, h:110, d:18, color:IC[0] },
  { id:1,  side:"iran", position:[-430,0,-600], w:15, h:95,  d:15, color:IC[1] },
  { id:2,  side:"iran", position:[-465,0,-655], w:17, h:100, d:17, color:IC[2] },
  { id:3,  side:"iran", position:[-510,0,-620], w:20, h:78,  d:18, color:IC[3] },
  { id:4,  side:"iran", position:[-358,0,-675], w:13, h:65,  d:14, color:IC[0] },
  { id:5,  side:"iran", position:[-548,0,-590], w:16, h:88,  d:16, color:IC[4] },
  { id:6,  side:"iran", position:[-338,0,-615], w:14, h:72,  d:14, color:IC[2] },
  { id:7,  side:"iran", position:[-405,0,-680], w:12, h:58,  d:14, color:IC[6] },
  { id:8,  side:"iran", position:[-455,0,-548], w:16, h:64,  d:16, color:IC[7] },
  { id:9,  side:"iran", position:[-590,0,-542], w:22, h:54,  d:20, color:IC[5] },
  { id:10, side:"iran", position:[-622,0,-652], w:22, h:52,  d:20, color:IC[7] },
  { id:11, side:"iran", position:[-480,0,-568], w:14, h:48,  d:14, color:IC[0] },
  { id:12, side:"iran", position:[-562,0,-635], w:15, h:42,  d:15, color:IC[3] },
  { id:13, side:"iran", position:[-680,0,-608], w:20, h:46,  d:18, color:IC[6] },
  { id:14, side:"iran", position:[-718,0,-660], w:16, h:38,  d:16, color:IC[1] },
  { id:15, side:"iran", position:[-742,0,-580], w:18, h:42,  d:16, color:IC[4] },
  { id:16, side:"iran", position:[-308,0,-558], w:12, h:38,  d:12, color:IC[2] },
  { id:17, side:"iran", position:[-268,0,-628], w:13, h:32,  d:12, color:IC[0] },
  { id:18, side:"iran", position:[-278,0,-550], w:12, h:28,  d:11, color:IC[5] },
  { id:19, side:"iran", position:[-758,0,-690], w:16, h:30,  d:16, color:IC[1] },
  { id:20, side:"iran", position:[-810,0,-630], w:20, h:36,  d:18, color:IC[3] },
  { id:21, side:"iran", position:[-840,0,-570], w:18, h:30,  d:16, color:IC[5] },
  { id:22, side:"iran", position:[-870,0,-650], w:16, h:26,  d:15, color:IC[7] },
  { id:23, side:"iran", position:[-350,0,-590], w:13, h:44,  d:13, color:IC[4] },
  { id:24, side:"iran", position:[-418,0,-555], w:14, h:52,  d:14, color:IC[3] },
  { id:25, side:"iran", position:[-490,0,-650], w:16, h:36,  d:14, color:IC[5] },
  { id:26, side:"iran", position:[-640,0,-545], w:14, h:34,  d:14, color:IC[2] },
  { id:27, side:"iran", position:[-700,0,-545], w:13, h:40,  d:13, color:IC[0] },
  { id:28, side:"iran", position:[-760,0,-520], w:18, h:30,  d:16, color:IC[6] },
  { id:29, side:"iran", position:[-820,0,-695], w:15, h:22,  d:14, color:IC[1] },
  // Midtown Z: -540 to 0
  { id:30, side:"iran", position:[-390,0,-440], w:18, h:100, d:18, color:IC[0] },
  { id:31, side:"iran", position:[-430,0,-400], w:15, h:82,  d:15, color:IC[1] },
  { id:32, side:"iran", position:[-465,0,-450], w:17, h:90,  d:17, color:IC[2] },
  { id:33, side:"iran", position:[-510,0,-418], w:20, h:68,  d:18, color:IC[3] },
  { id:34, side:"iran", position:[-358,0,-472], w:13, h:56,  d:14, color:IC[0] },
  { id:35, side:"iran", position:[-548,0,-388], w:16, h:75,  d:16, color:IC[4] },
  { id:36, side:"iran", position:[-338,0,-415], w:14, h:62,  d:14, color:IC[2] },
  { id:37, side:"iran", position:[-405,0,-475], w:12, h:48,  d:14, color:IC[6] },
  { id:38, side:"iran", position:[-455,0,-348], w:16, h:54,  d:16, color:IC[7] },
  { id:39, side:"iran", position:[-590,0,-342], w:22, h:44,  d:20, color:IC[5] },
  { id:40, side:"iran", position:[-542,0,-278], w:16, h:38,  d:16, color:IC[1] },
  { id:41, side:"iran", position:[-442,0,-258], w:15, h:32,  d:16, color:IC[3] },
  { id:42, side:"iran", position:[-372,0,-288], w:18, h:36,  d:15, color:IC[6] },
  { id:43, side:"iran", position:[-482,0,-308], w:14, h:30,  d:14, color:IC[0] },
  { id:44, side:"iran", position:[-622,0,-452], w:22, h:42,  d:20, color:IC[7] },
  { id:45, side:"iran", position:[-655,0,-318], w:18, h:34,  d:16, color:IC[4] },
  { id:46, side:"iran", position:[-308,0,-358], w:12, h:28,  d:12, color:IC[2] },
  { id:47, side:"iran", position:[-508,0,-352], w:13, h:38,  d:13, color:IC[5] },
  { id:48, side:"iran", position:[-562,0,-435], w:15, h:32,  d:15, color:IC[3] },
  { id:49, side:"iran", position:[-328,0,-338], w:11, h:24,  d:13, color:IC[1] },
  { id:50, side:"iran", position:[-698,0,-408], w:20, h:36,  d:18, color:IC[6] },
  { id:51, side:"iran", position:[-732,0,-452], w:24, h:28,  d:20, color:IC[6] },
  { id:52, side:"iran", position:[-758,0,-510], w:16, h:20,  d:16, color:IC[1] },
  { id:53, side:"iran", position:[-692,0,-378], w:18, h:22,  d:16, color:IC[0] },
  { id:54, side:"iran", position:[-268,0,-428], w:13, h:22,  d:12, color:IC[0] },
  { id:55, side:"iran", position:[-278,0,-350], w:12, h:16,  d:11, color:IC[5] },
  { id:56, side:"iran", position:[-318,0,-505], w:12, h:18,  d:12, color:IC[2] },
  { id:57, side:"iran", position:[-490,0,-188], w:20, h:18,  d:14, color:IC[5] },
  { id:58, side:"iran", position:[-572,0,-222], w:16, h:20,  d:14, color:IC[3] },
  { id:59, side:"iran", position:[-342,0,-222], w:14, h:16,  d:12, color:IC[7] },
  { id:60, side:"iran", position:[-415,0,-168], w:13, h:14,  d:13, color:IC[4] },
  { id:61, side:"iran", position:[-780,0,-388], w:18, h:26,  d:16, color:IC[2] },
  { id:62, side:"iran", position:[-820,0,-430], w:20, h:22,  d:18, color:IC[5] },
  { id:63, side:"iran", position:[-855,0,-380], w:16, h:18,  d:14, color:IC[0] },
  { id:64, side:"iran", position:[-880,0,-440], w:14, h:20,  d:13, color:IC[3] },
  { id:65, side:"iran", position:[-800,0,-480], w:16, h:28,  d:15, color:IC[6] },
  { id:66, side:"iran", position:[-840,0,-310], w:18, h:22,  d:16, color:IC[4] },
  { id:67, side:"iran", position:[-880,0,-290], w:14, h:18,  d:14, color:IC[7] },
  { id:68, side:"iran", position:[-755,0,-268], w:16, h:24,  d:14, color:IC[1] },
  // City Center Z: 0 to +350
  { id:69, side:"iran", position:[-282,0,90],   w:14, h:42,  d:14, color:IC[1] },
  { id:70, side:"iran", position:[-320,0,115],  w:16, h:52,  d:16, color:IC[0] },
  { id:71, side:"iran", position:[-368,0,158],  w:15, h:44,  d:14, color:IC[2] },
  { id:72, side:"iran", position:[-288,0,182],  w:13, h:36,  d:13, color:IC[1] },
  { id:73, side:"iran", position:[-428,0,102],  w:18, h:48,  d:16, color:IC[4] },
  { id:74, side:"iran", position:[-488,0,158],  w:14, h:38,  d:14, color:IC[5] },
  { id:75, side:"iran", position:[-542,0,212],  w:16, h:32,  d:15, color:IC[3] },
  { id:76, side:"iran", position:[-398,0,252],  w:20, h:26,  d:18, color:IC[7] },
  { id:77, side:"iran", position:[-308,0,242],  w:12, h:22,  d:12, color:IC[0] },
  { id:78, side:"iran", position:[-458,0,292],  w:18, h:24,  d:16, color:IC[6] },
  { id:79, side:"iran", position:[-582,0,142],  w:22, h:30,  d:20, color:IC[2] },
  { id:80, side:"iran", position:[-622,0,232],  w:16, h:20,  d:14, color:IC[4] },
  { id:81, side:"iran", position:[-268,0,162],  w:11, h:18,  d:12, color:IC[3] },
  { id:82, side:"iran", position:[-502,0,85],   w:14, h:28,  d:14, color:IC[7] },
  { id:83, side:"iran", position:[-655,0,175],  w:18, h:24,  d:16, color:IC[5] },
  { id:84, side:"iran", position:[-348,0,312],  w:13, h:18,  d:13, color:IC[1] },
  { id:85, side:"iran", position:[-412,0,338],  w:16, h:16,  d:14, color:IC[0] },
  { id:86, side:"iran", position:[-700,0,68],   w:20, h:28,  d:18, color:IC[6] },
  { id:87, side:"iran", position:[-745,0,130],  w:18, h:22,  d:16, color:IC[3] },
  { id:88, side:"iran", position:[-780,0,205],  w:16, h:26,  d:15, color:IC[2] },
  { id:89, side:"iran", position:[-820,0,95],   w:20, h:20,  d:18, color:IC[5] },
  { id:90, side:"iran", position:[-855,0,175],  w:16, h:18,  d:14, color:IC[0] },
  { id:91, side:"iran", position:[-880,0,235],  w:14, h:16,  d:13, color:IC[4] },
  { id:92, side:"iran", position:[-258,0,40],   w:12, h:20,  d:12, color:IC[2] },
  { id:93, side:"iran", position:[-268,0,108],  w:11, h:24,  d:11, color:IC[7] },
  { id:94, side:"iran", position:[-470,0,18],   w:14, h:30,  d:14, color:IC[5] },
  { id:95, side:"iran", position:[-540,0,42],   w:16, h:36,  d:15, color:IC[3] },
  { id:96, side:"iran", position:[-608,0,22],   w:18, h:28,  d:16, color:IC[1] },
  { id:97, side:"iran", position:[-665,0,280],  w:16, h:22,  d:14, color:IC[4] },
  { id:98, side:"iran", position:[-718,0,312],  w:18, h:20,  d:16, color:IC[0] },
  { id:99, side:"iran", position:[-762,0,275],  w:16, h:18,  d:15, color:IC[7] },
  { id:100, side:"iran", position:[-805,0,328], w:20, h:16,  d:18, color:IC[2] },
  { id:101, side:"iran", position:[-848,0,280], w:14, h:14,  d:13, color:IC[5] },
  // South Zone Z: +350 to +700
  { id:102, side:"iran", position:[-268,0,388], w:12, h:18,  d:12, color:IC[3] },
  { id:103, side:"iran", position:[-370,0,402], w:14, h:24,  d:14, color:IC[5] },
  { id:104, side:"iran", position:[-432,0,448], w:18, h:30,  d:16, color:IC[1] },
  { id:105, side:"iran", position:[-502,0,412], w:13, h:22,  d:13, color:IC[3] },
  { id:106, side:"iran", position:[-558,0,462], w:16, h:26,  d:16, color:IC[7] },
  { id:107, side:"iran", position:[-602,0,402], w:20, h:20,  d:18, color:IC[4] },
  { id:108, side:"iran", position:[-342,0,472], w:12, h:16,  d:12, color:IC[6] },
  { id:109, side:"iran", position:[-472,0,514], w:16, h:22,  d:14, color:IC[2] },
  { id:110, side:"iran", position:[-318,0,445], w:11, h:14,  d:11, color:IC[0] },
  { id:111, side:"iran", position:[-652,0,435], w:18, h:18,  d:16, color:IC[2] },
  { id:112, side:"iran", position:[-718,0,488], w:16, h:16,  d:14, color:IC[5] },
  { id:113, side:"iran", position:[-405,0,535], w:14, h:14,  d:13, color:IC[7] },
  { id:114, side:"iran", position:[-258,0,520], w:12, h:16,  d:12, color:IC[4] },
  { id:115, side:"iran", position:[-298,0,568], w:13, h:18,  d:13, color:IC[1] },
  { id:116, side:"iran", position:[-355,0,608], w:15, h:22,  d:14, color:IC[6] },
  { id:117, side:"iran", position:[-418,0,578], w:14, h:20,  d:14, color:IC[0] },
  { id:118, side:"iran", position:[-482,0,618], w:16, h:18,  d:15, color:IC[3] },
  { id:119, side:"iran", position:[-538,0,558], w:18, h:16,  d:16, color:IC[2] },
  { id:120, side:"iran", position:[-592,0,592], w:14, h:14,  d:13, color:IC[7] },
  { id:121, side:"iran", position:[-648,0,538], w:16, h:18,  d:15, color:IC[5] },
  { id:122, side:"iran", position:[-705,0,568], w:18, h:16,  d:16, color:IC[4] },
  { id:123, side:"iran", position:[-758,0,512], w:16, h:14,  d:14, color:IC[1] },
  { id:124, side:"iran", position:[-808,0,568], w:18, h:16,  d:16, color:IC[3] },
  { id:125, side:"iran", position:[-848,0,480], w:20, h:14,  d:18, color:IC[6] },
  { id:126, side:"iran", position:[-870,0,548], w:14, h:12,  d:13, color:IC[0] },
  { id:127, side:"iran", position:[-758,0,625], w:14, h:12,  d:13, color:IC[4] },
  { id:128, side:"iran", position:[-680,0,640], w:16, h:14,  d:14, color:IC[2] },
  { id:129, side:"iran", position:[-600,0,660], w:12, h:12,  d:12, color:IC[7] },
  { id:130, side:"iran", position:[-520,0,658], w:14, h:14,  d:13, color:IC[5] },
  { id:131, side:"iran", position:[-440,0,648], w:13, h:16,  d:13, color:IC[1] },
  { id:132, side:"iran", position:[-360,0,648], w:12, h:12,  d:12, color:IC[3] },
  { id:133, side:"iran", position:[-278,0,630], w:11, h:14,  d:11, color:IC[6] },
  // West Dense Zone X: -700 to -900
  { id:134, side:"iran", position:[-740,0,-245], w:20, h:32, d:18, color:IC[3] },
  { id:135, side:"iran", position:[-780,0,-168], w:18, h:28, d:16, color:IC[5] },
  { id:136, side:"iran", position:[-820,0,-222], w:22, h:24, d:20, color:IC[1] },
  { id:137, side:"iran", position:[-858,0,-158], w:16, h:20, d:15, color:IC[6] },
  { id:138, side:"iran", position:[-880,0,-110], w:14, h:18, d:13, color:IC[4] },
  { id:139, side:"iran", position:[-760,0,-78],  w:18, h:26, d:16, color:IC[2] },
  { id:140, side:"iran", position:[-810,0,-28],  w:20, h:22, d:18, color:IC[7] },
  { id:141, side:"iran", position:[-855,0,-55],  w:16, h:18, d:15, color:IC[0] },
  { id:142, side:"iran", position:[-740,0,22],   w:18, h:24, d:16, color:IC[3] },
  { id:143, side:"iran", position:[-800,0,72],   w:22, h:20, d:20, color:IC[5] },
  { id:144, side:"iran", position:[-852,0,32],   w:16, h:16, d:14, color:IC[1] },
  { id:145, side:"iran", position:[-880,0,95],   w:14, h:14, d:13, color:IC[4] },
  { id:146, side:"iran", position:[-740,0,378],  w:20, h:18, d:18, color:IC[6] },
  { id:147, side:"iran", position:[-790,0,428],  w:18, h:16, d:16, color:IC[3] },
  { id:148, side:"iran", position:[-835,0,382],  w:16, h:14, d:15, color:IC[0] },
  { id:149, side:"iran", position:[-870,0,440],  w:14, h:12, d:13, color:IC[7] },
  { id:150, side:"iran", position:[-880,0,368],  w:15, h:14, d:14, color:IC[2] },
];

// ─────────────────────────────────────────────────────────────────
// ISRAEL BUILDINGS DATA
// ─────────────────────────────────────────────────────────────────
const IS_C = ["#f0ead8","#e8e0cc","#ddd5c0","#ece4d4","#f4eed8","#e0d8c8","#eae2d0","#f0e8d4"];
const IS_W = "#aaddff";

export const ISRAEL_BUILDINGS: BuildingDef[] = [
  // Downtown Core Z: -700 to -540
  { id:200, side:"israel", position:[390,0,-640],  w:18, h:110, d:18, color:IS_C[0], windowColor:IS_W },
  { id:201, side:"israel", position:[430,0,-600],  w:15, h:95,  d:15, color:IS_C[1], windowColor:IS_W },
  { id:202, side:"israel", position:[465,0,-655],  w:17, h:100, d:17, color:IS_C[2], windowColor:IS_W },
  { id:203, side:"israel", position:[510,0,-620],  w:20, h:78,  d:18, color:IS_C[3], windowColor:IS_W },
  { id:204, side:"israel", position:[358,0,-675],  w:13, h:65,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:205, side:"israel", position:[548,0,-590],  w:16, h:88,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:206, side:"israel", position:[338,0,-615],  w:14, h:72,  d:14, color:IS_C[2], windowColor:IS_W },
  { id:207, side:"israel", position:[405,0,-680],  w:12, h:58,  d:14, color:IS_C[6], windowColor:IS_W },
  { id:208, side:"israel", position:[455,0,-548],  w:16, h:64,  d:16, color:IS_C[7], windowColor:IS_W },
  { id:209, side:"israel", position:[590,0,-542],  w:22, h:54,  d:20, color:IS_C[5], windowColor:IS_W },
  { id:210, side:"israel", position:[622,0,-652],  w:22, h:52,  d:20, color:IS_C[7], windowColor:IS_W },
  { id:211, side:"israel", position:[480,0,-568],  w:14, h:48,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:212, side:"israel", position:[562,0,-635],  w:15, h:42,  d:15, color:IS_C[3], windowColor:IS_W },
  { id:213, side:"israel", position:[680,0,-608],  w:20, h:46,  d:18, color:IS_C[6], windowColor:IS_W },
  { id:214, side:"israel", position:[718,0,-660],  w:16, h:38,  d:16, color:IS_C[1], windowColor:IS_W },
  { id:215, side:"israel", position:[742,0,-580],  w:18, h:42,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:216, side:"israel", position:[308,0,-558],  w:12, h:38,  d:12, color:IS_C[2], windowColor:IS_W },
  { id:217, side:"israel", position:[268,0,-628],  w:13, h:32,  d:12, color:IS_C[0], windowColor:IS_W },
  { id:218, side:"israel", position:[278,0,-550],  w:12, h:28,  d:11, color:IS_C[5], windowColor:IS_W },
  { id:219, side:"israel", position:[758,0,-690],  w:16, h:30,  d:16, color:IS_C[1], windowColor:IS_W },
  { id:220, side:"israel", position:[810,0,-630],  w:20, h:36,  d:18, color:IS_C[3], windowColor:IS_W },
  { id:221, side:"israel", position:[840,0,-570],  w:18, h:30,  d:16, color:IS_C[5], windowColor:IS_W },
  { id:222, side:"israel", position:[870,0,-650],  w:16, h:26,  d:15, color:IS_C[7], windowColor:IS_W },
  { id:223, side:"israel", position:[350,0,-590],  w:13, h:44,  d:13, color:IS_C[4], windowColor:IS_W },
  { id:224, side:"israel", position:[418,0,-555],  w:14, h:52,  d:14, color:IS_C[3], windowColor:IS_W },
  { id:225, side:"israel", position:[490,0,-650],  w:16, h:36,  d:14, color:IS_C[5], windowColor:IS_W },
  { id:226, side:"israel", position:[640,0,-545],  w:14, h:34,  d:14, color:IS_C[2], windowColor:IS_W },
  { id:227, side:"israel", position:[700,0,-545],  w:13, h:40,  d:13, color:IS_C[0], windowColor:IS_W },
  { id:228, side:"israel", position:[760,0,-520],  w:18, h:30,  d:16, color:IS_C[6], windowColor:IS_W },
  { id:229, side:"israel", position:[820,0,-695],  w:15, h:22,  d:14, color:IS_C[1], windowColor:IS_W },
  // Midtown Z: -540 to 0
  { id:230, side:"israel", position:[390,0,-440],  w:18, h:105, d:18, color:IS_C[0], windowColor:IS_W },
  { id:231, side:"israel", position:[430,0,-400],  w:15, h:84,  d:15, color:IS_C[1], windowColor:IS_W },
  { id:232, side:"israel", position:[465,0,-450],  w:17, h:92,  d:17, color:IS_C[2], windowColor:IS_W },
  { id:233, side:"israel", position:[510,0,-418],  w:20, h:70,  d:18, color:IS_C[3], windowColor:IS_W },
  { id:234, side:"israel", position:[358,0,-472],  w:13, h:58,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:235, side:"israel", position:[548,0,-388],  w:16, h:76,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:236, side:"israel", position:[338,0,-415],  w:14, h:64,  d:14, color:IS_C[2], windowColor:IS_W },
  { id:237, side:"israel", position:[405,0,-475],  w:12, h:50,  d:14, color:IS_C[6], windowColor:IS_W },
  { id:238, side:"israel", position:[455,0,-348],  w:16, h:56,  d:16, color:IS_C[7], windowColor:IS_W },
  { id:239, side:"israel", position:[590,0,-342],  w:22, h:46,  d:20, color:IS_C[5], windowColor:IS_W },
  { id:240, side:"israel", position:[542,0,-278],  w:16, h:40,  d:16, color:IS_C[1], windowColor:IS_W },
  { id:241, side:"israel", position:[442,0,-258],  w:15, h:34,  d:16, color:IS_C[3], windowColor:IS_W },
  { id:242, side:"israel", position:[372,0,-288],  w:18, h:38,  d:15, color:IS_C[6], windowColor:IS_W },
  { id:243, side:"israel", position:[482,0,-308],  w:14, h:32,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:244, side:"israel", position:[622,0,-452],  w:22, h:44,  d:20, color:IS_C[7], windowColor:IS_W },
  { id:245, side:"israel", position:[655,0,-318],  w:18, h:36,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:246, side:"israel", position:[308,0,-358],  w:12, h:30,  d:12, color:IS_C[2], windowColor:IS_W },
  { id:247, side:"israel", position:[508,0,-352],  w:13, h:40,  d:13, color:IS_C[5], windowColor:IS_W },
  { id:248, side:"israel", position:[562,0,-435],  w:15, h:34,  d:15, color:IS_C[3], windowColor:IS_W },
  { id:249, side:"israel", position:[328,0,-338],  w:11, h:26,  d:13, color:IS_C[1], windowColor:IS_W },
  { id:250, side:"israel", position:[698,0,-408],  w:20, h:38,  d:18, color:IS_C[6], windowColor:IS_W },
  { id:251, side:"israel", position:[732,0,-452],  w:24, h:30,  d:20, color:IS_C[6], windowColor:IS_W },
  { id:252, side:"israel", position:[758,0,-510],  w:16, h:20,  d:16, color:IS_C[1], windowColor:IS_W },
  { id:253, side:"israel", position:[692,0,-378],  w:18, h:24,  d:16, color:IS_C[0], windowColor:IS_W },
  { id:254, side:"israel", position:[268,0,-428],  w:13, h:22,  d:12, color:IS_C[0], windowColor:IS_W },
  { id:255, side:"israel", position:[278,0,-350],  w:12, h:16,  d:11, color:IS_C[5], windowColor:IS_W },
  { id:256, side:"israel", position:[318,0,-505],  w:12, h:18,  d:12, color:IS_C[2], windowColor:IS_W },
  { id:257, side:"israel", position:[490,0,-188],  w:20, h:20,  d:14, color:IS_C[5], windowColor:IS_W },
  { id:258, side:"israel", position:[572,0,-222],  w:16, h:22,  d:14, color:IS_C[3], windowColor:IS_W },
  { id:259, side:"israel", position:[342,0,-222],  w:14, h:18,  d:12, color:IS_C[7], windowColor:IS_W },
  { id:260, side:"israel", position:[415,0,-168],  w:13, h:14,  d:13, color:IS_C[4], windowColor:IS_W },
  { id:261, side:"israel", position:[780,0,-388],  w:18, h:26,  d:16, color:IS_C[2], windowColor:IS_W },
  { id:262, side:"israel", position:[820,0,-430],  w:20, h:22,  d:18, color:IS_C[5], windowColor:IS_W },
  { id:263, side:"israel", position:[855,0,-380],  w:16, h:18,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:264, side:"israel", position:[880,0,-440],  w:14, h:20,  d:13, color:IS_C[3], windowColor:IS_W },
  { id:265, side:"israel", position:[800,0,-480],  w:16, h:28,  d:15, color:IS_C[6], windowColor:IS_W },
  { id:266, side:"israel", position:[840,0,-310],  w:18, h:22,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:267, side:"israel", position:[880,0,-290],  w:14, h:18,  d:14, color:IS_C[7], windowColor:IS_W },
  { id:268, side:"israel", position:[755,0,-268],  w:16, h:24,  d:14, color:IS_C[1], windowColor:IS_W },
  // City Center Z: 0 to +350
  { id:269, side:"israel", position:[282,0,90],    w:14, h:44,  d:14, color:IS_C[1], windowColor:IS_W },
  { id:270, side:"israel", position:[320,0,115],   w:16, h:54,  d:16, color:IS_C[0], windowColor:IS_W },
  { id:271, side:"israel", position:[368,0,158],   w:15, h:46,  d:14, color:IS_C[2], windowColor:IS_W },
  { id:272, side:"israel", position:[288,0,182],   w:13, h:38,  d:13, color:IS_C[1], windowColor:IS_W },
  { id:273, side:"israel", position:[428,0,102],   w:18, h:50,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:274, side:"israel", position:[488,0,158],   w:14, h:40,  d:14, color:IS_C[5], windowColor:IS_W },
  { id:275, side:"israel", position:[542,0,212],   w:16, h:34,  d:15, color:IS_C[3], windowColor:IS_W },
  { id:276, side:"israel", position:[398,0,252],   w:20, h:28,  d:18, color:IS_C[7], windowColor:IS_W },
  { id:277, side:"israel", position:[308,0,242],   w:12, h:24,  d:12, color:IS_C[0], windowColor:IS_W },
  { id:278, side:"israel", position:[458,0,292],   w:18, h:26,  d:16, color:IS_C[6], windowColor:IS_W },
  { id:279, side:"israel", position:[582,0,142],   w:22, h:32,  d:20, color:IS_C[2], windowColor:IS_W },
  { id:280, side:"israel", position:[622,0,232],   w:16, h:22,  d:14, color:IS_C[4], windowColor:IS_W },
  { id:281, side:"israel", position:[268,0,162],   w:11, h:20,  d:12, color:IS_C[3], windowColor:IS_W },
  { id:282, side:"israel", position:[502,0,85],    w:14, h:30,  d:14, color:IS_C[7], windowColor:IS_W },
  { id:283, side:"israel", position:[655,0,175],   w:18, h:26,  d:16, color:IS_C[5], windowColor:IS_W },
  { id:284, side:"israel", position:[348,0,312],   w:13, h:20,  d:13, color:IS_C[1], windowColor:IS_W },
  { id:285, side:"israel", position:[412,0,338],   w:16, h:18,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:286, side:"israel", position:[700,0,68],    w:20, h:28,  d:18, color:IS_C[6], windowColor:IS_W },
  { id:287, side:"israel", position:[745,0,130],   w:18, h:22,  d:16, color:IS_C[3], windowColor:IS_W },
  { id:288, side:"israel", position:[780,0,205],   w:16, h:26,  d:15, color:IS_C[2], windowColor:IS_W },
  { id:289, side:"israel", position:[820,0,95],    w:20, h:20,  d:18, color:IS_C[5], windowColor:IS_W },
  { id:290, side:"israel", position:[855,0,175],   w:16, h:18,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:291, side:"israel", position:[880,0,235],   w:14, h:16,  d:13, color:IS_C[4], windowColor:IS_W },
  { id:292, side:"israel", position:[258,0,40],    w:12, h:20,  d:12, color:IS_C[2], windowColor:IS_W },
  { id:293, side:"israel", position:[268,0,108],   w:11, h:24,  d:11, color:IS_C[7], windowColor:IS_W },
  { id:294, side:"israel", position:[470,0,18],    w:14, h:30,  d:14, color:IS_C[5], windowColor:IS_W },
  { id:295, side:"israel", position:[540,0,42],    w:16, h:36,  d:15, color:IS_C[3], windowColor:IS_W },
  { id:296, side:"israel", position:[608,0,22],    w:18, h:28,  d:16, color:IS_C[1], windowColor:IS_W },
  { id:297, side:"israel", position:[665,0,280],   w:16, h:22,  d:14, color:IS_C[4], windowColor:IS_W },
  { id:298, side:"israel", position:[718,0,312],   w:18, h:20,  d:16, color:IS_C[0], windowColor:IS_W },
  { id:299, side:"israel", position:[762,0,275],   w:16, h:18,  d:15, color:IS_C[7], windowColor:IS_W },
  { id:300, side:"israel", position:[805,0,328],   w:20, h:16,  d:18, color:IS_C[2], windowColor:IS_W },
  { id:301, side:"israel", position:[848,0,280],   w:14, h:14,  d:13, color:IS_C[5], windowColor:IS_W },
  // South Zone Z: +350 to +700
  { id:302, side:"israel", position:[268,0,388],   w:12, h:20,  d:12, color:IS_C[3], windowColor:IS_W },
  { id:303, side:"israel", position:[370,0,402],   w:14, h:26,  d:14, color:IS_C[5], windowColor:IS_W },
  { id:304, side:"israel", position:[432,0,448],   w:18, h:32,  d:16, color:IS_C[1], windowColor:IS_W },
  { id:305, side:"israel", position:[502,0,412],   w:13, h:24,  d:13, color:IS_C[3], windowColor:IS_W },
  { id:306, side:"israel", position:[558,0,462],   w:16, h:28,  d:16, color:IS_C[7], windowColor:IS_W },
  { id:307, side:"israel", position:[602,0,402],   w:20, h:22,  d:18, color:IS_C[4], windowColor:IS_W },
  { id:308, side:"israel", position:[342,0,472],   w:12, h:18,  d:12, color:IS_C[6], windowColor:IS_W },
  { id:309, side:"israel", position:[472,0,514],   w:16, h:24,  d:14, color:IS_C[2], windowColor:IS_W },
  { id:310, side:"israel", position:[318,0,445],   w:11, h:16,  d:11, color:IS_C[0], windowColor:IS_W },
  { id:311, side:"israel", position:[652,0,435],   w:18, h:20,  d:16, color:IS_C[2], windowColor:IS_W },
  { id:312, side:"israel", position:[718,0,488],   w:16, h:18,  d:14, color:IS_C[5], windowColor:IS_W },
  { id:313, side:"israel", position:[405,0,535],   w:14, h:16,  d:13, color:IS_C[7], windowColor:IS_W },
  { id:314, side:"israel", position:[258,0,520],   w:12, h:16,  d:12, color:IS_C[4], windowColor:IS_W },
  { id:315, side:"israel", position:[298,0,568],   w:13, h:18,  d:13, color:IS_C[1], windowColor:IS_W },
  { id:316, side:"israel", position:[355,0,608],   w:15, h:22,  d:14, color:IS_C[6], windowColor:IS_W },
  { id:317, side:"israel", position:[418,0,578],   w:14, h:20,  d:14, color:IS_C[0], windowColor:IS_W },
  { id:318, side:"israel", position:[482,0,618],   w:16, h:18,  d:15, color:IS_C[3], windowColor:IS_W },
  { id:319, side:"israel", position:[538,0,558],   w:18, h:16,  d:16, color:IS_C[2], windowColor:IS_W },
  { id:320, side:"israel", position:[592,0,592],   w:14, h:14,  d:13, color:IS_C[7], windowColor:IS_W },
  { id:321, side:"israel", position:[648,0,538],   w:16, h:18,  d:15, color:IS_C[5], windowColor:IS_W },
  { id:322, side:"israel", position:[705,0,568],   w:18, h:16,  d:16, color:IS_C[4], windowColor:IS_W },
  { id:323, side:"israel", position:[758,0,512],   w:16, h:14,  d:14, color:IS_C[1], windowColor:IS_W },
  { id:324, side:"israel", position:[808,0,568],   w:18, h:16,  d:16, color:IS_C[3], windowColor:IS_W },
  { id:325, side:"israel", position:[848,0,480],   w:20, h:14,  d:18, color:IS_C[6], windowColor:IS_W },
  { id:326, side:"israel", position:[870,0,548],   w:14, h:12,  d:13, color:IS_C[0], windowColor:IS_W },
  { id:327, side:"israel", position:[758,0,625],   w:14, h:12,  d:13, color:IS_C[4], windowColor:IS_W },
  { id:328, side:"israel", position:[680,0,640],   w:16, h:14,  d:14, color:IS_C[2], windowColor:IS_W },
  { id:329, side:"israel", position:[600,0,660],   w:12, h:12,  d:12, color:IS_C[7], windowColor:IS_W },
  { id:330, side:"israel", position:[520,0,658],   w:14, h:14,  d:13, color:IS_C[5], windowColor:IS_W },
  { id:331, side:"israel", position:[440,0,648],   w:13, h:16,  d:13, color:IS_C[1], windowColor:IS_W },
  { id:332, side:"israel", position:[360,0,648],   w:12, h:12,  d:12, color:IS_C[3], windowColor:IS_W },
  { id:333, side:"israel", position:[278,0,630],   w:11, h:14,  d:11, color:IS_C[6], windowColor:IS_W },
  // East Dense Zone X: +700 to +900
  { id:334, side:"israel", position:[740,0,-245],  w:20, h:32, d:18, color:IS_C[3], windowColor:IS_W },
  { id:335, side:"israel", position:[780,0,-168],  w:18, h:28, d:16, color:IS_C[5], windowColor:IS_W },
  { id:336, side:"israel", position:[820,0,-222],  w:22, h:24, d:20, color:IS_C[1], windowColor:IS_W },
  { id:337, side:"israel", position:[858,0,-158],  w:16, h:20, d:15, color:IS_C[6], windowColor:IS_W },
  { id:338, side:"israel", position:[880,0,-110],  w:14, h:18, d:13, color:IS_C[4], windowColor:IS_W },
  { id:339, side:"israel", position:[760,0,-78],   w:18, h:26, d:16, color:IS_C[2], windowColor:IS_W },
  { id:340, side:"israel", position:[810,0,-28],   w:20, h:22, d:18, color:IS_C[7], windowColor:IS_W },
  { id:341, side:"israel", position:[855,0,-55],   w:16, h:18, d:15, color:IS_C[0], windowColor:IS_W },
  { id:342, side:"israel", position:[740,0,22],    w:18, h:24, d:16, color:IS_C[3], windowColor:IS_W },
  { id:343, side:"israel", position:[800,0,72],    w:22, h:20, d:20, color:IS_C[5], windowColor:IS_W },
  { id:344, side:"israel", position:[852,0,32],    w:16, h:16, d:14, color:IS_C[1], windowColor:IS_W },
  { id:345, side:"israel", position:[880,0,95],    w:14, h:14, d:13, color:IS_C[4], windowColor:IS_W },
  { id:346, side:"israel", position:[740,0,378],   w:20, h:18, d:18, color:IS_C[6], windowColor:IS_W },
  { id:347, side:"israel", position:[790,0,428],   w:18, h:16, d:16, color:IS_C[3], windowColor:IS_W },
  { id:348, side:"israel", position:[835,0,382],   w:16, h:14, d:15, color:IS_C[0], windowColor:IS_W },
  { id:349, side:"israel", position:[870,0,440],   w:14, h:12, d:13, color:IS_C[7], windowColor:IS_W },
  { id:350, side:"israel", position:[880,0,368],   w:15, h:14, d:14, color:IS_C[2], windowColor:IS_W },
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

const FIRE_COOLDOWN: Record<PlaneTier, number> = { 1: 600, 2: 400, 3: 250, 4: 150, 5: 1200 };
const TIER_DAMAGE:   Record<PlaneTier, number> = { 1: 20,  2: 35,  3: 50,  4: 70,  5: 150 };
const BULLET_SPEED  = 600;
const BULLET_RANGE: Record<PlaneTier, number>  = { 1: 350, 2: 450, 3: 550, 4: 650, 5: 0 };
const BOMB_BLAST_RADIUS = 35;
const MAX_BULLETS = 40;
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
    : plane.position.clone().addScaledVector(forward, 10);

  const velocity = isBomb
    ? forward.clone().multiplyScalar(50).add(new THREE.Vector3(0, -8, 0))
    : forward.clone().multiplyScalar(BULLET_SPEED);

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
  side: "iran" | "israel",
  tier: PlaneTier,
  onScoreChange: (s: ScoreState) => void,
  onCrash: () => void
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
        _mat.compose(p.position, _quat, new THREE.Vector3(1, 1, 1));
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
}

export function CombatLayer({ planeRef, fireQueueRef, side, tier, onScoreChange, onCrash }: CombatLayerProps) {
  const bulletMeshRef = useRef<THREE.InstancedMesh>(null);
  const bombMeshRef   = useRef<THREE.InstancedMesh>(null);

  useCombatSystem(planeRef, bulletMeshRef, bombMeshRef, fireQueueRef, side, tier, onScoreChange, onCrash);

  const bulletColor = side === "iran" ? "#ff6600" : "#88ccff";

  return (
    <>
      {/* Bullet pool */}
      <instancedMesh ref={bulletMeshRef} args={[undefined, undefined, MAX_BULLETS]} frustumCulled={false}>
        <boxGeometry args={[0.35, 0.35, 2.8]} />
        <meshStandardMaterial
          color={bulletColor}
          emissive={bulletColor}
          emissiveIntensity={5}
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
  const holes: JSX.Element[] = [];

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

// ─── BuildingDebris — tumbling pixel chunks with varied sizes ────────

const DEBRIS_CAP = 64;

interface DebrisParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  axis: THREE.Vector3;   // tumble axis
  spin: number;          // rad/s
  angle: number;         // current rotation
  size: number;          // base chunk size
  life: number;
  maxLife: number;
  dark: boolean;         // concrete/interior chunk vs building-colour chunk
}

interface BuildingDebrisProps {
  position: [number, number, number];
  color: string;
  triggerRef: React.MutableRefObject<(stage: number, w: number, h: number, d: number) => void>;
}

function BuildingDebris({ position, color, triggerRef }: BuildingDebrisProps) {
  const meshMain = useRef<THREE.InstancedMesh>(null); // building-colour chunks
  const meshDark = useRef<THREE.InstancedMesh>(null); // concrete/interior chunks
  const particles = useRef<DebrisParticle[]>([]);
  const hasActive = useRef(false);

  triggerRef.current = (stage: number, w: number, h: number, d: number) => {
    const count = stage === 3 ? 56 : stage === 2 ? 30 : 16;
    const px = position[0], pz = position[2];

    // Pick a random face to blast from — gives directional scatter
    const face = Math.floor(Math.random() * 4); // 0=front, 1=back, 2=left, 3=right
    const fx = face === 2 ? -w / 2 : face === 3 ? w / 2 : 0;
    const fz = face === 0 ? d / 2  : face === 1 ? -d / 2 : 0;

    for (let i = 0; i < count; i++) {
      // Spawn near the face surface, spread along it
      const spreadX = face < 2 ? (Math.random() - 0.5) * w * 0.9 : (Math.random() * 0.4);
      const spreadZ = face >= 2 ? (Math.random() - 0.5) * d * 0.9 : (Math.random() * 0.4);
      const ry = 2 + Math.random() * (stage === 3 ? h * 0.95 : h * 0.55);

      // Velocity: outward from face + upward burst + random spread
      const outX = fx !== 0 ? (fx / Math.abs(fx)) * (12 + Math.random() * 28) : (Math.random() - 0.5) * 20;
      const outZ = fz !== 0 ? (fz / Math.abs(fz)) * (12 + Math.random() * 28) : (Math.random() - 0.5) * 20;
      const lateralX = face < 2 ? (Math.random() - 0.5) * 22 : outX;
      const lateralZ = face >= 2 ? (Math.random() - 0.5) * 22 : outZ;
      const upward = 6 + Math.random() * (stage === 3 ? 45 : 25);

      // Varied chunk sizes: small slivers, medium blocks, large slabs
      const sizeRoll = Math.random();
      const size = sizeRoll < 0.45 ? 0.5 + Math.random() * 0.5   // small
                 : sizeRoll < 0.80 ? 1.0 + Math.random() * 0.8   // medium
                 :                   1.8 + Math.random() * 1.0;   // large slab

      const life = 1.6 + Math.random() * 1.2;
      particles.current.push({
        pos: new THREE.Vector3(px + fx + spreadX, ry, pz + fz + spreadZ),
        vel: new THREE.Vector3(lateralX, upward, lateralZ),
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        spin: (Math.random() - 0.5) * 8,
        angle: Math.random() * Math.PI * 2,
        size,
        life,
        maxLife: life,
        dark: Math.random() < 0.35, // 35% are concrete/rebar chunks
      });
    }
    if (particles.current.length > DEBRIS_CAP) {
      particles.current = particles.current.slice(-DEBRIS_CAP);
    }
    hasActive.current = true;
  };

  const _mat  = useRef(new THREE.Matrix4());
  const _q    = useRef(new THREE.Quaternion());
  const _axis = useRef(new THREE.Vector3());
  const _sc   = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!hasActive.current) return;
    const mMain = meshMain.current;
    const mDark = meshDark.current;
    if (!mMain || !mDark) return;
    const dt = Math.min(delta, 0.05);

    let mainIdx = 0, darkIdx = 0, anyAlive = false;

    for (const p of particles.current) {
      if (p.life <= 0) continue;

      p.vel.y -= 60 * dt;
      p.pos.addScaledVector(p.vel, dt);
      if (p.pos.y < 0) {
        p.pos.y = 0;
        p.vel.y *= -0.18;
        p.vel.x *= 0.55;
        p.vel.z *= 0.55;
        p.spin  *= 0.4;
      }
      p.angle += p.spin * dt;
      p.life  -= dt;

      const t = Math.max(0, p.life / p.maxLife);
      // Chunks keep full size then shrink sharply in last 30% of life
      const s = p.size * (t < 0.3 ? t / 0.3 : 1.0);
      _sc.current.set(s, s * (0.6 + Math.random() * 0.4), s); // slightly flattened = slab-like
      _axis.current.copy(p.axis);
      _q.current.setFromAxisAngle(_axis.current, p.angle);
      _mat.current.compose(p.pos, _q.current, _sc.current);

      if (!p.dark && mainIdx < DEBRIS_CAP) {
        mMain.setMatrixAt(mainIdx++, _mat.current);
      } else if (p.dark && darkIdx < DEBRIS_CAP) {
        mDark.setMatrixAt(darkIdx++, _mat.current);
      }
      anyAlive = true;
    }

    // Zero remaining slots
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = mainIdx; i < DEBRIS_CAP; i++) mMain.setMatrixAt(i, zero);
    for (let i = darkIdx; i < DEBRIS_CAP; i++) mDark.setMatrixAt(i, zero);
    mMain.instanceMatrix.needsUpdate = true;
    mDark.instanceMatrix.needsUpdate = true;
    hasActive.current = anyAlive;

    if (!anyAlive) particles.current = [];
  });

  return (
    <>
      {/* Building-colour chunks */}
      <instancedMesh ref={meshMain} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </instancedMesh>
      {/* Concrete / dark interior chunks */}
      <instancedMesh ref={meshDark} args={[undefined, undefined, DEBRIS_CAP]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a3530" roughness={0.95} />
      </instancedMesh>
    </>
  );
}

// Module-level map so _applyBuildingVisuals can trigger debris directly
export const debrisTriggers = new Map<number, (stage: number, w: number, h: number, d: number) => void>();
