// components/sections/FooterSection.tsx
'use client';

import React from 'react';

export default function FooterSection() {
  return (
    <footer className="w-full border-t border-gray-900/60 bg-black py-8 px-8 md:px-16 lg:px-32 font-jetbrains-mono text-[10px] text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        © {new Date().getFullYear()} NIYATI JOSHI // ALL RIGHTS RESERVED.
      </div>
      <div className="flex items-center gap-6">
        <span>LOC: INDORE, IN</span>
        <span>LATENCY: 14ms</span>
        <span className="text-emerald-500 animate-pulse">● SYS_ONLINE</span>
      </div>
    </footer>
  );
}