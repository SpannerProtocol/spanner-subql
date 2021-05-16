import { Account } from '../types';

export class AccountHandler {
  static async ensureAccount(id: string): Promise<void> {
    const account = await Account.get(id);
    if (!account) {
      return new Account(id).save();
    }
  }

  static async getAccountById(id: string): Promise<Account> {
    await this.ensureAccount(id);
    return await Account.get(id);
  }

  static async updateAccountDpo(id: string, dpo_id: string) {
    const account = await this.getAccountById(id);
    if (account.dpos) {
      const data = account.dpos.split(',');
      if (data.includes(dpo_id)) return;
      data.push(dpo_id);
      account.dpos = data.join(',');
    } else {
      account.dpos = dpo_id;
    }
    await account.save();
  }

  static async updateAccountTravelCabin(id: string, cabin_id: string) {
    const account = await this.getAccountById(id);
    if (account.travelCabins) {
      const data = account.travelCabins.split(',');
      if (data.includes(cabin_id)) return;
      data.push(cabin_id);
      account.travelCabins = data.join(',');
    } else {
      account.travelCabins = cabin_id;
    }
    await account.save();
  }

  //updated by extrinsic call
  //referrer in args of call and referee is signer of call
  static async updateAccountReferee(id: string, referee_id: string) {
    if (id.length > 0 && referee_id.length > 0 && id !== referee_id) {
      const account = await this.getAccountById(id);
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
    const account = await this.getAccountById(id);
    Object.keys(data).forEach((key, value) => {
      account[key] = value;
    });
    await account.save();
  }
}
