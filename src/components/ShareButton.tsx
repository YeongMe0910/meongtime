// src/components/ShareButton.tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface ShareButtonProps {
  gameTitle: string;
  gameId: string;
}

export default function ShareButton({ gameTitle, gameId }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/play/${gameId}`
      : `https://meongtime.com/play/${gameId}`;
  const shareText = `멍타임에서 [${gameTitle}] 같이 플레이해요! 🔥`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gameTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // 취소 시 무시
      }
    } else {
      handleCopyLink();
      alert("링크가 복사되었습니다. 카카오톡 창에 붙여넣어 주세요!");
    }
  };

  const handleShareInstagram = async () => {
    await handleCopyLink();
    alert("링크가 복사되었습니다! 인스타그램 스토리나 DM에 붙여넣어 공유해보세요.");
    window.open("https://www.instagram.com/", "_blank");
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  return (
    <>
      {/* 우측 하단 공유 트리거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-md active:scale-95 ${
          isDark
            ? "bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-yellow-400 border-slate-800"
            : "bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-600 border-slate-300"
        }`}
      >
        <span>🔗</span>
        <span>게임 공유하기</span>
      </button>

      {/* 공유 팝업 모달 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl relative border transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className={`absolute top-4 right-4 text-lg w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold">친구에게 공유하기</h3>
            <p
              className={`text-xs mt-1 line-clamp-1 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {gameTitle}
            </p>

            {/* 소셜 미디어 버튼 그리드 */}
            <div className="grid grid-cols-4 gap-3 my-6">
              {/* 카카오톡 */}
              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FEE500] flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-black"
                  >
                    <path d="M12 3c-5.5 0-10 3.5-10 7.8 0 2.8 1.8 5.2 4.5 6.6l-1 3.4c-.1.3.2.6.5.4l4-2.7c.6.1 1.3.2 2 .2 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
                  </svg>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  카카오톡
                </span>
              </button>

              {/* 인스타그램 */}
              <button
                onClick={handleShareInstagram}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-pink-500/20">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-white"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  인스타그램
                </span>
              </button>

              {/* X (트위터) */}
              <button
                onClick={handleShareTwitter}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black group-hover:scale-105 transition-transform ${
                    isDark
                      ? "bg-slate-800 border border-slate-700 text-white"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  𝕏
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  X (트위터)
                </span>
              </button>

              {/* 페이스북 */}
              <button
                onClick={handleShareFacebook}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform shadow-lg shadow-blue-600/20">
                  f
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  페이스북
                </span>
              </button>
            </div>

            {/* URL 직접 복사 바 */}
            <div
              className={`flex items-center gap-2 rounded-xl p-2 pl-3 border ${
                isDark
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <input
                type="text"
                readOnly
                value={shareUrl}
                className={`bg-transparent text-xs flex-1 outline-none select-all truncate ${
                  isDark ? "text-slate-300" : "text-slate-700 font-medium"
                }`}
              />
              <button
                onClick={handleCopyLink}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-black transition-all ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : isDark
                    ? "bg-yellow-400 hover:bg-yellow-300 text-slate-950"
                    : "bg-amber-500 hover:bg-amber-400 text-white"
                }`}
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}