/**
 * Tests unitaires pour le Grid Engine
 */

import { 
  computeTracks, 
  pxToColLine, 
  pxToRowLine, 
  snapItemLines,
  validateTracks,
  type GridSpec 
} from './gridEngine';

describe('Grid Engine', () => {
  describe('computeTracks', () => {
    test('calcule correctement les tracks avec fr égaux', () => {
      const spec: GridSpec = {
        colsFr: [1, 1, 1],
        rowsFr: [1, 1],
        gapX: 10,
        gapY: 10,
        padding: 20,
        containerW: 300,
        containerH: 200,
      };
      
      const tracks = computeTracks(spec);
      
      // innerW = 300 - 2*20 = 260 (gap non soustrait)
      expect(tracks.innerW).toBe(260);
      // innerH = 200 - 2*20 = 160 (gap non soustrait)
      expect(tracks.innerH).toBe(160);
      
      // colPx = [86.67, 86.67, 86.67] (260/3 pour chaque)
      expect(tracks.colPx[0]).toBeCloseTo(86.67, 1);
      expect(tracks.colPx[1]).toBeCloseTo(86.67, 1);
      expect(tracks.colPx[2]).toBeCloseTo(86.67, 1);
      
      // rowPx = [80, 80] (160/2 pour chaque)
      expect(tracks.rowPx[0]).toBe(80);
      expect(tracks.rowPx[1]).toBe(80);
      
      // colLines = [0, 86.67, 173.33, 260] (sans gap)
      expect(tracks.colLines[0]).toBe(0);
      expect(tracks.colLines[1]).toBeCloseTo(86.67, 1);
      expect(tracks.colLines[2]).toBeCloseTo(173.33, 1);
      expect(tracks.colLines[3]).toBeCloseTo(260, 1);
      
      // Validation
      expect(validateTracks(spec, tracks)).toBe(true);
    });
    
    test('calcule correctement les tracks avec fr différents', () => {
      const spec: GridSpec = {
        colsFr: [1, 2, 1],
        rowsFr: [1, 1],
        gapX: 16,
        gapY: 8,
        padding: 16,
        containerW: 400,
        containerH: 200,
      };
      
      const tracks = computeTracks(spec);
      
      // innerW = 400 - 2*16 = 368 (gap non soustrait)
      expect(tracks.innerW).toBe(368);
      
      // Sum colsFr = 4, donc 1fr = 368/4 = 92
      // colPx = [92, 184, 92]
      expect(tracks.colPx[0]).toBe(92);
      expect(tracks.colPx[1]).toBe(184);
      expect(tracks.colPx[2]).toBe(92);
      
      // colLines = [0, 92, 276, 368] (sans gap dans le calcul)
      expect(tracks.colLines[0]).toBe(0);
      expect(tracks.colLines[1]).toBe(92);   // 0 + 92
      expect(tracks.colLines[2]).toBe(276);  // 92 + 184
      expect(tracks.colLines[3]).toBe(368);  // 276 + 92
    });
  });
  
  describe('pxToColLine', () => {
    test('trouve la ligne la plus proche', () => {
      const colLines = [0, 100, 200, 300];
      
      expect(pxToColLine(0, colLines)).toBe(0);
      expect(pxToColLine(50, colLines)).toBe(0);
      expect(pxToColLine(80, colLines)).toBe(1);
      expect(pxToColLine(150, colLines)).toBe(1);
      expect(pxToColLine(170, colLines)).toBe(2);
      expect(pxToColLine(300, colLines)).toBe(3);
    });
  });
  
  describe('pxToRowLine', () => {
    test('trouve la ligne la plus proche', () => {
      const rowLines = [0, 75, 150];
      
      expect(pxToRowLine(0, rowLines)).toBe(0);
      expect(pxToRowLine(40, rowLines)).toBe(0);
      expect(pxToRowLine(60, rowLines)).toBe(1);
      expect(pxToRowLine(110, rowLines)).toBe(1);
      expect(pxToRowLine(140, rowLines)).toBe(2);
    });
  });
  
  describe('snapItemLines', () => {
    test('snap avec span minimum de 1', () => {
      const result = snapItemLines(2.4, 4.6, 12);
      expect(result.start).toBe(2);
      expect(result.end).toBe(5);
      expect(result.end - result.start).toBeGreaterThanOrEqual(1);
    });
    
    test('clamp aux bornes', () => {
      const result = snapItemLines(0, 15, 12);
      expect(result.start).toBe(1);
      expect(result.end).toBe(13);
    });
    
    test('garantit span minimum', () => {
      const result = snapItemLines(3, 3, 12);
      expect(result.end - result.start).toBe(1);
    });
  });
});

