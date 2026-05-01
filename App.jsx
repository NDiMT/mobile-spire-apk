import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';

// ============ CARD ART (procedural SVG) ============

function CardArt({ cardKey, type }) {
  const palette = type === 'attack'
    ? { primary: '#fbbf24', secondary: '#dc2626', glow: '#fbbf24', dark: '#450a0a' }
    : type === 'power'
    ? { primary: '#a78bfa', secondary: '#7c3aed', glow: '#a78bfa', dark: '#1e1b4b' }
    : { primary: '#60a5fa', secondary: '#a78bfa', glow: '#60a5fa', dark: '#0c1532' };
  
  const id = `g-${cardKey}-${Math.random().toString(36).slice(2,7)}`;
  
  const arts = {
    strike: (
      <g>
        <defs>
          <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <path d="M50,10 L55,55 L50,70 L45,55 Z" fill={`url(#${id}-blade)`} stroke="#fff" strokeWidth="0.5" />
        <rect x="42" y="55" width="16" height="4" fill="#78350f" />
        <rect x="46" y="59" width="8" height="20" fill="#451a03" />
        <circle cx="50" cy="80" r="3" fill="#fbbf24" />
        <line x1="20" y1="20" x2="40" y2="40" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
        <line x1="80" y1="20" x2="60" y2="40" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
      </g>
    ),
    heavyStrike: (
      <g>
        <defs>
          <radialGradient id={`${id}-rg`}>
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="45" r="30" fill={`url(#${id}-rg)`} opacity="0.4" />
        <path d="M50,5 L60,50 L50,80 L40,50 Z" fill="#9ca3af" stroke="#fff" strokeWidth="1" />
        <rect x="35" y="48" width="30" height="6" fill="#78350f" />
        <rect x="44" y="54" width="12" height="22" fill="#451a03" />
        <path d="M30,30 L50,45 L70,30" stroke="#fef3c7" strokeWidth="2" fill="none" opacity="0.6" />
      </g>
    ),
    cleave: (
      <g>
        <path d="M15,80 Q50,10 85,80" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.7" />
        <path d="M15,75 Q50,15 85,75" stroke="#fef3c7" strokeWidth="1.5" fill="none" />
        <path d="M20,30 L80,70" stroke="#9ca3af" strokeWidth="3" />
        <path d="M20,30 L25,25 L30,32 Z" fill="#9ca3af" />
        <path d="M80,70 L75,75 L82,80 Z" fill="#9ca3af" />
        <circle cx="50" cy="50" r="3" fill="#fbbf24" />
      </g>
    ),
    defend: (
      <g>
        <defs>
          <linearGradient id={`${id}-shd`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <path d="M50,15 L75,25 L73,55 Q50,80 27,55 L25,25 Z" fill={`url(#${id}-shd)`} stroke="#dbeafe" strokeWidth="1.5" />
        <path d="M50,25 L65,30 L63,50 Q50,68 37,50 L35,30 Z" fill="none" stroke="#60a5fa" strokeWidth="1" />
        <circle cx="50" cy="42" r="5" fill="#fbbf24" />
        <path d="M50,35 L52,40 L57,40 L53,43 L55,48 L50,45 L45,48 L47,43 L43,40 L48,40 Z" fill="#fef3c7" />
      </g>
    ),
    ironWall: (
      <g>
        <rect x="20" y="25" width="60" height="55" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="20" y="25" width="60" height="8" fill="#64748b" />
        <line x1="35" y1="33" x2="35" y2="80" stroke="#1e293b" strokeWidth="1" />
        <line x1="50" y1="33" x2="50" y2="80" stroke="#1e293b" strokeWidth="1" />
        <line x1="65" y1="33" x2="65" y2="80" stroke="#1e293b" strokeWidth="1" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#1e293b" strokeWidth="1" />
        <line x1="20" y1="65" x2="80" y2="65" stroke="#1e293b" strokeWidth="1" />
        <rect x="22" y="20" width="6" height="10" fill="#475569" />
        <rect x="32" y="20" width="6" height="10" fill="#475569" />
        <rect x="42" y="20" width="6" height="10" fill="#475569" />
        <rect x="52" y="20" width="6" height="10" fill="#475569" />
        <rect x="62" y="20" width="6" height="10" fill="#475569" />
        <rect x="72" y="20" width="6" height="10" fill="#475569" />
        <circle cx="50" cy="55" r="6" fill="#fbbf24" opacity="0.8" />
      </g>
    ),
    bash: (
      <g>
        <circle cx="50" cy="50" r="25" fill="#7f1d1d" opacity="0.5" />
        <path d="M30,30 L70,70 M70,30 L30,70" stroke="#fbbf24" strokeWidth="3" />
        <ellipse cx="50" cy="55" rx="22" ry="18" fill="#a16207" stroke="#451a03" strokeWidth="2" />
        <path d="M35,55 Q50,40 65,55" fill="none" stroke="#451a03" strokeWidth="2" />
        <circle cx="42" cy="52" r="2" fill="#451a03" />
        <circle cx="58" cy="52" r="2" fill="#451a03" />
        <path d="M28,30 L32,40 M72,30 L68,40 M50,18 L50,28" stroke="#fef3c7" strokeWidth="2" />
      </g>
    ),
    poison: (
      <g>
        <defs>
          <linearGradient id={`${id}-vial`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>
        <path d="M40,15 L40,30 L30,55 L30,75 Q50,82 70,75 L70,55 L60,30 L60,15 Z" fill={`url(#${id}-vial)`} stroke="#dcfce7" strokeWidth="1" />
        <rect x="38" y="12" width="24" height="6" fill="#78350f" />
        <ellipse cx="50" cy="60" rx="15" ry="8" fill="#22c55e" opacity="0.6" />
        <circle cx="45" cy="55" r="2" fill="#dcfce7" opacity="0.8" />
        <circle cx="55" cy="62" r="1.5" fill="#dcfce7" opacity="0.8" />
        <path d="M50,5 L52,10 L50,8 L48,10 Z" fill="#22c55e" opacity="0.7" />
      </g>
    ),
    rage: (
      <g>
        <defs>
          <radialGradient id={`${id}-rg2`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="35" fill={`url(#${id}-rg2)`} />
        <path d="M50,15 L55,35 L75,30 L60,45 L80,55 L58,55 L65,80 L50,60 L35,80 L42,55 L20,55 L40,45 L25,30 L45,35 Z" fill="#fbbf24" stroke="#7c2d12" strokeWidth="1" />
        <circle cx="50" cy="50" r="8" fill="#dc2626" />
      </g>
    ),
    meditate: (
      <g>
        <circle cx="50" cy="50" r="28" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.6" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.8" />
        <ellipse cx="50" cy="55" rx="3" ry="4" fill="#fef3c7" />
        <circle cx="50" cy="48" r="3.5" fill="#fef3c7" />
        <path d="M40,55 Q35,50 38,45 M60,55 Q65,50 62,45" stroke="#fef3c7" strokeWidth="2" fill="none" />
        <circle cx="30" cy="30" r="1.5" fill="#fff" />
        <circle cx="70" cy="30" r="1" fill="#fff" />
        <circle cx="25" cy="65" r="1" fill="#fff" />
        <circle cx="75" cy="70" r="1.5" fill="#fff" />
        <circle cx="50" cy="20" r="1.5" fill="#fbbf24" />
      </g>
    ),
    fireball: (
      <g>
        <defs>
          <radialGradient id={`${id}-fire`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="80%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="55" r="28" fill={`url(#${id}-fire)`} />
        <path d="M50,30 Q40,40 45,55 Q50,45 55,55 Q60,40 50,30" fill="#fef3c7" opacity="0.8" />
        <path d="M30,75 Q35,60 40,70 Q45,55 50,68 Q55,55 60,70 Q65,60 70,75" fill="#dc2626" />
        <circle cx="50" cy="55" r="6" fill="#fef3c7" />
        <circle cx="35" cy="40" r="2" fill="#fbbf24" />
        <circle cx="68" cy="45" r="1.5" fill="#fbbf24" />
      </g>
    ),
    shiv: (
      <g>
        <path d="M50,15 L53,55 L50,65 L47,55 Z" fill="#cbd5e1" stroke="#fff" strokeWidth="0.5" />
        <rect x="45" y="55" width="10" height="3" fill="#451a03" />
        <rect x="47" y="58" width="6" height="15" fill="#1c1917" />
        <line x1="30" y1="40" x2="44" y2="48" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
        <line x1="70" y1="40" x2="56" y2="48" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
      </g>
    ),
    bulwark: (
      <g>
        <defs>
          <linearGradient id={`${id}-bulw`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <path d="M50,12 L78,22 L78,55 Q50,82 22,55 L22,22 Z" fill={`url(#${id}-bulw)`} stroke="#fff" strokeWidth="1" />
        <path d="M50,20 L70,28 L70,52 Q50,72 30,52 L30,28 Z" fill="none" stroke="#1e293b" strokeWidth="1" />
        <path d="M50,28 L62,33 L62,50 Q50,62 38,50 L38,33 Z" fill="#1e3a8a" />
        <path d="M50,32 L50,55 M42,42 L58,42" stroke="#fbbf24" strokeWidth="2" />
      </g>
    ),
    twinStrike: (
      <g>
        <path d="M30,15 L33,55 L30,65 L27,55 Z" fill="#cbd5e1" stroke="#fff" strokeWidth="0.5" />
        <rect x="25" y="55" width="10" height="3" fill="#451a03" />
        <rect x="27" y="58" width="6" height="15" fill="#1c1917" />
        <path d="M70,15 L73,55 L70,65 L67,55 Z" fill="#cbd5e1" stroke="#fff" strokeWidth="0.5" />
        <rect x="65" y="55" width="10" height="3" fill="#451a03" />
        <rect x="67" y="58" width="6" height="15" fill="#1c1917" />
        <line x1="20" y1="30" x2="40" y2="40" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
        <line x1="80" y1="30" x2="60" y2="40" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
      </g>
    ),
    flurry: (
      <g>
        {[0,1,2,3].map(k => {
          const x = 25 + k*15;
          return <g key={k}>
            <path d={`M${x},15 L${x+2},45 L${x},55 L${x-2},45 Z`} fill="#cbd5e1" stroke="#fff" strokeWidth="0.4" />
            <rect x={x-3} y="45" width="6" height="2" fill="#451a03" />
            <rect x={x-2} y="47" width="4" height="10" fill="#1c1917" />
          </g>;
        })}
        <path d="M15,75 Q50,60 85,75" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.6" />
        <text x="50" y="90" fill="#fbbf24" fontSize="14" textAnchor="middle" fontWeight="bold">×4</text>
      </g>
    ),
    whirlwind: (
      <g>
        <path d="M50,50 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />
        <path d="M50,50 L80,30 M50,50 L20,30 M50,50 L80,70 M50,50 L20,70" stroke="#9ca3af" strokeWidth="2.5" />
        <path d="M75,30 L80,28 L82,33 Z M25,30 L20,28 L18,33 Z M75,70 L80,72 L82,67 Z M25,70 L20,72 L18,67 Z" fill="#9ca3af" />
        <circle cx="50" cy="50" r="4" fill="#fbbf24" />
      </g>
    ),
    executioner: (
      <g>
        <defs>
          <linearGradient id={`${id}-axe`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>
        <rect x="48" y="35" width="4" height="50" fill="#451a03" />
        <path d="M30,15 Q15,30 30,50 L52,40 L52,20 Z" fill={`url(#${id}-axe)`} stroke="#fff" strokeWidth="0.5" />
        <path d="M70,15 Q85,30 70,50 L48,40 L48,20 Z" fill={`url(#${id}-axe)`} stroke="#fff" strokeWidth="0.5" />
        <circle cx="50" cy="20" r="3" fill="#dc2626" />
        <circle cx="50" cy="85" r="2" fill="#fbbf24" />
      </g>
    ),
    bloodletter: (
      <g>
        <path d="M50,15 L53,55 L50,68 L47,55 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
        <rect x="45" y="55" width="10" height="3" fill="#451a03" />
        <rect x="47" y="58" width="6" height="15" fill="#1c1917" />
        <circle cx="35" cy="80" r="2" fill="#dc2626" />
        <circle cx="65" cy="83" r="1.5" fill="#dc2626" />
        <circle cx="50" cy="88" r="2" fill="#dc2626" />
        <path d="M45,75 Q50,80 55,75" stroke="#dc2626" strokeWidth="1" fill="none" />
      </g>
    ),
    reckless: (
      <g>
        <defs>
          <radialGradient id={`${id}-rch`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="35" fill={`url(#${id}-rch)`} opacity="0.5" />
        <path d="M20,50 L80,50" stroke="#fbbf24" strokeWidth="3" />
        <path d="M75,40 L85,50 L75,60" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <path d="M30,30 L40,40 M30,70 L40,60 M70,30 L60,40 M70,70 L60,60" stroke="#dc2626" strokeWidth="2" />
      </g>
    ),
    thunderclap: (
      <g>
        <path d="M40,15 L25,50 L40,50 L30,80 L65,40 L50,40 L60,15 Z" fill="#fbbf24" stroke="#fef3c7" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3" />
      </g>
    ),
    dragonBreath: (
      <g>
        <defs>
          <linearGradient id={`${id}-db`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
        <path d="M15,50 Q30,30 50,40 Q70,50 85,35 Q75,55 60,50 Q50,55 35,55 Q20,60 15,50 Z" fill={`url(#${id}-db)`} />
        <circle cx="22" cy="48" r="3" fill="#16a34a" />
        <path d="M18,42 L26,42 M22,38 L22,46" stroke="#16a34a" strokeWidth="1" />
        <ellipse cx="60" cy="45" rx="3" ry="2" fill="#fef3c7" />
        <ellipse cx="75" cy="40" rx="2" ry="1.5" fill="#fef3c7" />
      </g>
    ),
    venomFang: (
      <g>
        <path d="M30,20 L40,55 L35,65 L25,50 Z" fill="#fef3c7" stroke="#16a34a" strokeWidth="1" />
        <path d="M70,20 L60,55 L65,65 L75,50 Z" fill="#fef3c7" stroke="#16a34a" strokeWidth="1" />
        <ellipse cx="50" cy="70" rx="20" ry="6" fill="#22c55e" opacity="0.5" />
        <circle cx="42" cy="72" r="2" fill="#16a34a" />
        <circle cx="58" cy="73" r="1.5" fill="#16a34a" />
        <circle cx="50" cy="75" r="1.5" fill="#16a34a" />
      </g>
    ),
    lacerate: (
      <g>
        <path d="M20,25 L75,75 M30,15 L80,65 M15,40 L70,85" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
        <path d="M20,25 L25,20 M75,75 L80,80" stroke="#fef3c7" strokeWidth="1" />
        <circle cx="80" cy="20" r="2" fill="#dc2626" />
        <circle cx="20" cy="80" r="2" fill="#dc2626" />
      </g>
    ),
    skewer: (
      <g>
        <path d="M15,50 L75,50" stroke="#9ca3af" strokeWidth="3" />
        <path d="M75,50 L70,45 L80,50 L70,55 Z" fill="#9ca3af" />
        <rect x="10" y="46" width="8" height="8" fill="#451a03" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="#dc2626" strokeWidth="2" />
        <circle cx="50" cy="50" r="2" fill="#dc2626" />
      </g>
    ),
    meteor: (
      <g>
        <defs>
          <radialGradient id={`${id}-met`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="40" r="20" fill={`url(#${id}-met)`} />
        <circle cx="60" cy="40" r="8" fill="#fef3c7" />
        <path d="M20,80 L40,55 M30,85 L50,60 M15,70 L35,50" stroke="#f97316" strokeWidth="2" opacity="0.7" />
        <path d="M25,90 L45,65" stroke="#dc2626" strokeWidth="3" />
      </g>
    ),
    pyreCrush: (
      <g>
        <defs>
          <radialGradient id={`${id}-py`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="55" r="30" fill={`url(#${id}-py)`} />
        <path d="M30,75 L40,40 L45,55 L50,30 L55,55 L60,40 L70,75" fill="#dc2626" stroke="#fef3c7" strokeWidth="0.5" />
        <path d="M40,80 L45,60 L55,60 L60,80" fill="#fbbf24" />
        <circle cx="50" cy="20" r="3" fill="#fef3c7" />
      </g>
    ),
    riposte: (
      <g>
        <path d="M30,75 L70,25" stroke="#cbd5e1" strokeWidth="3" />
        <path d="M70,25 L65,30 L75,25 L70,35 Z" fill="#cbd5e1" />
        <path d="M40,40 Q50,50 40,60 L20,80 L20,60 Z" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="30" cy="60" r="3" fill="#fbbf24" />
      </g>
    ),
    shieldBash: (
      <g>
        <path d="M35,25 L65,25 L65,55 Q50,75 35,55 Z" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M40,30 L60,30 L60,50 Q50,65 40,50 Z" fill="#1e3a8a" />
        <circle cx="50" cy="42" r="5" fill="#fbbf24" />
        <path d="M70,80 L80,75 M75,85 L85,80 M65,85 L75,90" stroke="#fbbf24" strokeWidth="2" />
      </g>
    ),
    rampage: (
      <g>
        <path d="M50,15 L55,35 L75,30 L62,42 L82,50 L62,55 L75,75 L55,65 L50,85 L45,65 L25,75 L38,55 L18,50 L38,42 L25,30 L45,35 Z" fill="#dc2626" stroke="#fbbf24" strokeWidth="1" />
        <text x="50" y="55" fill="#fef3c7" fontSize="10" textAnchor="middle" fontWeight="bold">×2</text>
      </g>
    ),
    fortify: (
      <g>
        <rect x="20" y="30" width="60" height="50" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="35" y1="30" x2="35" y2="80" stroke="#1e293b" />
        <line x1="50" y1="30" x2="50" y2="80" stroke="#1e293b" />
        <line x1="65" y1="30" x2="65" y2="80" stroke="#1e293b" />
        <line x1="20" y1="55" x2="80" y2="55" stroke="#1e293b" />
        <rect x="22" y="25" width="6" height="8" fill="#475569" />
        <rect x="32" y="25" width="6" height="8" fill="#475569" />
        <rect x="42" y="25" width="6" height="8" fill="#475569" />
        <rect x="52" y="25" width="6" height="8" fill="#475569" />
        <rect x="62" y="25" width="6" height="8" fill="#475569" />
        <rect x="72" y="25" width="6" height="8" fill="#475569" />
        <circle cx="50" cy="60" r="6" fill="#60a5fa" />
        <path d="M48,57 L50,62 L52,57" stroke="#fef3c7" strokeWidth="1" fill="none" />
      </g>
    ),
    shieldWall: (
      <g>
        <rect x="10" y="25" width="20" height="55" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="35" y="25" width="20" height="60" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="60" y="25" width="20" height="55" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="20" cy="50" r="3" fill="#60a5fa" />
        <circle cx="45" cy="50" r="4" fill="#60a5fa" />
        <circle cx="70" cy="50" r="3" fill="#60a5fa" />
      </g>
    ),
    evade: (
      <g>
        <path d="M30,80 Q40,50 50,30 Q55,20 60,15" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <circle cx="60" cy="15" r="6" fill="#cbd5e1" />
        <ellipse cx="35" cy="80" rx="10" ry="4" fill="#1e3a8a" opacity="0.4" />
        <path d="M55,18 L65,12 M58,22 L68,16" stroke="#fbbf24" strokeWidth="1" />
      </g>
    ),
    warCry: (
      <g>
        <path d="M50,20 L40,35 L25,35 L35,45 L30,60 L50,52 L70,60 L65,45 L75,35 L60,35 Z" fill="#fbbf24" stroke="#7c2d12" strokeWidth="1" />
        <ellipse cx="50" cy="75" rx="30" ry="6" fill="#fbbf24" opacity="0.3" />
        <text x="50" y="50" fill="#7c2d12" fontSize="14" textAnchor="middle" fontWeight="bold">!</text>
      </g>
    ),
    battleHymn: (
      <g>
        <path d="M30,30 L30,70 L40,75" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <ellipse cx="35" cy="73" rx="6" ry="4" fill="#fbbf24" />
        <path d="M55,25 L55,65 L65,70" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <ellipse cx="60" cy="68" rx="6" ry="4" fill="#fbbf24" />
        <path d="M30,30 Q42,25 55,25" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="3" fill="#dc2626" />
      </g>
    ),
    bloodOath: (
      <g>
        <path d="M50,15 L55,35 L75,35 L60,48 L65,68 L50,55 L35,68 L40,48 L25,35 L45,35 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
        <circle cx="50" cy="40" r="10" fill="#fef3c7" />
        <text x="50" y="46" fill="#7f1d1d" fontSize="14" textAnchor="middle" fontWeight="bold">⚔</text>
        <circle cx="35" cy="80" r="2" fill="#dc2626" />
        <circle cx="65" cy="82" r="1.5" fill="#dc2626" />
      </g>
    ),
    preparation: (
      <g>
        <rect x="25" y="35" width="20" height="28" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1" />
        <rect x="55" y="30" width="20" height="33" fill="#7c2d12" stroke="#fbbf24" strokeWidth="1" />
        <circle cx="35" cy="49" r="3" fill="#fbbf24" />
        <circle cx="65" cy="46" r="3" fill="#fbbf24" />
        <path d="M30,75 L70,75" stroke="#fbbf24" strokeWidth="1" />
        <text x="50" y="20" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">+2</text>
      </g>
    ),
    scry: (
      <g>
        <defs>
          <radialGradient id={`${id}-scry`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="80" rx="20" ry="4" fill="#1e1b4b" />
        <circle cx="50" cy="50" r="25" fill={`url(#${id}-scry)`} stroke="#fbbf24" strokeWidth="1" />
        <circle cx="42" cy="42" r="8" fill="#fef3c7" opacity="0.6" />
        <text x="50" y="55" fill="#7c2d12" fontSize="14" textAnchor="middle" fontWeight="bold">3</text>
      </g>
    ),
    inspire: (
      <g>
        <circle cx="50" cy="45" r="15" fill="#fbbf24" />
        <circle cx="50" cy="45" r="22" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
        <circle cx="50" cy="45" r="30" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3" />
        <text x="50" y="50" fill="#7c2d12" fontSize="16" textAnchor="middle" fontWeight="bold">⚡</text>
        <path d="M30,75 L40,80 M70,75 L60,80" stroke="#fbbf24" strokeWidth="1" />
      </g>
    ),
    secondWind: (
      <g>
        <path d="M50,15 Q30,30 35,50 Q40,65 50,70 Q60,65 65,50 Q70,30 50,15" fill="#34d399" stroke="#fef3c7" strokeWidth="1" />
        <path d="M50,75 L48,85 L52,85 Z" fill="#34d399" />
        <circle cx="50" cy="40" r="6" fill="#fef3c7" />
        <text x="50" y="44" fill="#065f46" fontSize="10" textAnchor="middle">+</text>
      </g>
    ),
    potionOfLife: (
      <g>
        <defs>
          <linearGradient id={`${id}-pot`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
        <rect x="38" y="12" width="24" height="6" fill="#78350f" />
        <path d="M40,15 L40,28 L30,55 L30,75 Q50,82 70,75 L70,55 L60,28 L60,15 Z" fill={`url(#${id}-pot)`} stroke="#fef3c7" strokeWidth="1" />
        <ellipse cx="50" cy="55" rx="14" ry="6" fill="#fef3c7" opacity="0.6" />
        <path d="M50,40 L48,50 L52,50 Z" fill="#dc2626" />
        <circle cx="46" cy="60" r="2" fill="#fef3c7" opacity="0.8" />
      </g>
    ),
    bandage: (
      <g>
        <rect x="20" y="40" width="60" height="20" fill="#fef3c7" stroke="#a16207" strokeWidth="1" />
        <line x1="20" y1="45" x2="80" y2="45" stroke="#a16207" />
        <line x1="20" y1="55" x2="80" y2="55" stroke="#a16207" />
        <path d="M50,30 L45,40 L55,40 Z" fill="#dc2626" />
        <circle cx="50" cy="50" r="4" fill="#dc2626" />
        <text x="50" y="54" fill="#fef3c7" fontSize="8" textAnchor="middle" fontWeight="bold">+</text>
      </g>
    ),
    rallyingCry: (
      <g>
        <path d="M30,40 L25,45 L25,55 L30,60 L40,60 L40,40 Z" fill="#7c2d12" stroke="#fbbf24" strokeWidth="1" />
        <path d="M40,40 L70,25 L70,75 L40,60 Z" fill="#7c2d12" stroke="#fbbf24" strokeWidth="1" />
        <path d="M70,30 Q85,40 85,50 Q85,60 70,70" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
        <path d="M70,38 Q80,45 80,50 Q80,55 70,62" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.7" />
      </g>
    ),
    berserk: (
      <g>
        <defs>
          <radialGradient id={`${id}-brk`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill={`url(#${id}-brk)`} />
        <path d="M35,30 L40,50 L30,50 L40,70 L50,55 L60,70 L70,50 L60,50 L65,30 Z" fill="#fef3c7" stroke="#7c2d12" strokeWidth="1" />
        <circle cx="42" cy="42" r="2" fill="#dc2626" />
        <circle cx="58" cy="42" r="2" fill="#dc2626" />
      </g>
    ),
    warriorsResolve: (
      <g>
        <path d="M50,15 L60,30 L75,30 L65,45 L70,60 L50,55 L30,60 L35,45 L25,30 L40,30 Z" fill="#fbbf24" stroke="#7c2d12" strokeWidth="1.5" />
        <circle cx="50" cy="42" r="8" fill="#dc2626" />
        <text x="50" y="46" fill="#fef3c7" fontSize="10" textAnchor="middle" fontWeight="bold">⚔</text>
        <path d="M30,75 L70,75" stroke="#fbbf24" strokeWidth="2" />
      </g>
    ),
    bloodPact: (
      <g>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M50,25 L60,40 L75,40 L62,52 L67,68 L50,58 L33,68 L38,52 L25,40 L40,40 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
        <circle cx="50" cy="50" r="6" fill="#fef3c7" />
        <text x="50" y="54" fill="#7f1d1d" fontSize="10" textAnchor="middle">⚱</text>
        <circle cx="35" cy="80" r="1.5" fill="#dc2626" />
        <circle cx="65" cy="82" r="2" fill="#dc2626" />
      </g>
    ),
    dragonForm: (
      <g>
        <defs>
          <linearGradient id={`${id}-drg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
        <path d="M20,55 Q15,40 25,35 Q35,30 45,40 L55,30 Q65,35 70,45 Q85,40 80,55 Q80,65 70,65 Q60,70 50,65 Q40,70 30,65 Q20,65 20,55 Z" fill={`url(#${id}-drg)`} stroke="#7c2d12" strokeWidth="1" />
        <circle cx="35" cy="48" r="2" fill="#dc2626" />
        <circle cx="65" cy="48" r="2" fill="#dc2626" />
        <path d="M30,40 L25,30 M70,40 L75,30" stroke="#7c2d12" strokeWidth="2" />
        <path d="M40,60 L45,70 L50,62 L55,70 L60,60" stroke="#fef3c7" strokeWidth="1" fill="none" />
        <path d="M15,50 Q10,55 15,60 M85,50 Q90,55 85,60" fill="#fbbf24" stroke="#7c2d12" />
      </g>
    ),
    apocalypse: (
      <g>
        <defs>
          <radialGradient id={`${id}-apc`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="42" fill={`url(#${id}-apc)`} />
        <path d="M50,10 L52,40 L80,30 L55,50 L80,70 L52,60 L50,90 L48,60 L20,70 L45,50 L20,30 L48,40 Z" fill="#fef3c7" />
        <circle cx="50" cy="50" r="5" fill="#000" />
      </g>
    ),
    finalBlow: (
      <g>
        <path d="M50,8 L56,55 L50,72 L44,55 Z" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" />
        <rect x="40" y="55" width="20" height="5" fill="#7c2d12" />
        <rect x="46" y="60" width="8" height="22" fill="#451a03" />
        <circle cx="50" cy="84" r="4" fill="#dc2626" />
        <path d="M30,30 L50,40 L70,30 M25,50 L50,60 L75,50" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.4" />
      </g>
    ),
    bloodMagic: (
      <g>
        <circle cx="50" cy="50" r="32" fill="none" stroke="#dc2626" strokeWidth="1" />
        <path d="M50,18 L50,82 M18,50 L82,50 M27,27 L73,73 M73,27 L27,73" stroke="#dc2626" strokeWidth="0.7" opacity="0.6" />
        <circle cx="50" cy="50" r="10" fill="#7f1d1d" stroke="#fef3c7" strokeWidth="1" />
        <text x="50" y="55" fill="#fef3c7" fontSize="12" textAnchor="middle" fontWeight="bold">✚</text>
        <circle cx="50" cy="22" r="2" fill="#dc2626" />
        <circle cx="22" cy="50" r="2" fill="#dc2626" />
        <circle cx="78" cy="50" r="2" fill="#dc2626" />
        <circle cx="50" cy="78" r="2" fill="#dc2626" />
      </g>
    ),
    godsWrath: (
      <g>
        <defs>
          <radialGradient id={`${id}-gw`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fbbf24" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill={`url(#${id}-gw)`} opacity="0.6" />
        <path d="M45,15 L40,40 L25,40 L38,52 L33,72 L50,62 L67,72 L62,52 L75,40 L60,40 Z" fill="#fef3c7" stroke="#a16207" strokeWidth="1.5" />
        <path d="M48,30 L52,45 L58,40 L52,55 L60,55 L48,70 L40,55 L48,55 L42,40 L48,45 Z" fill="#fbbf24" />
      </g>
    ),
    immortal: (
      <g>
        <defs>
          <radialGradient id={`${id}-imm`}>
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill={`url(#${id}-imm)`} />
        <path d="M50,25 Q35,35 35,50 Q35,65 50,72 Q65,65 65,50 Q65,35 50,25" fill="#fef3c7" />
        <circle cx="50" cy="50" r="8" fill="#dc2626" />
        <text x="50" y="55" fill="#fef3c7" fontSize="14" textAnchor="middle" fontWeight="bold">∞</text>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#fef3c7" strokeWidth="0.5" opacity="0.6" />
      </g>
    ),
  };
  
  // Type-based fallbacks for any card without specific art
  const fallback = {
    attack: (
      <g>
        <path d="M50,15 L55,55 L50,68 L45,55 Z" fill="#cbd5e1" stroke="#fff" strokeWidth="0.5" />
        <rect x="45" y="55" width="10" height="3" fill="#451a03" />
        <rect x="47" y="58" width="6" height="20" fill="#1c1917" />
        <circle cx="50" cy="80" r="3" fill="#fbbf24" />
      </g>
    ),
    skill: (
      <g>
        <circle cx="50" cy="50" r="25" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="#60a5fa" opacity="0.4" />
        <circle cx="50" cy="50" r="6" fill="#fef3c7" />
      </g>
    ),
    power: (
      <g>
        <path d="M50,15 L60,40 L85,40 L65,55 L72,80 L50,65 L28,80 L35,55 L15,40 L40,40 Z" fill="#a78bfa" stroke="#fef3c7" strokeWidth="1" />
        <circle cx="50" cy="48" r="6" fill="#fef3c7" />
      </g>
    ),
  };
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={`${id}-bg`}>
          <stop offset="0%" stopColor={palette.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={palette.dark} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={`url(#${id}-bg)`} />
      {arts[cardKey] || fallback[type] || fallback.skill}
    </svg>
  );
}

// ============ AUDIO ENGINE — power metal, but dynamic and not annoying ============

class MetalAudio {
  constructor() {
    this.started = false;
    this.muted = false;
    this.synths = {};
    this.parts = [];
    this.currentTrack = null;
    this.masterGain = null;
  }
  
  async init() {
    if (this.started) return;
    await Tone.start();
    Tone.Transport.bpm.value = 168;
    
    // Master limiter so nothing clips, plus master gain
    const limiter = new Tone.Limiter(-3).toDestination();
    this.masterGain = new Tone.Gain(0.7).connect(limiter);
    
    // === RHYTHM GUITAR — moderately driven, not buzzsaw ===
    const rhythmDist = new Tone.Distortion({ distortion: 0.45, wet: 0.85 });
    const rhythmFilter = new Tone.Filter(2200, 'lowpass', -24).connect(rhythmDist);
    rhythmDist.connect(this.masterGain);
    this.synths.rhythm = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.003, decay: 0.12, sustain: 0.3, release: 0.1 },
    }).connect(rhythmFilter);
    this.synths.rhythm.volume.value = -22;
    
    // === LEAD GUITAR — clean-ish, with some bite ===
    const leadDist = new Tone.Distortion({ distortion: 0.5, wet: 0.85 });
    const leadDelay = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.18, wet: 0.18 });
    const leadReverb = new Tone.Reverb({ decay: 1.8, wet: 0.22 });
    leadDist.connect(leadDelay);
    leadDelay.connect(leadReverb);
    leadReverb.connect(this.masterGain);
    this.synths.lead = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0.6, release: 0.3 },
      filter: { Q: 3, type: 'lowpass', rolloff: -24 },
      filterEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.6, release: 0.4, baseFrequency: 1100, octaves: 2.5 },
    }).connect(leadDist);
    this.synths.lead.volume.value = -16;
    
    // === HARMONY LEAD — quieter, blends in ===
    const harmDist = new Tone.Distortion({ distortion: 0.45, wet: 0.85 });
    const harmReverb = new Tone.Reverb({ decay: 1.6, wet: 0.2 });
    harmDist.connect(harmReverb);
    harmReverb.connect(this.masterGain);
    this.synths.harmony = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0.6, release: 0.3 },
      filter: { Q: 3, type: 'lowpass', rolloff: -24 },
      filterEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.6, release: 0.4, baseFrequency: 1000, octaves: 2.5 },
    }).connect(harmDist);
    this.synths.harmony.volume.value = -22;
    
    // === KEYS — ambient pads ===
    const keyChorus = new Tone.Chorus(2, 1.5, 0.4).start();
    const keyReverb = new Tone.Reverb({ decay: 3, wet: 0.5 });
    keyChorus.connect(keyReverb);
    keyReverb.connect(this.masterGain);
    this.synths.keys = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.3, decay: 0.4, sustain: 0.5, release: 1.2 },
    }).connect(keyChorus);
    this.synths.keys.volume.value = -28;
    
    // === BASS ===
    this.synths.bass = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.003, decay: 0.2, sustain: 0.5, release: 0.15 },
      filter: { Q: 1.5, type: 'lowpass', rolloff: -24 },
      filterEnvelope: { attack: 0.005, decay: 0.1, sustain: 0.4, release: 0.2, baseFrequency: 280, octaves: 2 },
    }).connect(this.masterGain);
    this.synths.bass.volume.value = -18;
    
    // === DRUMS ===
    this.synths.kick = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 5,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0.01, release: 0.8 },
    }).connect(this.masterGain);
    this.synths.kick.volume.value = -10;
    
    this.synths.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.13, sustain: 0 },
    }).connect(this.masterGain);
    this.synths.snare.volume.value = -16;
    
    const hatFilter = new Tone.Filter(9000, 'highpass');
    hatFilter.connect(this.masterGain);
    this.synths.hihat = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.03, sustain: 0 },
    }).connect(hatFilter);
    this.synths.hihat.volume.value = -28;
    
    const crashFilter = new Tone.Filter(5000, 'highpass');
    crashFilter.connect(this.masterGain);
    this.synths.crash = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 1.5, sustain: 0 },
    }).connect(crashFilter);
    this.synths.crash.volume.value = -22;
    
    this.started = true;
  }
  
  clearParts() {
    this.parts.forEach(p => { p.stop(); p.dispose(); });
    this.parts = [];
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
    // Release any sustained notes
    Object.values(this.synths).forEach(s => {
      if (s.releaseAll) s.releaseAll();
      else if (s.triggerRelease) {
        try { s.triggerRelease(); } catch(e) {}
      }
    });
  }
  
  // ============ BATTLE THEME — sinister, slow, distant pipes in the dark ============
  // Very slow (60 BPM feel), sparse, low drone with occasional metallic clangs
  // and creeping dissonant intervals. Should feel like being trapped in a dungeon.
  playBattleTheme() {
    if (!this.started || this.currentTrack === 'battle') return;
    this.clearParts();
    this.currentTrack = 'battle';
    Tone.Transport.bpm.value = 60;
    
    // Deep sustained drone bass — slow heartbeat-like throb
    // Pattern: long low note every 2 measures, dissonant tritone tension
    const droneNotes = ['E1', 'E1', 'F1', 'E1']; // E pedal with one Phrygian F semitone
    
    const dronePart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 4;
      const note = droneNotes[bar];
      this.synths.bass.triggerAttackRelease(note, '2m', time);
    }, '2m').start(0);
    this.parts.push(dronePart);
    
    // Atmospheric pad — dissonant Em with occasional flat-9
    const padNotes = [
      ['E2','G2','B2'],   // Em — neutral dread
      ['E2','G2','B2'],   // hold
      ['F2','Ab2','C3'],  // Fdim — shift, evil
      ['E2','G2','B2'],   // back to Em
    ];
    
    const padPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 4;
      const chord = padNotes[bar].map(n => Tone.Frequency(n).transpose(12).toNote());
      this.synths.keys.triggerAttackRelease(chord, '2m', time);
    }, '2m').start(0);
    this.parts.push(padPart);
    
    // === DISTANT PIPES — metallic clangs that echo through the spire ===
    // Use the kick + filtered noise to simulate a far-off pipe being struck
    // Plus a long-decay metallic tone via the lead synth (high pitch through reverb)
    
    // Sparse low metallic boom — every 3-4 measures, randomized
    const pipeBoomPart = new Tone.Loop((time) => {
      // 60% chance to actually play, so the timing feels uneven and unsettling
      if (Math.random() < 0.6) {
        // Low metal clang
        this.synths.kick.triggerAttackRelease('C1', '2n', time);
        // Followed shortly by a higher ringing pipe tone
        this.synths.lead.triggerAttackRelease('E3', '2n', time + 0.4);
      }
    }, '3m').start('1m'); // start after 1 measure
    this.parts.push(pipeBoomPart);
    
    // Higher-pitched distant pipe taps — sparse, treble metallic notes
    const pipeTapNotes = ['B4', 'D5', 'A4', 'F#4', 'B4', 'E5'];
    let pipeTapIdx = 0;
    const pipeTapPart = new Tone.Loop((time) => {
      // Only fire 40% of the time for that "is something there?" feeling
      if (Math.random() < 0.4) {
        const note = pipeTapNotes[pipeTapIdx % pipeTapNotes.length];
        // Use harmony synth (which has reverb) for that distant decay
        this.synths.harmony.triggerAttackRelease(note, '4n', time);
        pipeTapIdx++;
      }
    }, '2m').start('2m');
    this.parts.push(pipeTapPart);
    
    // Single distant snare/cymbal scrape every ~8 measures — adds a "footsteps?" element
    const distantScrape = new Tone.Loop((time) => {
      this.synths.hihat.triggerAttackRelease('2n', time);
    }, '8m').start('5m');
    this.parts.push(distantScrape);
    
    // Heartbeat — low kick on beat 1 of every other measure (subtle, present)
    const heartbeatPart = new Tone.Loop((time) => {
      this.synths.kick.triggerAttackRelease('A0', '4n', time);
      // double-thump like a real heartbeat
      this.synths.kick.triggerAttackRelease('A0', '8n', time + 0.35);
    }, '4m').start('0:2');
    this.parts.push(heartbeatPart);
    
    Tone.Transport.start();
  }
  
  // ============ BOSS THEME — heavier, slower, doomy with epic chorus ============
  playBossTheme() {
    if (!this.started || this.currentTrack === 'boss') return;
    this.clearParts();
    this.currentTrack = 'boss';
    Tone.Transport.bpm.value = 144;
    
    // Em - F - G - Em (Phrygian / dark) | Am - D - G - B7
    const chordRoots = ['E2','F2','G2','E2', 'A2','D2','G2','B2'];
    const chordTriads = {
      'E2': ['E3','G3','B3'], 'F2': ['F3','A3','C4'],
      'G2': ['G3','B3','D4'], 'A2': ['A3','C4','E4'],
      'D2': ['D3','F#3','A3'], 'B2': ['B3','D#4','F#4'],
    };
    
    const isChorus = (bar) => bar >= 4;
    
    // Heavy quarter-note chugs in verse, 8ths in chorus
    const rhythmPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 8;
      const sub = parseInt(pos[2]);
      const root = chordRoots[bar];
      const fifth = Tone.Frequency(root).transpose(7).toNote();
      
      if (!isChorus(bar)) {
        if (sub === 0) this.synths.rhythm.triggerAttackRelease([root, fifth], '8n', time);
      } else {
        if (sub === 0 || sub === 2) this.synths.rhythm.triggerAttackRelease([root, fifth], '16n', time);
      }
    }, '16n').start(0);
    this.parts.push(rhythmPart);
    
    const bassPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 8;
      const sub = parseInt(pos[2]);
      const root = chordRoots[bar];
      if (!isChorus(bar) && sub === 0) {
        this.synths.bass.triggerAttackRelease(Tone.Frequency(root).transpose(-12).toNote(), '8n', time);
      } else if (isChorus(bar) && (sub === 0 || sub === 2)) {
        this.synths.bass.triggerAttackRelease(Tone.Frequency(root).transpose(-12).toNote(), '16n', time);
      }
    }, '16n').start(0);
    this.parts.push(bassPart);
    
    const drumPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 8;
      const beat = parseInt(pos[1]);
      const sub = parseInt(pos[2]);
      
      if (!isChorus(bar)) {
        // Slower doomy beat
        if (beat === 0 && sub === 0) this.synths.kick.triggerAttackRelease('C1', '4n', time);
        if (beat === 2 && sub === 0) this.synths.snare.triggerAttackRelease('8n', time);
      } else {
        // Driving boss-fight beat
        if ((beat === 0 || beat === 2) && sub === 0) this.synths.kick.triggerAttackRelease('C1', '8n', time);
        if ((beat === 1 || beat === 3) && sub === 0) this.synths.snare.triggerAttackRelease('16n', time);
        if (sub === 0 || sub === 2) this.synths.hihat.triggerAttackRelease('32n', time);
      }
    }, '16n').start(0);
    this.parts.push(drumPart);
    
    const crashPart = new Tone.Loop((time) => {
      this.synths.crash.triggerAttackRelease('1n', time);
    }, '8m').start('4m');
    this.parts.push(crashPart);
    
    const keyPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 8;
      const root = chordRoots[bar];
      const triad = chordTriads[root].map(n => Tone.Frequency(n).transpose(12).toNote());
      this.synths.keys.triggerAttackRelease(triad, '1m', time);
    }, '1m').start(0);
    this.parts.push(keyPart);
    
    // Boss chorus melody — wailing, sustained
    const bossChorus = [
      ['E5','2n'],['G5','4n'],['B5','2n'],['A5','4n'],
      ['G5','8n'],['F#5','8n'],['E5','4n'],['B4','2n'],['B4','4n'],
      ['G5','4n'],['B5','4n'],['D6','2n'],['B5','4n'],
      ['A5','8n'],['G5','8n'],['F#5','4n'],['E5','2n'],['E5','4n'],
    ];
    const melodyPart = new Tone.Loop((time) => {
      let offset = 0;
      const beatLen = 60 / Tone.Transport.bpm.value;
      bossChorus.forEach(([note, dur]) => {
        this.synths.lead.triggerAttackRelease(note, dur, time + offset);
        const harmNote = Tone.Frequency(note).transpose(7).toNote();
        this.synths.harmony.triggerAttackRelease(harmNote, dur, time + offset);
        const beats = dur === '8n' ? 0.5 : dur === '4n' ? 1 : dur === '2n' ? 2 : 0.5;
        offset += beats * beatLen;
      });
    }, '8m').start('4m');
    this.parts.push(melodyPart);
    
    Tone.Transport.start();
  }
  
  // ============ MAP/MENU THEME — calm, atmospheric, mostly ambient ============
  playMenuTheme() {
    if (!this.started || this.currentTrack === 'menu') return;
    this.clearParts();
    this.currentTrack = 'menu';
    Tone.Transport.bpm.value = 100;
    
    // D - Bm - G - A (gentle adventure feel)
    const chordRoots = ['D2','B2','G2','A2'];
    const chordTriads = {
      'D2': ['D3','F#3','A3'],
      'B2': ['B3','D4','F#4'],
      'G2': ['G3','B3','D4'],
      'A2': ['A3','C#4','E4'],
    };
    
    // Just a soft bass pluck on each chord change
    const bassPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 4;
      const root = chordRoots[bar];
      this.synths.bass.triggerAttackRelease(Tone.Frequency(root).transpose(-12).toNote(), '2n', time);
    }, '1m').start(0);
    this.parts.push(bassPart);
    
    // Soft sustained keyboard pads
    const keyPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 4;
      const root = chordRoots[bar];
      const triad = chordTriads[root].map(n => Tone.Frequency(n).transpose(12).toNote());
      this.synths.keys.triggerAttackRelease(triad, '1m', time);
    }, '1m').start(0);
    this.parts.push(keyPart);
    
    // Sparse soft kick on beat 1 only
    const kickPart = new Tone.Loop((time) => {
      const pos = Tone.Transport.position.split(':');
      const bar = parseInt(pos[0]) % 4;
      // Only every other bar
      if (bar % 2 === 0) {
        this.synths.kick.triggerAttackRelease('C1', '4n', time);
      }
    }, '1m').start(0);
    this.parts.push(kickPart);
    
    // Slow hero melody — sparse, with rests
    const wanderMelody = [
      ['D5','2n'],['F#5','4n'],['A5','2n'],['F#5','4n'],
      ['B4','2n'],['D5','4n'],['F#5','2n'],['A5','4n'],
      ['G4','2n'],['B4','4n'],['D5','2n'],['B4','4n'],
      ['A4','2n'],['C#5','4n'],['E5','2n'],['A4','4n'],
    ];
    const melodyPart = new Tone.Loop((time) => {
      let offset = 0;
      const beatLen = 60 / Tone.Transport.bpm.value;
      wanderMelody.forEach(([note, dur]) => {
        this.synths.lead.triggerAttackRelease(note, dur, time + offset);
        const beats = dur === '8n' ? 0.5 : dur === '4n' ? 1 : dur === '2n' ? 2 : 1;
        offset += beats * beatLen;
      });
    }, '4m').start('2m');
    this.parts.push(melodyPart);
    
    Tone.Transport.start();
  }
  
  // === SFX ===
  hit() {
    if (!this.started || this.muted) return;
    this.synths.snare.triggerAttackRelease('16n');
    this.synths.kick.triggerAttackRelease('C1', '8n');
  }
  
  cardPlay() {
    if (!this.started || this.muted) return;
    this.synths.hihat.triggerAttackRelease('32n');
  }
  
  setMuted(m) {
    this.muted = m;
    Tone.Destination.mute = m;
  }
  
  stop() {
    this.clearParts();
    Tone.Transport.stop();
    this.currentTrack = null;
  }
}

