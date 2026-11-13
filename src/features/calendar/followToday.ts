/** Follow the local day only while the user is viewing the previous local day. */
export function shouldFollowToday(selectedDate: string, previousToday: string, today: string): boolean {
  return selectedDate === previousToday && previousToday !== today;
}
