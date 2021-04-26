import { SubstrateExtrinsic } from '@subql/types'
import { checkIfExtrinsicExecuteSuccess } from '../helpers/extrinsic'
import { Extrinsic } from '../types/models/Extrinsic'
import { BlockHandler } from './block'
import { AccountHandler } from "./account";
import { Transfer } from "../types/models/Transfer";
import { CurrencyIdOf } from "../spanner-interfaces";

export class ExtrinsicHandler {
    private readonly extrinsic: SubstrateExtrinsic

    static async ensureExtrinsic(id: string): Promise<void> {
        const extrinsic = await Extrinsic.get(id)

        if (!extrinsic) {
            await new Extrinsic(id).save()
        }
    }

    constructor(extrinsic: SubstrateExtrinsic) {
        this.extrinsic = extrinsic
    }

    public async save () {
        const extrinsicHash = this.extrinsic?.extrinsic?.hash.toString();
        const record = new Extrinsic(extrinsicHash)
        const blockHash = this.extrinsic?.block?.block?.hash?.toString();
        const signer = this.extrinsic?.extrinsic?.signer?.toString();
        await BlockHandler.ensureBlock(blockHash)
        await AccountHandler.ensureAccount(signer)

        record.method = this.extrinsic.extrinsic.method.method;
        record.section = this.extrinsic.extrinsic.method.section;
        record.args = this.extrinsic?.extrinsic?.args?.toString();
        record.nonce = this.extrinsic?.extrinsic?.nonce?.toBigInt() || BigInt(0);
        record.signerId = signer;
        record.isSigned = this.extrinsic.extrinsic.isSigned;
        record.timestamp = this.extrinsic.block.timestamp
        record.signature = this.extrinsic.extrinsic.signature.toString()
        record.tip = this.extrinsic.extrinsic.tip.toBigInt() || BigInt(0)
        record.isSuccess = checkIfExtrinsicExecuteSuccess(this.extrinsic)
        record.blockId = blockHash;
        await record.save()

        //handle transfer
        if (record.method == 'transfer'){
            const transfer = new Transfer(record.id);
            let t_to: string;
            let t_tokenId: string;
            let t_amount: bigint;
            if(record.section == 'currencies'){
                const args = this.extrinsic?.extrinsic?.args;
                //parse destination
                const dest = api.createType('LookupSource', args[0]);
                t_to = dest.toString();
                //parse currency
                const token: CurrencyIdOf = api.createType('CurrencyIdOf', args[1]);
                if(token.isToken){
                    t_tokenId = token.asToken.toString();
                }else if(token.isDexShare){
                    t_tokenId = `${token.asDexShare[0]}-${token.asDexShare[1]}`;
                }
                //parse amount
                const amount = api.createType('Compact<BalanceOf>', args[2]);
                t_amount = amount.toBigInt();
            }else if(record.section == 'balances'){
                const args = this.extrinsic?.extrinsic?.args;
                //parse destination
                const dest = api.createType('LookupSource', args[0]);
                t_to = dest.toString();
                //parse amount
                const amount = api.createType('Compact<BalanceOf>', args[1]);
                t_amount = amount.toBigInt();
                //native currency transfer
                t_tokenId = 'BOLT';
            }
            await AccountHandler.ensureAccount(t_to);
            transfer.toId = t_to;
            transfer.fromId = record.signerId;
            transfer.token = t_tokenId;
            transfer.amount = t_amount;
            transfer.extrinsicId = record.id;
            transfer.timestamp = record.timestamp;
            transfer.isSuccess = record.isSuccess;
            await transfer.save();
        }
    }
}
