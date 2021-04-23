import {SignedBlock} from "@polkadot/types/interfaces";
import {SubstrateExtrinsic,SubstrateEvent} from "@subql/types";
import {Balance} from "@polkadot/types/interfaces";
import {SubstrateBlock} from "@subql/types";
import {Block} from "../types/models/Block";
import {BalanceTransfer} from "../types/models/BalanceTransfer";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    //Create a new starterEntity with ID using block hash
    let record = new Block(block.block.header.hash.toString());
    record.number = block.block.header.number.toBigInt();
    record.parentHash = block.block.header.parentHash.toString();
    record.specVersion = block.specVersion;
    await record.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [from, to, balance]}} = event;
    //Retrieve the record by its ID
    await Block.get(event.extrinsic.block.block.header.hash.toString());

    const blockNumber = event.block.block.header.number.toBigInt();
    const record = new BalanceTransfer(`${blockNumber}-${event.idx}`);
    record.from = from.toString();
    record.to = to.toString();
    //Big integer type Balance of a transfer event
    record.amount = (balance as Balance).toBigInt();
    record.blockId = event.block.block.hash.toString();
    await record.save();
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
}


