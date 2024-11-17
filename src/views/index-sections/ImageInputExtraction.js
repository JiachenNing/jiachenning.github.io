import {
    Button
  } from "reactstrap";
import * as XLSX from 'xlsx';
import { keywords, rawData } from './itemList';
import { hsCode } from './itemHsCode';

const ImageInputExtraction = ({ selectedOption }) => {
    const extractText = async (file) => {
        if (!file) {
          alert('Please select a file.');
          return;
        }
      
        const formData = new FormData();
        formData.append('file', file); // File from input
        formData.append('language', 'chs'); // Language parameter
        formData.append('isOverlayRequired', 'false'); // Optional: controls text overlay
        formData.append('apikey', 'K86074657288957'); // Replace with your OCR.space API key
        formData.append('scale', 'true'); // optional? 
        formData.append('isTable', 'true'); // must have!
        formData.append('OCREngine', '2');
      
        try {
          const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
          });
      
          if (!response.ok) {
            throw new Error('OCR request failed!');
          }
      
          const result = await response.json();
          const text = result?.ParsedResults?.[0]?.ParsedText;

          console.log(result);
          console.log(text);

//           const text = `生产数量 发货数量	2024年装柜数据	每箱重量	箱规	•	
// 业务员	装柜日	发票号	产品编号	（箱）	（箱）	平均每箱	重量	总毛重	净重	总体积	备注	
// 1	2	3	4	5	长	宽	高	
// 30*60蓝	631	200	8.06	8.30	7.44	7.93	1586	1440	62	32	33	13.09	
// 30*60白	287	17	8.10	7.90	7.90	7.97	135	122	62	32	36	1.21	
// 黄银燕	库存	3426宁继宏	日期:2024-05	
// 30*60红	469	119	8.42	8.06	7.27	7.92	942	857	62	32	33	7.79	LOT:052024	
// 30*60绿	300	8.00	7.96	8.08	8.01	62	32	33	0.00	
// 336	22.10	
// 黄银燕	库存	3446宁继宏	3038白色网孔	4389	1114	5.16	5.16	5.22	5.18	5771	5080	40	32	36	51.33	日期:2024-08	
// L.or:082024	`;

          // Step 1: Clean the input string by replacing \t, \r, and \n with spaces
          // e.g. "2024年装柜数据\t\r\n每箱重量\t平均每箱\t箱规\t\r\n业务员\t装柜日\t发票号\t产品编号\t生产数量\t（箱）\t发货数量\t（箱）
          const cleanedInput = text.replace(/[\t\r\n]+/g, ' ');

          // Step 2: Split the cleaned input into an array of words
          const words = cleanedInput.split(/\s+/);
          console.log('words', words);

          const products = [];
          if (!words.includes("生产数量")) {
            // 一个产品会有11个数值
            for (let i = 0; i < words.length; i++) {
              // if Chinese name is in the list of 中文品名
              const index = keywords.indexOf(words[i]);
              if (index != -1) {
                // Extract the next 11 values after the keyword
                const nextValues = words.slice(i + 1, i + 12);
                if (nextValues.length === 11 && isNumericStringArray(nextValues)) {
                  // Create a Product object and add it to the list
                  // false means 没有生产数量
                  products.push(createProduct(nextValues, rawData[index], false));
                }
              }
            }
          } else {
            // 一个产品会有12个数值
            for (let i = 0; i < words.length; i++) {
              const index = keywords.indexOf(words[i]);
              if (index != -1) {
                // Extract the next 12 values after the keyword
                const nextValues = words.slice(i + 1, i + 13);
                if (nextValues.length === 12 && isNumericStringArray(nextValues)) {
                  // Create a Product object and add it to the list
                  products.push(createProduct(nextValues, rawData[index], true));
                }
              }
            }
          }
          console.log(products);
          exportToExcel(products);

        } catch (error) {
          console.error('Error:', error);
        }
      }
      
    const createProduct = (values, data, isLong) => ({
      productName: data.officialChineseName,
      engName: data.productName,
      origin: selectedOption,
      hsCode: getHsCode(data.officialChineseName),
      rate: '13%',
      // 箱数
      count: values[0],
      // 数量  (箱数 * perCarton)
      number: roundToDecimals(Number(values[0]) * data.perCarton, 2),
      // 数量 单位
      unit: data.unit,
      // 毛重
      weight1: isLong ? values[6] : values[5],
      // 净重
      weight2: isLong ? values[7] : values[6],
      // 体积CBM
      volume: isLong ? values[11] : values[10],
      // 单价USD
      unitPrice: data.rate,
      // 单价 单位
      unitSlash: "/" + data.unit,
      // 总价USD (单价USD * 数量)
      total: roundToFixedDecimals(Number(data.rate) * Number(values[0]) * data.perCarton, 2)
    });

    // sometimes values can contain text, because text recognition sometimes ignores 0
    function isNumericStringArray(arr) {
      return arr.every(item => typeof item === 'string' && !isNaN(item) && item.trim() !== '');
    }

    function getHsCode(itemName) {
      for (const [code, items] of hsCode) {
        if (items.includes(itemName)) {
          return code;
        }
      }
      return "";
    }  
    
    // return a string (without 0 at the end)
    function roundToDecimals(value, decimal) {
      return Number(value.toFixed(decimal));
    }

    // fixed 2 decimal places (with 0 at the end)
    function roundToFixedDecimals(value, decimal) {
      return `${value.toFixed(decimal)}`;
    }

    function exportToExcel(products) {
      const dataRows = products.map(item => [
        item.productName,  
        item.engName,
        item.origin,
        item.hsCode,
        item.rate,
        item.count,
        item.number,
        item.unit,
        item.weight1,  
        item.weight2,  
        item.volume,
        item.unitPrice,
        item.unitSlash,
        item.total 
      ]);

      // Step 2: Structure the data for Excel
      // const sheetString = dataRows.join("\n")

      // console.log(sheetString);

      // // Step 3: Create a worksheet and workbook
      const ws = XLSX.utils.aoa_to_sheet(dataRows);
      const wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "出口货物明细单（报关不用");

      // Step 4: Export the workbook to an Excel file
      XLSX.writeFile(wb, "ProductData.xlsx");
    }

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => extractText(e.target.files[0])}
                disabled={false}
            />
        </div>
      );
};

export default ImageInputExtraction;