// src/app/play/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GAMES } from "@/src/data/games";

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

// 각 게임별 동적 메타태그 (카톡 공유 시 해당 게임 정보가 표시됨)
export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);

  if (!game) return { title: "게임을 찾을 수 없습니다" };

  return {
    title: game.title,
    description: game.description,
    openGraph: {
      title: `${game.title} - 멍타임`,
      description: game.description,
      images: [{ url: game.thumbnail }],
      url: `https://meongtime.com/play/${game.id}`,
    },
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 상단 네비게이션 바 */}
      <header className="h-16 border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
        <Link
          href="/"
          className="text-xs md:text-sm font-semibold text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
        >
          <span>←</span> 멍타임 홈으로
        </Link>
        <h1 className="font-bold text-sm md:text-base truncate max-w-[200px] md:max-w-md text-center">
          {game.title}
        </h1>
        <div className="w-24 text-right">
          <span className="text-xs bg-slate-800 text-yellow-400 font-medium px-2.5 py-1 rounded-full border border-slate-700">
            {game.category}
          </span>
        </div>
      </header>

      {/* 게임 실행 뷰어 */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-[4/3] sm:aspect-[16/9] max-h-[82vh] relative">
          <iframe
            src={game.gamePath}
            title={game.title}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; focus-without-user-activation"
          />
        </div>

        {/* 게임 설명 & 정보 */}
        <div className="w-full max-w-4xl mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
          <p>{game.description}</p>
          <p>공유 링크: meongtime.com/play/{game.id}</p>
        </div>
      </main>
    </div>
  );
}