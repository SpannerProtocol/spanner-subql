import * as BN from 'bn.js';
import { Block } from '@polkadot/types/interfaces/runtime';
import {SubstrateExtrinsic} from "@subql/types";

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

export const getBlockTimestamp = (block: Block): bigint => {
    const extrinsicForSetTimestamp = block.extrinsics.find((item) => {
        return item.method.method === 'set'
            && item.method.section === 'timestamp'
    })
    if (extrinsicForSetTimestamp) {
        return BigInt(extrinsicForSetTimestamp?.args?.[0].toString()) / BigInt(1000)
    }
    return BigInt(0)
}

export const checkIfExtrinsicExecuteSuccess = (extrinsic: SubstrateExtrinsic): boolean => {
    const { events } = extrinsic
    return !events.find((item) => {
        const { event: { method, section }} = item
        return method === 'ExtrinsicFailed' && section === 'system'
    })
}
