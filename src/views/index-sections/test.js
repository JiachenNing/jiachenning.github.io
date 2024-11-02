import {
    Button
  } from "reactstrap";
import * as XLSX from 'xlsx';
import { keywords, rawData } from './itemList';

const Test = () => {
    const extractText = async (file) => {
        // const fileInput = document.getElementById('fileInput');
        // const file = fileInput.files[0];
      
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
          // const response = await fetch('https://api.ocr.space/parse/image', {
          //   method: 'POST',
          //   body: formData,
          // });
      
          // if (!response.ok) {
          //   throw new Error('OCR request failed!');
          // }
      
          // const result = await response.json();
          // const text = result?.ParsedResults?.[0]?.ParsedText;

          // console.log(result);
          // console.log(text);

          const text = `生产数量 发货数量	2024年装柜数据	每箱重量	箱规													
          业务员	装柜日	发票号	产品编号	（箱）	（箱）	平均每箱	重量	总毛重	净重	总体积	备注					
          1	2	3	4	5	长	宽	高									
          30*60蓝	210	210	4.02	4.08	4.02	4.04	848	756	32	32	33	7.1				
          30*60白	60	60	4.08	4.06	4.06	4.07	244	216	32	32	33	2.03				
          3421宁继宏	日期：2024-04															
          30*30黄	100	100	4.1	4.06	4.06	4.07	407	360	32	32	33	3.38	LOT:042024			
          黄银燕	8月27日															
          30*30紅	120	120	4	4.02	4. 04	4.02	482	432	32	32	33	4.06				
          3420宁继宏	30*33红/卷	350	350	6.25	6.2	6.25	6.23	2181	1663	49	33	31.5	17.83	日期：2024-04		
          LOT: 042024																
          3446宁继宏	3038白色网孔	4389	744	5.16	5.16	5.22	5.18	3854	3393	40	32	36	34.28	LOT: 082024	日期：2024-08	
          1584	8016	6820	68.68`												

          // Step 1: Clean the input string by replacing \t, \r, and \n with spaces
          // e.g. "2024年装柜数据\t\r\n每箱重量\t平均每箱\t箱规\t\r\n业务员\t装柜日\t发票号\t产品编号\t生产数量\t（箱）\t发货数量\t（箱）
          const cleanedInput = text.replace(/[\t\r\n]+/g, ' ');

          // Step 2: Split the cleaned input into an array of words
          const words = cleanedInput.split(/\s+/);
          console.log('words', words);

          const products = [];
          if (words.includes("生产数量")) {
            // 一个产品会有11个数值
            for (let i = 0; i < words.length; i++) {
              const index = keywords.indexOf(words[i]);
              if (index != -1) {
                // Extract the next 11 values after the keyword
                const nextValues = words.slice(i + 1, i + 12);
                if (nextValues.length === 11) {
                  // Create a Product object and add it to the list
                  products.push(createProduct2(nextValues, rawData[index]));
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
                if (nextValues.length === 12) {
                  // Create a Product object and add it to the list
                  products.push(createProduct(nextValues, rawData[index]));
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
      
    const createProduct = (values, data) => ({
      productName: data.productSize,
      engName: data.productName,
      origin: '',
      hsCode: '',
      rate: '13%',
      count: values[0],
      number: values[0],
      weight1: values[6],
      weight2: values[7],
      volume: values[11],
      unit: data.rate,
      total: data.rate * Number(values[0])
    });

    // 没有生产数量
    const createProduct2 = (values, data) => ({
      productName: data.productSize,
      engName: data.productName,
      origin: '',
      hsCode: '',
      rate: '13%',
      count: values[0],
      number: values[0],
      weight1: values[5],
      weight2: values[6],
      volume: values[10],
      unit: data.rate,
      total: data.rate * Number(values[0])
    });
        
    function exportToExcel(products) {
      // Fixed header row
      const headerRow = [`	9/13/24												
SHIPPER	NINGBO CHINA-BASE IMPORT AND EXPORT CO., LTD.						合同号		 				
	宁波中基进出口有限公司						发票号码		ZJ24-0571				
	ROOM608, 6 F CHINA-BASE PLAZA, NO.666 TIANTONG SOUTH ROAD, NINGBO, CHINA						信用证号						
	 						报关金额		 				
CONSIGNEE	GLOBEMED CARE LLC						贸易方式		G.T.				
	OFFICE NO.407,						产地						
	FRIJ MURRAR,						收汇方式		T/T				
	P.O.BOX 231146 DUBAI,U.A.E						委托书号						
NOTIFY PARTY	GLOBEMED CARE LLC						起运港		NINGBO				
	SHOW ROOM-2,BLOCK 2						目的港		UMM AL QUWAIN				
	INDUSTRIAL AREA NO.18，						运费		美金	$2,170.00	人民币		¥2,900.00
	SHARJAH, U.A.E.						价格条款		 				
中文品名	DESCRIPTION	境内货源地	H.S.CODE	退税率	箱数CTNS	数量	数量  单位	重量KGS		体积CBM	单价USD		总价USD
								毛重	净重				`];

      const dataRows = products.map(item => [
        item.productName,  
        item.engName,
        item.origin,
        item.hsCode,
        item.rate,
        item.count,  
        item.number,
        item.weight1,  
        item.weight2,  
        item.volume,
        item.unit,
        item.total 
      ]);

      // Step 2: Structure the data for Excel
      // Combine header row and rows with only the keys
      const sheetData = [
        headerRow,
        ...dataRows
      ];

      console.log(sheetData);

      // Step 3: Create a worksheet and workbook
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
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

export default Test;