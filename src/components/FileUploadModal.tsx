import React, { useRef, useState } from 'react';
import { ExcelWorkbook } from '../types';
import { parseExcelFile } from '../utils/excelParser';
import { createCurriculumWorkbook, createLectureCatalogWorkbook } from '../data/sampleFiles';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkbookLoaded: (wb: ExcelWorkbook) => void;
  currentWorkbookName: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onWorkbookLoaded,
  currentWorkbookName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const wb = await parseExcelFile(file);
      onWorkbookLoaded(wb);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('엑셀 파일을 읽는 중 오류가 발생했습니다. .xlsx, .xls, .csv 형식을 확인해주세요.');
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e7eeff] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f0f3ff] border-b border-[#dee8ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#005f30] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
            </span>
            <h3 className="text-[16px] font-bold text-[#111c2d]">엑셀 파일 열기</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#dee8ff] flex items-center justify-center text-[#3f4940] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Drag & drop box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-[#005f30] bg-[#b3f1c5]/20'
                : 'border-[#cfdaf2] bg-[#f9f9ff] hover:bg-[#f0f3ff]'
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
            <span className="w-12 h-12 rounded-full bg-[#b3f1c5] text-[#005f30] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">upload_file</span>
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#111c2d]">
                엑셀 또는 CSV 파일을 드래그하거나 클릭
              </p>
              <p className="text-[11px] text-[#3f4940] mt-0.5">
                지원 형식: .xlsx, .xls, .csv (최대 50MB)
              </p>
            </div>
            {isLoading && (
              <span className="text-[12px] font-semibold text-[#005f30] animate-pulse">
                파일 분석 중...
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[12px] font-medium">
              {errorMsg}
            </div>
          )}

          {/* Sample files quick-pick */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#3f4940]">
              또는 샘플 데이터셋 바로 불러오기:
            </span>

            {/* Sample 1 */}
            <button
              type="button"
              onClick={() => handleSelectSample('curriculum')}
              className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                currentWorkbookName === '교양교육과정.xlsx'
                  ? 'border-[#005f30] bg-[#f0f3ff]'
                  : 'border-[#e7eeff] bg-white hover:bg-[#f9f9ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#b3f1c5] text-[#366f4d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </span>
                <div>
                  <p className="text-[13px] font-bold text-[#111c2d]">교양교육과정.xlsx</p>
                  <p className="text-[11px] text-[#3f4940]">39.7 KB · 315행 교양선택 과목 데이터</p>
                </div>
              </div>
              {currentWorkbookName === '교양교육과정.xlsx' && (
                <span className="px-2 py-0.5 rounded-full bg-[#005f30] text-white text-[10px] font-bold">
                  현재 파일
                </span>
              )}
            </button>

            {/* Sample 2 */}
            <button
              type="button"
              onClick={() => handleSelectSample('lecture')}
              className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                currentWorkbookName === '2024_1학기_강의목록.xlsx'
                  ? 'border-[#005f30] bg-[#f0f3ff]'
                  : 'border-[#e7eeff] bg-white hover:bg-[#f9f9ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#b3f1c5] text-[#366f4d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">table_chart</span>
                </span>
                <div>
                  <p className="text-[13px] font-bold text-[#111c2d]">2024_1학기_강의목록.xlsx</p>
                  <p className="text-[11px] text-[#3f4940]">48.2 KB · 240행 15칼럼 전공/융합 데이터</p>
                </div>
              </div>
              {currentWorkbookName === '2024_1학기_강의목록.xlsx' && (
                <span className="px-2 py-0.5 rounded-full bg-[#005f30] text-white text-[10px] font-bold">
                  현재 파일
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
