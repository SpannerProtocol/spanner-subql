import { Pair } from '../types';
import { PairHourData } from '../types';

async function getTradingPairId(
  token1: string,
  token2: string,
): Promise<string> {
  const tradingPair = await api.query.dex.tradingPairStatuses.entries();
  for (const pair of tradingPair) {
    const tokenA = pair[0].args[0][0].asToken.toString();
    const tokenB = pair[0].args[0][1].asToken.toString();
    if (
      (token1 == tokenA && token2 == tokenB) ||
      (token2 == tokenA && token1 == tokenB)
    ) {
      return `${tokenA}-${tokenB}`;
    }
  }
  return `${token1}-${token2}`;
}

export class dexPairHandler {
  static async ensureDexPair(tokenA: string, tokenB: string): Promise<Pair> {
    let id = `${tokenA}-${tokenB}`;
    let pair = await Pair.get(id);
    if (!pair) {
      id = await getTradingPairId(tokenA, tokenB);
      const [token1, token2] = id.split('-');
      pair = new Pair(id);
      pair.token1 = token1;
      pair.poolAmount1 = BigInt(0);
      pair.token2 = token2;
      pair.poolAmount2 = BigInt(0);
      await pair.save();
    }
    return pair;
  }

  static async getPairByTokens(token1: string, token2: string): Promise<Pair> {
    return await this.ensureDexPair(token1, token2);
  }

  static async updatePairHourData(
    token1: string,
    token2: string,
    timestamp: bigint,
  ): Promise<PairHourData> {
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
    await pairHourData.save();
    return pairHourData;
  }
}
