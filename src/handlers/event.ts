import { SubstrateEvent } from '@subql/types'
import { Event } from '../types/models/Event'
import { BlockHandler } from './block'
import { Dispatcher } from '../helpers/dispatcher'
import {ExtrinsicHandler} from "./extrinsic";

type EventDispatch = Dispatcher<SubstrateEvent>

export class EventHandler {
    private readonly event: SubstrateEvent
    private dispatcher: EventDispatch

    constructor(event: SubstrateEvent) {
        this.event = event
        this.dispatcher = new Dispatcher<SubstrateEvent>()

        this.registerDispatcherHandler()
    }

    private registerDispatcherHandler () {
        this.dispatcher.batchRegist([ ])
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
        event.extrinsicId = this.event?.extrinsic?.extrinsic?.hash?.toString();

        await this.dispatcher.dispatch(
            `${this.event.event.section}-${this.event.event.method}`,
            this.event
        );

        await event.save()
    }
}
