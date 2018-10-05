// padStart is not natively implemented in Android RN yet.
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

const upcA = {
    quietZone: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    start: [1, 0, 1],
    left: {
        0: [0, 0, 0, 1, 1, 0, 1],
        1: [0, 0, 1, 1, 0, 0, 1],
        2: [0, 0, 1, 0, 0, 1, 1],
        3: [0, 1, 1, 1, 1, 0, 1],
        4: [0, 1, 0, 0, 0, 1, 1],
        5: [0, 1, 1, 0, 0, 0, 1],
        6: [0, 1, 0, 1, 1, 1, 1],
        7: [0, 1, 1, 1, 0, 1, 1],
        8: [0, 1, 1, 0, 1, 1, 1],
        9: [0, 0, 0, 1, 0, 1, 1]
    },
    middle: [0, 1, 0, 1, 0],
    right: {
        0: [1, 1, 1, 0, 0, 1, 0],
        1: [1, 1, 0, 0, 1, 1, 0],
        2: [1, 1, 0, 1, 1, 0, 0],
        3: [1, 0, 0, 0, 0, 1, 0],
        4: [1, 0, 1, 1, 1, 0, 0],
        5: [1, 0, 0, 1, 1, 1, 0],
        6: [1, 0, 1, 0, 0, 0, 0],
        7: [1, 0, 0, 0, 1, 0, 0],
        8: [1, 0, 0, 1, 0, 0, 0],
        9: [1, 1, 1, 0, 1, 0, 0]
    },
    end: [1, 0, 1]
};

const upcE = {
    start: [1, 0, 1],
    end: [0, 1, 0, 1, 0, 1],
    odd: {
        0: [0, 0, 0, 1, 1, 0, 1],
        1: [0, 0, 1, 1, 0, 0, 1],
        2: [0, 0, 1, 0, 0, 1, 1],
        3: [0, 1, 1, 1, 1, 0, 1],
        4: [0, 1, 0, 0, 0, 1, 1],
        5: [0, 1, 1, 0, 0, 0, 1],
        6: [0, 1, 0, 1, 1, 1, 1],
        7: [0, 1, 1, 1, 0, 1, 1],
        8: [0, 1, 1, 0, 1, 1, 1],
        9: [0, 0, 0, 1, 0, 1, 1]
    },
    even: {
        0: [0, 1, 0, 0, 1, 1, 1],
        1: [0, 1, 1, 0, 0, 1, 1],
        2: [0, 0, 1, 1, 0, 1, 1],
        3: [0, 1, 0, 0, 0, 0, 1],
        4: [0, 0, 1, 1, 1, 0, 1],
        5: [0, 1, 1, 1, 0, 0, 1],
        6: [0, 0, 0, 0, 1, 0, 1],
        7: [0, 0, 1, 0, 0, 0, 1],
        8: [0, 0, 0, 1, 0, 0, 1],
        9: [0, 0, 1, 0, 1, 1, 1]
    }
};

const validateData = (data) => {
    if (!data) {
        throw 'Must submit data to be encoded.'
    }

    if (data.length > 12) {
        throw 'UPC data max length of 11 (12 with check digit) exceeded.'
    }

    if (!/^[0-9]/.test(data)) {
        throw 'UPC data must be numeric.'
    }

    return data;
};

const multiplyOddsByThree = (index, value) => index % 2 != 0 ? value * 3 : value;

const generateCheckDigit = (number) => {
    const sum = number
        .split('')
        .map((digit, index) => multiplyOddsByThree(index, Number(digit)))
        .reduce((curr, acc) => acc + curr);

    const checkDigit = sum % 10;

    if (checkDigit !== 0) {
        return `${number}${10 - checkDigit}`;
    }

    return `${number}${checkDigit}`;
};

const encodeUpcA = (data) => {
    let encodedData = [],
        paddedData,
        dataToEncode;

    paddedData = data.padStart(11, '0');

    dataToEncode = paddedData.length < 12 ? generateCheckDigit(paddedData) : paddedData;

    upcA.quietZone.map(i => encodedData.push(i));
    upcA.start.map(i => encodedData.push(i));

    for (let i = 0; i < 6; i++) {
        upcA.left[dataToEncode[i]].map(i => encodedData.push(i));
    }

    upcA.middle.map(i => encodedData.push(i));

    for (let i = 6; i < 12; i++) {
        upcA.right[dataToEncode[i]].map(i => encodedData.push(i));
    }

    upcA.end.map(i => encodedData.push(i));
    upcA.quietZone.map(i => encodedData.push(i));

    return encodedData;
};

export const formats = {
    UPC_A: 'UPC_A'
};

export const encodeData = (data, format) => format === formats.UPC_A ? encodeUpcA(validateData(data)) : null;
