import * as XLSX from 'xlsx';
import { ExcelWorkbook, Sheet, SearchResultCard } from '../types';

export function getColumnLetter(colIndex: number): string {
  let letter = '';
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

export function parseExcelFile(file: File): Promise<ExcelWorkbook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellFormula: true, cellDates: true });

        const sheets: Sheet[] = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<(string | number | null)[]>(worksheet, {
            header: 1,
            defval: '',
            blankrows: true
          });

          // Determine column headers
          let headers: string[] = [];
          if (jsonData.length > 0) {
            const firstRow = jsonData[0];
            const maxCols = Math.max(
              firstRow.length,
              ...jsonData.slice(0, 10).map((r) => r.length)
            );
            headers = Array.from({ length: maxCols }, (_, i) => {
              const colLetter = getColumnLetter(i);
              const headerVal = firstRow[i] !== undefined && firstRow[i] !== null && String(firstRow[i]).trim() !== ''
                ? String(firstRow[i]).trim()
                : `열 ${colLetter}`;
              return `${colLetter} (${headerVal})`;
            });
          }

          // Rows data
          const rows = jsonData.length > 1 ? jsonData.slice(1) : jsonData;

          return {
            name: sheetName,
            rowCount: Math.max(rows.length, 1),
            colCount: Math.max(headers.length, 1),
            headers: headers.length > 0 ? headers : ['A (기본열)'],
            rows
          };
        });

        const sizeFormatted = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;

        resolve({
          name: file.name,
          sizeFormatted,
          sheetCount: sheets.length,
          sheets,
          activeSheetIndex: 0
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export function performSearch(
  workbook: ExcelWorkbook,
  query: string,
  options: {
    selectedSheet: string; // 'all' or sheet name
    exactMatch: boolean;
    caseSensitive: boolean;
  }
): SearchResultCard[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: SearchResultCard[] = [];
  const targetSheets = options.selectedSheet === 'all'
    ? workbook.sheets
    : workbook.sheets.filter((s) => s.name === options.selectedSheet);

  for (const sheet of targetSheets) {
    sheet.rows.forEach((row, rowIdx) => {
      const rowNumber = rowIdx + 1; // 1-based index (data row)

      row.forEach((cellVal, colIdx) => {
        if (cellVal === null || cellVal === undefined) return;
        const strVal = String(cellVal);
        if (!strVal.trim()) return;

        let isMatch = false;
        let matchStart = -1;
        let matchEnd = -1;

        if (options.exactMatch) {
          if (options.caseSensitive) {
            isMatch = strVal === trimmed;
          } else {
            isMatch = strVal.toLowerCase() === trimmed.toLowerCase();
          }
          if (isMatch) {
            matchStart = 0;
            matchEnd = strVal.length;
          }
        } else {
          if (options.caseSensitive) {
            matchStart = strVal.indexOf(trimmed);
            isMatch = matchStart !== -1;
          } else {
            matchStart = strVal.toLowerCase().indexOf(trimmed.toLowerCase());
            isMatch = matchStart !== -1;
          }
          if (isMatch) {
            matchEnd = matchStart + trimmed.length;
          }
        }

        if (isMatch) {
          const colLetter = getColumnLetter(colIdx);
          const address = `${colLetter}${rowNumber}`;
          const prefixText = matchStart > 0 ? strVal.substring(0, matchStart) : '';
          const matchedText = strVal.substring(matchStart, matchEnd);
          const suffixText = strVal.substring(matchEnd);

          // Extract informative chips from other columns in this row
          const chips: { label: string; value: string; isHighlighted?: boolean; isBadge?: boolean }[] = [];
          
          sheet.headers.forEach((hdr, hIdx) => {
            if (hIdx === colIdx) return; // skip matched column
            const val = row[hIdx];
            if (val !== null && val !== undefined && String(val).trim() !== '') {
              const valStr = String(val).trim();
              const cleanHeader = hdr.replace(/^[A-Z]+\s*\((.*?)\)$/, '$1');
              
              if (chips.length < 3) {
                // Formatting specific tags like codes
                const isCode = /^[A-Z]{2,4}\d{3,4}$/.test(valStr);
                chips.push({
                  label: cleanHeader,
                  value: valStr,
                  isBadge: isCode
                });
              }
            }
          });

          results.push({
            id: `${sheet.name}-${rowNumber}-${colLetter}`,
            sheetName: sheet.name,
            row: rowNumber,
            col: colIdx + 1,
            colLetter,
            address,
            matchedValue: strVal,
            prefixText,
            matchedText,
            suffixText,
            formula: `"${strVal}"`,
            chips,
            rowData: row,
            rowHeaders: sheet.headers
          });
        }
      });
    });
  }

  return results;
}

export function exportResultsToCsv(results: SearchResultCard[], filename = 'search_results.csv') {
  if (results.length === 0) return;
  const headers = ['시트', '좌표', '행번호', '열', '매칭된 텍스트'];
  const rows = results.map((r) => [
    `"${r.sheetName}"`,
    `"${r.address}"`,
    r.row,
    `"${r.colLetter}"`,
    `"${r.matchedValue.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRowToCsv(rowData: (string | number | null)[], headers: string[], filename = 'row_export.csv') {
  const cleanHeaders = headers.map((h) => `"${h.replace(/"/g, '""')}"`);
  const cleanValues = rowData.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`);

  const csvContent = '\uFEFF' + [cleanHeaders.join(','), cleanValues.join(',')].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