const audio = new MetalAudio();

// ============ GAME DATA ============

const CARD_LIBRARY = {
  // === BASIC ATTACKS ===
  strike: { name: 'Strike', cost: 1, type: 'attack', dmg: 6, desc: 'Deal 6 damage.' },
  heavyStrike: { name: 'Heavy Strike', cost: 2, type: 'attack', dmg: 14, desc: 'Deal 14 damage.' },
  cleave: { name: 'Cleave', cost: 1, type: 'attack', dmg: 8, aoe: true, desc: 'Deal 8 damage to ALL enemies.' },
  shiv: { name: 'Shiv', cost: 0, type: 'attack', dmg: 4, desc: 'Deal 4 damage.' },
  bash: { name: 'Bash', cost: 2, type: 'attack', dmg: 8, vuln: 2, desc: 'Deal 8. Apply 2 Vulnerable.' },
  poison: { name: 'Poison Dart', cost: 1, type: 'attack', dmg: 3, poison: 3, desc: 'Deal 3. Apply 3 Poison.' },
  fireball: { name: 'Fireball', cost: 2, type: 'attack', dmg: 10, weak: 2, desc: 'Deal 10. Apply 2 Weak.' },
  
  // === ADVANCED ATTACKS ===
  twinStrike: { name: 'Twin Strike', cost: 1, type: 'attack', dmg: 5, hits: 2, desc: 'Deal 5 damage TWICE.' },
  flurry: { name: 'Flurry of Blows', cost: 2, type: 'attack', dmg: 4, hits: 4, desc: 'Deal 4 damage 4 times.' },
  whirlwind: { name: 'Whirlwind', cost: 2, type: 'attack', dmg: 5, aoe: true, hits: 2, desc: 'Deal 5 damage twice to ALL enemies.' },
  executioner: { name: 'Executioner', cost: 3, type: 'attack', dmg: 24, desc: 'Deal 24 damage.' },
  bloodletter: { name: 'Bloodletter', cost: 0, type: 'attack', dmg: 8, selfDmg: 2, desc: 'Lose 2 HP. Deal 8 damage.' },
  reckless: { name: 'Reckless Charge', cost: 1, type: 'attack', dmg: 12, selfDmg: 3, desc: 'Lose 3 HP. Deal 12 damage.' },
  thunderclap: { name: 'Thunderclap', cost: 1, type: 'attack', dmg: 4, aoe: true, vuln: 1, desc: 'Deal 4 to ALL. Apply 1 Vulnerable to ALL.' },
  dragonBreath: { name: 'Dragon Breath', cost: 2, type: 'attack', dmg: 7, aoe: true, weak: 2, desc: 'Deal 7 to ALL. Apply 2 Weak.' },
  venomFang: { name: 'Venom Fang', cost: 1, type: 'attack', dmg: 5, poison: 5, desc: 'Deal 5. Apply 5 Poison.' },
  lacerate: { name: 'Lacerate', cost: 2, type: 'attack', dmg: 6, hits: 3, desc: 'Deal 6 damage 3 times.' },
  skewer: { name: 'Skewer', cost: 1, type: 'attack', dmg: 7, vuln: 1, desc: 'Deal 7. Apply 1 Vulnerable.' },
  meteor: { name: 'Meteor Strike', cost: 3, type: 'attack', dmg: 18, aoe: true, desc: 'Deal 18 damage to ALL enemies.' },
  pyreCrush: { name: 'Pyre Crush', cost: 3, type: 'attack', dmg: 30, weak: 2, desc: 'Deal 30. Apply 2 Weak.' },
  riposte: { name: 'Riposte', cost: 1, type: 'attack', dmg: 6, block: 6, desc: 'Deal 6 damage. Gain 6 Block.' },
  shieldBash: { name: 'Shield Bash', cost: 1, type: 'attack', dmg: 0, desc: 'Deal damage equal to your current Block.' }, // special handled separately
  rampage: { name: 'Rampage', cost: 1, type: 'attack', dmg: 8, hits: 2, desc: 'Deal 8 damage twice.' },
  
  // === BASIC SKILLS ===
  defend: { name: 'Defend', cost: 1, type: 'skill', block: 5, desc: 'Gain 5 block.' },
  ironWall: { name: 'Iron Wall', cost: 2, type: 'skill', block: 13, desc: 'Gain 13 block.' },
  bulwark: { name: 'Bulwark', cost: 1, type: 'skill', block: 8, desc: 'Gain 8 block.' },
  rage: { name: 'Rage', cost: 0, type: 'skill', strength: 2, desc: 'Gain 2 Strength.' },
  meditate: { name: 'Meditate', cost: 1, type: 'skill', draw: 2, desc: 'Draw 2 cards.' },
  
  // === ADVANCED SKILLS ===
  fortify: { name: 'Fortify', cost: 2, type: 'skill', block: 10, dexterity: 2, desc: 'Gain 10 Block. Gain 2 Dexterity.' },
  shieldWall: { name: 'Shield Wall', cost: 3, type: 'skill', block: 22, desc: 'Gain 22 Block.' },
  evade: { name: 'Evade', cost: 1, type: 'skill', block: 8, dexterity: 1, desc: 'Gain 8 Block. Gain 1 Dexterity.' },
  warCry: { name: 'War Cry', cost: 1, type: 'skill', strength: 3, draw: 1, desc: 'Gain 3 Strength. Draw 1.' },
  battleHymn: { name: 'Battle Hymn', cost: 1, type: 'skill', strength: 2, dexterity: 2, desc: 'Gain 2 Strength and 2 Dexterity.' },
  bloodOath: { name: 'Blood Oath', cost: 0, type: 'skill', strength: 4, selfDmg: 4, desc: 'Lose 4 HP. Gain 4 Strength.' },
  preparation: { name: 'Preparation', cost: 0, type: 'skill', draw: 2, desc: 'Draw 2 cards.' },
  scry: { name: 'Scrying Stone', cost: 1, type: 'skill', draw: 3, desc: 'Draw 3 cards.' },
  inspire: { name: 'Inspire', cost: 0, type: 'skill', energy: 1, draw: 1, desc: 'Gain 1 Energy. Draw 1 card.' },
  secondWind: { name: 'Second Wind', cost: 1, type: 'skill', heal: 8, block: 5, desc: 'Heal 8 HP. Gain 5 Block.' },
  potionOfLife: { name: 'Potion of Life', cost: 1, type: 'skill', heal: 15, exhaust: true, desc: 'Heal 15 HP. Exhaust.' },
  bandage: { name: 'Field Bandage', cost: 0, type: 'skill', heal: 6, exhaust: true, desc: 'Heal 6 HP. Exhaust.' },
  rallyingCry: { name: 'Rallying Cry', cost: 1, type: 'skill', block: 6, energy: 1, desc: 'Gain 6 Block. Gain 1 Energy.' },
  
  // === POWER CARDS (high-impact buffs) ===
  berserk: { name: 'Berserk', cost: 0, type: 'power', strength: 3, selfDmg: 6, exhaust: true, desc: 'Lose 6 HP. Gain 3 Strength permanently. Exhaust.' },
  warriorsResolve: { name: "Warrior's Resolve", cost: 2, type: 'power', strength: 2, dexterity: 2, exhaust: true, desc: 'Gain 2 Strength and 2 Dexterity. Exhaust.' },
  bloodPact: { name: 'Blood Pact', cost: 1, type: 'power', strength: 4, selfDmg: 5, exhaust: true, desc: 'Lose 5 HP. Gain 4 Strength. Exhaust.' },
  dragonForm: { name: 'Dragon Form', cost: 3, type: 'power', strength: 4, dexterity: 2, exhaust: true, desc: 'Gain 4 Strength and 2 Dexterity. Exhaust.' },
  
  // === LEGENDARY (rare powerful cards) ===
  apocalypse: { name: 'Apocalypse', cost: 4, type: 'attack', dmg: 12, aoe: true, hits: 2, weak: 2, vuln: 2, desc: 'Deal 12 twice to ALL. Apply 2 Weak + 2 Vulnerable.' },
  finalBlow: { name: 'Final Blow', cost: 2, type: 'attack', dmg: 20, exhaust: true, desc: 'Deal 20 damage. Exhaust.' },
  bloodMagic: { name: 'Blood Magic', cost: 0, type: 'skill', draw: 4, selfDmg: 4, exhaust: true, desc: 'Lose 4 HP. Draw 4 cards. Exhaust.' },
  godsWrath: { name: "God's Wrath", cost: 3, type: 'attack', dmg: 15, hits: 2, desc: 'Deal 15 damage twice.' },
  immortal: { name: 'Immortal Surge', cost: 2, type: 'skill', heal: 20, block: 10, exhaust: true, desc: 'Heal 20. Gain 10 Block. Exhaust.' },
};

