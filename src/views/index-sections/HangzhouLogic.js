import { keywords, rawData } from './itemList';
import { 
    isNumericStringArray, 
    roundToFixedDecimals, 
    getHsCode, 
    roundToDecimals 
} from './SharedUtils';

// logic for 浙江杭州
export function HangzhouLogic(words) {
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
    return products;

    function createProduct(values, data, isLong) {
        return {
            productName: data.officialChineseName,
            engName: data.officialEnglishName,
            origin: "浙江杭州",
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
          }
        }
}