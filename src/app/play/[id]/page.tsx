// src/app/play/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GAMES } from "@/data/games";
import PlayClientView from "@/components/PlayClientView";

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

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

  return <PlayClientView game={game} />;
}