const STARTER_DECK = ['strike','strike','strike','strike','strike','defend','defend','defend','defend','bash'];

// Reward pool — common, uncommon (most rewards), excludes super-rare
const REWARD_POOL = [
  'heavyStrike','cleave','ironWall','poison','rage','meditate','fireball','shiv','bulwark','bash',
  'twinStrike','flurry','whirlwind','bloodletter','reckless','thunderclap','dragonBreath',
  'venomFang','lacerate','skewer','riposte','rampage',
  'fortify','evade','warCry','battleHymn','bloodOath','preparation','scry','inspire',
  'secondWind','bandage','rallyingCry',
];

// Rare pool — for special rewards (boss rewards, ancient tomes, etc.)
const RARE_POOL = [
  'executioner','meteor','pyreCrush','shieldWall','potionOfLife',
  'berserk','warriorsResolve','bloodPact','dragonForm',
  'apocalypse','finalBlow','bloodMagic','godsWrath','immortal',
];

// ============ ARTIFACTS ============
// Effects keyed by event hooks. Each artifact has at most one effect.
// Hooks: onCombatStart, onTurnStart, onCardPlay, onDmgTaken, onDmgDealt, onKill, onMapEnter, passive (always on)
const ARTIFACTS = {
  bloodPendant: { name: 'Blood Pendant', icon: '🩸', desc: '+10 max HP. Start each combat with 1 Strength.', rarity: 'common' },
  ironRing: { name: 'Iron Ring', icon: '💍', desc: '+1 Energy at start of each turn (max 4 energy).', rarity: 'rare' },
  dragonScale: { name: 'Dragon Scale', icon: '🐉', desc: 'Start each combat with 5 Block.', rarity: 'common' },
  gildedChalice: { name: 'Gilded Chalice', icon: '🍷', desc: 'Gain 5 extra gold from every battle.', rarity: 'common' },
  ravenFeather: { name: 'Raven Feather', icon: '🪶', desc: 'Draw 1 extra card each turn.', rarity: 'rare' },
  warhorn: { name: 'Warhorn', icon: '📯', desc: 'First card each turn costs 1 less Energy.', rarity: 'rare' },
  shadowCloak: { name: 'Shadow Cloak', icon: '🥷', desc: '+8 Block at start of each combat.', rarity: 'common' },
  cursedSkull: { name: 'Cursed Skull', icon: '💀', desc: 'Whenever you kill an enemy, gain 1 Strength this combat.', rarity: 'rare' },
  emberCore: { name: 'Ember Core', icon: '🔥', desc: 'All your AoE attacks deal +3 damage.', rarity: 'rare' },
  frozenHeart: { name: 'Frozen Heart', icon: '❄', desc: 'Start each combat with 8 Energy (one-time).', rarity: 'rare' },
  goldenIdol: { name: 'Golden Idol', icon: '🗿', desc: 'Gain 50% more gold from all sources.', rarity: 'common' },
  vampireFang: { name: 'Vampire Fang', icon: '🦇', desc: 'Heal 1 HP for every enemy killed.', rarity: 'common' },
  thornCrown: { name: 'Crown of Thorns', icon: '👑', desc: 'Whenever you take damage, deal 2 to attacker.', rarity: 'rare' },
  oracleEye: { name: 'Oracle Eye', icon: '👁', desc: 'Draw 2 extra cards on first turn of combat.', rarity: 'common' },
  livingArmor: { name: 'Living Armor', icon: '🛡', desc: 'Block does NOT reset between turns.', rarity: 'rare' },
  serpentTongue: { name: 'Serpent Tongue', icon: '🐍', desc: 'Apply +2 Poison whenever you Poison an enemy.', rarity: 'common' },
  thunderRune: { name: 'Thunder Rune', icon: '⚡', desc: 'Every 3rd attack deals double damage.', rarity: 'rare' },
  lifeAmulet: { name: 'Amulet of Life', icon: '💚', desc: 'Heal 4 HP after each battle.', rarity: 'common' },
  warStandard: { name: 'War Standard', icon: '🚩', desc: '+1 Strength at start of each combat.', rarity: 'common' },
  voidShard: { name: 'Void Shard', icon: '🔮', desc: 'On combat start: discard your hand, draw 5 fresh cards.', rarity: 'rare' },
};

const COMMON_ARTIFACTS = Object.keys(ARTIFACTS).filter(k => ARTIFACTS[k].rarity === 'common');
const RARE_ARTIFACTS = Object.keys(ARTIFACTS).filter(k => ARTIFACTS[k].rarity === 'rare');

const SINISTER_MESSAGES = [
  "You are being watched.",
  "It knows your name.",
  "The walls remember.",
  "Don't look behind you.",
  "Something else moves in your shadow.",
  "The spire whispers your true name.",
  "You should not have come this far.",
  "Your reflection blinks first.",
  "The dead are taking notes.",
  "There is no exit. There never was.",
  "You are running out of time.",
  "It hungers. It always hungers.",
  "The cards are not yours.",
  "Someone has been here before. They did not leave.",
  "Your bones already know the way.",
  "The next floor is hungry tonight.",
  "You felt that, didn't you?",
  "Don't blink. Don't blink. Don't blink.",
  "It is wearing your face.",
  "The boss has been waiting for you specifically.",
  "Every step echoes back twice.",
  "You should have stayed home.",
  "Something just learned your weakness.",
  "The torch is dying. So are you.",
];

const ENEMIES = {
  slime: { name: 'Slime', hp: 22, color: 0x6ee7b7, scale: 1, moves: [{type:'atk',val:6},{type:'atk',val:8},{type:'def',val:5}] },
  goblin: { name: 'Goblin', hp: 18, color: 0x84cc16, scale: 0.9, moves: [{type:'atk',val:7},{type:'atk',val:5},{type:'buff',val:2}] },
  wraith: { name: 'Wraith', hp: 28, color: 0xa78bfa, scale: 1.1, moves: [{type:'atk',val:9},{type:'atk',val:11},{type:'def',val:6}] },
  brute: { name: 'Brute', hp: 42, color: 0xef4444, scale: 1.3, moves: [{type:'atk',val:12},{type:'atk',val:8},{type:'buff',val:3}] },
  shade: { name: 'Shade', hp: 35, color: 0x60a5fa, scale: 1.0, moves: [{type:'atk',val:10},{type:'def',val:8},{type:'atk',val:14}] },
};

const BOSSES = {
  titan: { name: 'The Titan', hp: 110, color: 0xdc2626, scale: 1.8, moves: [{type:'atk',val:18},{type:'atk',val:22},{type:'buff',val:4},{type:'def',val:15}] },
  hydra: { name: 'Hydra Queen', hp: 95, color: 0x059669, scale: 1.7, moves: [{type:'atk',val:14},{type:'atk',val:10,times:2},{type:'def',val:12},{type:'buff',val:3}] },
  lich: { name: 'Lich Lord', hp: 85, color: 0x7c3aed, scale: 1.6, moves: [{type:'atk',val:20},{type:'def',val:18},{type:'atk',val:12},{type:'buff',val:5}] },
  voidlord: { name: 'The Void Sovereign', hp: 140, color: 0x000000, scale: 1.9, moves: [{type:'atk',val:24},{type:'atk',val:18},{type:'def',val:20},{type:'buff',val:6},{type:'atk',val:30}] },
};

// Pool of bosses to draw from per act. Acts 1-3 share bosses (shuffled, no repeats).
// Final boss (act 4) is always the Void Sovereign.
const BOSS_ACT_POOL = ['titan','hydra','lich'];
const FINAL_BOSS = 'voidlord';

// ============ MAP GENERATION ============

function generateMap(actNum = 0) {
  // 7 floors in act 1, scale up to 10 in act 4. More stops per floor too.
  const FLOORS = 8 + actNum;  // act 0->8, 1->9, 2->10, 3->11
  const map = [];
  
  for (let f = 0; f < FLOORS; f++) {
    const row = [];
    // More nodes per floor — 2 to 4 in middle floors
    const nodeCount = f === 0 ? 2 + Math.floor(Math.random() * 2)
                    : f === FLOORS - 1 ? 1
                    : 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nodeCount; i++) {
      let type;
      if (f === FLOORS - 1) type = 'boss';
      else if (f === 0) type = 'battle';
      else {
        const r = Math.random();
        // Slightly more events / merchants in higher acts
        if (r < 0.5) type = 'battle';
        else if (r < 0.72) type = 'event';
        else if (r < 0.88) type = 'merchant';
        else type = 'rest';
      }
      row.push({
        type,
        floor: f,
        idx: i,
        x: (i + 0.5) / nodeCount,
        connections: [],
        visited: false,
      });
    }
    map.push(row);
  }
  
  for (let f = 0; f < FLOORS - 1; f++) {
    map[f].forEach((node, i) => {
      const nextRow = map[f + 1];
      let closest = 0;
      let minDist = Infinity;
      nextRow.forEach((n, j) => {
        const d = Math.abs(n.x - node.x);
        if (d < minDist) { minDist = d; closest = j; }
      });
      node.connections.push(closest);
      // More frequent branching for richer paths
      if (Math.random() < 0.5 && nextRow.length > 1) {
        const alt = closest === 0 ? 1 : closest === nextRow.length - 1 ? closest - 1 : (Math.random() < 0.5 ? closest - 1 : closest + 1);
        if (!node.connections.includes(alt)) node.connections.push(alt);
      }
    });
    const nextRow = map[f + 1];
    nextRow.forEach((_, j) => {
      const reached = map[f].some(n => n.connections.includes(j));
      if (!reached) {
        let closest = 0, minDist = Infinity;
        map[f].forEach((n, i) => {
          const d = Math.abs(n.x - nextRow[j].x);
          if (d < minDist) { minDist = d; closest = i; }
        });
        map[f][closest].connections.push(j);
      }
    });
  }
  
  return map;
}

