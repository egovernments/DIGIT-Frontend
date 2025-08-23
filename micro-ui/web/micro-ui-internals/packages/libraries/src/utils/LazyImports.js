/**
 * Lazy Import Utilities for Heavy Dependencies
 * This module provides lazy loading for heavy dependencies to reduce initial bundle size
 * Dependencies are only loaded when actually needed
 */

// Cache for loaded modules to avoid duplicate imports
const moduleCache = {};

/**
 * Generic lazy loader with caching
 * @param {string} moduleName - Name of the module to load
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise} Promise resolving to the module
 */
const lazyLoad = async (moduleName, importFn) => {
  if (moduleCache[moduleName]) {
    return moduleCache[moduleName];
  }
  
  try {
    const module = await importFn();
    moduleCache[moduleName] = module.default || module;
    return moduleCache[moduleName];
  } catch (error) {
    console.error(`❌ Failed to load ${moduleName}:`, error.message || error);
    throw error;
  }
};

/**
 * PDF Generation Utilities
 * Loads pdfmake only when PDF generation is needed
 */
export const loadPDFMake = async () => {
  return lazyLoad('pdfmake', () => import(/* webpackChunkName: "pdfmake" */ 'pdfmake/build/pdfmake'));
};

export const loadPDFVFS = async () => {
  return lazyLoad('pdfmake-vfs', () => import(/* webpackChunkName: "pdfmake-vfs" */ 'pdfmake/build/vfs_fonts'));
};

/**
 * Excel Processing Utilities
 * Loads xlsx only when Excel export/import is needed
 */
export const loadXLSX = async () => {
  return lazyLoad('xlsx', () => import(/* webpackChunkName: "xlsx" */ 'xlsx'));
};

/**
 * Image Capture Utilities
 * Loads html2canvas or dom-to-image only when screenshot features are needed
 */
export const loadHTML2Canvas = async () => {
  return lazyLoad('html2canvas', () => import(/* webpackChunkName: "html2canvas" */ 'html2canvas'));
};

export const loadDomToImage = async () => {
  return lazyLoad('dom-to-image', () => import(/* webpackChunkName: "dom-to-image" */ 'dom-to-image'));
};

/**
 * Utility function to generate PDF with lazy loading
 * @param {Object} docDefinition - PDF document definition
 * @returns {Promise} Promise resolving to PDF document
 */
export const generatePDF = async (docDefinition) => {
  const pdfMake = await loadPDFMake();
  const vfsFonts = await loadPDFVFS();
  
  if (vfsFonts && vfsFonts.pdfMake) {
    pdfMake.vfs = vfsFonts.pdfMake.vfs;
  }
  
  return pdfMake.createPdf(docDefinition);
};

/**
 * Utility function to export to Excel with lazy loading
 * @param {Array} data - Data to export
 * @param {string} filename - Output filename
 * @returns {Promise} Promise resolving when export is complete
 */
export const exportToExcel = async (data, filename = 'export.xlsx') => {
  const XLSX = await loadXLSX();
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  XLSX.writeFile(workbook, filename);
};

/**
 * Utility function to capture screenshot with lazy loading
 * @param {HTMLElement} element - Element to capture
 * @param {Object} options - Capture options
 * @returns {Promise} Promise resolving to canvas or data URL
 */
export const captureScreenshot = async (element, options = {}) => {
  const html2canvas = await loadHTML2Canvas();
  return html2canvas(element, options);
};

/**
 * Alternative screenshot capture using dom-to-image
 * @param {HTMLElement} element - Element to capture
 * @param {string} format - Output format (png, jpeg, svg)
 * @returns {Promise} Promise resolving to data URL
 */
export const captureAsPNG = async (element) => {
  const domtoimage = await loadDomToImage();
  return domtoimage.toPng(element);
};

export const captureAsJPEG = async (element, quality = 0.95) => {
  const domtoimage = await loadDomToImage();
  return domtoimage.toJpeg(element, { quality });
};

export const captureAsSVG = async (element) => {
  const domtoimage = await loadDomToImage();
  return domtoimage.toSvg(element);
};