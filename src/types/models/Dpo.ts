// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class Dpo implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public events?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Dpo entity without an ID");
        await store.set('Dpo', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Dpo entity without an ID");
        await store.remove('Dpo', id.toString());
    }

    static async get(id:string): Promise<Dpo | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Dpo entity without an ID");
        const record = await store.get('Dpo', id.toString());
        if (record){
            return Dpo.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new Dpo(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
