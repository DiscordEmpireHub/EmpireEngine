export type EventListener<TPayload> = (payload: TPayload) => void;
export type Unsubscribe = () => void;

export class EventBus {
  private readonly listenersByEvent = new Map<string, Set<EventListener<unknown>>>();

  on<TPayload>(event: string, listener: EventListener<TPayload>): Unsubscribe {
    const listeners = this.listenersByEvent.get(event) ?? new Set();
    listeners.add(listener as EventListener<unknown>);
    this.listenersByEvent.set(event, listeners);

    return () => this.off(event, listener);
  }

  off<TPayload>(event: string, listener: EventListener<TPayload>): void {
    this.listenersByEvent.get(event)?.delete(listener as EventListener<unknown>);
  }

  emit<TPayload>(event: string, payload: TPayload): void {
    const listeners = this.listenersByEvent.get(event);
    if (!listeners) return;

    for (const listener of listeners) {
      (listener as EventListener<TPayload>)(payload);
    }
  }

  clear(): void {
    this.listenersByEvent.clear();
  }
}
