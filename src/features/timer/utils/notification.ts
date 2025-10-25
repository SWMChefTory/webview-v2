import { MODE, request } from "@/src/shared/client/native/client";

export const NOTIFICATION_TYPE = {
  CANCEL: "CANCEL_TIMER_NOTIFICATION",
  SCHEDULE: "SCHEDULE_TIMER_NOTIFICATION",
} as const;

type ScheduleNotificationPayload = {
  timerId: string;
  recipeId: string;
  recipeTitle: string;
  remainingSeconds: number;
};

type CancelNotificationPayload = {
  timerId: string;
};

export const scheduleNotification = async (payload: ScheduleNotificationPayload) => {
  request(
    MODE.UNBLOCKING,
    NOTIFICATION_TYPE.SCHEDULE,
    payload
  );
};

export const cancelNotification = async (payload: CancelNotificationPayload) => {
  request(
    MODE.UNBLOCKING,
    NOTIFICATION_TYPE.CANCEL,
    payload
  );
};
