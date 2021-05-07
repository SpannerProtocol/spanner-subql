// Auto-generated , DO NOT EDIT
import { Entity } from '@subql/types';
import assert from 'assert';

export class Pair implements Entity {
  constructor(id: string) {
    this.id = id;
  }

  public id: string;

  public token1: string;

  public poolAmount1: bigint;

  public token2: string;

  public poolAmount2: bigint;

  async save(): Promise<void> {
    const id = this.id;
    assert(id !== null, 'Cannot save Pair entity without an ID');
    await store.set('Pair', id.toString(), this);
  }
  static async remove(id: string): Promise<void> {
    assert(id !== null, 'Cannot remove Pair entity without an ID');
    await store.remove('Pair', id.toString());
  }

  static async get(id: string): Promise<Pair | undefined> {
    assert(
      id !== null && id !== undefined,
      'Cannot get Pair entity without an ID',
    );
    const record = await store.get('Pair', id.toString());
    if (record) {
      return Pair.create(record);
    } else {
      return;
    }
  }

  static create(record) {
    const entity = new Pair(record.id);
    Object.assign(entity, record);
    return entity;
  }
}
