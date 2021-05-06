import {Account} from "../types/models/Account"

export class AccountHandler {
    static async ensureAccount(id: string): Promise<void> {
        const account = await Account.get(id)
        if (!account) {
            return new Account(id).save()
        }
    }

    static async getAccountById(id: string): Promise<Account> {
        await this.ensureAccount(id)
        return await Account.get(id)
    }

    static async updateAccountDpo(id: string, dpo_id: string){
        const account = await this.getAccountById(id);
        if(account.dpos){
            const dpos = account.dpos.split(',');
            if (!dpos.includes(dpo_id)){
                account.dpos = account.dpos.concat(',', dpo_id);
            }
        }else{
            account.dpos = dpo_id;
        }
        await account.save();
    }

    static async updateAccountTravelCabin(id: string, cabin_id: string){
        const account = await this.getAccountById(id);
        if(account.travelCabins){
            const travelCabins = account.travelCabins.split(',');
            if (!travelCabins.includes(cabin_id)) {
                account.travelCabins = account.travelCabins.concat(',', cabin_id)
            }
        }else{
            account.travelCabins = cabin_id;
        }
        await account.save();
    }

    static async updateAccount(id: string, data: Record<string, any>) {
        const account = await this.getAccountById(id)
        Object.keys(data).forEach((key, value) => {
            account[key] = value
        })
        await account.save()
    }
}
