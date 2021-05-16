import { Dpo } from '../types';

export class DpoHandler {
  static async ensureDpo(id: string): Promise<void> {
    const dpo = await Dpo.get(id);
    if (!dpo) {
      return new Dpo(id).save();
    }
  }

  static async getDpoById(id: string): Promise<Dpo> {
    await this.ensureDpo(id);
    return await Dpo.get(id);
  }

  static async updateDpoEvents(id: string, event_id: string) {
    const dpo = await this.getDpoById(id);
    if (dpo.events) {
      const data = dpo.events.split(',');
      if (data.includes(event_id)) return;
      data.push(event_id);
      dpo.events = data.join(',');
    } else {
      dpo.events = event_id;
    }
    await dpo.save();
  }
}
