// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class Swap implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public timestamp?: Date;

    public token1?: string;

    public tokenAmount1?: string;

    public token2?: string;

    public tokenAmount2?: string;

    public price?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Swap entity without an ID");
        await store.set('Swap', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Swap entity without an ID");
        await store.remove('Swap', id.toString());
    }

    static async get(id:string): Promise<Swap>{
        assert(id !== null, "Cannot get Swap entity without an ID");
        const record = await store.get('Swap', id.toString());
        if (record){
            return Swap.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new Swap(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
