// src/data/games.ts

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  gamePath: string;
  category: "반응속도" | "퀴즈" | "미니게임" | "퍼즐";
}

export const GAMES: Game[] = [
  {
    id: "reaction-test",
    title: "멍 때리기 반응속도 테스트",
    description: "화면이 초록색으로 바뀌는 순간 빛의 속도로 클릭하세요!",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    gamePath: "/games/reaction-test/index.html",
    category: "반응속도",
  },
];