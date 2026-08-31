// src/app/page.tsx
"use client";

import Link from "next/link";
import { GAMES } from "@/data/games";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto flex flex-col">
      {/* 상단 헤더 & 테마 토글 버튼 */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
            isDark
              ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800"
              : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
          }`}
        >
          <span>{isDark ? "🌙 다크모드" : "☀️ 화이트모드"}</span>
        </button>
      </div>

      <header className="text-center my-6">
        <span
          className={`text-xs md:text-sm font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${
            isDark
              ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
              : "text-amber-600 bg-amber-500/10 border-amber-500/20"
          }`}
        >
          KILLING TIME WEB GAMES
        </span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 tracking-tight">
          멍타임{" "}
          <span className={isDark ? "text-yellow-400" : "text-amber-500"}>
            MEONGTIME
          </span>
        </h1>
        <p
          className={`mt-3 text-sm md:text-base max-w-lg mx-auto ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          복잡한 설치나 회원가입 없이, 멍 때릴 때 링크 하나로 바로 즐기는 미니 웹 게임들
        </p>
      </header>

      {/* 게임 목록 그리드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {GAMES.filter((g) => !g.hidden).map((game) => (
          <Link
            key={game.id}
            href={`/play/${game.id}`}
            className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
              isDark
                ? "bg-slate-900 border-slate-800 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/5"
                : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
            }`}
          >
            <div className="relative aspect-video overflow-hidden bg-slate-800">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md border backdrop-blur-md ${
                  isDark
                    ? "bg-slate-950/80 text-yellow-400 border-slate-700"
                    : "bg-white/90 text-amber-600 border-slate-200"
                }`}
              >
                {game.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2
                  className={`text-lg font-bold transition-colors ${
                    isDark
                      ? "text-slate-200 group-hover:text-yellow-400"
                      : "text-slate-800 group-hover:text-amber-600"
                  }`}
                >
                  {game.title}
                </h2>
                <p
                  className={`text-sm mt-2 line-clamp-2 leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {game.description}
                </p>
              </div>
              <div
                className={`mt-4 pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                  isDark
                    ? "border-slate-800/80 text-slate-500 group-hover:text-slate-300"
                    : "border-slate-100 text-slate-400 group-hover:text-slate-700"
                }`}
              >
                <span>지금 플레이하기</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 푸터 */}
      <footer
        className={`mt-16 text-center text-xs py-6 border-t ${
          isDark ? "border-slate-900 text-slate-600" : "border-slate-200 text-slate-400"
        }`}
      >
        © 2026 meongtime.com. All rights reserved.
      </footer>
    </main>
  );
}