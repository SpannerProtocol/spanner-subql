import {Account} from "../types"

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
        if(!account.dpos.includes(dpo_id)){
            account.dpos.push(dpo_id)
            await account.save();
        }
    }

    static async updateAccountTravelCabin(id: string, cabin_id: string){
        const account = await this.getAccountById(id);
        if(!account.travelCabins.includes(cabin_id)){
            account.travelCabins.push(cabin_id)
            await account.save();
        }
    }

    static async updateAccountReferee(id: string, referee_id){
        const account = await this.getAccountById(id);
        if(!account.refereesId.includes(referee_id)){
            account.refereesId.push(referee_id)
            await account.save();
        }
    }

    static async updateAccount(id: string, data: Record<string, any>) {
        const account = await this.getAccountById(id)
        Object.keys(data).forEach((key, value) => {
            account[key] = value
        })
        await account.save()
    }
}
