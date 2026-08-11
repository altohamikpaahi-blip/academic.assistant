// جدولة تنبيهات محلية (Local Notifications) تفكّر الطالب بمواعيد المذاكرة
// بتشتغل بالكامل على الجهاز بدون سيرفر أو إنترنت.

import { LocalNotifications } from '@capacitor/local-notifications';
import type { StudyReminder } from '../types';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch {
    return false;
  }
}

function reminderToNotificationId(reminder: StudyReminder): number {
  // نحول الـ id (uuid) لرقم ثابت بسيط يستخدمه Capacitor
  let hash = 0;
  for (let i = 0; i < reminder.id.length; i++) {
    hash = (hash * 31 + reminder.id.charCodeAt(i)) % 1000000;
  }
  return hash;
}

export async function scheduleReminder(reminder: StudyReminder) {
  if (!reminder.enabled) return;
  await LocalNotifications.schedule({
    notifications: [
      {
        id: reminderToNotificationId(reminder),
        title: 'وقت المذاكرة 📚',
        body: reminder.label || 'حان وقت مراجعة المقرر',
        schedule: {
          on: { hour: reminder.hour, minute: reminder.minute },
          repeats: true,
          allowWhileIdle: true,
        },
      },
    ],
  });
}

export async function cancelReminder(reminder: StudyReminder) {
  await LocalNotifications.cancel({
    notifications: [{ id: reminderToNotificationId(reminder) }],
  });
}

export async function syncAllReminders(reminders: StudyReminder[]) {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  for (const r of reminders) {
    if (r.enabled) await scheduleReminder(r);
    else await cancelReminder(r);
  }
}
