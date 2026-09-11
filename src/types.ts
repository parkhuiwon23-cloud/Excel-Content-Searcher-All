export interface SheetColumn {
  index: number;
  letter: string;
  name: string;
}

export interface CellData {
  address: string; // e.g., "D8"
  colLetter: string; // e.g., "D"
  colIndex: number; // 0-based
  rowIndex: number; // 1-based (Excel convention)
  value: string;
  formattedValue?: string;
  formula?: string;
  type?: 'text' | 'number' | 'date' | 'formula';
}

export interface Sheet {
  name: string;
  rowCount: number;
  colCount: number;
  headers: string[]; // header names for col A, B, C...
  rows: (string | number | null)[][];
}

export interface ExcelWorkbook {
  name: string;
  sizeFormatted: string;
  sheetCount: number;
  sheets: Sheet[];
  activeSheetIndex: number;
}

export interface SearchResultCard {
  id: string;
  sheetName: string;
  row: number; // 1-based
  col: number; // 1-based
  colLetter: string;
  address: string; // e.g. "H2", "D8"
  matchedValue: string;
  prefixText?: string;
  matchedText: string;
  suffixText?: string;
  formula?: string;
  chips: {
    label: string;
    value: string;
    isHighlighted?: boolean;
    isBadge?: boolean;
  }[];
  rowData: (string | number | null)[];
  rowHeaders: string[];
  isBookmarked?: boolean;
}

export type ViewMode = 'card' | 'table';
export type ActiveTab = 'search' | 'viewer' | 'settings';
