import React, { useState } from 'react';

interface JumpRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxRow: number;
  currentRow: number;
  onJump: (rowNum: number) => void;
}

export const JumpRowModal: React.FC<JumpRowModalProps> = ({
  isOpen,
  onClose,
  maxRow,
  currentRow,
  onJump
}) => {
  const [inputVal, setInputVal] = useState(String(currentRow));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputVal, 10);
    if (!isNaN(num) && num >= 1 && num <= maxRow) {
      onJump(num);
      onClose();
    }
  };

  const quickJump = (target: number) => {
    onJump(target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#e7eeff] overflow-hidden p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#005f30] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">vertical_align_center</span>
            </span>
            <h3 className="text-[16px] font-bold text-[#111c2d]">행 번호로 점프</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#dee8ff] flex items-center justify-center text-[#3f4940] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-semibold text-[#3f4940] mb-1 block">
              이동할 행 번호 (1 ~ {maxRow})
            </label>
            <input
              type="number"
              min={1}
              max={maxRow}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              autoFocus
              className="w-full h-11 px-3 bg-[#f0f3ff] rounded-xl border border-[#dee8ff] font-mono text-[16px] font-bold text-[#111c2d] focus:outline-none focus:border-[#005f30] focus:bg-white"
            />
          </div>

          {/* Quick jump suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="text-[#3f4940]">빠른 이동:</span>
            <button
              type="button"
              onClick={() => quickJump(1)}
              className="px-2 py-0.5 rounded-md bg-[#e7eeff] text-[#005f30] font-semibold hover:bg-[#d8e3fb]"
            >
              첫 행 (1)
            </button>
            <button
              type="button"
              onClick={() => quickJump(8)}
              className="px-2 py-0.5 rounded-md bg-[#b3f1c5] text-[#366f4d] font-bold hover:opacity-90"
            >
              8행 (메타버스)
            </button>
            <button
              type="button"
              onClick={() => quickJump(Math.floor(maxRow / 2))}
              className="px-2 py-0.5 rounded-md bg-[#e7eeff] text-[#005f30] font-semibold hover:bg-[#d8e3fb]"
            >
              중간 ({Math.floor(maxRow / 2)})
            </button>
            <button
              type="button"
              onClick={() => quickJump(maxRow)}
              className="px-2 py-0.5 rounded-md bg-[#e7eeff] text-[#005f30] font-semibold hover:bg-[#d8e3fb]"
            >
              마지막 ({maxRow})
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-xl text-[12px] font-semibold text-[#3f4940] hover:bg-[#f0f3ff] cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 h-9 rounded-xl text-[12px] font-bold bg-[#005f30] text-white hover:bg-[#0d7a41] cursor-pointer shadow-sm"
            >
              이동하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
