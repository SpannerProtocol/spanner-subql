import { SubstrateEvent } from '@subql/types'
import { Event } from '../types/models/Event'
import { BlockHandler } from './block'
import { ExtrinsicHandler } from "./extrinsic";
import { AccountHandler } from "./account";
import { bnToUnit } from "../helpers/utility";
import {Swap} from "../types/models/Swap";

export class EventHandler {
    private readonly event: SubstrateEvent
    constructor(event: SubstrateEvent) {
        this.event = event
    }

    public async save () {
        const blockNumber = this.event.block.block.header.number.toString();
        const blockHash = this.event.block.block.hash.toString();
        const event = new Event(`${blockNumber}-${this.event.idx}`);
        const data = this.event.event.data;
        await BlockHandler.ensureBlock(blockHash)
        const timestamp = await BlockHandler.getTimestamp(blockHash);

        const extrinsicHash = this.event?.extrinsic?.extrinsic?.hash?.toString();
        if (extrinsicHash && extrinsicHash !== 'null') {
            await ExtrinsicHandler.ensureExtrinsic(extrinsicHash)
        }

        event.index = this.event.idx
        event.section = this.event.event.section
        event.method = this.event.event.method;
        event.data = data.toString();
        event.blockId = blockHash;
        event.extrinsicId = extrinsicHash;
        await event.save()

        //todo: update accounts
        if(event.section == 'bulletTrain'){
            if(event.method == 'CreateDpo'){

            }else if(event.method == 'DpoTargetPurchased'){

        if(event.section == 'dex' && event.method == 'Swap'){
            const chain_decimal = api.registry.chainDecimals[0];
            const path = api.createType('Vec<CurrencyId>', data[1]);
            const amount1 = api.createType('Balance', data[2]);
            const amount2 = api.createType('Balance', data[3]);

            const swap = new Swap(event.id);

            const n_amount1 = bnToUnit(amount1.toBn(), chain_decimal);
            const n_amount2 = bnToUnit(amount2.toBn(), chain_decimal);
            const price = n_amount2 / n_amount1;

            swap.price = price.toString();
            swap.timestamp = timestamp;
            swap.token1 = path[0].asToken.toString();
            swap.token2 = path[path.length - 1].asToken.toString();
            swap.tokenAmount1 = amount1.toString();
            swap.tokenAmount2 = amount2.toString();
            await swap.save();
        }
    }
}
