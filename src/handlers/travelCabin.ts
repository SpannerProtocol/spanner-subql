import { TravelCabin } from '../types';

export class TravelCabinHandler {
  static async ensureTravelCabin(id: string): Promise<void> {
    const tc = await TravelCabin.get(id);
    if (!tc) {
      return new TravelCabin(id).save();
    }
  }

  static async getTravelCabinById(id: string): Promise<TravelCabin> {
    await this.ensureTravelCabin(id);
    return await TravelCabin.get(id);
  }

  static async updateTravelCabinEvents(id: string, event_id: string) {
    const tc = await this.getTravelCabinById(id);
    if (tc.events) {
      const data = tc.events.split(',');
      if (data.includes(event_id)) return;
      data.push(event_id);
      tc.events = data.join(',');
    } else {
      tc.events = event_id;
    }
    await tc.save();
  }
}
