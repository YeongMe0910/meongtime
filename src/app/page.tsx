// src/app/page.tsx
import Link from "next/link";
import { GAMES } from "@/src/data/games";

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto flex flex-col">
      {/* 헤더 */}
      <header className="text-center my-10">
        <span className="text-xs md:text-sm font-semibold tracking-widest text-yellow-400 uppercase bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
          KILLING TIME WEB GAMES
        </span>
        <h1 className="text-4xl md:text-6xl font-black mt-4 tracking-tight">
          멍타임 <span className="text-yellow-400">MEONGTIME</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          복잡한 설치나 회원가입 없이, 멍 때릴 때 링크 하나로 바로 즐기는 미니 웹 게임들
        </p>
      </header>

      {/* 게임 목록 그리드 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            href={`/play/${game.id}`}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/5 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-800">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-md text-yellow-400 border border-slate-700">
                {game.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold group-hover:text-yellow-400 transition-colors">
                  {game.title}
                </h2>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-slate-300">
                <span>지금 플레이하기</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 푸터 */}
      <footer className="mt-16 text-center text-xs text-slate-600 py-6 border-t border-slate-900">
        © 2026 meongtime.com. All rights reserved.
      </footer>
    </main>
  );
}