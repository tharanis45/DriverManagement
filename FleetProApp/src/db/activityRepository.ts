import {query, run} from './database';
import {Activity} from '@/context/types';
import {relativeTime} from '@/utils/time';

type ActivityRow = {
  icon: string;
  bg: string;
  fg: string;
  title: string;
  sub: string;
  createdAt: string;
};

export async function fetchRecentActivities(limit = 20): Promise<Activity[]> {
  const rows = await query<ActivityRow>(
    'SELECT * FROM activities ORDER BY createdAt DESC, id DESC LIMIT ?;',
    [limit],
  );
  return rows.map(r => ({
    icon: r.icon,
    bg: r.bg,
    fg: r.fg,
    title: r.title,
    sub: r.sub,
    time: relativeTime(r.createdAt),
  }));
}

export async function insertActivity(
  activity: Omit<Activity, 'time'>,
  createdAt = new Date().toISOString(),
): Promise<void> {
  await run(
    'INSERT INTO activities (icon, bg, fg, title, sub, createdAt) VALUES (?, ?, ?, ?, ?, ?);',
    [
      activity.icon,
      activity.bg,
      activity.fg,
      activity.title,
      activity.sub,
      createdAt,
    ],
  );
}
