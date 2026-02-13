# Changelog

## 0.4.3 - 2026-02-13

#### Security Fix

- **Removed `@cyntler/react-doc-viewer` to fix CVE-2024-4367 (pdfjs-dist vulnerability)**
  The `@cyntler/react-doc-viewer` library had a transitive dependency on `pdfjs-dist@2.12.313` (via `react-pdf@5.7.2`), which is affected by CVE-2024-4367 — a high-severity vulnerability allowing arbitrary JavaScript execution when rendering a malicious PDF. Since upgrading the library requires Node >= 18 and React >= 18 (incompatible with this workspace), the `DocViewer` component was replaced with a direct Microsoft Office Online iframe (`https://view.officeapps.live.com/op/embed.aspx`) which provides the same XLSX preview functionality without the vulnerable dependency. The old code is commented out in `XlsPreview.js` and `XlsPreviewNew.js` for reference.

## 0.4.2 - 2025-10-31

#### Admin console

- **BUG FIXES - Update Campaign**  
  Bug Fixes related to Update campaign flow.

## 0.4.1 - 2025-10-29

#### Admin console

- **Enhanced Form Config with Navigation and Dependency Rule Support**  
  Added functionality to define and manage navigation rules and dependency fields behavior within form configurations.


## 0.4 - 2025-7-10

#### Admin console

- **Redesigned Campaign Creation Flow**  
  Improved UI/UX for campaign creation with a more intuitive, streamlined experience.

- **Introduced App Screen Configuration Feature**  
  Added a new dynamic configuration interface to manage app screens, with support for localization and modular setup.

## 0.3.1 - 2025-2-11

#### Admin console , Microplan & Payments

1. Campaign Manager Module CSS
2. Boundary Manager Module CSS
3. Microplan Module CSS
4. Payments Module CSS
5. Other Core Override CSS

## 0.3.0 - 2024-12-03

#### Base Admin console & microplan web

1. Campaign Manager Module CSS
2. Boundary Manager Module CSS
3. Microplan Module CSS
4. Other Core Override CSS

## [0.1.20]

- Updated Loader with text styles

## [0.1.1]

- Base CSS