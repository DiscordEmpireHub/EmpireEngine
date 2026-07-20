import { describe, it, expect, vi } from "vitest";
import { EventBus } from "./EventBus.js";

describe("EventBus", () => {
  it("calls a listener with the emitted payload", () => {
    const bus = new EventBus();
    const listener = vi.fn();

    bus.on<{ value: number }>("score", listener);
    bus.emit("score", { value: 42 });

    expect(listener).toHaveBeenCalledWith({ value: 42 });
  });

  it("does not call a listener after it unsubscribes", () => {
    const bus = new EventBus();
    const listener = vi.fn();
    const unsubscribe = bus.on("score", listener);

    unsubscribe();
    bus.emit("score", { value: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  it("does not call a listener removed via off", () => {
    const bus = new EventBus();
    const listener = vi.fn();
    bus.on("score", listener);

    bus.off("score", listener);
    bus.emit("score", { value: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  it("does not throw when emitting an event with no listeners", () => {
    const bus = new EventBus();

    expect(() => bus.emit("unknown-event", {})).not.toThrow();
  });

  it("removes all listeners after clear", () => {
    const bus = new EventBus();
    const listener = vi.fn();
    bus.on("score", listener);

    bus.clear();
    bus.emit("score", { value: 1 });

    expect(listener).not.toHaveBeenCalled();
  });
});
