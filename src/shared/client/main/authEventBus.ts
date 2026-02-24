type AuthLogoutHandler = (error: unknown) => void;

let _handler: AuthLogoutHandler | null = null;

export const authEventBus = {
  register(handler: AuthLogoutHandler): void {
    _handler = handler;
  },

  emit(error: unknown): void {
    _handler?.(error);
  },

  unregister(): void {
    _handler = null;
  },
};
