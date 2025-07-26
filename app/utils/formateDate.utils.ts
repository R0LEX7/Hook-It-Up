import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  differenceInMinutes,
  differenceInHours,
  formatDistanceToNow,
} from 'date-fns';

export const formatMessageTime = (date: Date | string): string => {
  const newDate = new Date(date);

  const now = new Date();
  const minsAgo = differenceInMinutes(now, newDate);
  const hrsAgo = differenceInHours(now, newDate);

  if (minsAgo < 1) return 'Just now';
  if (minsAgo < 60) return `${minsAgo} min${minsAgo > 1 ? 's' : ''} ago`;
  if (hrsAgo < 24 && isToday(newDate)) return format(newDate, 'hh:mm a');
  if (isYesterday(newDate)) return 'Yesterday';
  if (isThisWeek(newDate)) return format(newDate, 'EEEE'); // Monday, Tuesday...
  return format(newDate, 'dd/MM/yyyy'); // fallback format
};
