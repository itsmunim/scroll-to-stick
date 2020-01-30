/* eslint no-underscore-dangle: 0 */
import { ScrollHelper } from './scroll.helper';

jest.useFakeTimers();

describe('ScrollHelper', () => {
  let scrollHelper;

  const mockDocument = {
    _map: {},
    dispatchEvent: (event) => {
      if (mockDocument._map[event.type]) {
        mockDocument._map[event.type]();
      }
    },
    addEventListener: (eventType, cb) => {
      mockDocument._map[eventType] = cb;
    },
    removeEventListener: (eventType) => {
      delete mockDocument._map[eventType];
    },
    documentElement: {
      clientHeight: 320,
      scrollHeight: 640,
    },
  };

  beforeEach(() => {
    scrollHelper = new ScrollHelper(mockDocument);
  });

  it('should be properly initiated', () => {
    expect(scrollHelper).toBeDefined();
  });

  it('should fire callback with proper params on scroll changes', () => {
    const eventHandler = jest.fn();
    scrollHelper.attachHook(eventHandler);

    mockDocument.documentElement.scrollTop = 45;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalledWith({ delta: 45, direction: 'down', undefined });
  });

  it('should be able to decide proper direction & track previous direction', () => {
    const eventHandler = jest.fn();
    scrollHelper.attachHook(eventHandler);

    mockDocument.documentElement.scrollTop = 45;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalledWith({ delta: 45, direction: 'down', lastKnownDirection: undefined });

    mockDocument.documentElement.scrollTop = 30;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalledWith({ delta: 15, direction: 'up', lastKnownDirection: 'down' });
  });

  it('should allow to set a different threshold rather than default 5', () => {
    const eventHandler = jest.fn();
    scrollHelper.attachHook(eventHandler);

    scrollHelper.setThreshold(10);
    mockDocument.documentElement.scrollTop = 5;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalledTimes(0);

    mockDocument.documentElement.scrollTop = 10;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalledTimes(0);

    mockDocument.documentElement.scrollTop = 21;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalledTimes(1);
  });

  it('should remove all event listeners when decommissioned', () => {
    const eventHandler = jest.fn();
    scrollHelper.attachHook(eventHandler);

    mockDocument.documentElement.scrollTop = 20;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    expect(eventHandler).toHaveBeenCalled();

    const removeListenerSpy = jest.spyOn(mockDocument, 'removeEventListener');
    scrollHelper.decommission();
    expect(removeListenerSpy).toHaveBeenCalledTimes(1);

    mockDocument.documentElement.scrollTop = 40;
    mockDocument.dispatchEvent({ type: 'scroll' });
    jest.runAllTimers();
    // no event handler is registered anymore, so the call count remains same
    expect(eventHandler).toHaveBeenCalledTimes(1);
  });
});
