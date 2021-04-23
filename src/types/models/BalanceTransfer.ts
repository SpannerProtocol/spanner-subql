// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

export class BalanceTransfer implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public from?: string;

    public to?: string;

    public amount?: bigint;

    public blockId?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BalanceTransfer entity without an ID");
        await store.set('BalanceTransfer', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BalanceTransfer entity without an ID");
        await store.remove('BalanceTransfer', id.toString());
    }

    static async get(id:string): Promise<BalanceTransfer>{
        assert(id !== null, "Cannot get BalanceTransfer entity without an ID");
        const record = await store.get('BalanceTransfer', id.toString());
        if (record){
            return BalanceTransfer.create(record);
        }else{
            return;
        }
    }

    static create(record){
        let entity = new BalanceTransfer(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
