// src/components/GameViewer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import ShareButton from "@/components/ShareButton";
import { Game } from "@/data/games";
import { useTheme } from "@/context/ThemeContext";

interface PlayerRank {
  id: string;
  nickname: string;
  progress: number;
  time: number | null;
  score?: number;
  finished: boolean;
  timedOut?: boolean;
  isMe: boolean;
}

type ScreenSize = "normal" | "wide" | "full" | "custom";
type TileSize = "sm" | "md" | "lg";

export default function GameViewer({ game }: { game: Game }) {
  const [leaderboard, setLeaderboard] = useState<PlayerRank[]>([]);
  const [screenSize, setScreenSize] = useState<ScreenSize>("normal");
  const [tileSize, setTileSize] = useState<TileSize>("md");
  const [highlightColor, setHighlightColor] = useState<boolean>(true);
  
  const { theme, toggleTheme } = useTheme();

  // 최소 가로/세로 제한 (높이 최소 720px 적용)
  const minWidth = game.id === "liar-game" ? 480 : 440;
  const minHeight = 720;

  const [customSize, setCustomSize] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  const postToIframe = (data: object) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(data, "*");
    }
  };

  const handleTileSizeChange = (size: TileSize) => {
    setTileSize(size);
    if (size === "lg" && screenSize === "normal") {
      setScreenSize("wide");
      setCustomSize(null);
    }
    postToIframe({ type: "MEONGTIME_SET_TILE_SIZE", size });
  };

  const toggleHighlightColor = () => {
    const next = !highlightColor;
    setHighlightColor(next);
    postToIframe({ type: "MEONGTIME_SET_HIGHLIGHT", enabled: next });
  };

  useEffect(() => {
    postToIframe({ type: "MEONGTIME_SET_THEME", theme });
  }, [theme]);

  const handleIframeLoad = () => {
    postToIframe({ type: "MEONGTIME_SET_TILE_SIZE", size: tileSize });
    postToIframe({ type: "MEONGTIME_SET_THEME", theme });
    if (game.id === "1to50-multi") {
      postToIframe({ type: "MEONGTIME_SET_HIGHLIGHT", enabled: highlightColor });
    }
  };

  const handlePresetChange = (preset: "normal" | "wide" | "full") => {
    setCustomSize(null);
    setScreenSize(preset);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
    };
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;
      
      const effectiveMinWidth = Math.min(minWidth, window.innerWidth - 32);
      const effectiveMinHeight = minHeight;

      const maxAllowedHeight = Math.max(effectiveMinHeight, window.innerHeight - 150);
      const maxAllowedWidth = Math.max(
        effectiveMinWidth,
        window.innerWidth - (leaderboard.length > 0 ? 330 : 64)
      );

      // 최소 720px 보장 Clamping
      const newWidth = Math.max(
        effectiveMinWidth,
        Math.min(maxAllowedWidth, dragStartRef.current.startW + deltaX)
      );
      const newHeight = Math.max(
        effectiveMinHeight,
        Math.min(maxAllowedHeight, dragStartRef.current.startH + deltaY)
      );
      
      setCustomSize({ width: newWidth, height: newHeight });
      setScreenSize("custom");
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      dragStartRef.current = null;
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, leaderboard.length, minWidth, minHeight]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "MEONGTIME_LEADERBOARD") {
        const { players, myId } = event.data;
        if (!players) return;

        const list: PlayerRank[] = Object.entries(players).map(
          ([id, p]: [string, any]) => ({
            id,
            nickname: p.nickname || "플레이어",
            progress: p.progress || 0,
            score: p.score !== undefined ? p.score : undefined,
            time: p.time || null,
            finished: !!p.finished,
            timedOut: !!p.timedOut,
            isMe: id === myId,
          })
        );

        list.sort((a, b) => {
          if (a.score !== undefined && b.score !== undefined) {
            return b.score - a.score;
          }
          const aSuccess = a.finished && !a.timedOut;
          const bSuccess = b.finished && !b.timedOut;

          if (aSuccess && bSuccess) return (a.time || 0) - (b.time || 0);
          if (aSuccess) return -1;
          if (bSuccess) return 1;
          return (b.progress || 0) - (a.progress || 0);
        });

        setLeaderboard(list);
      } else if (event.data?.type === "MEONGTIME_REQUIRE_EXPAND") {
        if (screenSize === "normal") {
          setScreenSize("wide");
          setCustomSize(null);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [screenSize]);

  const isFull = screenSize === "full";
  const isDark = theme === "dark";

  return (
    <main
      className={`flex-1 flex flex-col items-center justify-center p-2 sm:p-4 w-full transition-colors duration-200 ${
        isFull ? "fixed inset-0 z-50 p-0" : "max-w-[1600px] mx-auto"
      }`}
    >
      {/* 상단 컨트롤 바 */}
      <div
        className={`w-full flex flex-wrap items-center justify-between gap-2 mb-2.5 px-2 ${
          isFull
            ? isDark
              ? "p-3 bg-slate-900 border-b border-slate-800"
              : "p-3 bg-white border-b border-slate-200 shadow-sm"
            : ""
        }`}
      >
        <span className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          🎮 {game.title} {screenSize === "custom" && "(커스텀 크기)"}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
              isDark
                ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800"
                : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span>{isDark ? "🌙 다크모드" : "☀️ 화이트모드"}</span>
          </button>

          {game.id === "1to50-multi" && (
            <button
              onClick={toggleHighlightColor}
              title="26~50번 타일의 파란색 배경 강조를 켜거나 끕니다."
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                highlightColor
                  ? isDark
                    ? "bg-blue-600/20 border-blue-500/60 text-blue-400 hover:bg-blue-600/30"
                    : "bg-blue-50 border-blue-400 text-blue-600 hover:bg-blue-100"
                  : isDark
                  ? "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                  : "bg-white border-slate-300 text-slate-400 hover:text-slate-700"
              }`}
            >
              <span>{highlightColor ? "🟦 2단계 색상: ON" : "⬜ 2단계 색상: OFF"}</span>
            </button>
          )}

          <div
            className={`flex items-center gap-1 border p-1 rounded-xl shadow-sm ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300"
            }`}
          >
            <span className={`text-[11px] font-bold px-2 hidden sm:inline ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              크기
            </span>
            <button
              onClick={() => handleTileSizeChange("sm")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tileSize === "sm"
                  ? "bg-yellow-400 text-slate-950 font-black shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
            >
              작게
            </button>
            <button
              onClick={() => handleTileSizeChange("md")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tileSize === "md"
                  ? "bg-yellow-400 text-slate-950 font-black shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
            >
              보통
            </button>
            <button
              onClick={() => handleTileSizeChange("lg")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tileSize === "lg"
                  ? "bg-yellow-400 text-slate-950 font-black shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
            >
              크게
            </button>
          </div>

          <div
            className={`flex items-center gap-1 border p-1 rounded-xl shadow-sm ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300"
            }`}
          >
            <span className={`text-[11px] font-bold px-2 hidden sm:inline ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              화면 크기
            </span>
            <button
              onClick={() => handlePresetChange("normal")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                screenSize === "normal"
                  ? "bg-yellow-400 text-slate-950 font-black shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
            >
              기본
            </button>
            <button
              onClick={() => handlePresetChange("wide")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                screenSize === "wide"
                  ? "bg-yellow-400 text-slate-950 font-black shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
            >
              와이드
            </button>
            <button
              onClick={() => handlePresetChange(isFull ? "normal" : "full")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isFull
                  ? "bg-emerald-500 text-white shadow-sm font-black"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
            >
              {isFull ? "닫기 ✕" : "전체화면 ⛶"}
            </button>
          </div>
        </div>
      </div>

      {/* 중앙 메인 영역 */}
      <div
        className={`w-full flex flex-col lg:flex-row gap-4 items-stretch justify-center ${
          isFull ? "flex-1 p-2" : ""
        }`}
      >
        {/* 실시간 순위표 */}
        {leaderboard.length > 0 && (
          <aside
            className={`w-full lg:w-72 border rounded-2xl p-4 flex flex-col shadow-xl order-2 lg:order-1 flex-shrink-0 transition-colors ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <span className={`font-black text-sm flex items-center gap-1.5 ${
                isDark ? "text-yellow-400" : "text-amber-600"
              }`}>
                <span>🏆</span> 실시간 순위
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
              }`}>
                {leaderboard.length}명
              </span>
            </div>

            <ul className="mt-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[350px] lg:max-h-[calc(100vh-280px)]">
              {leaderboard.map((p, idx) => {
                const isScoreGame = p.score !== undefined;
                const scoreText = isScoreGame ? `${p.score}점` : p.finished ? `${p.time}s` : p.timedOut ? "시간초과" : `${p.progress}/50`;

                return (
                  <li
                    key={p.id}
                    className={`min-w-[180px] lg:min-w-0 p-2.5 rounded-xl border transition-all ${
                      p.isMe
                        ? isDark ? "bg-yellow-400/10 border-yellow-400/50" : "bg-amber-50 border-amber-400"
                        : isDark ? "bg-slate-950 border-slate-800/80" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5 gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span
                          className={`shrink-0 font-black ${
                            idx === 0
                              ? "text-yellow-500"
                              : idx === 1
                              ? "text-slate-400"
                              : idx === 2
                              ? "text-amber-700"
                              : "text-slate-500"
                          }`}
                        >
                          {idx + 1}등
                        </span>
                        <span
                          title={p.nickname}
                          className={`truncate text-xs ${
                            isDark ? "text-slate-200" : "text-slate-800"
                          }`}
                        >
                          {p.nickname}
                          {p.isMe && <span className="text-yellow-500 font-extrabold ml-1">(나)</span>}
                        </span>
                      </div>
                      <span className="shrink-0 font-black text-xs text-yellow-400">
                        {scoreText}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        {/* 최소 높이 720px 보장 게임 프레임 */}
        <div
          ref={containerRef}
          style={
            !isFull && customSize
              ? { 
                  width: `${customSize.width}px`, 
                  height: `${customSize.height}px`,
                  minWidth: `${minWidth}px`,
                  minHeight: `${minHeight}px`
                }
              : !isFull
              ? {
                  minWidth: `${minWidth}px`,
                  minHeight: `${minHeight}px`,
                  height: "720px"
                }
              : undefined
          }
          className={`rounded-2xl overflow-hidden border shadow-2xl relative order-1 lg:order-2 transition-colors duration-200 ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300"
          } ${
            isFull
              ? "w-full h-full max-w-none max-h-none rounded-none border-none"
              : !customSize
              ? screenSize === "wide"
                ? "w-full max-w-[1300px]"
                : "w-full max-w-5xl"
              : ""
          }`}
        >
          {isResizing && <div className="absolute inset-0 z-20 cursor-se-resize bg-transparent" />}

          <iframe
            ref={iframeRef}
            onLoad={handleIframeLoad}
            src={game.gamePath}
            title={game.title}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; focus-without-user-activation"
          />

          {!isFull && (
            <div
              onMouseDown={handleMouseDown}
              title="마우스로 드래그하여 화면 크기 조절 (최소 높이 720px)"
              className={`absolute bottom-1 right-1 w-6 h-6 z-30 cursor-se-resize flex items-end justify-end p-1 select-none transition-colors ${
                isDark ? "text-slate-500 hover:text-yellow-400" : "text-slate-400 hover:text-amber-500"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M21 15v6h-6M21 9v.01M21 3v.01M15 21v.01M9 21v.01" />
                <path d="M21 21L12 12" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 하단 공유 바 */}
      {!isFull && (
        <div className={`w-full max-w-[1600px] mt-3 flex items-center justify-between text-xs px-2 shrink-0 ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}>
          <p className="line-clamp-1 max-w-[65%]">{game.description}</p>
          <ShareButton gameTitle={game.title} gameId={game.id} />
        </div>
      )}
    </main>
  );
}