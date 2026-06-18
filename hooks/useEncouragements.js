import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const messages = [
  "You're doing great — keep it up! 💪",
  "Take a deep breath. You've got this. 🌬️",
  "Stretch for 1 min. Your body will thank you. 🧘‍♀️",
  "Hydration check! 💧",
  "You don’t need to be perfect — just keep going. 💛",
  "Step outside for some fresh air ☀️",
  "Celebrate your effort, not just the outcome ✨",
];

export default function useEncouragements() {
  useEffect(() => {
    let interval;

    const setup = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      interval = setInterval(() => {
        const message = messages[Math.floor(Math.random() * messages.length)];
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'FocusLink says 👋',
            body: message,
          },
          trigger: null, // Send now
        });
      }, 1000 * 60 * 60); // every 60 mins
    };

    setup();

    return () => clearInterval(interval);
  }, []);
}
