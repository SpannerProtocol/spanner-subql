import { SubstrateBlock } from '@subql/types'
import { getBlockTimestamp } from '../helpers/block'
import { Block } from '../types/models/Block'

export class BlockHandler {
    private block: SubstrateBlock

    static async ensureBlock (id: string): Promise<void> {
        const block = await Block.get(id)
        if (!block) {
            await new Block(id).save()
        }
    }

    static async getTimestamp(id: string): Promise<Date> {
        const block = await Block.get(id)
        return block.timestamp;
    }

    constructor(block: SubstrateBlock) {
        this.block = block
    }

    public async save () {
        const block = new Block(this.block.block.hash.toString());
        block.number = this.block.block.header.number.toString();
        block.specVersion = this.block.specVersion;
        block.parentHash = this.block.block.header.parentHash.toString();
        block.timestamp = getBlockTimestamp(this.block.block);
        await block.save()
    }
}
