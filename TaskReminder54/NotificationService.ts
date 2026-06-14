import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const sendLocalNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // Inmediata
  });
};

export const scheduleTaskNotification = async (title: string, body: string, date: Date) => {
  // Si la fecha ya pasó, no programar
  if (date <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Recordatorio: ${title}`,
      body: body,
    },
    trigger: date,
  });
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};