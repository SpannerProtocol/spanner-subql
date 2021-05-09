import { Pair } from '../types';
import { PairHourData } from '../types';
import { bnToUnit } from './utility';

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
  static async ensureDexPair(id: string): Promise<void> {
    const pair = await Pair.get(id);
    if (!pair) {
      const [token1, token2] = id.split('-');
      const new_pair = new Pair(id);
      new_pair.token1 = token1;
      new_pair.poolAmount1 = BigInt(0);
      new_pair.token2 = token2;
      new_pair.poolAmount2 = BigInt(0);
      return await new_pair.save();
    }
  }

  static async getPairByTokens(token1: string, token2: string): Promise<Pair> {
    const id = await getTradingPairId(token1, token2);
    await this.ensureDexPair(id);
    return await Pair.get(id);
  }

  static async ensurePairHourData(
    hourId: string,
    pair: Pair,
    startTime: bigint,
  ): Promise<void> {
    let pairHourData = await PairHourData.get(hourId);
    if (!pairHourData) {
      pairHourData = new PairHourData(hourId);
      pairHourData.hourStartTime = startTime;
      pairHourData.pairId = pair.id;
      pairHourData.hourlyVolumeToken1 = BigInt(0);
      pairHourData.hourlyVolumeToken2 = BigInt(0);
      pairHourData.hourlyTxns = BigInt(0);
    }
    pairHourData.poolAmount1 = pair.poolAmount1;
    pairHourData.poolAmount2 = pair.poolAmount2;

    const amount1 = bnToUnit(pair.poolAmount1, api.registry.chainDecimals[0]);
    const amount2 = bnToUnit(pair.poolAmount2, api.registry.chainDecimals[0]);
    if (amount1 > 0 && amount2 > 0) {
      pairHourData.price = (amount2 / amount1).toFixed(6).toString();
    } else {
      pairHourData.price = '0';
    }

    return await pairHourData.save();
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
    await this.ensurePairHourData(hourPairId, pair, hourStartTime);
    return await PairHourData.get(hourPairId);
  }
}
