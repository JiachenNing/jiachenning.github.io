import React, { useEffect } from 'react';
import { openDB } from 'idb';
import * as XLSX from 'xlsx';

function UploadTemplate() {
  useEffect(() => {
    // Initialize IndexedDB
    const initDB = async () => {
      const db = await openDB('TemplateDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('templates')) {
            db.createObjectStore('templates', { keyPath: 'id' });
          }
        },
      });
      return db;
    };
    initDB();
  }, []);

  // Handle file upload and store in IndexedDB
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target.result;

      const db = await openDB('TemplateDB', 1);
      await db.put('templates', {
        id: 'userTemplate',
        name: file.name,
        data: fileData,
      });
      alert("Template uploaded and saved successfully!");
    };
    reader.readAsArrayBuffer(file);
  };

  const appendToLastSheetAndDownload2 = async (appendString) => {
    const db = await openDB('TemplateDB', 1);
    const template = await db.get('templates', 'userTemplate');
  
    if (!template) {
      alert("No template found!");
      return;
    }
  
    // Load workbook from ArrayBuffer
    const workbook = XLSX.read(new Uint8Array(template.data), { type: "array", cellStyles: true });
  
    // Get the last sheet in the workbook
    const sheetNames = workbook.SheetNames;
    const lastSheetName = sheetNames[sheetNames.length - 1];
    const lastSheet = workbook.Sheets[lastSheetName];
  
    // Find the next empty row
    const range = XLSX.utils.decode_range(lastSheet['!ref']);
    let nextRow = range.e.r + 1; // Start at the first empty row
  
    // Split the string into rows and columns
    const rows = appendString.split("\n");
    rows.forEach((row, rowIndex) => {
      const cells = row.split(",");
      cells.forEach((cellValue, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: nextRow + rowIndex, c: colIndex });
  
        // Only add a cell if there's content, leaving blank cells as needed
        if (cellValue !== "") {
          lastSheet[cellAddress] = { v: cellValue.trim() };
        }
      });
    });
  
    // Update the sheet range
    range.e.r = nextRow + rows.length - 1;
    lastSheet['!ref'] = XLSX.utils.encode_range(range);
  
    // Create a new ArrayBuffer from the updated workbook
    const updatedWorkbookArrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
    const blob = new Blob([updatedWorkbookArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
  
    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = template.name; // Use the original filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  // Append string to the last sheet and download
  const appendToLastSheetAndDownload = async (appendString) => {
    const db = await openDB('TemplateDB', 1);
    const template = await db.get('templates', 'userTemplate');

    if (!template) {
      alert("No template found!");
      return;
    }

    // Load workbook from ArrayBuffer
    const workbook = XLSX.read(new Uint8Array(template.data), { type: "array" });

    // Get the last sheet in the workbook
    const sheetNames = workbook.SheetNames;
    const lastSheetName = sheetNames[sheetNames.length - 1];
    const lastSheet = workbook.Sheets[lastSheetName];

    // Find the next empty row and append the string
    const range = XLSX.utils.decode_range(lastSheet['!ref']);
    const nextRow = range.e.r + 1; // Get the next row index
    const cellAddress = XLSX.utils.encode_cell({ r: nextRow, c: 0 }); // Cell address in column A
    lastSheet[cellAddress] = { v: appendString };

    // Update the sheet range
    range.e.r = nextRow;
    lastSheet['!ref'] = XLSX.utils.encode_range(range);

    // Create a new ArrayBuffer from the updated workbook
    const updatedWorkbookArrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([updatedWorkbookArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = template.name; // Original filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <input
        type="file"
        id="template-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <button onClick={() => document.getElementById('template-upload').click()}>
        Upload Template
      </button>
      <button
        onClick={() => appendToLastSheetAndDownload2("test text")}
        style={{ marginLeft: '10px' }}
      >
        Append and Download Template
      </button>
    </div>
  );
}

export default UploadTemplate;
