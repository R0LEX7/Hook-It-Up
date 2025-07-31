import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInWeeks,
  format,
  isThisWeek,
  isToday,
  isYesterday,
} from 'date-fns';

export const formatMessageTime = (date: Date | string): string => {
  const newDate = new Date(date);
  const now = new Date();

  const minsAgo = differenceInMinutes(now, newDate);
  const hrsAgo = differenceInHours(now, newDate);
  const daysAgo = differenceInDays(now, newDate);
  const weeksAgo = differenceInWeeks(now, newDate);

  if (minsAgo < 1) return 'Just now';
  if (minsAgo < 60) return `${minsAgo} min${minsAgo > 1 ? 's' : ''} ago`;
  if (hrsAgo < 24 && isToday(newDate)) return format(newDate, 'hh:mm a');
  if (isYesterday(newDate)) return 'Yesterday';
  if (isThisWeek(newDate)) return format(newDate, 'EEEE');
  if (daysAgo < 7) return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  if (weeksAgo < 4) return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;

  return format(newDate, 'dd/MM/yyyy'); // fallback for months/years ago
};
