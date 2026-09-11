import React, { useState } from 'react';
import { ExcelWorkbook } from '../types';

interface SettingsTabProps {
  workbook: ExcelWorkbook | null;
  isFreezeColumns: boolean;
  onToggleFreezeColumns: () => void;
  onSelectSampleWorkbook: (name: string) => void;
  onResetWorkbook?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  workbook,
  isFreezeColumns,
  onToggleFreezeColumns,
  onSelectSampleWorkbook,
  onResetWorkbook
}) => {
  const [autoHighlight, setAutoHighlight] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(false);

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* File Information Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#111c2d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f30]">description</span>
            현재 로드된 파일 정보
          </h3>
          {workbook && onResetWorkbook && (
            <button
              type="button"
              onClick={onResetWorkbook}
              className="text-[11px] font-bold text-[#ba1a1a] hover:bg-[#ffdad6] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              파일 닫기
            </button>
          )}
        </div>

        {workbook ? (
          <div className="grid grid-cols-2 gap-3 text-[13px] bg-[#f9f9ff] p-3 rounded-xl border border-[#dee8ff]">
            <div>
              <span className="text-[#6f7a6f] block text-[11px]">파일명</span>
              <span className="font-bold text-[#111c2d] truncate block">{workbook.name}</span>
            </div>
            <div>
              <span className="text-[#6f7a6f] block text-[11px]">용량</span>
              <span className="font-bold text-[#111c2d]">{workbook.sizeFormatted}</span>
            </div>
            <div>
              <span className="text-[#6f7a6f] block text-[11px]">시트 개수</span>
              <span className="font-bold text-[#111c2d]">{workbook.sheetCount}개</span>
            </div>
            <div>
              <span className="text-[#6f7a6f] block text-[11px]">총 데이터 행</span>
              <span className="font-bold text-[#111c2d]">
                {workbook.sheets[0]?.rowCount || 0}행 ({workbook.sheets[0]?.colCount || 0}열)
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#f9f9ff] rounded-xl border border-[#dee8ff] text-center">
            <p className="text-[13px] text-[#6f7a6f]">로드된 엑셀 파일이 없습니다.</p>
          </div>
        )}

        {/* Demo switcher */}
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[12px] font-semibold text-[#3f4940]">샘플 데이터로 열기:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectSampleWorkbook('교양교육과정.xlsx')}
              className={`p-2.5 rounded-xl border text-[12px] font-semibold transition-all cursor-pointer text-left ${
                workbook?.name === '교양교육과정.xlsx'
                  ? 'border-[#005f30] bg-[#f0f3ff] text-[#005f30] font-bold'
                  : 'border-[#dee8ff] bg-white text-[#111c2d] hover:bg-[#f9f9ff]'
              }`}
            >
              교양교육과정.xlsx
            </button>
            <button
              type="button"
              onClick={() => onSelectSampleWorkbook('2024_1학기_강의목록.xlsx')}
              className={`p-2.5 rounded-xl border text-[12px] font-semibold transition-all cursor-pointer text-left ${
                workbook?.name === '2024_1학기_강의목록.xlsx'
                  ? 'border-[#005f30] bg-[#f0f3ff] text-[#005f30] font-bold'
                  : 'border-[#dee8ff] bg-white text-[#111c2d] hover:bg-[#f9f9ff]'
              }`}
            >
              2024_1학기_강의목록.xlsx
            </button>
          </div>
        </div>
      </div>

      {/* Display & Search Preferences */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e7eeff] flex flex-col gap-4">
        <h3 className="text-[16px] font-bold text-[#111c2d] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#005f30]">tune</span>
          표시 및 검색 설정
        </h3>

        <div className="flex flex-col divide-y divide-[#f0f3ff] text-[13px]">
          {/* Setting 1 */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#111c2d]">A, B열 고정 보기 (Freeze Columns)</p>
              <p className="text-[11px] text-[#6f7a6f]">
                테이블 뷰에서 가로 스크롤 시 학수번호와 과목명 열을 고정합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleFreezeColumns}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isFreezeColumns ? 'bg-[#005f30]' : 'bg-[#d8e3fb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  isFreezeColumns ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Setting 2 */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#111c2d]">검색어 형광펜 강조 (Highlight)</p>
              <p className="text-[11px] text-[#6f7a6f]">
                일치하는 검색어 키워드를 연두색 배지로 자동 하이라이트합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoHighlight(!autoHighlight)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoHighlight ? 'bg-[#005f30]' : 'bg-[#d8e3fb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  autoHighlight ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Setting 3 */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#111c2d]">클릭 및 복사 진동 피드백</p>
              <p className="text-[11px] text-[#6f7a6f]">
                셀 복사 및 북마크 저장 시 햅틱 피드백을 전달합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSoundFeedback(!soundFeedback)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundFeedback ? 'bg-[#005f30]' : 'bg-[#d8e3fb]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5 ${
                  soundFeedback ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* App Version Card */}
      <div className="bg-[#f0f3ff] rounded-xl p-4 border border-[#dee8ff] text-center">
        <p className="text-[13px] font-bold text-[#111c2d]">엑셀 검색기 PRO v2.4.0</p>
        <p className="text-[11px] text-[#6f7a6f] mt-0.5">
          실시간 엑셀 인덱싱 엔진 · Noto Sans Tabular 기반 최적화
        </p>
      </div>
    </div>
  );
};
