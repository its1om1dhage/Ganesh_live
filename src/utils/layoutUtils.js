// This file contains the screen-aware mosaic layout algorithm,
// now updated with a failsafe to guarantee every photo is placed.

const getGridDimensions = (photoCount, width, height) => {
  if (photoCount === 0) return { cols: 1, rows: 1 };
  const screenArea = width * height;
  const idealCellArea = screenArea / (photoCount * 0.9);
  const idealCellSide = Math.sqrt(idealCellArea);

  let cols = Math.max(3, Math.floor(width / idealCellSide));
  let rows = Math.max(3, Math.floor(height / idealCellSide));
  
  cols = Math.min(cols, 12);
  rows = Math.min(rows, 12);
  
  return { cols, rows };
};

export const generateFullscreenMosaic = (photos, viewportWidth, viewportHeight) => {
  const photoCount = photos.length;
  if (photoCount === 0) return { layouts: [], gridCols: 1, gridRows: 1 };

  let { cols: gridCols, rows: gridRows } = getGridDimensions(photoCount, viewportWidth, viewportHeight);
  const layouts = [];
  const occupiedCells = new Set();
  
  const patterns = [
    { r: 2, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 1 }, { r: 1, c: 1 },
    { r: 2, c: 3 }, { r: 3, c: 2 }
  ];

  for (let i = 0; i < photoCount; i++) {
    const photo = photos[i];
    const aspectRatio = photo.width / photo.height;
    const isLandscape = aspectRatio > 1.3;
    const isPortrait = aspectRatio < 0.7;

    let bestPattern = { r: 1, c: 1 };
    if (isLandscape) bestPattern = { r: 1, c: 2 };
    if (isPortrait) bestPattern = { r: 2, c: 1 };
    if (!isLandscape && !isPortrait) bestPattern = { r: 2, c: 2 };
    
    let position = findBestFit(bestPattern, gridCols, gridRows, occupiedCells);

    if (!position) {
      position = findBestFit({ r: 1, c: 1 }, gridCols, gridRows, occupiedCells);
    }
    
    // NEW: The Failsafe Mechanism
    // If there is absolutely no space left, dynamically add a new row to the grid.
    if (!position) {
      gridRows++; // Expand the grid
      position = findBestFit({ r: 1, c: 1 }, gridCols, gridRows, occupiedCells);
      // This will always find a spot in the new row.
    }
    
    if (position) {
      layouts.push({ ...position, rowSpan: position.pattern.r, colSpan: position.pattern.c });
      for (let r = position.row; r < position.row + position.pattern.r; r++) {
        for (let c = position.col; c < position.col + position.pattern.c; c++) {
          occupiedCells.add(`${r}-${c}`);
        }
      }
    }
  }
  // We return the potentially expanded grid dimensions
  return { layouts, gridCols, gridRows };
};

// Helper function to find a position for a pattern
function findBestFit(pattern, gridCols, gridRows, occupiedCells) {
  for (let r = 1; r <= gridRows; r++) {
    for (let c = 1; c <= gridCols; c++) {
      if (canPlace(pattern, r, c, gridCols, gridRows, occupiedCells)) {
        return { row: r, col: c, pattern };
      }
    }
  }
  return null;
}

// Helper function to check if a pattern can be placed at a specific spot
function canPlace(pattern, row, col, gridCols, gridRows, occupiedCells) {
  if (row + pattern.r - 1 > gridRows || col + pattern.c - 1 > gridCols) {
    return false;
  }
  for (let r_offset = 0; r_offset < pattern.r; r_offset++) {
    for (let c_offset = 0; c_offset < pattern.c; c_offset++) {
      if (occupiedCells.has(`${row + r_offset}-${col + c_offset}`)) {
        return false;
      }
    }
  }
  return true;
}