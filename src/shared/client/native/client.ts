import { UNBLOCKING_HANDLER_TYPE } from "./unblockingHandlerType";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(message: string): void;
      getMessage(): unknown;
    };
  }

  interface BridgeMessage {
    type: unknown;
    data: unknown;
  }
}

const enum ACTION {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
}

// web/bridge.ts
type RequestMsgBlockingFromWebview = {
  intended: true;
  action: ACTION.REQUEST;
  mode: MODE.BLOCKING;
  id: string;
  type: string;
  payload?: any;
};
type ResponseMsg = {
  intended: true;
  action: ACTION.RESPONSE;
  mode: MODE.BLOCKING;
  id: string;
  ok: boolean;
  result: any;
};

type RequestMsgUnblockingFromWebview = {
  intended: true;
  action: ACTION.REQUEST;
  mode: MODE.UNBLOCKING;
  type: string;
  payload?: any;
};

type RequestMsgUnblockingFromNative = {
  intended: true;
  action: ACTION.REQUEST;
  mode: MODE.UNBLOCKING;
  type: UNBLOCKING_HANDLER_TYPE;
  payload?: any;
};

const pending = new Map<
  string,
  { resolve: (v: any) => void; reject: (e: any) => void; timer: any }
>();

export type UnblockingHandler = (type: UNBLOCKING_HANDLER_TYPE, payload: any) => void;
const unblockingHandlers = new Map<UNBLOCKING_HANDLER_TYPE, UnblockingHandler>();


//payLoad는 이미 객체화 되어있음.
export const onUnblockingRequest = (type: UNBLOCKING_HANDLER_TYPE, handler: UnblockingHandler) => {
  if (unblockingHandlers.has(type)) {
    console.warn(`핸들러가 이미 등록되어 있어 덮어씁니다: ${type}`);
  }
  unblockingHandlers.set(type, handler);
  
  // cleanup 함수 반환
  return () => {
    if(unblockingHandlers.has(type)) {
      unblockingHandlers.delete(type);
    }
  };
};

//useEffect안에서만 써야함. CSR코드
//request함수 사용할 때 이 코드는 몰라도 됨.
export const communication = (event: MessageEvent) => {
  console.log("[EVENT] : ", event.data);
  if (typeof event.data !== "string") return;

  const msg = JSON.parse(event.data) as
    | ResponseMsg
    | RequestMsgUnblockingFromNative;

  if (!msg.intended) {
    console.log("[NOT INTENDED] : ", msg);
    return;
  }
  if (!msg.action) {
    console.log("[NOT ACTION] : ", msg);
    return;
  }

  if (!msg.mode) {
    console.log("[NOT MODE] : ", msg);
    return;
  }

  if (msg.action === ACTION.REQUEST) {
    console.log("[UNBLOCKING HANDLER] : ", JSON.stringify(msg));
    if(unblockingHandlers.has(msg.type)) {
      unblockingHandlers.get(msg.type)?.(msg.type as UNBLOCKING_HANDLER_TYPE, msg.payload);
      return;
    }
    throw new Error(`해당 타입에 대한 핸들러가 등록되어 있지 않습니다 : ${JSON.stringify(msg)}`);
  }

  if (!msg || !("id" in msg)) return;

  const entry = pending.get(msg.id);
  if (!entry) {
    console.log("[NOT PENDING] : ", msg);
    return;
  }

  clearTimeout(entry.timer);
  pending.delete(msg.id);

  if ("ok" in msg && msg.ok) return entry.resolve(msg.result);
  else entry.reject(new Error((msg as any).error ?? "Unknown error"));
};

export const enum MODE {
  BLOCKING = "BLOCKING",
  UNBLOCKING = "UNBLOCKING",
}

// 요청 보내기 (HTTP의 fetch처럼 사용)
// blocking 방식과 unblocking 방식 둘 다 사용할 수 있음.
//payload는 무조건 객체로 보내야 함.
export function request<T = any>(
  mode: MODE,
  type: string,
  payload?: any,
  timeoutMs = 10_000
): Promise<T> {
  if (typeof window === "undefined") {
    console.log("[NOT WINDOW] : ", mode, type, payload);
    return Promise.resolve(payload);
  }
  if (!window.ReactNativeWebView)
    return Promise.reject(new Error("Bridge not ready"));

  if (mode === MODE.UNBLOCKING) {
    const req: RequestMsgUnblockingFromWebview = {
      intended: true,
      action: ACTION.REQUEST,
      mode: MODE.UNBLOCKING,
      type,
      payload,
    };
    window.ReactNativeWebView!.postMessage(JSON.stringify(req));
    return Promise.resolve(payload);
  }

  const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const req: RequestMsgBlockingFromWebview = {
    intended: true,
    action: ACTION.REQUEST,
    mode: MODE.BLOCKING,
    id,
    type,
    payload,
  };

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Bridge request timed out"));
    }, timeoutMs);

    pending.set(id, { resolve, reject, timer });
    window.ReactNativeWebView!.postMessage(JSON.stringify(req));
  });
}
