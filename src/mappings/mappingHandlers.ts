import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types';
import { SubstrateBlock } from '@subql/types';
import { BlockHandler } from '../handlers/block';
import { EventHandler } from '../handlers/event';
import { ExtrinsicHandler } from '../handlers/extrinsic';

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const handler = new BlockHandler(block);
  await handler.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const handler = new EventHandler(event);
  await handler.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const extrinsicHandler = new ExtrinsicHandler(extrinsic);
  await extrinsicHandler.save();
}
