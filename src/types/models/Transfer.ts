// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Transfer implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public eventId: string;

    public timestamp: bigint;

    public fromId: string;

    public toId: string;

    public token: string;

    public amount: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Transfer entity without an ID");
        await store.set('Transfer', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Transfer entity without an ID");
        await store.remove('Transfer', id.toString());
    }

    static async get(id:string): Promise<Transfer | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Transfer entity without an ID");
        const record = await store.get('Transfer', id.toString());
        if (record){
            return Transfer.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Transfer(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
