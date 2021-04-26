// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class TravelCabin implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public targetingId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save TravelCabin entity without an ID");
        await store.set('TravelCabin', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove TravelCabin entity without an ID");
        await store.remove('TravelCabin', id.toString());
    }

    static async get(id:string): Promise<TravelCabin>{
        assert(id !== null, "Cannot get TravelCabin entity without an ID");
        const record = await store.get('TravelCabin', id.toString());
        if (record){
            return TravelCabin.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new TravelCabin(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
