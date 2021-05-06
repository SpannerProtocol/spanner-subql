import {Pair} from "../types/models/Pair";
import {PairHourData} from "../types/models/PairHourData";

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

    static async getPairById(id: string): Promise<Pair> {
        await this.ensureDexPair(id);
        return await Pair.get(id);
    }

    static async updatePairHourData(pair_id: string, timestamp: bigint){
        const pair = await this.getPairById(pair_id);
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
