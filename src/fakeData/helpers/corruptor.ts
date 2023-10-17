export const corruptData = (str: string, errorTypeSeed: number, indexErrorSeed: number, maxLen: number, locale: string) => {
    const errorInd = getRandomizedIndex(errorTypeSeed, 3);
    return str = injectError(str, errorInd, getRandomizedIndex(indexErrorSeed, maxLen), locale)
}

export const getRandomizedIndex = (seed: number, lenght: number) => {
    return Math.floor(seed * lenght);
}

export const removeCharInString = (str: string, index: number) => {
    return str.slice(0, index) + str.slice(index + 1);
}

export const swapChars = (str: string, index: number) => {
    const strArray = str.split('');
    let swapper = 0;

    index + 1 < strArray.length ? swapper = index + 1 : swapper = index - 1;

    var temp = strArray[index];
    strArray[index] = strArray[swapper];
    strArray[swapper] = temp;

    return strArray.toString().replaceAll(',', '');
}

const latAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
const cyrAlphabet = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЬЫЭЮЯабвгдеёжзиклмнопрстуфхцчшщъьыэюя1234567890';

export const addRandomChar = (str: string, index: number, locale: string) => {
    let alphabet = '';
    locale === 'lat' ? alphabet = latAlphabet : alphabet = cyrAlphabet;
    const seedrandom = require('seedrandom')
    var charSeedGen = seedrandom(str.length + index * 32);
    var charSeed = charSeedGen();
    let result = '';
    const char = alphabet.charAt(getRandomizedIndex(charSeed, alphabet.length));
    for (let i = 0; i < index; i++) result += str[i];
    result += char;
    for (let i = index; i < str.length; i++) result += str[i];
    return result;
}

export const injectError = (str: string, errorIndex: number, index: number, locale: string) => {
    switch(errorIndex) {
        case 0: {
            return swapChars(str, index);
        } 
        case 1: {
            return removeCharInString(str, index);
        }
        case 2: {
            return addRandomChar(str, index, locale);
        }
    }
}