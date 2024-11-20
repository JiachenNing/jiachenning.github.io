import { hsCode } from './itemHsCode';

// sometimes values can contain text, because text recognition sometimes ignores 0
export function isNumericStringArray(arr) {
    return arr.every(item => typeof item === 'string' && !isNaN(item) && item.trim() !== '');
}

export function getHsCode(itemName) {
    for (const [code, items] of hsCode) {
        if (items.includes(itemName)) {
        return code;
        }
    }
    return "";
}  

// return a string (without 0 at the end)
export function roundToDecimals(value, decimal = 2) {
    return Number(value.toFixed(decimal));
}

// fixed 2 decimal places (with 0 at the end)
export function roundToFixedDecimals(value, decimal) {
    return `${value.toFixed(decimal)}`;
}
