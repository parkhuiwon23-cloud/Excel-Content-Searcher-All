import React, { useState } from 'react';
import { ExcelWorkbook } from '../types';

interface SheetViewerTabProps {
  workbook: ExcelWorkbook | null;
  onOpenZoomModal: (cellInfo: { address: string; value: string; formula?: string; type: string }) => void;
  onOpenUploadModal?: () => void;
}

export const SheetViewerTab: React.FC<SheetViewerTabProps> = ({
  workbook,
  onOpenZoomModal,
  onOpenUploadModal
}) => {
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
    address: string;
    value: string;
  } | null>(null);
  const [filterText, setFilterText] = useState('');

  if (!workbook || workbook.sheets.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#e7eeff] shadow-sm my-4">
        <span className="material-symbols-outlined text-[48px] text-[#005f30]/40 mb-2">
          upload_file
        </span>
        <h3 className="text-[16px] font-bold text-[#111c2d]">로드된 엑셀 파일이 없습니다</h3>
        <p className="text-[13px] text-[#3f4940] mt-1 mb-4">
          시트를 확인하시려면 먼저 엑셀 파일을 업로드해주세요.
        </p>
        {onOpenUploadModal && (
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-4 py-2 rounded-full bg-[#005f30] text-white text-[13px] font-bold hover:bg-[#0d7a41] cursor-pointer shadow-sm active:scale-95"
          >
            엑셀 파일 열기
          </button>
        )}
      </div>
    );
  }

  const currentSheet = workbook.sheets[activeSheetIdx] || workbook.sheets[0];

  // Filter rows if user types in sheet quick filter
  const displayedRows = filterText.trim()
    ? currentSheet.rows.filter((row) =>
        row.some((c) => String(c ?? '').toLowerCase().includes(filterText.toLowerCase()))
      )
    : currentSheet.rows.slice(0, 100); // limit to 100 for fast smooth UI

  const handleCellClick = (rowIdx: number, colIdx: number, val: string | number | null) => {
    const colLetter = String.fromCharCode(65 + colIdx);
    const address = `${colLetter}${rowIdx + 1}`;
    const value = String(val ?? '');
    setSelectedCell({
      row: rowIdx + 1,
      col: colIdx + 1,
      address,
      value
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Sheet Bar & Quick Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e7eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {workbook.sheets.map((sheet, idx) => (
              <button
                key={sheet.name}
                type="button"
                onClick={() => setActiveSheetIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSheetIdx === idx
                    ? 'bg-[#005f30] text-white shadow-sm'
                    : 'bg-[#f0f3ff] text-[#3f4940] hover:bg-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">tab</span>
                <span>{sheet.name}</span>
                <span className="text-[10px] opacity-80">({sheet.rowCount}행)</span>
              </button>
            ))}
          </div>

          <div className="text-[12px] font-mono text-[#3f4940]">
            전체: <strong className="text-[#111c2d]">{currentSheet.rowCount}행</strong> ·{' '}
            <strong className="text-[#111c2d]">{currentSheet.colCount}열</strong>
          </div>
        </div>

        {/* Selected Cell Formula & Inspection Bar */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f0f3ff] border border-[#dee8ff] text-[13px] font-mono">
          <span className="px-2 py-0.5 rounded bg-white text-[#005f30] font-bold shadow-xs text-[11px]">
            {selectedCell ? selectedCell.address : 'A1'}
          </span>
          <span className="text-[#6f7a6f]">=</span>
          <span className="text-[#111c2d] truncate flex-1 font-medium">
            {selectedCell ? selectedCell.value || '(빈 셀)' : '셀을 클릭하여 내용을 검사하세요'}
          </span>
          {selectedCell && (
            <button
              type="button"
              onClick={() =>
                onOpenZoomModal({
                  address: selectedCell.address,
                  value: selectedCell.value,
                  formula: `"${selectedCell.value}"`,
                  type: '텍스트'
                })
              }
              className="p-1 rounded hover:bg-white text-[#005f30] transition-colors cursor-pointer"
              title="셀 확대"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_full</span>
            </button>
          )}
        </div>

        {/* Quick Filter */}
        <div className="relative">
          <span className="absolute left-3 top-2.5 material-symbols-outlined text-[#6f7a6f] text-[18px]">
            filter_list
          </span>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="시트 내 실시간 필터링..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#f9f9ff] border border-[#dee8ff] text-[13px] text-[#111c2d] focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e7eeff] overflow-hidden">
        <div className="relative overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead className="sticky top-0 z-30 bg-[#dee8ff]">
              <tr className="border-b border-[#cfdaf2] text-[#3f4940] font-mono text-[10px] uppercase font-bold">
                <th className="sticky left-0 z-40 bg-[#d8e3fb] px-3 py-2 text-center w-12 border-r border-[#cfdaf2]">
                  행
                </th>
                {currentSheet.headers.map((h, cIdx) => (
                  <th
                    key={cIdx}
                    className="px-3 py-2 whitespace-nowrap min-w-[110px] border-r border-[#cfdaf2]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono text-[#111c2d]">
              {displayedRows.map((row, rIdx) => {
                const rowNumber = rIdx + 1;
                const isSelectedRow = selectedCell?.row === rowNumber;

                return (
                  <tr
                    key={rIdx}
                    className={`border-b border-[#e7eeff] transition-colors ${
                      isSelectedRow ? 'bg-[#b3f1c5]/30' : 'hover:bg-[#f0f3ff]'
                    }`}
                  >
                    <td
                      className={`sticky left-0 z-20 px-3 py-2 text-center border-r border-[#cfdaf2] font-semibold ${
                        isSelectedRow
                          ? 'bg-[#005f30] text-white font-bold'
                          : 'bg-[#f0f3ff] text-[#6f7a6f]'
                      }`}
                    >
                      {rowNumber}
                    </td>
                    {currentSheet.headers.map((_, cIdx) => {
                      const cellVal = row[cIdx];
                      const isSelectedCell =
                        selectedCell?.row === rowNumber && selectedCell?.col === cIdx + 1;

                      return (
                        <td
                          key={cIdx}
                          onClick={() => handleCellClick(rIdx, cIdx, cellVal)}
                          className={`px-3 py-2 whitespace-nowrap border-r border-[#f0f3ff] cursor-pointer max-w-[240px] truncate ${
                            isSelectedCell
                              ? 'bg-[#b3f1c5] text-[#005f30] font-bold outline-2 outline-[#005f30]'
                              : ''
                          }`}
                        >
                          {String(cellVal ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
