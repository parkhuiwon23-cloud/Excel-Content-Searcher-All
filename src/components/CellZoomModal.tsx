import React, { useState } from 'react';

interface CellZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellInfo: {
    address: string;
    value: string;
    formula?: string;
    type: string;
  } | null;
}

export const CellZoomModal: React.FC<CellZoomModalProps> = ({
  isOpen,
  onClose,
  cellInfo
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !cellInfo) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cellInfo.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e7eeff] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#f0f3ff] border-b border-[#dee8ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#005f30] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">open_in_full</span>
            </span>
            <div>
              <h3 className="text-[16px] font-bold text-[#111c2d]">셀 상세 확대 보기</h3>
              <p className="text-[11px] font-mono text-[#3f4940]">
                셀 주소: <strong className="text-[#005f30]">{cellInfo.address}</strong> · 유형: {cellInfo.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#dee8ff] flex items-center justify-center text-[#3f4940] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {/* Formula preview */}
          {cellInfo.formula && (
            <div className="p-3 bg-[#dee8ff] rounded-xl font-mono text-[12px] flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-white font-bold text-[#005f30] shadow-xs text-[10px]">
                fx
              </span>
              <span className="text-[#111c2d] truncate">{cellInfo.formula}</span>
            </div>
          )}

          {/* Full value box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#3f4940]">셀 데이터 원문</label>
            <div className="p-4 bg-[#f9f9ff] rounded-xl border border-[#e7eeff] text-[#111c2d] text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium select-all">
              {cellInfo.value || '(빈 셀)'}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-[12px] text-[#3f4940] font-mono">
            <span>글자수: {cellInfo.value.length}자</span>
            <span>·</span>
            <span>단어수: {cellInfo.value.trim().split(/\s+/).filter(Boolean).length}개</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#f0f3ff] border-t border-[#dee8ff] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#3f4940] hover:bg-white transition-colors cursor-pointer"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#005f30] text-white hover:bg-[#0d7a41] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? '복사되었습니다!' : '내용 복사'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
