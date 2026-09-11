import React from 'react';

interface HeaderProps {
  onOpenFileClick: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFileClick, onProfileClick }) => {
  const brandLogoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1UIiMHSxUWNqrc1UDpJx-xsTXnmdQ1FSW_wvytZCQwZJmJ-z_DyYwNWub4xbpBvHwkpvorYGmkpBOZIEjPQ19YCfhrwKX3rc5o-6XXXKpbRyWde4LZxiZhA2Rw-g59CfiAKXUNOfgurP0V_3kVnWMa5coErtFUFF4HmJUjx6L0rJxnz3OWvVru57WWGSmiqN7GTa7w_AOSXm7974btquj5rycGXeD6ssAt89EX0GXz6-NhGdg4hErZe';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-4 flex items-center justify-between max-w-4xl mx-auto w-full">
        {/* Brand logo & title */}
        <div className="flex items-center gap-2">
          <img
            alt="엑셀 검색기 PRO Logo"
            className="h-8 w-auto object-contain rounded-md"
            src={brandLogoUrl}
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback graceful SVG if external image fails
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] text-[#111c2d] font-bold tracking-tight">
              엑셀 검색기
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#b3f1c5] text-[#366f4d] text-[10px] uppercase font-bold tracking-wide">
              PRO
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFileClick}
            className="h-9 px-3 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#e2e8f0]/60 flex items-center gap-1.5 text-[#005f30] active:scale-95 hover:bg-[#f0f3ff] transition-all cursor-pointer"
            title="엑셀 또는 CSV 파일 열기"
          >
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
            <span className="text-[12px] text-[#111c2d] font-semibold">파일 열기</span>
          </button>
          
          <button
            type="button"
            onClick={onProfileClick}
            className="w-8 h-8 rounded-full bg-[#005f30] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            title="사용자 정보"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
