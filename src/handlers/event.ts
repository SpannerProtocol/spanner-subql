import { SubstrateEvent } from '@subql/types'
import { Event } from '../types/models/Event'
import { BlockHandler } from './block'
import { ExtrinsicHandler } from "./extrinsic";
import { AccountHandler } from "./account";
import { bnToUnit } from "./utility";
import { Swap } from "../types/models/Swap";
import { Transfer } from "../types/models/Transfer";

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

        //handle account bulletTrain
        if(event.section == 'bulletTrain'){
            if(event.method == 'CreateDpo'){
                const acc = api.createType('AccountId', data[0]);
                const dpo_id = api.createType('DpoIndex', data[1]);
                await AccountHandler.updateAccountDpo(acc.toString(), dpo_id.toString());
            }else if(event.method == 'DpoTargetPurchased'){
                const buyer = api.createType('Buyer', data[1]);
                if(buyer.isPassenger){
                    const acc = api.createType('AccountId', data[0]);
                    const dpo_id = api.createType('DpoIndex', data[2]);
                    await AccountHandler.updateAccountDpo(acc.toString(), dpo_id.toString())
                }
            }else if(event.method == 'TravelCabinTargetPurchased'){
                const buyer = api.createType('Buyer', data[1]);
                if(buyer.isPassenger){
                    const acc = api.createType('AccountId', data[0]);
                    const tc_id = api.createType('TravelCabinIndex', data[2]);
                    const tc_inv_idx = api.createType('TravelCabinInventoryIndex', data[3]);
                    await AccountHandler.updateAccountTravelCabin(acc.toString(), `${tc_id}-${tc_inv_idx}`)
                }
            }
        }

        //handle swap price
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

        //handle transfer
        if(event.method == 'Transfer' || event.method == 'Transferred'){
            let t_from: string;
            let t_to: string;
            let t_tokenId: string;
            let t_amount: string;

            if(event.section == 'balances'){
                t_tokenId = 'BOLT';

                const from = api.createType('AccountId', data[0]);
                t_from = from.toString();

                const to = api.createType('AccountId', data[1]);
                t_to = to.toString();

                const amount = api.createType('Balance', data[2]);
                t_amount = amount.toString();
            }else if(event.section == 'currencies'){
                const token = api.createType('CurrencyIdOf', data[0]);
                if(token.isToken && token.asToken.isBolt){
                    //event will be captured by balances.Transfer
                    return;
                }else if(token.isToken){
                    t_tokenId = token.asToken.toString();
                }else if(token.isDexShare){
                    t_tokenId = `${token.asDexShare[0]}-${token.asDexShare[1]}`;
                }

                const from = api.createType('AccountId', data[1]);
                t_from = from.toString();

                const to = api.createType('AccountId', data[2]);
                t_to = to.toString();

                const amount = api.createType('BalanceOf', data[3]);
                t_amount = amount.toString();
            }
            await AccountHandler.ensureAccount(t_to);
            await AccountHandler.ensureAccount(t_from);
            const transfer = new Transfer(event.id);
            transfer.toId = t_to;
            transfer.fromId = t_from;
            transfer.token = t_tokenId;
            transfer.amount = t_amount;
            transfer.timestamp = timestamp;
            await transfer.save();
        }
    }
}
