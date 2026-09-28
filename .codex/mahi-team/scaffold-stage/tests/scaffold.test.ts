import app from '../app.json';

test('Android identity and route scheme stay configured', () => {
  expect(app.expo.android.package).toBe('com.pooniya.hinducalendar');
  expect(app.expo.scheme).toBe('hinducalendar');
});
