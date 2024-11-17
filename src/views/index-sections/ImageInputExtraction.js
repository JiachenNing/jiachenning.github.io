import * as XLSX from 'xlsx';
import { HangzhouLogic } from './HangzhouLogic';
import { XiantaoLogic } from './XiantaoLogic';
import { HuzhouLogic } from './HuzhouLogic';

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

          const text = `亿泰货品清单	2024.11.04	
箱装	箱规	
序号	品名	件数	箱装数	毛重	总重量	净重	总重量	长	宽	高	立方数	批号	
（kg）	（kg）	（kg）	（kg）	（月）	
（件）	（只/件）	（cm）	（cm）	（cm）	
1	21白双	190	2000	7.1	1349	6.5	1235	57	29	36	11.31	20240726	
2	21白双	1214	2000	7.1	8619	6.5	7891	57	29	36	72.24	20241009	
3	21兰双	160	2000	7.1	1136	6.5	1040	57	29	36	9.52	20241009	
4	无纺布印花鞋套	300	1000	6	1800	5.1	1530	43	29	33	12.35	241009	
5	绑带口罩	200	1000	5	1000	4.4	880	39	22	52	8.92	241009	
6	40g隔离衣	900	100	9	8100	8.4	7560	56	27	30.5	41.50	24091902	
7	23g隔离衣	1500	100	4.9	7350	4.5	6750	32.5	27	30.5	40.15	24100901	
8	40g针织袖口	700	100	9.2	6440	8.6	6020	58	27	30	32.89	241009	
9	0	0	0.00	
10	0	0	0.00	
总件数（件）：	5164	合计毛重（kg）：	35794	合计净重（kg）：	32906	合计立方数（月）：	228.875	`;

          // Step 1: Clean the input string by replacing \t, \r, and \n with spaces
          // e.g. "2024年装柜数据\t\r\n每箱重量\t平均每箱\t箱规\t\r\n业务员\t装柜日\t发票号\t产品编号\t生产数量\t（箱）\t发货数量\t（箱）
          const cleanedInput = text.replace(/[\t\r\n]+/g, ' ');

          // Step 2: Split the cleaned input into an array of words
          const words = cleanedInput.split(/\s+/);
          console.log('words', words);

          let products = [];
          switch (selectedOption) {
            case "浙江杭州":
              products = HangzhouLogic(words);
              break;
            case "湖北仙桃":
              products = XiantaoLogic(words);
              break;
            case "浙江湖州":
              products = HuzhouLogic(words);
              break;
            default:
              products = [];
              break;
          }

          console.log(products);
          exportToExcel(products);

        } catch (error) {
          console.error('Error:', error);
        }
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

      // // Step 2: Structure the data for Excel
      // const sheetString = dataRows.join("\n")
      // console.log(sheetString);

      // Step 3: Create a worksheet and workbook
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
                disabled={selectedOption == ""}
            />
        </div>
      );
};

export default ImageInputExtraction;