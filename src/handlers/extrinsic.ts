import { SubstrateExtrinsic } from '@subql/types'
import { checkIfExtrinsicExecuteSuccess } from './utility'
import { Extrinsic } from '../types/models/Extrinsic'
import { BlockHandler } from './block'
import { AccountHandler } from "./account";

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
        const args = this.extrinsic?.extrinsic?.args;
        await BlockHandler.ensureBlock(blockHash)
        await AccountHandler.ensureAccount(signer)

        record.method = this.extrinsic.extrinsic.method.method;
        record.section = this.extrinsic.extrinsic.method.section;
        record.args = args?.toString();
        record.nonce = this.extrinsic?.extrinsic?.nonce?.toString();
        record.signerId = signer;
        record.isSigned = this.extrinsic.extrinsic.isSigned;
        record.timestamp = this.extrinsic.block.timestamp;
        record.signature = this.extrinsic.extrinsic.signature.toString();
        record.tip = this.extrinsic.extrinsic.tip.toString();
        record.isSuccess = checkIfExtrinsicExecuteSuccess(this.extrinsic);
        record.blockId = blockHash;
        await record.save()
    }
}
