import { Account } from '../types';

export class AccountHandler {
  static async ensureAccount(id: string): Promise<Account> {
    let account = await Account.get(id);
    if (!account) {
      account = new Account(id);
      await account.save();
    }
    return account;
  }

  static async updateAccountDpo(id: string, dpo_id: string) {
    const account = await this.ensureAccount(id);
    if (account.dpos && !account.dpos.split(',').includes(dpo_id)) {
      account.dpos = account.dpos.concat(',', dpo_id);
    } else {
      account.dpos = dpo_id;
    }
    await account.save();
  }

  static async updateAccountTravelCabin(id: string, cabin_id: string) {
    const account = await this.ensureAccount(id);
    if (
      account.travelCabins &&
      !account.travelCabins.split(',').includes(cabin_id)
    ) {
      account.travelCabins = account.travelCabins.concat(',', cabin_id);
    } else {
      account.travelCabins = cabin_id;
    }
    await account.save();
  }

  //updated by extrinsic call
  //referrer in args of call and referee is signer of call
  static async updateAccountReferee(id: string, referee_id: string) {
    if (id.length > 0 && referee_id.length > 0 && id !== referee_id) {
      const account = await this.ensureAccount(id);
      if (
        account.referees &&
        !account.referees.split(',').includes(referee_id)
      ) {
        account.referees = account.referees.concat(',', referee_id);
      } else {
        account.referees = referee_id;
      }
      await account.save();
    }
  }

  static async updateAccount(id: string, data: Record<string, any>) {
    const account = await this.ensureAccount(id);
    Object.keys(data).forEach((key, value) => {
      account[key] = value;
    });
    await account.save();
  }
}
