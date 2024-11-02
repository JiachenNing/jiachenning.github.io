import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { Jimp } from 'jimp';
import { Buffer } from 'buffer';

const ImageToTable = () => {
  const [worker, setWorker] = useState(null); // Store worker globally in state
  const [isWorkerReady, setIsWorkerReady] = useState(false); // Track worker readiness
  const [tableData, setTableData] = useState([]); // Store table data
  const [imageBuffer, setImageBuffer] = useState(null);

  // Initialize the worker on component mount
  useEffect(() => {
    const initWorker = async () => {
      try {
        const workerInstance = await createWorker('chi_sim+eng');
        setWorker(workerInstance); // Store worker globally in state
        setIsWorkerReady(true); // Mark worker as ready
        console.log('Worker initialized successfully');
      } catch (error) {
        console.error('Worker Initialization Error:', error);
      }
    };

    initWorker();

    // Cleanup: Terminate worker on component unmount
    return () => {
      if (worker) {
        worker.terminate();
        console.log('Worker terminated');
      }
    };
  }, []); // Run once on mount

  const preprocessImage = async (imageBuffer) => {
    try {
      // Use Jimp to read and process the image buffer
      const image = await Jimp.read(imageBuffer);
      console.log('Image:', image);
  
      // Perform any preprocessing here (resize, grayscale, etc.)
      // image.resize(800, Jimp.AUTO); // Example resize
      image.grayscale(); // Example grayscale
  
      // Convert the processed image back to a buffer if needed
      const processedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      setImageBuffer(processedBuffer);
  
      // Now you can use the processed buffer for OCR or other purposes
      console.log('Image processed successfully');
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result); // The result will be an ArrayBuffer
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    });
  };

  const extractText = async (file) => {
    if (!isWorkerReady) {
      console.log('Worker is not ready yet');
      return;
    }

    try {
      if (file) {
        // const arrayBuffer = await readFileAsArrayBuffer(file);
        // const uint8Array = new Uint8Array(arrayBuffer);
        // const buffer = Buffer.from(uint8Array);
        // console.log("MMMMM", buffer);
        // await preprocessImage(buffer);
        
        // const { data: { text } } = await worker.recognize(imagefileBuffer);
        // const { data: { text } } = await worker.recognize(file, 'eng+chi_sim');
        const { data: { text } } = await worker.recognize(file, 'custom', {
          langPath: '/path/to/traineddata/'  // Path to the traineddata file
        });
        
        console.log('Extracted Text:', text);
        
        // Parse the extracted text into a structured format
        // const parsedData = parseTextToTable(text);
        const parsedData = processTableText(text, 18);

        console.log('Table Text:', parsedData);
        setTableData(parsedData); // Store the parsed data in state
      }
      
    } catch (error) {
      console.error('OCR Error:', error);
    }
  };

  const parseTextToTable = (text) => {
    const rows = text.split('\n'); // Split text into rows by line
    const table = rows.map(row => row.split(/\s+/)); // Split each row into columns
    return table; // Return the parsed table data
  };

  function processTableText(text, columnCount) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const rows = lines.map(line => line.split(/\s+/)); // Split by whitespace
  
    // Validate and correct row structure
    return rows.map(row => {
      if (row.length < columnCount) {
        // Pad missing columns with empty strings
        return row.concat(Array(columnCount - row.length).fill(''));
      } else if (row.length > columnCount) {
        // Trim extra columns
        return row.slice(0, columnCount);
      }
      return row;
    });
  }

  // Render UI
  return (
    <div>
      <h1>照片转换</h1>
      {!isWorkerReady ? (
        <p>正在加载转换器，请稍等...</p>
      ) : (
        <p>请选择上传照片</p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => extractText(e.target.files[0])}
        disabled={!isWorkerReady}
      />

      {/* Display the extracted table */}
      {tableData.length > 0 && (
        <table>
          <thead>
            <tr>
              {tableData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ImageToTable;