import React, { useRef, useState } from 'react';
import { ExcelWorkbook } from '../types';
import { parseExcelFile } from '../utils/excelParser';
import { createCurriculumWorkbook, createLectureCatalogWorkbook } from '../data/sampleFiles';

interface InitialUploadViewProps {
  onWorkbookLoaded: (wb: ExcelWorkbook) => void;
}

export const InitialUploadView: React.FC<InitialUploadViewProps> = ({ onWorkbookLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const wb = await parseExcelFile(file);
      onWorkbookLoaded(wb);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('엑셀 파일을 읽는 중 오류가 발생했습니다. .xlsx, .xls, .csv 형식인지 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (type: 'curriculum' | 'lecture') => {
    if (type === 'curriculum') {
      onWorkbookLoaded(createCurriculumWorkbook());
    } else {
      onWorkbookLoaded(createLectureCatalogWorkbook());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 px-2 animate-fade-in">
      {/* Visual Title Card */}
      <div className="text-center max-w-md mx-auto mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#b3f1c5] text-[#005f30] flex items-center justify-center mx-auto mb-3.5 shadow-sm">
          <span
            className="material-symbols-outlined text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            table_chart
          </span>
        </div>
        <h2 className="text-[22px] font-bold text-[#111c2d] tracking-tight">
          검색할 엑셀 파일을 넣어주세요
        </h2>
        <p className="text-[13px] text-[#3f4940] mt-1.5 leading-relaxed">
          스프레드시트를 업로드하면 실시간 셀 검색, 카드 뷰 요약,
          테이블 필드 분석 및 CSV 추출을 바로 이용할 수 있습니다.
        </p>
      </div>

      {/* Main Drag and Drop Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full max-w-md border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 bg-white shadow-sm hover:shadow-md ${
          isDragging
            ? 'border-[#005f30] bg-[#f0f3ff] scale-[1.01]'
            : 'border-[#cfdaf2] hover:border-[#005f30]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-14 h-14 rounded-full bg-[#f0f3ff] text-[#005f30] flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[30px]">
            {isLoading ? 'progress_activity' : 'upload_file'}
          </span>
        </div>

        <div>
          <p className="text-[15px] font-bold text-[#111c2d]">
            {isLoading ? '엑셀 시트 분석 중...' : '엑셀 파일 선택 또는 여기에 드래그'}
          </p>
          <p className="text-[12px] text-[#6f7a6f] mt-1">
            지원 파일: <span className="font-semibold text-[#111c2d]">.xlsx</span>,{' '}
            <span className="font-semibold text-[#111c2d]">.xls</span>,{' '}
            <span className="font-semibold text-[#111c2d]">.csv</span>
          </p>
        </div>

        <button
          type="button"
          className="mt-2 h-10 px-5 rounded-full bg-[#005f30] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#0d7a41] active:scale-95 transition-all pointer-events-none"
        >
          <span className="material-symbols-outlined text-[18px]">folder_open</span>
          <span>내 컴퓨터에서 파일 찾기</span>
        </button>
      </div>

      {errorMsg && (
        <div className="w-full max-w-md mt-4 p-3.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[12px] font-medium border border-[#ffb4ab]">
          {errorMsg}
        </div>
      )}

      {/* Or Select Sample Datasets */}
      <div className="w-full max-w-md mt-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px bg-[#dee8ff] flex-1"></div>
          <span className="text-[12px] font-semibold text-[#6f7a6f]">
            또는 샘플 파일로 먼저 체험하기
          </span>
          <div className="h-px bg-[#dee8ff] flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Sample 1: 교양교육과정 */}
          <button
            type="button"
            onClick={() => handleSelectSample('curriculum')}
            className="p-3.5 rounded-xl bg-white border border-[#e7eeff] hover:border-[#005f30] hover:bg-[#f0f3ff] transition-all text-left flex items-center gap-3 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#b3f1c5] text-[#366f4d] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#111c2d] truncate">
                교양교육과정.xlsx
              </p>
              <p className="text-[11px] text-[#6f7a6f]">
                39.7 KB · 315개 교양 강좌
              </p>
            </div>
          </button>

          {/* Sample 2: 2024_1학기_강의목록 */}
          <button
            type="button"
            onClick={() => handleSelectSample('lecture')}
            className="p-3.5 rounded-xl bg-white border border-[#e7eeff] hover:border-[#005f30] hover:bg-[#f0f3ff] transition-all text-left flex items-center gap-3 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#b3f1c5] text-[#366f4d] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#111c2d] truncate">
                2024_1학기_강의목록.xlsx
              </p>
              <p className="text-[11px] text-[#6f7a6f]">
                48.2 KB · 240행 15칼럼
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