function generateBattle(floor, actNum = 0) {
  // Higher acts use stronger pools
  let pool;
  if (actNum === 0) {
    pool = floor < 2 ? ['slime','goblin'] : floor < 5 ? ['slime','goblin','wraith'] : ['wraith','brute','shade'];
  } else if (actNum === 1) {
    pool = floor < 3 ? ['goblin','wraith'] : floor < 6 ? ['wraith','brute','shade'] : ['brute','shade','wraith'];
  } else if (actNum === 2) {
    pool = floor < 3 ? ['wraith','shade'] : ['brute','shade','wraith'];
  } else {
    // Act 4 — only the toughest enemies
    pool = ['brute','shade','wraith'];
  }
  
  // More enemies in later acts
  const minCount = actNum >= 2 ? 2 : 1;
  const maxCount = actNum >= 2 ? 3 : 2;
  const count = floor < 2 && actNum === 0 ? 1 : minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
  
  // HP/damage scaling per act
  const hpMult = 1 + actNum * 0.4;       // act 0: 1.0×, act 1: 1.4×, act 2: 1.8×, act 3: 2.2×
  const dmgMult = 1 + actNum * 0.3;      // act 0: 1.0×, act 1: 1.3×, act 2: 1.6×, act 3: 1.9×
  
  const enemies = [];
  for (let i = 0; i < count; i++) {
    const key = pool[Math.floor(Math.random() * pool.length)];
    const tmpl = ENEMIES[key];
    const scaledHp = Math.floor(tmpl.hp * hpMult);
    const scaledMoves = tmpl.moves.map(m => ({
      ...m,
      val: m.type === 'atk' || m.type === 'def' || m.type === 'buff' ? Math.floor(m.val * (m.type === 'buff' ? 1 : dmgMult)) : m.val,
    }));
    enemies.push({
      ...tmpl,
      key,
      hp: scaledHp,
      maxHp: scaledHp,
      moves: scaledMoves,
      block: 0,
      strength: 0,
      vuln: 0,
      weak: 0,
      poison: 0,
      moveIdx: Math.floor(Math.random() * tmpl.moves.length),
      id: Math.random(),
    });
  }
  return enemies;
}

function generateBoss(actNum = 0, usedBosses = []) {
  let key;
  if (actNum >= 3) {
    // Final act — Void Sovereign
    key = FINAL_BOSS;
  } else {
    // Pick a boss not yet used
    const available = BOSS_ACT_POOL.filter(b => !usedBosses.includes(b));
    key = available[Math.floor(Math.random() * available.length)] || BOSS_ACT_POOL[Math.floor(Math.random() * BOSS_ACT_POOL.length)];
  }
  const tmpl = BOSSES[key];
  
  // Scale boss HP/dmg per act
  const hpMult = 1 + actNum * 0.45;     // act 0: 1.0×, act 3: 2.35×
  const dmgMult = 1 + actNum * 0.35;
  
  const scaledHp = Math.floor(tmpl.hp * hpMult);
  const scaledMoves = tmpl.moves.map(m => ({
    ...m,
    val: m.type === 'atk' || m.type === 'def' || m.type === 'buff' ? Math.floor(m.val * (m.type === 'buff' ? 1 : dmgMult)) : m.val,
  }));
  
  return [{
    ...tmpl,
    key,
    hp: scaledHp,
    maxHp: scaledHp,
    moves: scaledMoves,
    block: 0,
    strength: 0,
    vuln: 0,
    weak: 0,
    poison: 0,
    moveIdx: 0,
    id: Math.random(),
    isBoss: true,
  }];
}

const EVENTS = [
  { name: 'Mysterious Shrine', icon: '⛩', desc: 'A glowing altar pulses with otherworldly energy. The air hums.', choices: [
    { label: 'Pray (Heal 12 HP)', effect: g => ({ ...g, hp: Math.min(g.maxHp, g.hp + 12) }) },
    { label: 'Desecrate (+1 random card, lose 5 HP)', effect: g => {
      const card = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, deck: [...g.deck, card], hp: Math.max(1, g.hp - 5) };
    }},
    { label: 'Leave', effect: g => g },
  ]},
  { name: 'Wandering Spirit', icon: '👻', desc: 'A translucent ghost drifts toward you, whispering forgotten promises.', choices: [
    { label: 'Take its blessing (+8 max HP)', effect: g => ({ ...g, maxHp: g.maxHp + 8, hp: g.hp + 8 }) },
    { label: 'Steal its essence (+25 gold)', effect: g => ({ ...g, gold: g.gold + 25 }) },
    { label: 'Leave', effect: g => g },
  ]},
  { name: 'Forgotten Chest', icon: '⚱', desc: 'A dusty chest sealed with ancient runes sits in the corner.', choices: [
    { label: 'Open carefully (+30 gold)', effect: g => ({ ...g, gold: g.gold + 30 }) },
    { label: 'Smash it open (+1 card, take 8 damage)', effect: g => {
      const card = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, deck: [...g.deck, card], hp: Math.max(1, g.hp - 8) };
    }},
    { label: 'Leave', effect: g => g },
  ]},
  { name: 'The Hooded Stranger', icon: '🕯', desc: 'A cloaked figure offers a mysterious bargain. You cannot see their face.', choices: [
    { label: 'Trade 30 gold for healing (Heal 20 HP)', effect: g => g.gold >= 30 ? ({ ...g, gold: g.gold - 30, hp: Math.min(g.maxHp, g.hp + 20) }) : g },
    { label: 'Sell your soul (-10 max HP, +2 cards)', effect: g => {
      const c1 = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      const c2 = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, maxHp: Math.max(20, g.maxHp - 10), hp: Math.min(g.maxHp - 10, g.hp), deck: [...g.deck, c1, c2] };
    }},
    { label: 'Refuse', effect: g => g },
  ]},
  { name: 'Cursed Mirror', icon: '🪞', desc: 'A black mirror reflects something that is not quite you.', choices: [
    { label: 'Touch the glass (Random: heal or harm)', effect: g => {
      if (Math.random() < 0.5) return { ...g, hp: Math.min(g.maxHp, g.hp + 18) };
      return { ...g, hp: Math.max(1, g.hp - 12) };
    }},
    { label: 'Shatter it (+15 gold, +1 card)', effect: g => {
      const card = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, gold: g.gold + 15, deck: [...g.deck, card] };
    }},
    { label: 'Leave', effect: g => g },
  ]},
  { name: 'The Old Crone', icon: '🧙', desc: 'A bent figure cackles by a bubbling cauldron. "Drink, child?"', choices: [
    { label: 'Drink the potion (+5 max HP, full heal)', effect: g => ({ ...g, maxHp: g.maxHp + 5, hp: g.maxHp + 5 }) },
    { label: 'Steal her gold (+50 gold, lose 10 HP)', effect: g => ({ ...g, gold: g.gold + 50, hp: Math.max(1, g.hp - 10) }) },
    { label: 'Walk past', effect: g => g },
  ]},
  { name: 'Ancient Tome', icon: '📕', desc: 'A leather-bound book floats above a stone pedestal, pages turning.', choices: [
    { label: 'Read it (+1 RARE card)', effect: g => {
      const card = RARE_POOL[Math.floor(Math.random() * RARE_POOL.length)];
      return { ...g, deck: [...g.deck, card] };
    }},
    { label: 'Burn it (+40 gold)', effect: g => ({ ...g, gold: g.gold + 40 }) },
    { label: 'Leave it be', effect: g => g },
  ]},
  { name: 'Bloodstained Altar', icon: '🩸', desc: 'A jagged altar still wet with sacrifice. Power lingers here.', choices: [
    { label: 'Offer blood (-15 HP, +2 random cards)', effect: g => {
      const c1 = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      const c2 = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, hp: Math.max(1, g.hp - 15), deck: [...g.deck, c1, c2] };
    }},
    { label: 'Offer gold (-40 gold, gain blessing: +12 max HP)', effect: g => g.gold >= 40 ? ({ ...g, gold: g.gold - 40, maxHp: g.maxHp + 12, hp: g.hp + 12 }) : g },
    { label: 'Flee', effect: g => g },
  ]},
  { name: 'Drunken Bandit', icon: '🗡', desc: 'A passed-out bandit slumps against a tree, coin purse open.', choices: [
    { label: 'Steal silently (+35 gold)', effect: g => ({ ...g, gold: g.gold + 35 }) },
    { label: 'Slit his throat (+50 gold, gain Bash)', effect: g => ({ ...g, gold: g.gold + 50, deck: [...g.deck, 'bash'] }) },
    { label: 'Wake him up (lose 5 HP, +1 card)', effect: g => {
      const card = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, hp: Math.max(1, g.hp - 5), deck: [...g.deck, card] };
    }},
  ]},
  { name: 'Whispering Well', icon: '🪙', desc: 'Voices echo from a bottomless well. They demand tribute.', choices: [
    { label: 'Toss gold in (-20 gold, fully heal)', effect: g => g.gold >= 20 ? ({ ...g, gold: g.gold - 20, hp: g.maxHp }) : g },
    { label: 'Climb down (lose 10 HP, +60 gold)', effect: g => ({ ...g, hp: Math.max(1, g.hp - 10), gold: g.gold + 60 }) },
    { label: 'Spit and leave', effect: g => g },
  ]},
  { name: 'Imp Trader', icon: '👹', desc: 'A grinning imp lays out trinkets on a tattered cloth.', choices: [
    { label: 'Buy a Fireball scroll (-30 gold)', effect: g => g.gold >= 30 ? ({ ...g, gold: g.gold - 30, deck: [...g.deck, 'fireball'] }) : g },
    { label: 'Buy a Bulwark plate (-30 gold)', effect: g => g.gold >= 30 ? ({ ...g, gold: g.gold - 30, deck: [...g.deck, 'bulwark'] }) : g },
    { label: 'Decline', effect: g => g },
  ]},
  { name: 'The Twin Doors', icon: '🚪', desc: 'Two identical doors, one carved with runes, one with thorns.', choices: [
    { label: 'Rune door (Heal fully)', effect: g => ({ ...g, hp: g.maxHp }) },
    { label: 'Thorn door (-1 random card from deck, +1 powerful card)', effect: g => {
      if (g.deck.length <= 5) return g;
      const newDeck = [...g.deck];
      newDeck.splice(Math.floor(Math.random() * newDeck.length), 1);
      const powerful = RARE_POOL;
      newDeck.push(powerful[Math.floor(Math.random() * powerful.length)]);
      return { ...g, deck: newDeck };
    }},
    { label: 'Walk away', effect: g => g },
  ]},
  { name: 'Starving Beggar', icon: '🍞', desc: 'A trembling figure clutches at your cloak, hollow-eyed.', choices: [
    { label: 'Give 20 gold (+8 max HP — karma)', effect: g => g.gold >= 20 ? ({ ...g, gold: g.gold - 20, maxHp: g.maxHp + 8, hp: g.hp + 8 }) : g },
    { label: 'Ignore', effect: g => g },
    { label: 'Strike them down (+1 card, lose 3 HP from struggle)', effect: g => {
      const card = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
      return { ...g, deck: [...g.deck, card], hp: Math.max(1, g.hp - 3) };
    }},
  ]},
  { name: 'Dragon\'s Hoard', icon: '🐲', desc: 'Gold gleams in a chamber. The dragon is sleeping... probably.', choices: [
    { label: 'Grab and run (+80 gold, lose 20 HP)', effect: g => ({ ...g, gold: g.gold + 80, hp: Math.max(1, g.hp - 20) }) },
    { label: 'Take only one coin (+10 gold, safe)', effect: g => ({ ...g, gold: g.gold + 10 }) },
    { label: 'Back away slowly', effect: g => g },
  ]},
];

// ============ MAIN COMPONENT ============

