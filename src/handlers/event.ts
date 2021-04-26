import { SubstrateEvent } from '@subql/types'
import { Event } from '../types/models/Event'
import { BlockHandler } from './block'
import { ExtrinsicHandler } from "./extrinsic";

export class EventHandler {
    private readonly event: SubstrateEvent
    constructor(event: SubstrateEvent) {
        this.event = event
    }

    public async save () {
        const blockNumber = this.event.block.block.header.number.toBigInt();
        const blockHash = this.event.block.block.hash.toString();
        const event = new Event(`${blockNumber}-${this.event.idx}`)
        await BlockHandler.ensureBlock(blockHash)

        const extrinsicHash = this.event?.extrinsic?.extrinsic?.hash?.toString();
        if (extrinsicHash && extrinsicHash !== 'null') {
            await ExtrinsicHandler.ensureExtrinsic(extrinsicHash)
        }

        event.index = this.event.idx
        event.section = this.event.event.section
        event.method = this.event.event.method;
        event.data = this.event.event.data.toString();
        event.blockId = blockHash;
        event.extrinsicId = extrinsicHash;
        await event.save()

        //todo: update accounts
        if(event.section == 'bulletTrain'){
            if(event.method == 'CreateDpo'){

            }else if(event.method == 'DpoTargetPurchased'){

            }
        }

        //todo: update price
        if(event.section == 'dex' && event.method == 'Swap'){

        }
    }
}
