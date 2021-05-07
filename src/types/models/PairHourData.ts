// Auto-generated , DO NOT EDIT
import { Entity } from '@subql/types';
import assert from 'assert';

export class PairHourData implements Entity {
  constructor(id: string) {
    this.id = id;
  }

  public id: string;

  public hourStartTime: bigint;

  public pairId: string;

  public poolAmount1: bigint;

  public poolAmount2: bigint;

  public hourlyVolumeToken1: bigint;

  public hourlyVolumeToken2: bigint;

  public hourlyTxns: bigint;

  async save(): Promise<void> {
    const id = this.id;
    assert(id !== null, 'Cannot save PairHourData entity without an ID');
    await store.set('PairHourData', id.toString(), this);
  }
  static async remove(id: string): Promise<void> {
    assert(id !== null, 'Cannot remove PairHourData entity without an ID');
    await store.remove('PairHourData', id.toString());
  }

  static async get(id: string): Promise<PairHourData | undefined> {
    assert(
      id !== null && id !== undefined,
      'Cannot get PairHourData entity without an ID',
    );
    const record = await store.get('PairHourData', id.toString());
    if (record) {
      return PairHourData.create(record);
    } else {
      return;
    }
  }

  static create(record) {
    const entity = new PairHourData(record.id);
    Object.assign(entity, record);
    return entity;
  }
}
