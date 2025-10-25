import { MODE, request } from "@/src/shared/client/native/client";

export enum LIVE_ACTIVITY_TYPE  {
  START_LIVE_ACTIVITY= "START_LIVE_ACTIVITY",
  PAUSE_LIVE_ACTIVITY= "PAUSE_LIVE_ACTIVITY",
  RESUME_LIVE_ACTIVITY= "RESUME_LIVE_ACTIVITY",
  END_LIVE_ACTIVITY= "END_LIVE_ACTIVITY",
};

type StartLiveActivityPayload = {
    timerId: string;
    activityName: string;
    endAt: number ;
    recipeId: string;
    validTimerIds: string[];
};

type PauseLiveActivityPayload = {
    timerId: string;
    startedAt: number | null;
    pausedAt: number | null;
    duration: number;
    remainingTime: number;
};

type ResumeLiveActivityPayload = {
    timerId: string;
    startedAt: number | null;
    endAt: number ;
    duration: number;
};

type EndLiveActivityPayload = {
  timerId: string;
};

export const startLiveActivity = async (payload: StartLiveActivityPayload) => {
  request(MODE.UNBLOCKING, LIVE_ACTIVITY_TYPE.START_LIVE_ACTIVITY, payload);
};

export const pauseLiveActivity = async (payload: PauseLiveActivityPayload) => {
  request(MODE.UNBLOCKING, LIVE_ACTIVITY_TYPE.PAUSE_LIVE_ACTIVITY, payload);
};

export const resumeLiveActivity = async (payload: ResumeLiveActivityPayload) => {
  request(MODE.UNBLOCKING, LIVE_ACTIVITY_TYPE.RESUME_LIVE_ACTIVITY, payload);
};

export const endLiveActivity = async (payload: EndLiveActivityPayload) => {
  request(MODE.UNBLOCKING, LIVE_ACTIVITY_TYPE.END_LIVE_ACTIVITY, payload);
};