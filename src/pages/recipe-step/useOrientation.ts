import { request, MODE } from "@/src/shared/client/native/client";

enum ORIENTATION {
  LOCK_ORIENTATION = "LOCK_ORIENTATION",
  UNLOCK_ORIENTATION = "UNLOCK_ORIENTATION",
}

export const useOrientation = () => {
  function handleLockOrientation() {
    console.log("!!!!!!!!!!!!!!!!!!!!!!");
    request(MODE.UNBLOCKING, ORIENTATION.LOCK_ORIENTATION);
  }
  function handleUnlockOrientation() {
    request(MODE.UNBLOCKING, ORIENTATION.UNLOCK_ORIENTATION);
  }
  return { handleLockOrientation, handleUnlockOrientation };
};
