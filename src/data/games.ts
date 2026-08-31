// src/data/games.ts

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  gamePath: string;
  category: "반응속도" | "퀴즈" | "미니게임" | "퍼즐" | "심리추리";
  hidden?: boolean;
}

export const GAMES: Game[] = [
  /* 왁뿌볼 임시 보류
  {
    id: "wakbbu-smash",
    title: "왁뿌볼 뿌수기",
    description: "스트레스 해소 끝판왕! 찰진 소리와 함께 왁뿌볼을 산산조각 내보세요.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    gamePath: "/games/wakbbu-smash/index.html",
    category: "미니게임",
  },
  */
  {
    id: "reaction-test",
    title: "멍 때리기 반응속도 테스트",
    description: "화면이 초록색으로 바뀌는 순간 빛의 속도로 클릭하세요!",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    gamePath: "/games/reaction-test/index.html",
    category: "반응속도",
  },
  {
    id: "1to50-multi",
    title: "1 to 50 멀티 배틀",
    description: "같은 맵에서 친구와 실시간 속도 대결! 가장 먼저 50을 누르는 사람은 누구일까요?",
    thumbnail: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
    gamePath: "/games/1to50-multi/index.html",
    category: "미니게임",
  },
  {
    id: "liar-game",
    title: "16단어 라이어 게임",
    description: "16개 단어 중 정답을 모르는 라이어를 찾아라! 차례대로 힌트를 말하고 투표로 검거하는 심리 추리 게임",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    gamePath: "/games/liar-game/index.html",
    category: "심리추리",
  },
];