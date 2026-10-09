import { firstValueFrom } from 'rxjs';
import { MockBookingApi } from './booking/data/booking.mock';
import { MockFeedApi } from './social/data/social.mock';

describe('adaptadores mock reemplazables', () => {
  it('actualiza un like detrás de FeedApi', async () => {
    const api = new MockFeedApi();
    const before = (await firstValueFrom(api.list()))[0].likes;
    await firstValueFrom(api.toggleLike('1'));
    expect((await firstValueFrom(api.list()))[0].likes).toBe(before + 1);
  });

  it('cancela una cita detrás de BookingApi', async () => {
    const api = new MockBookingApi();
    const result = await firstValueFrom(api.cancel('a1', 'Cambio de planes'));
    expect(result.status).toBe('Reembolsada');
  });
});
