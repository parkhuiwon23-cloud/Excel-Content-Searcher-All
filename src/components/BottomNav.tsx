import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  resultCountBadge?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  resultCountBadge = '99+'
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#f9f9ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] border-t border-[#e7eeff]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {/* Tab 1: 검색 */}
        <button
          type="button"
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative cursor-pointer ${
            activeTab === 'search'
              ? 'text-[#005f30] font-bold'
              : 'text-[#3f4940] hover:text-[#111c2d]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">search</span>
            {resultCountBadge && (
              <span className="absolute -top-1 -right-3 px-1 py-0.2 bg-[#005f30] text-white text-[10px] rounded-full leading-tight font-bold">
                {resultCountBadge}
              </span>
            )}
          </div>
          <span className="text-[12px]">검색</span>
        </button>

        {/* Tab 2: 시트 뷰어/파일 */}
        <button
          type="button"
          onClick={() => onTabChange('viewer')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative cursor-pointer ${
            activeTab === 'viewer'
              ? 'text-[#005f30] font-bold'
              : 'text-[#3f4940] hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">table_chart</span>
          <span className="text-[12px]">시트 뷰어/파일</span>
        </button>

        {/* Tab 3: 설정 */}
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[#005f30] font-bold'
              : 'text-[#3f4940] hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">settings</span>
          <span className="text-[12px]">설정</span>
        </button>
      </div>
    </nav>
  );
};
