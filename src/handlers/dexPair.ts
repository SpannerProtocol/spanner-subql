import {Pair} from "../types/models/Pair";
import {PairHourData} from "../types/models/PairHourData";

async function getTradingPairId(token1: string, token2: string): Promise<string> {
    const tradingPair = await api.query.dex.tradingPairStatuses.entries();
    for (const [tp, v] of tradingPair) {
        const tokenA = tp.args[0][0].asToken.toString();
        const tokenB = tp.args[0][1].asToken.toString();
        if((token1.localeCompare(tokenA)==0 && token2.localeCompare(tokenB)==0) ||
            (token2.localeCompare(tokenA)==0 && token1.localeCompare(tokenB)==0)){
            return `${tokenA}-${tokenB}`;
        }
    }
    return `${token1}-${token2}`;
}

export class dexPairHandler {
    static async ensureDexPair(id: string): Promise<void> {
        const pair = await Pair.get(id)
        if (!pair) {
            const [token1, token2] = id.split('-');
            const pair = new Pair(id);
            pair.token1 = token1;
            pair.poolAmount1 = BigInt(0);
            pair.token2 = token2;
            pair.poolAmount2 = BigInt(0);
            await pair.save();
        }
    }

    static async getPairByTokens(token1: string, token2: string): Promise<Pair> {
        let id = `${token1}-${token2}`;
        const pair = await Pair.get(id);
        if(!pair){
            id = await getTradingPairId(token1, token2);
        }
        await this.ensureDexPair(id);
        return await Pair.get(id);
    }

    static async updatePairHourData(token1: string, token2: string, timestamp: bigint){
        const pair = await this.getPairByTokens(token1, token2);
        const hourIndex = timestamp / BigInt(3600);
        const hourStartTime = hourIndex * BigInt(3600);
        const hourPairId = pair.id.concat('-', hourIndex.toString());
        let pairHourData = await PairHourData.get(hourPairId);
        if (!pairHourData) {
            pairHourData = new PairHourData(hourPairId);
            pairHourData.hourStartTime = hourStartTime;
            pairHourData.pairId = pair.id;
            pairHourData.hourlyVolumeToken1 = BigInt(0);
            pairHourData.hourlyVolumeToken2 = BigInt(0);
            pairHourData.hourlyTxns = BigInt(0);
        }
        pairHourData.poolAmount1 = pair.poolAmount1;
        pairHourData.poolAmount2 = pair.poolAmount2;
        pairHourData.hourlyTxns += BigInt(1);
        await pairHourData.save();
        return pairHourData;
    }
}
