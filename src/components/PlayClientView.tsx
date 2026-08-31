// src/components/PlayClientView.tsx
"use client";

import Link from "next/link";
import { Game } from "@/data/games";
import GameViewer from "@/components/GameViewer";
import { useTheme } from "@/context/ThemeContext";

export default function PlayClientView({ game }: { game: Game }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* 테마 연동 상단 네비게이션 헤더 */}
      <header
        className={`h-16 border-b px-4 md:px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-10 transition-colors duration-200 ${
          isDark
            ? "bg-slate-900/80 border-slate-800 text-slate-100"
            : "bg-white/80 border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <Link
          href="/"
          className={`text-xs md:text-sm font-bold transition-colors flex items-center gap-1.5 ${
            isDark
              ? "text-slate-400 hover:text-yellow-400"
              : "text-slate-600 hover:text-amber-600"
          }`}
        >
          <span>←</span> 멍타임 홈으로
        </Link>
        <h1 className="font-extrabold text-sm md:text-base truncate max-w-[200px] md:max-w-md text-center">
          {game.title}
        </h1>
        <div className="w-24 text-right">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-colors ${
              isDark
                ? "bg-slate-800 text-yellow-400 border-slate-700"
                : "bg-slate-50 text-amber-600 border-slate-200 shadow-sm"
            }`}
          >
            {game.category}
          </span>
        </div>
      </header>

      {/* 실시간 랭킹 + 게임 뷰어 */}
      <GameViewer game={game} />
    </div>
  );
}
