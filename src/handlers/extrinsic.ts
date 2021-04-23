import { SubstrateExtrinsic } from '@subql/types'
import { checkIfExtrinsicExecuteSuccess } from '../helpers/extrinsic'
import { Extrinsic } from '../types/models/Extrinsic'
import { BlockHandler } from './block'

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
        const record = new Extrinsic(this.extrinsic?.extrinsic?.hash?.toString())
        const blockHash = this.extrinsic?.block?.block?.hash?.toString();
        await BlockHandler.ensureBlock(blockHash)

        record.method = this.extrinsic.extrinsic.method.method;
        record.section = this.extrinsic.extrinsic.method.section;
        record.args = this.extrinsic?.extrinsic?.args?.toString();
        record.signer = this.extrinsic?.extrinsic?.signer?.toString();
        record.nonce = this.extrinsic?.extrinsic?.nonce?.toBigInt() || BigInt(0);
        record.isSigned = this.extrinsic.extrinsic.isSigned;
        record.timestamp = this.extrinsic.block.timestamp
        record.signature = this.extrinsic.extrinsic.signature.toString()
        record.tip = this.extrinsic.extrinsic.tip.toBigInt() || BigInt(0)
        record.isSuccess = checkIfExtrinsicExecuteSuccess(this.extrinsic)
        record.blockId = blockHash;

        await record.save()
    }
}
