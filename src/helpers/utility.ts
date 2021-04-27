import * as BN from 'bn.js';

export function bnToUnit(num: BN, chainDecimals: number): number {
    const numStr = num.toString();
    if (numStr.length > chainDecimals) {
        const integer = numStr.substr(0, numStr.length - chainDecimals);
        const decimal = numStr.substr(numStr.length - chainDecimals);
        return parseFloat(integer + '.' + decimal);
    } else {
        return num.toNumber() / 10 ** chainDecimals;
    }
}
