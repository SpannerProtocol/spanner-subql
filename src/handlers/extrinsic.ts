import { SubstrateExtrinsic } from '@subql/types';
import { checkIfExtrinsicExecuteSuccess } from './utility';
import { Extrinsic } from '../types';
import { BlockHandler } from './block';
import { AccountHandler } from './account';

export class ExtrinsicHandler {
  private readonly extrinsic: SubstrateExtrinsic;

  static async ensureExtrinsic(id: string): Promise<void> {
    const extrinsic = await Extrinsic.get(id);
    if (!extrinsic) {
      await new Extrinsic(id).save();
    }
  }

  constructor(extrinsic: SubstrateExtrinsic) {
    this.extrinsic = extrinsic;
  }

  public async save() {
    const extrinsicHash = this.extrinsic?.extrinsic?.hash.toString();
    const extrinsic = new Extrinsic(extrinsicHash);
    const blockHash = this.extrinsic?.block?.block?.hash?.toString();
    const signer = this.extrinsic?.extrinsic?.signer?.toString();
    const args = this.extrinsic?.extrinsic?.args;
    await BlockHandler.ensureBlock(blockHash);
    await AccountHandler.ensureAccount(signer);

    extrinsic.method = this.extrinsic.extrinsic.method.method;
    extrinsic.section = this.extrinsic.extrinsic.method.section;
    extrinsic.args = args?.toString();
    extrinsic.nonce = this.extrinsic?.extrinsic?.nonce?.toBigInt();
    extrinsic.signerId = signer;
    extrinsic.isSigned = this.extrinsic.extrinsic.isSigned;
    const timestampStr = this.extrinsic.block.timestamp.getTime().toString();
    extrinsic.timestamp = BigInt(
      timestampStr.slice(0, timestampStr.length - 3),
    );
    extrinsic.signature = this.extrinsic.extrinsic.signature.toString();
    extrinsic.tip = this.extrinsic.extrinsic.tip.toBigInt();
    extrinsic.isSuccess = checkIfExtrinsicExecuteSuccess(this.extrinsic);
    extrinsic.blockId = blockHash;
    await extrinsic.save();

    if (extrinsic.isSuccess) {
      //handle account referee
      if (extrinsic.section == 'bulletTrain') {
        if (extrinsic.method == 'createDpo') {
          await AccountHandler.updateAccountReferee(args[6].toString(), signer);
        } else if (extrinsic.method == 'passengerBuyDpoSeats') {
          await AccountHandler.updateAccountReferee(args[2].toString(), signer);
        }
      }
    }
  }
}
