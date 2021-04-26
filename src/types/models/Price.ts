// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class Price implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public blkNumber?: bigint;

    public timestamp?: Date;

    public token1?: string;

    public tokenAmount1?: bigint;

    public token2?: string;

    public tokenAmount2?: bigint;

    public price?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Price entity without an ID");
        await store.set('Price', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Price entity without an ID");
        await store.remove('Price', id.toString());
    }

    static async get(id:string): Promise<Price>{
        assert(id !== null, "Cannot get Price entity without an ID");
        const record = await store.get('Price', id.toString());
        if (record){
            return Price.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new Price(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