export default function SpireClone() {
  const [scene, setScene] = useState('menu'); // menu, map, battle, event, merchant, rest, reward, gameover, victory
  const [game, setGame] = useState(null);
  const [battle, setBattle] = useState(null);
  const [event, setEvent] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [reward, setReward] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [artifactOffer, setArtifactOffer] = useState(null);
  const [sinister, setSinister] = useState(null);

  // Pick the right track per scene
  // Track which kind of music should be playing (computed)
  const isBossBattle = scene === 'battle' && battle?.enemies?.[0]?.isBoss === true;
  
  useEffect(() => {
    if (!audioReady) return;
    if (scene === 'battle') {
      if (isBossBattle) audio.playBossTheme();
      else audio.playBattleTheme();
    } else {
      // menu, map, event, merchant, rest, reward, gameover, victory, actTransition
      audio.playMenuTheme();
    }
  }, [scene, isBossBattle, audioReady]);
  
  const toggleMute = async () => {
    if (!audioReady) {
      await audio.init();
      setAudioReady(true);
    }
    const next = !muted;
    setMuted(next);
    audio.setMuted(next);
  };

  const startGame = async () => {
    if (!audioReady) {
      await audio.init();
      setAudioReady(true);
    }
    setGame({
      hp: 70,
      maxHp: 70,
      gold: 50,
      deck: [...STARTER_DECK],
      artifacts: [],
      actNum: 0,
      defeatedBosses: [],
      map: generateMap(0),
      pos: { floor: -1, idx: 0 }, // -1 means not started yet, can pick any floor 0 node
    });
    setScene('map');
  };
  
  const has = (key) => (game?.artifacts || []).includes(key);
  
  const offerArtifact = (key) => {
    // Functional check on the latest game state to avoid races.
    setGame(g => {
      const arts = g.artifacts || [];
      if (arts.length < 3) {
        // Auto-take it
        const next = { ...g, artifacts: [...arts, key] };
        if (key === 'bloodPendant') {
          next.maxHp = g.maxHp + 10;
          next.hp = g.hp + 10;
        }
        return next;
      } else {
        // Already full — open the swap modal (don't add the artifact yet)
        setArtifactOffer(key);
        return g;
      }
    });
  };
  
  // Kept for compatibility — only used internally now
  const grantArtifact = (key) => {
    setGame(g => {
      if ((g.artifacts || []).length >= 3) return g; // safety guard
      const next = { ...g, artifacts: [...(g.artifacts || []), key] };
      if (key === 'bloodPendant') {
        next.maxHp = g.maxHp + 10;
        next.hp = g.hp + 10;
      }
      return next;
    });
  };
  
  const swapArtifact = (replaceIdx, newKey) => {
    setGame(g => {
      const arts = [...(g.artifacts || [])];
      if (replaceIdx < 0 || replaceIdx >= arts.length) return g;
      const removed = arts[replaceIdx];
      arts[replaceIdx] = newKey;
      let next = { ...g, artifacts: arts };
      // Reverse pickup-bonus of removed
      if (removed === 'bloodPendant') {
        next.maxHp = Math.max(20, g.maxHp - 10);
        next.hp = Math.min(next.maxHp, g.hp);
      }
      // Apply pickup-bonus of new
      if (newKey === 'bloodPendant') {
        next.maxHp = next.maxHp + 10;
        next.hp = next.hp + 10;
      }
      return next;
    });
    setArtifactOffer(null);
  };
  
  const declineArtifact = () => setArtifactOffer(null);
  
  // Show a sinister message — random chance after most non-battle nodes
  const maybeShowSinister = (chance = 0.35) => {
    if (Math.random() < chance) {
      const msg = SINISTER_MESSAGES[Math.floor(Math.random() * SINISTER_MESSAGES.length)];
      setSinister(msg);
    }
  };

  const enterNode = (floor, idx) => {
    const node = game.map[floor][idx];
    const newMap = game.map.map(row => row.map(n => ({...n})));
    newMap[floor][idx].visited = true;
    setGame({ ...game, map: newMap, pos: { floor, idx } });
    
    if (node.type === 'battle') {
      setBattle(initBattle(generateBattle(floor, game.actNum || 0), game));
      setScene('battle');
    } else if (node.type === 'boss') {
      setBattle(initBattle(generateBoss(game.actNum || 0, game.defeatedBosses || []), game));
      setScene('battle');
    } else if (node.type === 'event') {
      setEvent(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
      setScene('event');
    } else if (node.type === 'merchant') {
      const cards = [];
      const used = new Set();
      while (cards.length < 3) {
        const c = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
        if (!used.has(c)) { used.add(c); cards.push({ card: c, price: 30 + Math.floor(Math.random() * 30) }); }
      }
      // 1-2 artifacts for sale
      const artifactCount = 1 + Math.floor(Math.random() * 2);
      const artifacts = [];
      const artUsed = new Set();
      const allArt = [...COMMON_ARTIFACTS, ...COMMON_ARTIFACTS, ...RARE_ARTIFACTS]; // weighted toward common
      while (artifacts.length < artifactCount) {
        const k = allArt[Math.floor(Math.random() * allArt.length)];
        if (!artUsed.has(k)) {
          artUsed.add(k);
          const isRare = ARTIFACTS[k].rarity === 'rare';
          artifacts.push({ key: k, price: isRare ? 90 + Math.floor(Math.random()*30) : 50 + Math.floor(Math.random()*25) });
        }
      }
      setMerchant({ cards, artifacts });
      setScene('merchant');
    } else if (node.type === 'rest') {
      setScene('rest');
    }
  };

  const initBattle = (enemies, g) => {
    const arts = g.artifacts || [];
    const hasA = (k) => arts.includes(k);
    
    const oracleBonus = hasA('oracleEye') ? 2 : 0;
    const ravenBonus = hasA('ravenFeather') ? 1 : 0;
    let initialHandSize = 5 + oracleBonus + ravenBonus;
    
    let deck = shuffle([...g.deck]);
    
    // Void Shard — re-shuffle the deck (effectively a "fresh draw")
    if (hasA('voidShard')) {
      deck = shuffle(deck);
    }
    
    return {
      enemies,
      hand: deck.slice(0, initialHandSize),
      drawPile: deck.slice(initialHandSize),
      discardPile: [],
      energy: hasA('frozenHeart') ? 8 : 3,
      maxEnergy: 3,
      block: (hasA('dragonScale') ? 5 : 0) + (hasA('shadowCloak') ? 8 : 0),
      strength: (hasA('bloodPendant') ? 1 : 0) + (hasA('warStandard') ? 1 : 0),
      turn: 'player',
      shadowCloakUsed: false,
      hitsCount: 0,
      firstCardOfTurn: true,
    };
  };

  const onBattleEnd = (won) => {
    if (won) {
      let gold = 15 + Math.floor(Math.random() * 15);
      // Artifact bonuses
      if (has('gildedChalice')) gold += 5;
      if (has('goldenIdol')) gold = Math.floor(gold * 1.5);
      let healAmt = 0;
      if (has('lifeAmulet')) healAmt = 4;
      
      const isBoss = battle.enemies[0].isBoss;
      const bossKey = isBoss ? battle.enemies[0].key : null;
      
      // Apply heal + gold immediately
      setGame(g => ({
        ...g,
        gold: g.gold + gold,
        hp: Math.min(g.maxHp, g.hp + healAmt),
      }));
      
      if (isBoss) {
        const isFinal = bossKey === FINAL_BOSS;
        if (isFinal) {
          setScene('victory');
          return;
        }
        // Boss defeated — give big rewards (gold + rare card + guaranteed artifact)
        // then transition to next act after the reward screen
        const bossGold = 80 + Math.floor(Math.random() * 40);
        const bossCards = [];
        const usedRare = new Set();
        while (bossCards.length < 3) {
          const c = RARE_POOL[Math.floor(Math.random() * RARE_POOL.length)];
          if (!usedRare.has(c)) { usedRare.add(c); bossCards.push(c); }
        }
        // Guaranteed rare artifact
        const bossArtifact = RARE_ARTIFACTS[Math.floor(Math.random() * RARE_ARTIFACTS.length)];
        setReward({ gold: bossGold, cards: bossCards, healed: healAmt, artifact: bossArtifact, isBossReward: true, defeatedBoss: bossKey });
        setGame(g => ({ ...g, gold: g.gold + bossGold }));  // bossGold on top of regular gold
        setScene('reward');
        return;
      }
      // pick 3 random cards
      const choices = [];
      const used = new Set();
      while (choices.length < 3) {
        const c = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
        if (!used.has(c)) { used.add(c); choices.push(c); }
      }
      // Bonus artifact reward — small chance after non-boss combat
      const artifactReward = Math.random() < 0.2 ? COMMON_ARTIFACTS[Math.floor(Math.random() * COMMON_ARTIFACTS.length)] : null;
      setReward({ gold, cards: choices, healed: healAmt, artifact: artifactReward });
      setScene('reward');
    } else {
      setScene('gameover');
    }
  };

  const completeReward = (chosenCard) => {
    if (chosenCard) {
      setGame(g => ({ ...g, deck: [...g.deck, chosenCard] }));
    }
    
    const wasBossReward = reward?.isBossReward;
    const defeatedKey = reward?.defeatedBoss;
    const artifactToOffer = reward?.artifact;
    
    setReward(null);
    
    if (wasBossReward) {
      // Advance to the next act!
      setGame(g => {
        const newAct = (g.actNum || 0) + 1;
        const newDefeated = [...(g.defeatedBosses || []), defeatedKey];
        return {
          ...g,
          actNum: newAct,
          defeatedBosses: newDefeated,
          map: generateMap(newAct),
          pos: { floor: -1, idx: 0 },
          // Heal player by 30% max HP between acts
          hp: Math.min(g.maxHp, g.hp + Math.floor(g.maxHp * 0.3)),
        };
      });
      // Offer the artifact after state update
      if (artifactToOffer) {
        setTimeout(() => offerArtifact(artifactToOffer), 100);
      }
      setScene('actTransition');
      return;
    }
    
    // Normal reward — offer artifact (if any) and go back to map
    if (artifactToOffer) {
      offerArtifact(artifactToOffer);
    }
    setScene('map');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-mono select-none" style={{
      fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
      background: 'radial-gradient(ellipse at top, #1a0f2e 0%, #050208 60%, #000 100%)',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Cormorant+Garamond:wght@400;600&display=swap" rel="stylesheet" />
      
      {scene === 'menu' && <MainMenu onStart={startGame} />}
      {scene === 'map' && <MapScreen game={game} onEnter={enterNode} />}
      {scene === 'battle' && <BattleScreen game={game} setGame={setGame} battle={battle} setBattle={setBattle} onEnd={onBattleEnd} />}
      {scene === 'event' && <EventScreen game={game} setGame={setGame} event={event} onDone={() => {
        // 30% chance event yields a small artifact + 35% chance of sinister message
        if (Math.random() < 0.25) {
          const key = COMMON_ARTIFACTS[Math.floor(Math.random() * COMMON_ARTIFACTS.length)];
          offerArtifact(key);
        }
        maybeShowSinister(0.4);
        setScene('map');
      }} />}
      {scene === 'merchant' && <MerchantScreen game={game} setGame={setGame} merchant={merchant} setMerchant={setMerchant} onOfferArtifact={offerArtifact} onDone={() => setScene('map')} />}
      {scene === 'rest' && <RestScreen game={game} setGame={setGame} onDone={() => { maybeShowSinister(0.2); setScene('map'); }} />}
      {scene === 'reward' && <RewardScreen reward={reward} onDone={completeReward} />}
      {scene === 'gameover' && <GameOver onRestart={() => setScene('menu')} />}
      {scene === 'victory' && <VictoryScreen onRestart={() => setScene('menu')} />}
      {scene === 'actTransition' && <ActTransition actNum={game.actNum} onContinue={() => setScene('map')} />}
      
      {/* Artifact offer modal — when picking up a 4th artifact */}
      {artifactOffer && game && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at center, rgba(76,29,149,0.6) 0%, rgba(0,0,0,0.92) 70%)' }}>
          <div className="max-w-sm w-full p-5 border-2 border-amber-400/60 rounded-lg" style={{ background: 'linear-gradient(160deg, #1a0f2e, #050208)', boxShadow: '0 0 40px rgba(245,158,11,0.4)' }}>
            <div className="text-[10px] tracking-[0.4em] text-amber-300/70 text-center mb-2">A FIND</div>
            <h3 className="text-xl font-bold text-amber-200 text-center mb-3" style={{ fontFamily: 'Cinzel, serif' }}>{ARTIFACTS[artifactOffer].name}</h3>
            <div className="text-5xl text-center mb-3" style={{ filter: `drop-shadow(0 0 12px ${ARTIFACTS[artifactOffer].rarity === 'rare' ? '#a78bfa' : '#fbbf24'})` }}>{ARTIFACTS[artifactOffer].icon}</div>
            <div className="text-sm text-amber-100/80 text-center italic mb-4">{ARTIFACTS[artifactOffer].desc}</div>
            
            <div className="text-xs tracking-widest text-amber-100/60 text-center mb-2">YOUR INVENTORY IS FULL.<br/>SWAP ONE OUT — OR LEAVE IT.</div>
            <div className="space-y-2 mb-4">
              {game.artifacts.map((k, i) => {
                const a = ARTIFACTS[k];
                return (
                  <button key={i} onClick={() => swapArtifact(i, artifactOffer)}
                    className="w-full p-2 border border-red-400/40 hover:bg-red-500/10 active:scale-95 flex items-center gap-3 text-left transition-all">
                    <div className="text-2xl">{a.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-amber-100 font-bold">Drop {a.name}</div>
                      <div className="text-[10px] text-white/50">{a.desc}</div>
                    </div>
                    <div className="text-xs text-red-300 tracking-widest">SWAP</div>
                  </button>
                );
              })}
            </div>
            <button onClick={declineArtifact} className="w-full px-4 py-2 border border-amber-400/40 text-amber-100/70 hover:bg-amber-400/10 active:scale-95 transition-all text-xs tracking-widest">
              LEAVE THE ARTIFACT
            </button>
          </div>
        </div>
      )}
      
      {/* Sinister message — short, ominous, dismissable */}
      {sinister && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-6 cursor-pointer" 
          onClick={() => setSinister(null)}
          style={{ background: 'radial-gradient(ellipse at center, rgba(50,0,0,0.4) 0%, rgba(0,0,0,0.95) 80%)', animation: 'sinisterFade 0.5s ease-out' }}>
          <div className="text-center" style={{ animation: 'sinisterText 0.8s ease-out' }}>
            <div className="text-red-900 text-[10px] tracking-[0.6em] mb-4">· · ·</div>
            <div className="text-red-200/90 text-lg md:text-2xl italic leading-relaxed max-w-md" style={{
              fontFamily: 'Cormorant Garamond, serif',
              textShadow: '0 0 20px rgba(220,38,38,0.6), 0 0 40px rgba(0,0,0,0.9)',
              letterSpacing: '0.05em',
            }}>
              "{sinister}"
            </div>
            <div className="text-red-900/70 text-[10px] tracking-[0.4em] mt-6 animate-pulse">[ TAP TO CONTINUE ]</div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes sinisterFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sinisterText {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          50% { opacity: 1; }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      
      {/* Mute button — always visible */}
      <button
        onClick={toggleMute}
        className="fixed top-2 right-2 z-50 w-9 h-9 rounded-full border border-amber-400/40 bg-black/60 backdrop-blur text-amber-200 active:scale-90 transition-all flex items-center justify-center text-sm"
        style={{ boxShadow: '0 0 10px rgba(245,158,11,0.3)' }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {!audioReady ? '♪' : muted ? '🔇' : '🎸'}
      </button>
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============ MAIN MENU ============

function MainMenu({ onStart }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, #7c2d12 0%, transparent 40%), radial-gradient(circle at 80% 70%, #4c1d95 0%, transparent 40%)',
      }} />
      <div className="relative z-10 text-center">
        <div className="text-xs tracking-[0.5em] text-amber-200/60 mb-4">A DECK · A PATH · A DOOM</div>
        <h1 className="text-6xl md:text-8xl font-bold mb-2 tracking-wider" style={{
          background: 'linear-gradient(180deg, #fef3c7 0%, #f59e0b 50%, #7c2d12 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(245,158,11,0.3)',
        }}>ASCENT</h1>
        <div className="text-amber-100/40 italic text-sm md:text-base mb-12 tracking-widest">of the forgotten spire</div>
        <button
          onClick={onStart}
          className="px-12 py-4 text-lg tracking-[0.3em] border border-amber-400/40 text-amber-100 hover:bg-amber-400/10 hover:border-amber-400 active:scale-95 transition-all duration-200"
          style={{ boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}
        >
          BEGIN
        </button>
        <div className="mt-16 text-amber-100/30 text-xs tracking-[0.3em]">TAP · DRAG · CONQUER</div>
      </div>
    </div>
  );
}

// ============ MAP SCREEN ============

function MapScreen({ game, onEnter }) {
  const FLOORS = game.map.length;
  const currentFloor = game.pos.floor;
  const currentIdx = game.pos.idx;
  const FLOOR_HEIGHT = 140;
  const TOTAL_HEIGHT = FLOORS * FLOOR_HEIGHT + 120;
  
  const scrollRef = useRef(null);
  
  // Auto-scroll to focus on the active position (next available row)
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    // The "focus" floor is one above current (the row the player is choosing into),
    // or floor 0 if they haven't started.
    const focusFloor = currentFloor === -1 ? 0 : Math.min(currentFloor + 1, FLOORS - 1);
    // Y of that row from top of map area:
    const focusY = (FLOORS - 1 - focusFloor) * FLOOR_HEIGHT + 50;
    // Center it in the visible viewport:
    const targetScroll = Math.max(0, focusY - el.clientHeight / 2);
    el.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [currentFloor, currentIdx, FLOORS]);
  
  const isAvailable = (f, i) => {
    if (currentFloor === -1) return f === 0;
    if (f !== currentFloor + 1) return false;
    return game.map[currentFloor][currentIdx].connections.includes(i);
  };
  
  const nodeIcon = (type) => {
    if (type === 'battle') return '⚔';
    if (type === 'boss') return '☠';
    if (type === 'event') return '?';
    if (type === 'merchant') return '$';
    if (type === 'rest') return '✦';
    return '·';
  };
  
  const nodeColor = (type) => {
    if (type === 'battle') return '#ef4444';
    if (type === 'boss') return '#dc2626';
    if (type === 'event') return '#a78bfa';
    if (type === 'merchant') return '#fbbf24';
    if (type === 'rest') return '#34d399';
    return '#fff';
  };
  
  // Procedural scenery — generated once per map, deterministic per floor index
  const scenery = useMemo(() => {
    const items = [];
    // Particles drifting across whole map
    for (let i = 0; i < 40; i++) {
      items.push({
        kind: 'particle',
        id: `p${i}`,
        left: Math.random() * 100,
        top: Math.random() * TOTAL_HEIGHT,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.4,
      });
    }
    // Floating runes / glyphs
    const runes = ['✦','✧','❂','◈','✺','❉','✤','⚜'];
    for (let i = 0; i < 12; i++) {
      items.push({
        kind: 'rune',
        id: `r${i}`,
        left: 5 + Math.random() * 90,
        top: Math.random() * TOTAL_HEIGHT,
        char: runes[Math.floor(Math.random() * runes.length)],
        size: 8 + Math.random() * 14,
        delay: Math.random() * 10,
        opacity: 0.08 + Math.random() * 0.15,
      });
    }
    return items;
  }, [TOTAL_HEIGHT]);
  
  // Decoration per floor — alternating left/right side props
  const floorDecor = (f) => {
    const props = ['🗻','🏛','🌲','⛰','🪨','🏚'];
    const seed = (f * 7) % props.length;
    const seed2 = (f * 11 + 3) % props.length;
    return [props[seed], props[seed2]];
  };
  
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-amber-400/30 bg-gradient-to-b from-black/90 to-black/60 backdrop-blur z-20 relative gap-2">
        <div className="flex items-center gap-2 text-sm flex-shrink-0">
          <div className="text-red-400 flex items-center gap-1">
            <span className="text-base">♥</span>
            <span className="font-bold">{game.hp}</span>
            <span className="text-red-400/40 text-xs">/{game.maxHp}</span>
          </div>
          <div className="text-amber-400 flex items-center gap-1">
            <span className="text-base">◈</span>
            <span className="font-bold">{game.gold}</span>
          </div>
        </div>
        
        {/* Artifact slots in middle */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {[0,1,2].map(i => {
            const k = (game.artifacts || [])[i];
            const a = k ? ARTIFACTS[k] : null;
            return (
              <div key={i} className={`w-9 h-9 rounded border flex items-center justify-center text-lg ${a ? '' : 'border-dashed border-amber-400/20'}`}
                style={a ? {
                  borderColor: a.rarity === 'rare' ? '#a78bfa' : '#fbbf24',
                  background: a.rarity === 'rare' ? 'radial-gradient(circle, #4c1d9580, #0a0a1a)' : 'radial-gradient(circle, #78350f80, #0a0203)',
                  boxShadow: `0 0 8px ${a.rarity === 'rare' ? '#a78bfa80' : '#fbbf2480'}`,
                } : {}}
                title={a ? `${a.name}: ${a.desc}` : 'Empty slot'}>
                {a ? a.icon : <span className="text-amber-400/20 text-xs">·</span>}
              </div>
            );
          })}
        </div>
        
        <div className="text-xs text-amber-100/50 flex-shrink-0">{game.deck.length}c</div>
      </div>
      
      {/* Act indicator */}
      <div className="px-3 py-1 bg-black/40 border-b border-amber-400/10 flex items-center justify-center gap-3 z-20 relative">
        <div className="flex items-center gap-1">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${
              i < (game.actNum || 0) ? 'bg-emerald-400' : i === (game.actNum || 0) ? 'bg-amber-400 animate-pulse' : 'bg-white/20'
            }`} />
          ))}
        </div>
        <div className="text-[10px] tracking-[0.3em] text-amber-100/60" style={{ fontFamily: 'Cinzel, serif' }}>
          ACT {(game.actNum || 0) + 1} · {ACT_NAMES[Math.min(game.actNum || 0, 3)].name.toUpperCase()}
        </div>
      </div>
      
      {/* Map scrollable area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* === BACKGROUND LAYERS === */}
        
        {/* Atmospheric gradient background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 30% 20%, #4c1d95 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, #7c2d12 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, #1e1b4b 0%, transparent 70%),
            linear-gradient(180deg, #1a0f2e 0%, #050208 100%)
          `,
          height: `${TOTAL_HEIGHT}px`,
          minHeight: '100%',
        }} />
        
        {/* Mountain silhouettes — repeating SVG layer behind the path */}
        <svg className="absolute inset-x-0 pointer-events-none opacity-40" style={{ height: `${TOTAL_HEIGHT}px`, width: '100%' }}
          preserveAspectRatio="none" viewBox={`0 0 100 ${TOTAL_HEIGHT}`}>
          <defs>
            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mountainGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#831843" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Repeating mountain ridges every ~200px */}
          {Array.from({ length: Math.ceil(TOTAL_HEIGHT / 200) }).map((_, i) => {
            const y = i * 200;
            return (
              <g key={i}>
                <path d={`M0,${y+150} L15,${y+80} L25,${y+110} L40,${y+50} L55,${y+95} L70,${y+40} L85,${y+90} L100,${y+70} L100,${y+200} L0,${y+200} Z`}
                  fill="url(#mountainGrad)" />
                <path d={`M0,${y+170} L20,${y+120} L35,${y+140} L50,${y+90} L65,${y+130} L80,${y+100} L100,${y+125} L100,${y+200} L0,${y+200} Z`}
                  fill="url(#mountainGrad2)" />
              </g>
            );
          })}
        </svg>
        
        {/* Drifting particles + glyphs */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ height: `${TOTAL_HEIGHT}px` }}>
          {scenery.map(s => {
            if (s.kind === 'particle') {
              return (
                <div key={s.id} className="absolute rounded-full bg-amber-300"
                  style={{
                    left: `${s.left}%`, top: `${s.top}px`,
                    width: `${s.size}px`, height: `${s.size}px`,
                    opacity: s.opacity,
                    boxShadow: `0 0 ${s.size * 3}px rgba(251,191,36,${s.opacity})`,
                    animation: `mapDrift ${s.duration}s ease-in-out ${s.delay}s infinite`,
                  }} />
              );
            }
            return (
              <div key={s.id} className="absolute text-purple-300"
                style={{
                  left: `${s.left}%`, top: `${s.top}px`,
                  fontSize: `${s.size}px`,
                  opacity: s.opacity,
                  animation: `mapPulse ${4 + s.delay}s ease-in-out ${s.delay}s infinite`,
                  textShadow: '0 0 8px currentColor',
                }}>{s.char}</div>
            );
          })}
        </div>
        
        {/* Outer floor decorations (mountains, ruins, trees in margins) */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ height: `${TOTAL_HEIGHT}px` }}>
          {game.map.map((_, f) => {
            const [leftProp, rightProp] = floorDecor(f);
            const y = (FLOORS - 1 - f) * FLOOR_HEIGHT + 50;
            return (
              <React.Fragment key={f}>
                <div className="absolute text-3xl opacity-25" style={{
                  left: '4%', top: `${y}px`, transform: 'translateY(-50%)',
                  filter: 'grayscale(0.5) brightness(0.7)',
                  textShadow: '0 0 20px rgba(124,58,237,0.5)',
                }}>{leftProp}</div>
                <div className="absolute text-3xl opacity-25" style={{
                  right: '4%', top: `${y + 30}px`, transform: 'translateY(-50%) scaleX(-1)',
                  filter: 'grayscale(0.5) brightness(0.7)',
                  textShadow: '0 0 20px rgba(220,38,38,0.5)',
                }}>{rightProp}</div>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Boss aura at the top */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ top: 0, height: '180px' }}>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.4) 0%, transparent 70%)',
            animation: 'bossPulse 3s ease-in-out infinite',
          }} />
        </div>
        
        {/* === PATH LINES === */}
        <svg className="absolute inset-0 w-full pointer-events-none z-10" style={{ height: `${TOTAL_HEIGHT}px` }}>
          <defs>
            <filter id="pathGlow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {game.map.map((row, f) => row.map((node, i) => 
            node.connections.map((conn, ci) => {
              const next = game.map[f+1][conn];
              const x1 = node.x * 100;
              const y1 = ((FLOORS - 1 - f) * FLOOR_HEIGHT + 80);
              const x2 = next.x * 100;
              const y2 = ((FLOORS - 1 - (f+1)) * FLOOR_HEIGHT + 80);
              const active = currentFloor === f && currentIdx === i && isAvailable(f+1, conn);
              const traveled = node.visited && next.visited;
              return (
                <line key={`${f}-${i}-${ci}`}
                  x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2}
                  stroke={active ? '#fbbf24' : traveled ? '#fbbf2470' : '#ffffff15'}
                  strokeWidth={active ? 3 : traveled ? 2 : 1.5}
                  strokeDasharray={active ? '0' : traveled ? '0' : '4 4'}
                  filter={active ? 'url(#pathGlow)' : undefined}
                />
              );
            })
          ))}
        </svg>
        
        {/* === NODES === */}
        <div className="relative z-20" style={{ height: `${TOTAL_HEIGHT}px` }}>
          {game.map.map((row, f) => (
            <div key={f} className="absolute w-full" style={{ top: `${(FLOORS - 1 - f) * FLOOR_HEIGHT + 30}px` }}>
              {/* Floor label on the side */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.3em] text-amber-200/30 rotate-90 origin-left whitespace-nowrap" style={{ fontFamily: 'Cinzel, serif' }}>
                FLOOR {f + 1}
              </div>
              
              {row.map((node, i) => {
                const available = isAvailable(f, i);
                const isCurrent = currentFloor === f && currentIdx === i;
                const visited = node.visited;
                const color = nodeColor(node.type);
                return (
                  <button
                    key={i}
                    onClick={() => available && onEnter(f, i)}
                    disabled={!available}
                    className="absolute -translate-x-1/2 transition-all duration-300"
                    style={{
                      left: `${node.x * 100}%`,
                      opacity: available || visited || isCurrent ? 1 : 0.4,
                    }}
                  >
                    <div className="relative">
                      {/* Glow halo for available nodes */}
                      {available && (
                        <div className="absolute inset-0 rounded-full -m-3" style={{
                          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                          animation: 'nodeHalo 2s ease-in-out infinite',
                        }} />
                      )}
                      
                      {/* Node ring (decorative outer circle) */}
                      {(available || isCurrent) && (
                        <div className="absolute inset-0 -m-1 rounded-full border" style={{
                          borderColor: `${color}60`,
                          animation: 'nodeRing 3s linear infinite',
                        }} />
                      )}
                      
                      {/* Main node */}
                      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
                        isCurrent ? 'scale-110' : 'active:scale-95'
                      }`}
                      style={{
                        background: visited
                          ? `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`
                          : available
                          ? `radial-gradient(circle at 30% 30%, ${color}30, ${color}10)`
                          : `radial-gradient(circle at 30% 30%, ${color}15, #00000080)`,
                        borderColor: available ? color : `${color}50`,
                        color: color,
                        boxShadow: available
                          ? `0 0 25px ${color}, inset 0 0 10px ${color}40`
                          : isCurrent
                          ? `0 0 15px ${color}80`
                          : visited
                          ? `0 0 8px ${color}40`
                          : 'none',
                        textShadow: '0 0 8px currentColor',
                      }}>
                        {nodeIcon(node.type)}
                      </div>
                      
                      {/* Current position indicator */}
                      {isCurrent && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] tracking-widest text-amber-300 whitespace-nowrap" style={{ textShadow: '0 0 6px rgba(251,191,36,0.8)' }}>
                          ▲ HERE ▲
                        </div>
                      )}
                      
                      {/* Boss label */}
                      {f === FLOORS - 1 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-red-400 font-bold whitespace-nowrap" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 8px rgba(220,38,38,0.8)' }}>
                          ☠ BOSS ☠
                        </div>
                      )}
                      
                      {/* "TAP" hint for available */}
                      {available && (
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] tracking-widest whitespace-nowrap" style={{ color, opacity: 0.8 }}>
                          ▼
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-around items-center px-2 py-2 border-t border-amber-400/30 bg-gradient-to-t from-black to-black/80 backdrop-blur text-[10px] tracking-wider z-20 relative">
        <div className="text-red-400">⚔ Fight</div>
        <div className="text-purple-400">? Event</div>
        <div className="text-amber-400">$ Shop</div>
        <div className="text-emerald-400">✦ Rest</div>
        <div className="text-red-600">☠ Boss</div>
      </div>
      
      <style>{`
        @keyframes mapDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -20px); }
        }
        @keyframes mapPulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        @keyframes bossPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes nodeHalo {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes nodeRing {
          0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          50% { transform: scale(1.15) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// ============ 3D BATTLE SCENE ============

function Battle3D({ enemies, playerAction, enemyAction, onAnimComplete }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const enemyMeshesRef = useRef([]);
  const animStateRef = useRef({ time: 0 });
  const actionRef = useRef(null);
  
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0510, 0.08);
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    const hasBoss = enemies.some(e => e.isBoss);
    camera.position.set(0, hasBoss ? 3.5 : 2.5, hasBoss ? 11 : 8);
    camera.lookAt(0, hasBoss ? 1.8 : 1, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    
    // Lights
    const ambient = new THREE.AmbientLight(0x4a3a6a, 0.5);
    scene.add(ambient);
    
    const keyLight = new THREE.DirectionalLight(0xffaa66, 1.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0x7c3aed, 0.6);
    rimLight.position.set(-5, 3, -3);
    scene.add(rimLight);
    
    const torchLight = new THREE.PointLight(0xff6633, 1.5, 15);
    torchLight.position.set(0, 4, 4);
    scene.add(torchLight);
    
    // Floor - stone arena
    const floorGeo = new THREE.CircleGeometry(8, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f33,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Magic circle on floor
    const circleGeo = new THREE.RingGeometry(2.5, 2.8, 64);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = -Math.PI / 2;
    circle.position.y = 0.01;
    scene.add(circle);
    
    const innerCircle = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 1.85, 64),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    innerCircle.rotation.x = -Math.PI / 2;
    innerCircle.position.y = 0.02;
    scene.add(innerCircle);
    
    // Pillars in background
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const r = 7;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 6, 8),
        new THREE.MeshStandardMaterial({ color: 0x1a1525, roughness: 0.8 })
      );
      pillar.position.set(Math.cos(angle) * r, 3, Math.sin(angle) * r);
      pillar.castShadow = true;
      scene.add(pillar);
    }
    
    // Floating particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - 0.5) * 16;
      positions[i*3+1] = Math.random() * 6;
      positions[i*3+2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
      color: 0xfbbf24, size: 0.05, transparent: true, opacity: 0.5,
    }));
    scene.add(particles);
    
    // Helpers
    const makeEye = (size, color) => {
      const eye = new THREE.Group();
      const sclera = new THREE.Mesh(
        new THREE.SphereGeometry(size, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: color || 0xffaa00, emissiveIntensity: 0.6, roughness: 0.2 })
      );
      eye.add(sclera);
      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.5, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      pupil.position.z = size * 0.6;
      eye.add(pupil);
      return eye;
    };
    
    const makeFang = (h) => new THREE.Mesh(
      new THREE.ConeGeometry(0.05, h, 4),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.3 })
    );
    
    // Create enemy meshes
    const enemyMeshes = [];
    enemies.forEach((enemy, idx) => {
      const group = new THREE.Group();
      const offset = (idx - (enemies.length - 1) / 2) * 3;
      group.position.set(offset, 0, 0);
      
      // Body - detailed models per enemy type
      let bodyMesh = new THREE.Group();
      const s = enemy.scale;
      
      if (enemy.key === 'slime') {
        // Gelatinous blob with eyes and bubbles
        const blob = new THREE.Mesh(
          new THREE.SphereGeometry(0.85 * s, 24, 18),
          new THREE.MeshPhysicalMaterial({
            color: enemy.color, roughness: 0.1, metalness: 0,
            transmission: 0.6, thickness: 1.5, ior: 1.4,
            transparent: true, opacity: 0.8,
            emissive: enemy.color, emissiveIntensity: 0.4,
            clearcoat: 1, clearcoatRoughness: 0.1,
          })
        );
        blob.position.y = 0.65 * s;
        blob.scale.y = 0.75;
        bodyMesh.add(blob);
        // Inner core
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.3 * s, 12, 8),
          new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: enemy.color, emissiveIntensity: 1 })
        );
        core.position.y = 0.55 * s;
        bodyMesh.add(core);
        // Floating bubbles inside
        for (let i = 0; i < 4; i++) {
          const bubble = new THREE.Mesh(
            new THREE.SphereGeometry(0.08 * s, 8, 6),
            new THREE.MeshStandardMaterial({ color: 0xfffff0, transparent: true, opacity: 0.7 })
          );
          bubble.position.set((Math.random()-0.5)*0.8, 0.3 + Math.random()*0.6, (Math.random()-0.5)*0.5);
          bubble.userData.bubbleSpeed = 0.005 + Math.random() * 0.01;
          bodyMesh.add(bubble);
        }
        // Eyes
        const leyeS = makeEye(0.13 * s, 0x44ff44);
        leyeS.position.set(-0.2 * s, 0.7 * s, 0.6 * s);
        const reyeS = makeEye(0.13 * s, 0x44ff44);
        reyeS.position.set(0.2 * s, 0.7 * s, 0.6 * s);
        bodyMesh.add(leyeS); bodyMesh.add(reyeS);
      }
      else if (enemy.key === 'goblin') {
        // Hunched goblin: legs, torso, head, ears, club
        const skin = new THREE.MeshStandardMaterial({ color: enemy.color, roughness: 0.8 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x3f2f1f, roughness: 0.9 });
        // Legs
        for (let l = 0; l < 2; l++) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12*s, 0.15*s, 0.6*s, 8), skin);
          leg.position.set((l ? 0.2 : -0.2) * s, 0.3 * s, 0);
          bodyMesh.add(leg);
          const foot = new THREE.Mesh(new THREE.BoxGeometry(0.25*s, 0.1*s, 0.35*s), dark);
          foot.position.set((l ? 0.2 : -0.2) * s, 0.05 * s, 0.05 * s);
          bodyMesh.add(foot);
        }
        // Torso (hunched)
        const torso = new THREE.Mesh(new THREE.SphereGeometry(0.4*s, 12, 10), skin);
        torso.scale.set(1, 0.9, 0.8);
        torso.position.set(0, 0.85 * s, -0.05 * s);
        bodyMesh.add(torso);
        // Loincloth
        const cloth = new THREE.Mesh(new THREE.CylinderGeometry(0.4*s, 0.45*s, 0.3*s, 8), dark);
        cloth.position.y = 0.65 * s;
        bodyMesh.add(cloth);
        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.32*s, 14, 12), skin);
        head.position.y = 1.3 * s;
        head.scale.z = 1.1;
        bodyMesh.add(head);
        // Ears (pointy)
        for (let e = 0; e < 2; e++) {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08*s, 0.3*s, 4), skin);
          ear.position.set((e ? 0.32 : -0.32) * s, 1.4 * s, -0.05 * s);
          ear.rotation.z = (e ? -1 : 1) * 0.5;
          bodyMesh.add(ear);
        }
        // Eyes - red glowing
        const lge = makeEye(0.07*s, 0xff2200);
        lge.position.set(-0.12*s, 1.32*s, 0.28*s);
        const rge = makeEye(0.07*s, 0xff2200);
        rge.position.set(0.12*s, 1.32*s, 0.28*s);
        bodyMesh.add(lge); bodyMesh.add(rge);
        // Fangs
        const f1 = makeFang(0.12*s); f1.position.set(-0.05*s, 1.18*s, 0.3*s); f1.rotation.x = Math.PI;
        const f2 = makeFang(0.12*s); f2.position.set(0.05*s, 1.18*s, 0.3*s); f2.rotation.x = Math.PI;
        bodyMesh.add(f1); bodyMesh.add(f2);
        // Arm + club
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08*s, 0.1*s, 0.6*s, 6), skin);
        arm.position.set(0.35*s, 0.85*s, 0.2*s);
        arm.rotation.z = 0.4;
        bodyMesh.add(arm);
        const club = new THREE.Mesh(new THREE.CylinderGeometry(0.1*s, 0.18*s, 0.7*s, 8), new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 }));
        club.position.set(0.55*s, 0.5*s, 0.3*s);
        club.rotation.z = 0.6;
        bodyMesh.add(club);
        // Spikes on club
        for (let sp = 0; sp < 4; sp++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04*s, 0.12*s, 4), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.3 }));
          const ang = (sp / 4) * Math.PI * 2;
          spike.position.set(0.55*s + Math.cos(ang)*0.15*s, 0.3*s, 0.3*s + Math.sin(ang)*0.15*s);
          spike.rotation.x = ang;
          bodyMesh.add(spike);
        }
      }
      else if (enemy.key === 'wraith' || enemy.key === 'shade') {
        // Floating cloaked spectre with skull face
        const cloakColor = enemy.color;
        const cloakMat = new THREE.MeshStandardMaterial({
          color: cloakColor, transparent: true, opacity: 0.65,
          emissive: cloakColor, emissiveIntensity: 0.6, side: THREE.DoubleSide,
          roughness: 0.9,
        });
        // Robe body (tapered)
        const robeShape = new THREE.LatheGeometry([
          new THREE.Vector2(0.05, 0),
          new THREE.Vector2(0.3, 0.2),
          new THREE.Vector2(0.6, 0.6),
          new THREE.Vector2(0.7, 1.2),
          new THREE.Vector2(0.5, 1.6),
          new THREE.Vector2(0.4, 1.85),
          new THREE.Vector2(0, 2),
        ].map(v => new THREE.Vector2(v.x * s, v.y * s)), 16);
        const robe = new THREE.Mesh(robeShape, cloakMat);
        robe.position.y = 0.1 * s;
        bodyMesh.add(robe);
        // Tattered bottom (additional drapes)
        for (let d = 0; d < 8; d++) {
          const drape = new THREE.Mesh(
            new THREE.PlaneGeometry(0.2*s, 0.5*s),
            new THREE.MeshStandardMaterial({ color: cloakColor, transparent: true, opacity: 0.5, side: THREE.DoubleSide, emissive: cloakColor, emissiveIntensity: 0.3 })
          );
          const ang = (d / 8) * Math.PI * 2;
          drape.position.set(Math.cos(ang) * 0.55 * s, 0.15 * s, Math.sin(ang) * 0.55 * s);
          drape.rotation.y = ang;
          drape.userData.flutter = Math.random() * Math.PI * 2;
          bodyMesh.add(drape);
        }
        // Skull face inside hood
        const skull = new THREE.Mesh(
          new THREE.SphereGeometry(0.25*s, 16, 14),
          new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
        );
        skull.position.y = 1.85 * s;
        skull.position.z = 0.1 * s;
        skull.scale.z = 1.1;
        bodyMesh.add(skull);
        // Glowing eye sockets
        const le = new THREE.Mesh(
          new THREE.SphereGeometry(0.06*s, 8, 6),
          new THREE.MeshBasicMaterial({ color: cloakColor })
        );
        le.position.set(-0.08*s, 1.88*s, 0.3*s);
        const re = new THREE.Mesh(
          new THREE.SphereGeometry(0.06*s, 8, 6),
          new THREE.MeshBasicMaterial({ color: cloakColor })
        );
        re.position.set(0.08*s, 1.88*s, 0.3*s);
        bodyMesh.add(le); bodyMesh.add(re);
        // Eye glow lights
        const eyeLight = new THREE.PointLight(cloakColor, 0.8, 3);
        eyeLight.position.set(0, 1.88*s, 0.4*s);
        bodyMesh.add(eyeLight);
        // Floating skeletal hands
        for (let h = 0; h < 2; h++) {
          const hand = new THREE.Mesh(
            new THREE.BoxGeometry(0.15*s, 0.1*s, 0.2*s),
            new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.7 })
          );
          hand.position.set((h ? 0.7 : -0.7) * s, 1.1 * s, 0.3 * s);
          bodyMesh.add(hand);
          // bony fingers
          for (let f = 0; f < 3; f++) {
            const finger = new THREE.Mesh(
              new THREE.CylinderGeometry(0.015*s, 0.015*s, 0.18*s, 4),
              new THREE.MeshStandardMaterial({ color: 0xeeeeee })
            );
            finger.position.set((h ? 0.7 : -0.7) * s + (f-1)*0.05*s, 0.95 * s, 0.4 * s);
            bodyMesh.add(finger);
          }
        }
        bodyMesh.userData.floats = true;
      }
      else if (enemy.key === 'brute') {
        // Hulking armored brute
        const armorMat = new THREE.MeshStandardMaterial({ color: 0x4a1f1f, roughness: 0.6, metalness: 0.5 });
        const skinMat = new THREE.MeshStandardMaterial({ color: enemy.color, roughness: 0.7 });
        // Legs (chunky)
        for (let l = 0; l < 2; l++) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22*s, 0.28*s, 0.7*s, 8), armorMat);
          leg.position.set((l ? 0.3 : -0.3) * s, 0.4 * s, 0);
          bodyMesh.add(leg);
          const foot = new THREE.Mesh(new THREE.BoxGeometry(0.4*s, 0.15*s, 0.5*s), armorMat);
          foot.position.set((l ? 0.3 : -0.3) * s, 0.07 * s, 0.05 * s);
          bodyMesh.add(foot);
        }
        // Massive torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2*s, 1*s, 0.8*s), skinMat);
        torso.position.y = 1.3 * s;
        bodyMesh.add(torso);
        // Chest plate
        const chest = new THREE.Mesh(new THREE.BoxGeometry(1.1*s, 0.7*s, 0.1*s), armorMat);
        chest.position.set(0, 1.35 * s, 0.42 * s);
        bodyMesh.add(chest);
        // Spikes on shoulders
        for (let i = -1; i <= 1; i += 2) {
          const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22*s, 8, 6), armorMat);
          shoulder.position.set(i * 0.55 * s, 1.7 * s, 0);
          bodyMesh.add(shoulder);
          for (let sp = 0; sp < 3; sp++) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07*s, 0.2*s, 4), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }));
            spike.position.set(i * 0.55 * s, 1.85 * s, (sp-1) * 0.12 * s);
            bodyMesh.add(spike);
          }
        }
        // Arms
        for (let a = 0; a < 2; a++) {
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.18*s, 0.22*s, 1*s, 8), skinMat);
          arm.position.set((a ? 0.7 : -0.7) * s, 1.15 * s, 0);
          bodyMesh.add(arm);
          const fist = new THREE.Mesh(new THREE.SphereGeometry(0.22*s, 10, 8), armorMat);
          fist.position.set((a ? 0.7 : -0.7) * s, 0.6 * s, 0);
          bodyMesh.add(fist);
        }
        // Small head with horns
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3*s, 14, 10), skinMat);
        head.position.y = 2 * s;
        bodyMesh.add(head);
        for (let h = 0; h < 2; h++) {
          const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08*s, 0.4*s, 6), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 }));
          horn.position.set((h ? 0.18 : -0.18) * s, 2.25 * s, 0);
          horn.rotation.z = (h ? -0.3 : 0.3);
          bodyMesh.add(horn);
        }
        // Glowing red eyes
        const leb = makeEye(0.05*s, 0xff0000);
        leb.position.set(-0.1*s, 2*s, 0.27*s);
        const reb = makeEye(0.05*s, 0xff0000);
        reb.position.set(0.1*s, 2*s, 0.27*s);
        bodyMesh.add(leb); bodyMesh.add(reb);
        // Tusks
        const t1 = makeFang(0.18*s); t1.position.set(-0.08*s, 1.85*s, 0.28*s); t1.rotation.x = Math.PI;
        const t2 = makeFang(0.18*s); t2.position.set(0.08*s, 1.85*s, 0.28*s); t2.rotation.x = Math.PI;
        bodyMesh.add(t1); bodyMesh.add(t2);
      }
      else if (enemy.isBoss) {
        // BOSS - hugely detailed: depends on which boss
        const armorMat = new THREE.MeshStandardMaterial({ color: 0x1a0505, roughness: 0.4, metalness: 0.7, emissive: enemy.color, emissiveIntensity: 0.3 });
        const accentMat = new THREE.MeshStandardMaterial({ color: enemy.color, roughness: 0.3, metalness: 0.5, emissive: enemy.color, emissiveIntensity: 0.6 });
        const boneMat = new THREE.MeshStandardMaterial({ color: 0xddd6c0, roughness: 0.7 });
        
        if (enemy.key === 'titan') {
          // Massive armored colossus
          // Pedestal/base armor
          const base = new THREE.Mesh(new THREE.CylinderGeometry(1*s, 1.2*s, 0.4*s, 8), armorMat);
          base.position.y = 0.2 * s;
          bodyMesh.add(base);
          // Legs (thick armored)
          for (let l = 0; l < 2; l++) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3*s, 0.4*s, 0.9*s, 8), armorMat);
            leg.position.set((l ? 0.4 : -0.4) * s, 0.85 * s, 0);
            bodyMesh.add(leg);
            // Knee plates
            const knee = new THREE.Mesh(new THREE.SphereGeometry(0.32*s, 10, 8), accentMat);
            knee.position.set((l ? 0.4 : -0.4) * s, 0.85 * s, 0.2 * s);
            bodyMesh.add(knee);
          }
          // Massive torso
          const torso = new THREE.Mesh(new THREE.BoxGeometry(1.6*s, 1.4*s, 1*s), armorMat);
          torso.position.y = 2 * s;
          bodyMesh.add(torso);
          // Chest emblem
          const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.35*s, 0), accentMat);
          emblem.position.set(0, 2 * s, 0.55 * s);
          bodyMesh.add(emblem);
          // Pauldrons (huge spiked shoulders)
          for (let p = 0; p < 2; p++) {
            const pauld = new THREE.Mesh(new THREE.SphereGeometry(0.5*s, 12, 10, 0, Math.PI*2, 0, Math.PI/2), armorMat);
            pauld.position.set((p ? 0.85 : -0.85) * s, 2.6 * s, 0);
            bodyMesh.add(pauld);
            // Big spikes
            for (let sp = 0; sp < 5; sp++) {
              const ang = (sp / 5) * Math.PI;
              const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1*s, 0.5*s, 6), accentMat);
              spike.position.set((p ? 0.85 : -0.85) * s + Math.cos(ang)*0.5*s, 2.6 * s, Math.sin(ang)*0.5*s);
              spike.lookAt(spike.position.x*2, spike.position.y+0.5, spike.position.z*2);
              spike.rotateX(Math.PI/2);
              bodyMesh.add(spike);
            }
          }
          // Arms
          for (let a = 0; a < 2; a++) {
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.22*s, 0.28*s, 1.3*s, 8), armorMat);
            arm.position.set((a ? 1 : -1) * s, 1.7 * s, 0);
            bodyMesh.add(arm);
          }
          // Right arm holds a giant hammer
          const hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.08*s, 0.08*s, 1.5*s, 8), new THREE.MeshStandardMaterial({ color: 0x4a2f1a, roughness: 0.9 }));
          hammerHandle.position.set(1.2 * s, 0.8 * s, 0.5 * s);
          hammerHandle.rotation.z = -0.5;
          bodyMesh.add(hammerHandle);
          const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.5*s, 0.4*s, 0.5*s), armorMat);
          hammerHead.position.set(1.55 * s, 1.55 * s, 0.5 * s);
          bodyMesh.add(hammerHead);
          const hammerGlow = new THREE.Mesh(new THREE.BoxGeometry(0.55*s, 0.1*s, 0.55*s), accentMat);
          hammerGlow.position.set(1.55 * s, 1.55 * s, 0.5 * s);
          bodyMesh.add(hammerGlow);
          // Helmet with crown of horns
          const helm = new THREE.Mesh(new THREE.SphereGeometry(0.4*s, 16, 12), armorMat);
          helm.position.y = 2.95 * s;
          bodyMesh.add(helm);
          // Crown spikes
          for (let c = 0; c < 7; c++) {
            const crown = new THREE.Mesh(new THREE.ConeGeometry(0.07*s, 0.4*s, 6), accentMat);
            const ang = (c / 7 - 0.5) * Math.PI * 1.2;
            crown.position.set(Math.sin(ang)*0.35*s, 3.2*s, Math.cos(ang)*0.3*s);
            crown.rotation.x = -Math.cos(ang) * 0.3;
            crown.rotation.z = Math.sin(ang) * 0.3;
            bodyMesh.add(crown);
          }
          // Glowing visor slit
          const visor = new THREE.Mesh(new THREE.BoxGeometry(0.45*s, 0.06*s, 0.05*s), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
          visor.position.set(0, 2.95 * s, 0.4 * s);
          bodyMesh.add(visor);
          const visorLight = new THREE.PointLight(0xff3300, 1.2, 4);
          visorLight.position.set(0, 2.95 * s, 0.6 * s);
          bodyMesh.add(visorLight);
        }
        else if (enemy.key === 'hydra') {
          // Multi-headed serpent emerging from coiled body
          const scaleMat = new THREE.MeshStandardMaterial({ color: enemy.color, roughness: 0.4, metalness: 0.3, emissive: enemy.color, emissiveIntensity: 0.2 });
          const accent2 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3, metalness: 0.5, emissive: 0xfbbf24, emissiveIntensity: 0.3 });
          // Coiled body base
          for (let c = 0; c < 3; c++) {
            const coil = new THREE.Mesh(new THREE.TorusGeometry(0.7*s - c*0.1*s, 0.25*s, 8, 16), scaleMat);
            coil.position.y = 0.3 * s + c * 0.15 * s;
            coil.rotation.x = Math.PI / 2;
            coil.rotation.z = c * 0.5;
            bodyMesh.add(coil);
          }
          // 3 serpent heads on long necks
          const headPositions = [-0.8, 0, 0.8];
          headPositions.forEach((xOff, hi) => {
            // Neck (curved using multiple segments)
            for (let n = 0; n < 5; n++) {
              const seg = new THREE.Mesh(new THREE.SphereGeometry((0.18 - n*0.015)*s, 10, 8), scaleMat);
              const t = n / 5;
              seg.position.set(xOff * (1-t) * s, (1 + n * 0.35) * s, Math.sin(t * Math.PI) * 0.3 * s);
              bodyMesh.add(seg);
            }
            // Head
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.28*s, 14, 10), scaleMat);
            head.position.set(0, 2.8 * s, 0.4 * s);
            head.scale.z = 1.4;
            bodyMesh.add(head);
            // Snout
            const snout = new THREE.Mesh(new THREE.ConeGeometry(0.2*s, 0.35*s, 8), scaleMat);
            snout.position.set(0, 2.8 * s, 0.7 * s);
            snout.rotation.x = Math.PI/2;
            bodyMesh.add(snout);
            // Eyes (yellow)
            const lhe = makeEye(0.06*s, 0xffaa00); lhe.position.set(-0.1*s, 2.88*s, 0.55*s); bodyMesh.add(lhe);
            const rhe = makeEye(0.06*s, 0xffaa00); rhe.position.set(0.1*s, 2.88*s, 0.55*s); bodyMesh.add(rhe);
            // Crests (spines on top)
            for (let cr = 0; cr < 4; cr++) {
              const crest = new THREE.Mesh(new THREE.ConeGeometry(0.04*s, 0.18*s, 4), accent2);
              crest.position.set(0, 2.95*s + cr*0.02*s, 0.3*s + cr*0.08*s);
              bodyMesh.add(crest);
            }
            // Fangs
            const fa = makeFang(0.1*s); fa.position.set(-0.06*s, 2.7*s, 0.85*s); fa.rotation.x = Math.PI; bodyMesh.add(fa);
            const fb = makeFang(0.1*s); fb.position.set(0.06*s, 2.7*s, 0.85*s); fb.rotation.x = Math.PI; bodyMesh.add(fb);
          });
        }
        else if (enemy.key === 'lich') {
          // Floating skeletal mage with crown and staff
          const robeMat = new THREE.MeshStandardMaterial({ color: enemy.color, roughness: 0.8, emissive: enemy.color, emissiveIntensity: 0.3, transparent: true, opacity: 0.9 });
          const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2, emissive: 0xfbbf24, emissiveIntensity: 0.4 });
          // Robe (lathe)
          const robeGeo = new THREE.LatheGeometry([
            new THREE.Vector2(0.05, 0),
            new THREE.Vector2(0.4, 0.1),
            new THREE.Vector2(0.85, 0.5),
            new THREE.Vector2(0.95, 1.2),
            new THREE.Vector2(0.85, 1.8),
            new THREE.Vector2(0.6, 2.2),
            new THREE.Vector2(0.3, 2.5),
            new THREE.Vector2(0, 2.6),
          ].map(v => new THREE.Vector2(v.x * s, v.y * s)), 20);
          const robe = new THREE.Mesh(robeGeo, robeMat);
          bodyMesh.add(robe);
          // Tattered robe edges
          for (let d = 0; d < 12; d++) {
            const drape = new THREE.Mesh(
              new THREE.PlaneGeometry(0.25*s, 0.6*s),
              new THREE.MeshStandardMaterial({ color: enemy.color, transparent: true, opacity: 0.6, side: THREE.DoubleSide, emissive: enemy.color, emissiveIntensity: 0.2 })
            );
            const ang = (d / 12) * Math.PI * 2;
            drape.position.set(Math.cos(ang) * 0.85 * s, 0.3 * s, Math.sin(ang) * 0.85 * s);
            drape.rotation.y = ang;
            bodyMesh.add(drape);
          }
          // Skull head
          const skull = new THREE.Mesh(new THREE.SphereGeometry(0.32*s, 16, 14), boneMat);
          skull.position.y = 2.8 * s;
          skull.scale.z = 1.15;
          bodyMesh.add(skull);
          // Jaw
          const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.4*s, 0.15*s, 0.3*s), boneMat);
          jaw.position.set(0, 2.55 * s, 0.1 * s);
          bodyMesh.add(jaw);
          // Eye sockets - glowing purple
          const lel = new THREE.Mesh(new THREE.SphereGeometry(0.08*s, 10, 8), new THREE.MeshBasicMaterial({ color: enemy.color }));
          lel.position.set(-0.12*s, 2.85*s, 0.35*s);
          const rel = new THREE.Mesh(new THREE.SphereGeometry(0.08*s, 10, 8), new THREE.MeshBasicMaterial({ color: enemy.color }));
          rel.position.set(0.12*s, 2.85*s, 0.35*s);
          bodyMesh.add(lel); bodyMesh.add(rel);
          const eyeLightL = new THREE.PointLight(enemy.color, 1.5, 5);
          eyeLightL.position.set(0, 2.85*s, 0.6*s);
          bodyMesh.add(eyeLightL);
          // Crown
          const crownBase = new THREE.Mesh(new THREE.TorusGeometry(0.32*s, 0.05*s, 6, 16), goldMat);
          crownBase.position.y = 3.15 * s;
          crownBase.rotation.x = Math.PI/2;
          bodyMesh.add(crownBase);
          for (let c = 0; c < 5; c++) {
            const ang = (c / 5) * Math.PI * 2;
            const point = new THREE.Mesh(new THREE.ConeGeometry(0.05*s, 0.25*s, 4), goldMat);
            point.position.set(Math.cos(ang)*0.32*s, 3.3*s, Math.sin(ang)*0.32*s);
            bodyMesh.add(point);
            // Gem
            const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.04*s, 0), accentMat);
            gem.position.set(Math.cos(ang)*0.32*s, 3.4*s, Math.sin(ang)*0.32*s);
            bodyMesh.add(gem);
          }
          // Staff
          const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.04*s, 0.04*s, 2.5*s, 8), new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.8 }));
          staff.position.set(0.9 * s, 1.5 * s, 0.3 * s);
          staff.rotation.z = -0.1;
          bodyMesh.add(staff);
          // Staff orb
          const orb = new THREE.Mesh(
            new THREE.SphereGeometry(0.18*s, 16, 12),
            new THREE.MeshStandardMaterial({ color: enemy.color, emissive: enemy.color, emissiveIntensity: 1.5, roughness: 0.1 })
          );
          orb.position.set(0.95 * s, 2.7 * s, 0.3 * s);
          bodyMesh.add(orb);
          const orbLight = new THREE.PointLight(enemy.color, 2, 6);
          orbLight.position.set(0.95 * s, 2.7 * s, 0.3 * s);
          bodyMesh.add(orbLight);
          // Orb claws (holding the orb)
          for (let cl = 0; cl < 3; cl++) {
            const claw = new THREE.Mesh(new THREE.ConeGeometry(0.04*s, 0.2*s, 4), goldMat);
            const ang = (cl / 3) * Math.PI * 2;
            claw.position.set(0.95*s + Math.cos(ang)*0.15*s, 2.55*s, 0.3*s + Math.sin(ang)*0.15*s);
            claw.rotation.x = ang + Math.PI/2;
            bodyMesh.add(claw);
          }
          // Skeletal hands
          for (let h = 0; h < 2; h++) {
            const hand = new THREE.Mesh(new THREE.BoxGeometry(0.18*s, 0.12*s, 0.25*s), boneMat);
            hand.position.set((h ? 0.85 : -0.6) * s, 1.7 * s, 0.4 * s);
            bodyMesh.add(hand);
            for (let f = 0; f < 4; f++) {
              const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.018*s, 0.012*s, 0.2*s, 4), boneMat);
              finger.position.set((h ? 0.85 : -0.6) * s + (f-1.5)*0.05*s, 1.55*s, 0.5*s);
              bodyMesh.add(finger);
            }
          }
          bodyMesh.userData.floats = true;
        }
      }
      
      // Ensure all body meshes cast shadows
      bodyMesh.traverse(m => { if (m.isMesh) m.castShadow = true; });
      
      group.add(bodyMesh);
      group.userData = { baseY: 0, enemy, bodyMesh, hitFlash: 0, deathFade: 1 };
      scene.add(group);
      enemyMeshes.push(group);
    });
    enemyMeshesRef.current = enemyMeshes;
    
    let raf;
    const animate = () => {
      const t = animStateRef.current.time += 0.016;
      
      // Idle animations
      enemyMeshes.forEach((mesh, idx) => {
        const enemy = mesh.userData.enemy;
        if (enemy.hp <= 0) {
          mesh.userData.deathFade = Math.max(0, mesh.userData.deathFade - 0.04);
          mesh.scale.setScalar(mesh.userData.deathFade);
          mesh.rotation.y += 0.1;
          mesh.position.y = (1 - mesh.userData.deathFade) * 2;
        } else {
          mesh.position.y = Math.sin(t * 1.5 + idx) * 0.15;
          mesh.rotation.y = Math.sin(t * 0.5 + idx) * 0.1;
          
          if (mesh.userData.hitFlash > 0) {
            mesh.userData.hitFlash -= 0.04;
            mesh.position.x += (Math.random() - 0.5) * 0.2 * mesh.userData.hitFlash;
            mesh.userData.bodyMesh.traverse(c => {
              if (c.material) c.material.emissiveIntensity = 0.3 + mesh.userData.hitFlash * 2;
            });
          } else {
            const baseOffset = (idx - (enemies.length - 1) / 2) * 3;
            mesh.position.x += (baseOffset - mesh.position.x) * 0.1;
            mesh.userData.bodyMesh.traverse(c => {
              if (c.material && c.material.emissive) c.material.emissiveIntensity = enemy.key === 'wraith' || enemy.key === 'shade' || enemy.isBoss ? 0.5 : 0.3;
            });
          }
        }
      });
      
      // Particle drift
      const pos = particles.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        pos.array[i*3+1] += 0.005;
        if (pos.array[i*3+1] > 6) pos.array[i*3+1] = 0;
      }
      pos.needsUpdate = true;
      
      // Torch flicker
      torchLight.intensity = 1.3 + Math.sin(t * 8) * 0.2 + Math.random() * 0.1;
      
      // Magic circle rotation
      circle.rotation.z = t * 0.2;
      innerCircle.rotation.z = -t * 0.3;
      
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();
    
    const handleResize = () => {
      const w2 = mount.clientWidth;
      const h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [enemies.length]);
  
  // Trigger hit flashes when an enemy takes damage
  useEffect(() => {
    if (playerAction && playerAction.type === 'hit') {
      playerAction.targets.forEach(idx => {
        if (enemyMeshesRef.current[idx]) {
          enemyMeshesRef.current[idx].userData.hitFlash = 1;
        }
      });
    }
  }, [playerAction]);
  
  return <div ref={mountRef} className="w-full h-full" />;
}

// ============ BATTLE SCREEN ============

function BattleScreen({ game, setGame, battle, setBattle, onEnd }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetMode, setTargetMode] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [playerAction, setPlayerAction] = useState(null);
  const [intentVisible, setIntentVisible] = useState(true);
  const [animating, setAnimating] = useState(false);
  
  const addFloat = (text, color, x, y) => {
    const id = Math.random();
    setFloatingTexts(f => [...f, { id, text, color, x, y }]);
    setTimeout(() => setFloatingTexts(f => f.filter(ft => ft.id !== id)), 1200);
  };
  
  const drawCards = (b, n) => {
    const newB = { ...b };
    for (let i = 0; i < n; i++) {
      if (newB.drawPile.length === 0) {
        newB.drawPile = shuffle([...newB.discardPile]);
        newB.discardPile = [];
      }
      if (newB.drawPile.length > 0 && newB.hand.length < 10) {
        newB.hand = [...newB.hand, newB.drawPile[0]];
        newB.drawPile = newB.drawPile.slice(1);
      }
    }
    return newB;
  };
  
  const playCard = (cardIdx, targetIdx) => {
    if (animating) return;
    const cardKey = battle.hand[cardIdx];
    const card = CARD_LIBRARY[cardKey];
    
    const arts = game.artifacts || [];
    const hasA = (k) => arts.includes(k);
    
    // Warhorn — first card of turn costs 1 less
    let actualCost = card.cost;
    if (hasA('warhorn') && battle.firstCardOfTurn) {
      actualCost = Math.max(0, actualCost - 1);
    }
    
    if (battle.energy < actualCost) return;
    audio.cardPlay();
    
    let b = { ...battle };
    b.energy -= actualCost;
    b.firstCardOfTurn = false;
    b.hand = b.hand.filter((_, i) => i !== cardIdx);
    if (card.exhaust) {
      // exhausted cards leave play permanently this combat (just don't add to discard)
    } else {
      b.discardPile = [...b.discardPile, cardKey];
    }
    
    let g = { ...game };
    
    // Apply effects
    if (card.block) {
      const blockAmt = card.block + (b.dexterity || 0);
      b.block = (b.block || 0) + blockAmt;
      addFloat(`+${blockAmt} ◇`, '#60a5fa', 50, 80);
    }
    if (card.strength) {
      b.strength = (b.strength || 0) + card.strength;
      addFloat(`+${card.strength} STR`, '#f87171', 50, 80);
    }
    if (card.dexterity) {
      b.dexterity = (b.dexterity || 0) + card.dexterity;
      addFloat(`+${card.dexterity} DEX`, '#60a5fa', 50, 80);
    }
    if (card.draw) {
      b = drawCards(b, card.draw);
    }
    if (card.energy) {
      b.energy += card.energy;
      addFloat(`+${card.energy} ⚡`, '#fbbf24', 50, 80);
    }
    if (card.heal) {
      const healAmt = Math.min(card.heal, g.maxHp - g.hp);
      g.hp = Math.min(g.maxHp, g.hp + card.heal);
      if (healAmt > 0) addFloat(`+${healAmt} ♥`, '#34d399', 50, 75);
    }
    
    if (card.dmg || cardKey === 'shieldBash') {
      const targets = card.aoe ? b.enemies.map((_, i) => i).filter(i => b.enemies[i].hp > 0) : [targetIdx];
      const hits = card.hits || 1;
      // Ember Core: +3 damage on AoE attacks
      const emberBonus = (card.aoe && hasA('emberCore')) ? 3 : 0;
      // Shield Bash deals damage equal to current block
      let baseDmg = (cardKey === 'shieldBash' ? (b.block || 0) : card.dmg) + (b.strength || 0) + emberBonus;
      
      setPlayerAction({ type: 'hit', targets, time: Date.now() });
      audio.hit();
      
      for (let h = 0; h < hits; h++) {
        targets.forEach(ti => {
          const enemy = b.enemies[ti];
          if (!enemy || enemy.hp <= 0) return;
          let actualDmg = baseDmg;
          if (enemy.vuln > 0) actualDmg = Math.floor(actualDmg * 1.5);
          
          // Thunder Rune: every 3rd hit deals double
          b.hitsCount = (b.hitsCount || 0) + 1;
          if (hasA('thunderRune') && b.hitsCount % 3 === 0) {
            actualDmg *= 2;
            addFloat('⚡!', '#fbbf24', 50 + (ti - (b.enemies.length-1)/2) * 20, 20);
          }
          
          let remaining = actualDmg;
          if (enemy.block > 0) {
            const absorbed = Math.min(enemy.block, remaining);
            enemy.block -= absorbed;
            remaining -= absorbed;
          }
          const wasAlive = enemy.hp > 0;
          enemy.hp = Math.max(0, enemy.hp - remaining);
          if (card.vuln) enemy.vuln = (enemy.vuln || 0) + card.vuln;
          if (card.weak) enemy.weak = (enemy.weak || 0) + card.weak;
          if (card.poison) {
            // Serpent Tongue: +2 poison
            const poisonAmt = card.poison + (hasA('serpentTongue') ? 2 : 0);
            enemy.poison = (enemy.poison || 0) + poisonAmt;
          }
          addFloat(`-${actualDmg}`, '#fbbf24', 50 + (ti - (b.enemies.length-1)/2) * 20 + (h * 3), 30 + h * 5);
          
          // Kill triggers
          if (wasAlive && enemy.hp <= 0) {
            if (hasA('vampireFang')) {
              g.hp = Math.min(g.maxHp, g.hp + 1);
              addFloat('+1 ♥', '#34d399', 50, 75);
            }
            if (hasA('cursedSkull')) {
              b.strength = (b.strength || 0) + 1;
              addFloat('+1 STR', '#f87171', 50, 80);
            }
          }
        });
      }
    }
    
    // Self damage (some cards hurt you for power)
    if (card.selfDmg) {
      g.hp = Math.max(1, g.hp - card.selfDmg);
      addFloat(`-${card.selfDmg} ♥`, '#ef4444', 50, 75);
    }
    
    setBattle(b);
    setGame(g);
    setSelectedCard(null);
    setTargetMode(false);
    
    // Check victory
    setTimeout(() => {
      if (b.enemies.every(e => e.hp <= 0)) {
        onEnd(true);
      }
    }, 800);
  };
  
  const endTurn = () => {
    if (animating) return;
    setAnimating(true);
    setIntentVisible(false);
    
    // Apply poison at end of player turn
    let b = { ...battle };
    b.enemies = b.enemies.map(e => {
      if (e.hp <= 0) return e;
      const newE = { ...e };
      if (newE.poison > 0) {
        newE.hp = Math.max(0, newE.hp - newE.poison);
        newE.poison = Math.max(0, newE.poison - 1);
      }
      return newE;
    });
    
    setTimeout(() => {
      // Enemies act
      let g = { ...game };
      const arts = g.artifacts || [];
      const hasA = (k) => arts.includes(k);
      
      let totalDmg = 0;
      let attackingEnemies = []; // for thornCrown
      let bb = { ...b };
      bb.enemies = bb.enemies.map((e, idx) => {
        if (e.hp <= 0) return e;
        const move = e.moves[e.moveIdx];
        const newE = { ...e };
        if (move.type === 'atk') {
          let dmg = move.val + (e.strength || 0);
          if (e.weak > 0) dmg = Math.floor(dmg * 0.75);
          totalDmg += dmg;
          attackingEnemies.push(idx);
        } else if (move.type === 'def') {
          newE.block = (newE.block || 0) + move.val;
        } else if (move.type === 'buff') {
          newE.strength = (newE.strength || 0) + move.val;
        }
        // pick next move
        newE.moveIdx = (e.moveIdx + 1) % e.moves.length;
        // decrement debuffs
        if (newE.vuln > 0) newE.vuln--;
        if (newE.weak > 0) newE.weak--;
        return newE;
      });
      
      // Apply damage to player
      let remaining = totalDmg;
      if (bb.block > 0) {
        const absorbed = Math.min(bb.block, remaining);
        bb.block -= absorbed;
        remaining -= absorbed;
      }
      g.hp = Math.max(0, g.hp - remaining);
      if (totalDmg > 0) addFloat(`-${totalDmg}`, '#ef4444', 50, 65);
      
      // Thorn Crown: reflect 2 damage per attacker that hit you
      if (hasA('thornCrown') && attackingEnemies.length > 0 && remaining > 0) {
        attackingEnemies.forEach(ai => {
          const enemy = bb.enemies[ai];
          if (!enemy || enemy.hp <= 0) return;
          let thornDmg = 2;
          let er = thornDmg;
          if (enemy.block > 0) {
            const ab = Math.min(enemy.block, er);
            enemy.block -= ab;
            er -= ab;
          }
          enemy.hp = Math.max(0, enemy.hp - er);
        });
        addFloat('🌹 -2', '#dc2626', 50, 50);
      }
      
      // Living Armor: block does NOT reset
      if (!hasA('livingArmor')) {
        bb.block = 0;
      }
      
      // Energy reset + Iron Ring bonus
      bb.energy = bb.maxEnergy + (hasA('ironRing') ? 1 : 0);
      bb.firstCardOfTurn = true;
      
      // Discard hand and draw fresh 5 (+ artifact bonuses)
      bb.discardPile = [...bb.discardPile, ...bb.hand];
      bb.hand = [];
      const drawCount = 5 + (hasA('ravenFeather') ? 1 : 0);
      bb = drawCards(bb, drawCount);
      
      setBattle(bb);
      setGame(g);
      setIntentVisible(true);
      setAnimating(false);
      
      // Check victory after thornCrown reflects
      if (bb.enemies.every(e => e.hp <= 0)) {
        setTimeout(() => onEnd(true), 600);
        return;
      }
      
      if (g.hp <= 0) {
        setTimeout(() => onEnd(false), 600);
      }
    }, 800);
  };
  
  const intentText = (enemy) => {
    if (enemy.hp <= 0) return null;
    const move = enemy.moves[enemy.moveIdx];
    if (move.type === 'atk') {
      let dmg = move.val + (enemy.strength || 0);
      if (enemy.weak > 0) dmg = Math.floor(dmg * 0.75);
      return { icon: '⚔', text: `${dmg}`, color: '#ef4444' };
    }
    if (move.type === 'def') return { icon: '◇', text: `${move.val}`, color: '#60a5fa' };
    if (move.type === 'buff') return { icon: '↑', text: `+${move.val}`, color: '#f59e0b' };
    return null;
  };
  
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* 3D scene */}
      <div className="flex-1 relative">
        <Battle3D enemies={battle.enemies} playerAction={playerAction} />
        
        {/* Enemy UI overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {battle.enemies.map((enemy, idx) => {
            const offset = (idx - (battle.enemies.length - 1) / 2);
            const left = 50 + offset * 25;
            const intent = intentText(enemy);
            return (
              <div key={enemy.id} className="absolute pointer-events-auto" style={{ left: `${left}%`, top: '15%', transform: 'translateX(-50%)' }}>
                {enemy.hp > 0 && (
                  <button
                    onClick={() => targetMode && playCard(selectedCard, idx)}
                    className={`flex flex-col items-center ${targetMode ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    {intentVisible && intent && (
                      <div className="mb-1 px-2 py-0.5 bg-black/70 border rounded text-xs flex items-center gap-1" style={{ borderColor: intent.color, color: intent.color }}>
                        <span>{intent.icon}</span>
                        <span>{intent.text}</span>
                      </div>
                    )}
                    <div className="text-[10px] tracking-wider opacity-80">{enemy.name.toUpperCase()}</div>
                    <div className="w-20 h-1.5 bg-black/60 border border-red-900 mt-1 relative overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-700 to-red-400 transition-all" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                    </div>
                    <div className="text-[10px] mt-0.5 text-red-200">{enemy.hp}/{enemy.maxHp}</div>
                    <div className="flex gap-1 mt-0.5">
                      {enemy.block > 0 && <span className="text-[9px] text-blue-300">◇{enemy.block}</span>}
                      {enemy.vuln > 0 && <span className="text-[9px] text-purple-300">▼{enemy.vuln}</span>}
                      {enemy.weak > 0 && <span className="text-[9px] text-amber-300">⊘{enemy.weak}</span>}
                      {enemy.poison > 0 && <span className="text-[9px] text-green-400">☠{enemy.poison}</span>}
                      {enemy.strength > 0 && <span className="text-[9px] text-red-300">↑{enemy.strength}</span>}
                    </div>
                    {targetMode && (
                      <div className="text-[10px] text-amber-400 animate-pulse mt-1">▼ TAP ▼</div>
                    )}
                  </button>
                )}
              </div>
            );
          })}
          
          {/* Floating damage texts */}
          {floatingTexts.map(ft => (
            <div key={ft.id} className="absolute text-2xl font-bold pointer-events-none animate-bounce"
              style={{
                left: `${ft.x}%`, top: `${ft.y}%`, color: ft.color, textShadow: '0 0 10px currentColor',
                animation: 'floatUp 1.2s ease-out forwards',
              }}>
              {ft.text}
            </div>
          ))}
        </div>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex flex-col gap-0.5">
            <div className="text-xs text-red-400">♥ {game.hp}/{game.maxHp}</div>
            {battle.block > 0 && <div className="text-xs text-blue-300">◇ {battle.block}</div>}
            {battle.strength > 0 && <div className="text-xs text-red-300">↑ STR {battle.strength}</div>}
            {battle.dexterity > 0 && <div className="text-xs text-blue-300">◇ DEX {battle.dexterity}</div>}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs tracking-widest text-amber-200/60">COMBAT</div>
            {(game.artifacts || []).length > 0 && (
              <div className="flex gap-1">
                {game.artifacts.map((k,i) => {
                  const a = ARTIFACTS[k];
                  return <div key={i} className="text-base" style={{ filter: `drop-shadow(0 0 4px ${a.rarity === 'rare' ? '#a78bfa' : '#fbbf24'})` }}>{a.icon}</div>;
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-0.5 text-xs">
            <div className="text-amber-400">draw: {battle.drawPile.length}</div>
            <div className="text-gray-400">disc: {battle.discardPile.length}</div>
          </div>
        </div>
      </div>
      
      {/* Hand area */}
      <div className="bg-gradient-to-t from-black via-black/95 to-black/60 pt-2 pb-2 px-2 border-t border-amber-400/20 relative">
        {/* Energy + End turn */}
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-amber-100 text-xl font-bold" style={{ boxShadow: '0 0 15px rgba(245,158,11,0.6)' }}>
              {battle.energy}/{battle.maxEnergy}
            </div>
            <div className="text-xs text-amber-100/60 tracking-wider">ENERGY</div>
          </div>
          <button
            onClick={endTurn}
            disabled={animating}
            className="px-5 py-2 border border-red-400/60 text-red-200 hover:bg-red-500/20 active:scale-95 transition-all text-xs tracking-[0.2em] disabled:opacity-50"
          >
            END TURN ▶
          </button>
        </div>
        
        {/* Hand — horizontal scroll, justify-center only when fits */}
        <div className="overflow-x-auto overflow-y-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-2 px-4 pb-2 pt-1" style={{ minWidth: '100%', justifyContent: battle.hand.length <= 4 ? 'center' : 'flex-start', width: 'max-content' }}>
          {battle.hand.map((cardKey, i) => {
            const card = CARD_LIBRARY[cardKey];
            const playable = battle.energy >= card.cost && !animating;
            const selected = selectedCard === i;
            return (
              <button
                key={i}
                onClick={() => {
                  if (!playable) return;
                  if ((card.dmg || cardKey === 'shieldBash') && !card.aoe) {
                    if (selected) {
                      setSelectedCard(null);
                      setTargetMode(false);
                    } else {
                      setSelectedCard(i);
                      setTargetMode(true);
                    }
                  } else {
                    playCard(i, 0);
                  }
                }}
                className={`flex-shrink-0 w-24 h-40 rounded-lg border-2 p-1 flex flex-col text-left transition-all overflow-hidden relative ${
                  selected ? 'border-amber-400' : 'active:scale-95'
                } ${playable ? '' : 'opacity-40'}`}
                style={{
                  background: card.type === 'attack'
                    ? 'linear-gradient(160deg, #4c0519 0%, #1c0709 100%)'
                    : card.type === 'power'
                    ? 'linear-gradient(160deg, #4c1d95 0%, #1e1b4b 100%)'
                    : 'linear-gradient(160deg, #1e3a8a 0%, #0c1532 100%)',
                  borderColor: selected ? '#fbbf24' : card.type === 'attack' ? '#7f1d1d' : card.type === 'power' ? '#6d28d9' : '#1e3a8a',
                  boxShadow: selected
                    ? '0 0 24px rgba(245,158,11,0.95), 0 0 40px rgba(245,158,11,0.5), inset 0 0 12px rgba(245,158,11,0.3)'
                    : 'inset 0 0 15px rgba(0,0,0,0.5)',
                  borderWidth: selected ? '3px' : '2px',
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start px-1 pt-0.5 z-10">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.8)' }}>{card.cost}</div>
                  <div className="text-[7px] tracking-widest text-white/50">{card.type === 'attack' ? 'ATK' : card.type === 'power' ? 'PWR' : 'SKL'}</div>
                </div>
                
                {/* Art */}
                <div className="w-full h-16 mt-0.5 relative" style={{
                  background: card.type === 'attack' ? 'radial-gradient(ellipse at center, #7c2d1240 0%, transparent 70%)' : card.type === 'power' ? 'radial-gradient(ellipse at center, #4c1d9540 0%, transparent 70%)' : 'radial-gradient(ellipse at center, #1e3a8a40 0%, transparent 70%)',
                  borderTop: '1px solid rgba(245,158,11,0.2)',
                  borderBottom: '1px solid rgba(245,158,11,0.2)',
                }}>
                  <CardArt cardKey={cardKey} type={card.type} />
                </div>
                
                {/* Name */}
                <div className="text-[10px] font-bold mt-1 text-amber-100 text-center tracking-wider leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>{card.name}</div>
                
                {/* Desc */}
                <div className="text-[8px] text-white/70 leading-tight mt-0.5 flex-1 text-center px-0.5">{card.desc}</div>
                
                {/* Selection ribbon */}
                {selected && (
                  <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse" />
                )}
              </button>
            );
          })}
          </div>
        </div>
        
        {targetMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-amber-400 text-xs tracking-widest animate-pulse">
            SELECT TARGET ABOVE ↑
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes floatUp {
          0% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, -60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ============ EVENT SCREEN ============

function EventScreen({ game, setGame, event, onDone }) {
  const [resultText, setResultText] = useState(null);
  
  const choose = (choice) => {
    const before = game;
    const after = choice.effect(game);
    setGame(after);
    let result = '';
    if (after.hp !== before.hp) result += `${after.hp > before.hp ? '+' : ''}${after.hp - before.hp} HP. `;
    if (after.gold !== before.gold) result += `${after.gold > before.gold ? '+' : ''}${after.gold - before.gold} gold. `;
    if (after.maxHp !== before.maxHp) result += `${after.maxHp > before.maxHp ? '+' : ''}${after.maxHp - before.maxHp} max HP. `;
    if (after.deck.length !== before.deck.length) result += `${after.deck.length - before.deck.length > 0 ? '+' : ''}${after.deck.length - before.deck.length} cards. `;
    setResultText(result || 'You leave quietly.');
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, #4c1d95 0%, transparent 60%)',
        opacity: 0.4,
      }} />
      <div className="relative z-10 max-w-md w-full">
        <div className="text-xs tracking-[0.4em] text-purple-300/60 mb-2 text-center">UNKNOWN</div>
        <div className="text-6xl text-center mb-2" style={{ filter: 'drop-shadow(0 0 12px rgba(167,139,250,0.6))' }}>{event.icon || '?'}</div>
        <h2 className="text-3xl font-bold text-purple-200 mb-4 text-center" style={{ fontFamily: 'Cinzel, serif' }}>{event.name}</h2>
        <div className="text-purple-100/70 text-center italic mb-8 text-sm">{event.desc}</div>
        
        {!resultText ? (
          <div className="space-y-3">
            {event.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => choose(c)}
                className="w-full px-4 py-4 border border-purple-400/40 text-purple-100 hover:bg-purple-500/20 active:scale-95 transition-all text-sm tracking-wider"
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-purple-200 italic mb-6">{resultText}</div>
            <button onClick={onDone} className="px-8 py-3 border border-amber-400/60 text-amber-100 hover:bg-amber-400/10 active:scale-95 transition-all tracking-widest">
              CONTINUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ MERCHANT ============

function MerchantScreen({ game, setGame, merchant, setMerchant, onOfferArtifact, onDone }) {
  const buy = (idx) => {
    const item = merchant.cards[idx];
    if (!item || game.gold < item.price) return;
    setGame({ ...game, gold: game.gold - item.price, deck: [...game.deck, item.card] });
    setMerchant({ ...merchant, cards: merchant.cards.map((c, i) => i === idx ? null : c) });
  };
  
  const buyArtifact = (idx) => {
    const item = merchant.artifacts[idx];
    if (!item || game.gold < item.price) return;
    setGame(g => ({ ...g, gold: g.gold - item.price }));
    setMerchant({ ...merchant, artifacts: merchant.artifacts.map((c, i) => i === idx ? null : c) });
    // Slight delay to let state update before offering
    setTimeout(() => onOfferArtifact(item.key), 50);
  };
  
  return (
    <div className="w-full h-full flex flex-col px-4 py-4 relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, #78350f 0%, transparent 60%)', opacity: 0.4 }} />
      <div className="relative z-10 max-w-md w-full mx-auto">
        <div className="text-xs tracking-[0.4em] text-amber-300/60 mb-2 text-center">VENDOR</div>
        <h2 className="text-3xl font-bold text-amber-200 mb-2 text-center" style={{ fontFamily: 'Cinzel, serif' }}>The Merchant</h2>
        <div className="text-amber-100/60 text-center mb-4 text-sm">◈ {game.gold} gold</div>
        
        {/* Cards */}
        <div className="text-[10px] tracking-[0.3em] text-amber-200/50 mb-2">CARDS</div>
        <div className="space-y-2 mb-5">
          {merchant.cards.map((item, i) => {
            if (!item) return <div key={i} className="text-center text-amber-100/30 py-3 text-sm">— SOLD —</div>;
            const card = CARD_LIBRARY[item.card];
            const canAfford = game.gold >= item.price;
            return (
              <button
                key={i}
                onClick={() => buy(i)}
                disabled={!canAfford}
                className="w-full p-3 border flex items-center justify-between text-left transition-all active:scale-95"
                style={{
                  background: card.type === 'attack' ? 'linear-gradient(90deg, #4c0519, #0a0203)' : card.type === 'power' ? 'linear-gradient(90deg, #4c1d95, #0a0a1a)' : 'linear-gradient(90deg, #1e3a8a, #0a0a1a)',
                  borderColor: canAfford ? '#f59e0b80' : '#33333380',
                  opacity: canAfford ? 1 : 0.5,
                }}
              >
                <div>
                  <div className="text-amber-100 font-bold text-sm">{card.name} <span className="text-xs text-amber-200/60">[{card.cost}]</span></div>
                  <div className="text-xs text-white/60 mt-0.5">{card.desc}</div>
                </div>
                <div className="text-amber-400 font-bold">◈{item.price}</div>
              </button>
            );
          })}
        </div>
        
        {/* Artifacts */}
        {merchant.artifacts && merchant.artifacts.length > 0 && (
          <>
            <div className="text-[10px] tracking-[0.3em] text-amber-200/50 mb-2">ARTIFACTS</div>
            <div className="space-y-2 mb-6">
              {merchant.artifacts.map((item, i) => {
                if (!item) return <div key={i} className="text-center text-amber-100/30 py-3 text-sm">— SOLD —</div>;
                const a = ARTIFACTS[item.key];
                const canAfford = game.gold >= item.price;
                const isRare = a.rarity === 'rare';
                return (
                  <button
                    key={i}
                    onClick={() => buyArtifact(i)}
                    disabled={!canAfford}
                    className="w-full p-3 border flex items-center gap-3 text-left transition-all active:scale-95"
                    style={{
                      background: isRare
                        ? 'linear-gradient(90deg, #4c1d95, #0a0a1a)'
                        : 'linear-gradient(90deg, #78350f, #0a0203)',
                      borderColor: canAfford ? (isRare ? '#a78bfa80' : '#fbbf2480') : '#33333380',
                      opacity: canAfford ? 1 : 0.5,
                    }}
                  >
                    <div className="text-3xl flex-shrink-0">{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-amber-100 font-bold text-sm">{a.name} {isRare && <span className="text-[9px] text-purple-300 tracking-widest">★ RARE</span>}</div>
                      <div className="text-[11px] text-white/70 mt-0.5">{a.desc}</div>
                    </div>
                    <div className="text-amber-400 font-bold flex-shrink-0">◈{item.price}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}
        
        <button onClick={onDone} className="w-full px-8 py-3 border border-amber-400/60 text-amber-100 hover:bg-amber-400/10 active:scale-95 transition-all tracking-widest">
          LEAVE
        </button>
      </div>
    </div>
  );
}

// ============ REST ============

function RestScreen({ game, setGame, onDone }) {
  const [used, setUsed] = useState(false);
  
  const heal = () => {
    setGame({ ...game, hp: Math.min(game.maxHp, game.hp + 25) });
    setUsed(true);
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #047857 0%, transparent 60%)', opacity: 0.3 }} />
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="text-xs tracking-[0.4em] text-emerald-300/60 mb-2">CAMPFIRE</div>
        <h2 className="text-3xl font-bold text-emerald-200 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Rest</h2>
        <div className="text-6xl mb-6">✦</div>
        <div className="text-emerald-100/60 italic mb-8 text-sm">The fire crackles softly. You may rest.</div>
        
        {!used ? (
          <button onClick={heal} className="w-full px-8 py-4 border border-emerald-400/60 text-emerald-100 hover:bg-emerald-500/20 active:scale-95 transition-all tracking-widest mb-3">
            REST (Heal 25 HP)
          </button>
        ) : (
          <div className="text-emerald-200 mb-6 italic">You feel renewed.</div>
        )}
        
        <button onClick={onDone} className="w-full px-8 py-3 border border-amber-400/40 text-amber-100/80 hover:bg-amber-400/10 active:scale-95 transition-all tracking-widest text-sm">
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// ============ REWARD ============

function RewardScreen({ reward, onDone }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #b45309 0%, transparent 60%)', opacity: 0.3 }} />
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="text-xs tracking-[0.4em] text-amber-300/60 mb-2">VICTORY</div>
        <h2 className="text-3xl font-bold text-amber-200 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Spoils</h2>
        <div className="text-amber-300 mb-1">◈ +{reward.gold} gold</div>
        {reward.healed > 0 && <div className="text-emerald-300 text-sm mb-1">♥ +{reward.healed} HP (Amulet)</div>}
        {reward.artifact && (
          <div className="text-purple-300 text-sm mb-4 italic">{ARTIFACTS[reward.artifact].icon} An artifact awaits...</div>
        )}
        {!reward.artifact && <div className="mb-4" />}
        <div className="text-xs tracking-widest text-amber-100/60 mb-3">CHOOSE A CARD</div>
        
        <div className="space-y-2 mb-6">
          {reward.cards.map((cardKey, i) => {
            const card = CARD_LIBRARY[cardKey];
            return (
              <button
                key={i}
                onClick={() => onDone(cardKey)}
                className="w-full p-3 border text-left active:scale-95 transition-all"
                style={{
                  background: card.type === 'attack' ? 'linear-gradient(90deg, #4c0519, #0a0203)' : card.type === 'power' ? 'linear-gradient(90deg, #4c1d95, #0a0a1a)' : 'linear-gradient(90deg, #1e3a8a, #0a0a1a)',
                  borderColor: '#f59e0b80',
                }}
              >
                <div className="text-amber-100 font-bold text-sm">{card.name} <span className="text-xs text-amber-200/60">[{card.cost}]</span></div>
                <div className="text-xs text-white/60 mt-0.5">{card.desc}</div>
              </button>
            );
          })}
        </div>
        
        <button onClick={() => onDone(null)} className="w-full px-8 py-3 border border-amber-400/40 text-amber-100/60 hover:bg-amber-400/10 active:scale-95 transition-all tracking-widest text-xs">
          SKIP
        </button>
      </div>
    </div>
  );
}

// ============ END SCREENS ============

function GameOver({ onRestart }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6">
      <div className="text-xs tracking-[0.5em] text-red-400/60 mb-3">YOU HAVE FALLEN</div>
      <h1 className="text-6xl font-bold text-red-300 mb-8 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>DEATH</h1>
      <div className="text-red-200/60 italic mb-12 text-center">The spire claims another soul...</div>
      <button onClick={onRestart} className="px-12 py-4 border border-red-400/60 text-red-200 hover:bg-red-500/20 active:scale-95 transition-all tracking-[0.3em]">
        TRY AGAIN
      </button>
    </div>
  );
}

function VictoryScreen({ onRestart }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #f59e0b 0%, transparent 60%)', opacity: 0.3 }} />
      <div className="relative z-10 text-center">
        <div className="text-xs tracking-[0.5em] text-amber-300/80 mb-3">THE VOID IS BROKEN</div>
        <h1 className="text-6xl font-bold text-amber-200 mb-8 tracking-wider" style={{ fontFamily: 'Cinzel, serif',
          background: 'linear-gradient(180deg, #fef3c7 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VICTORY</h1>
        <div className="text-amber-100/70 italic mb-2 max-w-md">Four spires. Four kings. All fallen.</div>
        <div className="text-amber-100/50 italic mb-12 max-w-md text-sm">The Void Sovereign is no more. You stand alone at the summit of all things.</div>
        <button onClick={onRestart} className="px-12 py-4 border border-amber-400 text-amber-100 hover:bg-amber-400/20 active:scale-95 transition-all tracking-[0.3em]">
          ASCEND AGAIN
        </button>
      </div>
    </div>
  );
}

const ACT_NAMES = [
  { name: 'The Forsaken Crypts', sub: 'Where slimes whisper and goblins gnaw', color: '#a3a3a3' },
  { name: 'The Bleeding Halls', sub: 'Walls weep blood. Wraiths walk freely.', color: '#dc2626' },
  { name: 'The Sunless Vault', sub: 'Light has not reached here in centuries', color: '#a78bfa' },
  { name: 'The Final Spire', sub: 'The Void Sovereign awaits at the apex', color: '#fbbf24' },
];

function ActTransition({ actNum, onContinue }) {
  const act = ACT_NAMES[Math.min(actNum, 3)];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at center, ${act.color}40 0%, transparent 60%), linear-gradient(180deg, #0a0510 0%, #000 100%)`,
        animation: 'actFadeIn 1s ease-out',
      }} />
      <div className="relative z-10 text-center" style={{ animation: 'actFadeIn 1.5s ease-out' }}>
        <div className="text-xs tracking-[0.6em] text-amber-200/50 mb-3">— ACT {actNum + 1} OF 4 —</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-wider" style={{
          fontFamily: 'Cinzel, serif',
          color: act.color,
          textShadow: `0 0 30px ${act.color}80`,
        }}>{act.name}</h1>
        <div className="text-amber-100/60 italic mb-12 text-sm md:text-base max-w-sm mx-auto">"{act.sub}"</div>
        <div className="text-[11px] tracking-[0.3em] text-amber-100/40 mb-4">YOU FEEL RENEWED. THE PATH BEGINS AGAIN.</div>
        <button onClick={onContinue} className="px-12 py-4 border-2 border-amber-400/60 text-amber-100 hover:bg-amber-400/10 active:scale-95 transition-all tracking-[0.3em] text-sm" style={{
          boxShadow: `0 0 20px ${act.color}60`,
        }}>
          ENTER {act.name.toUpperCase()}
        </button>
      </div>
      <style>{`
        @keyframes actFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
