import { keywords, rawData } from './itemList';
import { 
    isNumericStringArray, 
    roundToFixedDecimals, 
    getHsCode, 
    roundToDecimals 
} from './SharedUtils';

// logic for 湖北仙桃
export function XiantaoLogic(words) {
    const products = [];
    
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
    return products;

    function createProduct(values, data) {
        return {
            productName: data.officialChineseName,
            engName: data.productName,
            origin: "浙江湖州",
            hsCode: getHsCode(data.officialChineseName),
            rate: '13%',
            // 箱数
            count: values[0],
            // 数量  (箱数 * perCarton)
            number: roundToDecimals(Number(values[0]) * data.perCarton, 2),
            // 数量 单位
            unit: data.unit,
            // 毛重
            weight1: values[3],
            // 净重
            weight2: values[5],
            // 体积CBM
            volume: values[9],
            // 单价USD
            unitPrice: data.rate,
            // 单价 单位
            unitSlash: "/" + data.unit,
            // 总价USD (单价USD * 数量)
            total: roundToFixedDecimals(Number(data.rate) * Number(values[0]) * data.perCarton, 2)
          }
    }
}