/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ExcelWorkbook,
  SearchResultCard,
  ViewMode,
  ActiveTab
} from './types';
import {
  createCurriculumWorkbook,
  createLectureCatalogWorkbook
} from './data/sampleFiles';
import { performSearch } from './utils/excelParser';
import { Header } from './components/Header';
import { InitialUploadView } from './components/InitialUploadView';
import { FileStatusCard } from './components/FileStatusCard';
import { SheetSelector } from './components/SheetSelector';
import { SearchControl } from './components/SearchControl';
import { CardViewList } from './components/CardViewList';
import { TableViewDetail } from './components/TableViewDetail';
import { SheetViewerTab } from './components/SheetViewerTab';
import { SettingsTab } from './components/SettingsTab';
import { CellZoomModal } from './components/CellZoomModal';
import { JumpRowModal } from './components/JumpRowModal';
import { FileUploadModal } from './components/FileUploadModal';
import { BottomNav } from './components/BottomNav';

export default function App() {
  // Current active workbook: Starts as NULL so the user sees the upload screen first!
  const [workbook, setWorkbook] = useState<ExcelWorkbook | null>(null);
  
  // Navigation & View Modes
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Search parameters
  const [query, setQuery] = useState('교양선택');
  const [exactMatch, setExactMatch] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<string>('all');

  // Active highlighted search result for Table View
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [selectedRowNumber, setSelectedRowNumber] = useState<number>(1);

  // Freeze columns setting
  const [isFreezeColumns, setIsFreezeColumns] = useState(true);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [zoomModalCell, setZoomModalCell] = useState<{
    address: string;
    value: string;
    formula?: string;
    type: string;
  } | null>(null);
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);

  // Execute search whenever query, workbook, or options change
  const searchResults = useMemo(() => {
    if (!workbook) return [];
    return performSearch(workbook, query, {
      selectedSheet,
      exactMatch,
      caseSensitive
    });
  }, [workbook, query, selectedSheet, exactMatch, caseSensitive]);

  // Compute counts per sheet
  const sheetMatchCounts = useMemo(() => {
    if (!workbook) return {};
    const counts: Record<string, number> = {};
    for (const sheet of workbook.sheets) {
      const sheetResults = performSearch(workbook, query, {
        selectedSheet: sheet.name,
        exactMatch,
        caseSensitive
      });
      counts[sheet.name] = sheetResults.length;
    }
    return counts;
  }, [workbook, query, exactMatch, caseSensitive]);

  // Find currently active result object
  const activeResult = useMemo(() => {
    if (searchResults.length === 0) return null;
    if (activeResultId) {
      const found = searchResults.find((r) => r.id === activeResultId);
      if (found) return found;
    }
    // Default to first result
    return searchResults[0];
  }, [searchResults, activeResultId]);

  // Keep row number in sync with active result
  useEffect(() => {
    if (activeResult) {
      setSelectedRowNumber(activeResult.row);
    }
  }, [activeResult]);

  // When a workbook is loaded (either via InitialUploadView or FileUploadModal)
  const handleWorkbookLoaded = (wb: ExcelWorkbook) => {
    setWorkbook(wb);
    setActiveTab('search');

    if (wb.name === '교양교육과정.xlsx') {
      setQuery('교양선택');
      setViewMode('card');
      setSelectedRowNumber(2);
      setActiveResultId('Sheet1-2-H');
    } else if (wb.name === '2024_1학기_강의목록.xlsx') {
      setQuery('메타버스');
      setViewMode('table');
      setSelectedRowNumber(8);
      setActiveResultId('Sheet1-8-D');
    } else {
      // User uploaded custom file: find the first non-empty cell value to seed search or clear query
      const firstRow = wb.sheets[0]?.rows[0] || [];
      const sampleVal = firstRow.find((c) => String(c ?? '').trim().length >= 2);
      if (sampleVal) {
        setQuery(String(sampleVal).trim().substring(0, 5));
      } else {
        setQuery('');
      }
      setViewMode('card');
      setSelectedRowNumber(1);
    }
  };

  // Switch to sample file helper
  const handleSelectSampleWorkbook = (name: string) => {
    if (name.includes('강의목록')) {
      handleWorkbookLoaded(createLectureCatalogWorkbook());
    } else {
      handleWorkbookLoaded(createCurriculumWorkbook());
    }
  };

  // Card click handler: switches smoothly to Table View focusing on that exact result
  const handleSelectResultCard = (item: SearchResultCard) => {
    setActiveResultId(item.id);
    setSelectedRowNumber(item.row);
    setViewMode('table');
  };

  const currentSheet = workbook?.sheets[0] || {
    name: 'Sheet1',
    rowCount: 1,
    colCount: 1,
    headers: [],
    rows: []
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onOpenFileClick={() => setIsUploadModalOpen(true)}
        onProfileClick={() => setActiveTab('settings')}
      />

      {/* Main Screen Container */}
      <main className="flex flex-col relative w-full pt-16 pb-24 bg-[#f9f9ff] flex-1 max-w-2xl mx-auto px-4">
        {/* If no workbook loaded yet and on search or viewer tab, show the initial upload/drop screen */}
        {!workbook ? (
          <div className="mt-4">
            <InitialUploadView onWorkbookLoaded={handleWorkbookLoaded} />
          </div>
        ) : (
          <>
            {/* Tab 1: 검색 */}
            {activeTab === 'search' && (
              <div className="flex flex-col w-full space-y-3.5 mt-3">
                {/* File Status Card */}
                <FileStatusCard
                  workbook={workbook}
                  onSelectAnotherFile={() => setIsUploadModalOpen(true)}
                />

                {/* Sheet Selector Carousel */}
                <SheetSelector
                  sheets={workbook.sheets}
                  selectedSheet={selectedSheet}
                  onSelectSheet={(sheetName) => setSelectedSheet(sheetName)}
                  totalMatchCount={searchResults.length}
                  sheetMatchCounts={sheetMatchCounts}
                />

                {/* Search Controls (Input + Exact Match + Case Sensitive + View Toggle) */}
                <SearchControl
                  query={query}
                  onQueryChange={(val) => setQuery(val)}
                  onSearch={() => {
                    // Trigger search
                  }}
                  exactMatch={exactMatch}
                  onExactMatchChange={setExactMatch}
                  caseSensitive={caseSensitive}
                  onCaseSensitiveChange={setCaseSensitive}
                  resultCount={searchResults.length}
                  viewMode={viewMode}
                  onViewModeChange={(mode) => setViewMode(mode)}
                  fileName={workbook.name}
                />

                {/* Mode 1: Card View (Image 1) */}
                {viewMode === 'card' && (
                  <CardViewList
                    results={searchResults}
                    onSelectResult={handleSelectResultCard}
                    fileName={workbook.name}
                  />
                )}

                {/* Mode 2: Table View & Row Field Explorer (Image 2) */}
                {viewMode === 'table' && (
                  <TableViewDetail
                    activeResult={activeResult}
                    sheet={currentSheet}
                    onSelectRowNumber={(rowNum) => {
                      setSelectedRowNumber(rowNum);
                      // Check if there is a match in this row
                      const matchInRow = searchResults.find((r) => r.row === rowNum);
                      if (matchInRow) {
                        setActiveResultId(matchInRow.id);
                      }
                    }}
                    onOpenZoomModal={(cellInfo) => setZoomModalCell(cellInfo)}
                    onOpenJumpModal={() => setIsJumpModalOpen(true)}
                    isFreezeColumns={isFreezeColumns}
                    onToggleFreezeColumns={() => setIsFreezeColumns(!isFreezeColumns)}
                    query={query}
                  />
                )}
              </div>
            )}

            {/* Tab 2: Full Sheet Viewer */}
            {activeTab === 'viewer' && (
              <div className="mt-3">
                <SheetViewerTab
                  workbook={workbook}
                  onOpenZoomModal={(cellInfo) => setZoomModalCell(cellInfo)}
                  onOpenUploadModal={() => setIsUploadModalOpen(true)}
                />
              </div>
            )}
          </>
        )}

        {/* Tab 3: Settings (Always accessible) */}
        {activeTab === 'settings' && (
          <div className="mt-3">
            <SettingsTab
              workbook={workbook}
              isFreezeColumns={isFreezeColumns}
              onToggleFreezeColumns={() => setIsFreezeColumns(!isFreezeColumns)}
              onSelectSampleWorkbook={handleSelectSampleWorkbook}
              onResetWorkbook={() => {
                setWorkbook(null);
                setActiveTab('search');
              }}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        resultCountBadge={
          workbook && searchResults.length > 0
            ? searchResults.length > 99
              ? '99+'
              : String(searchResults.length)
            : undefined
        }
      />

      {/* Modals */}
      <CellZoomModal
        isOpen={Boolean(zoomModalCell)}
        onClose={() => setZoomModalCell(null)}
        cellInfo={zoomModalCell}
      />

      <JumpRowModal
        isOpen={isJumpModalOpen}
        onClose={() => setIsJumpModalOpen(false)}
        maxRow={currentSheet.rowCount}
        currentRow={selectedRowNumber}
        onJump={(rowNum) => {
          setSelectedRowNumber(rowNum);
          const matchInRow = searchResults.find((r) => r.row === rowNum);
          if (matchInRow) {
            setActiveResultId(matchInRow.id);
          }
        }}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentWorkbookName={workbook?.name || ''}
        onWorkbookLoaded={handleWorkbookLoaded}
      />
    </div>
  );
}
