/**
 * Constants
 */

const ALL_ORIGINS = '*';
const PROD_ORIGIN = 'https://wepify.mohamad-salman.dev';
const TARGET_ORIGIN = import.meta.env.MODE === 'production' ? PROD_ORIGIN : ALL_ORIGINS;

const SELECTOR_IFRAME = 'iframe';

/**
 * Types
 */

type Message<T = any> = { type: string; payload?: T };
type Handler<T = any> = (payload: T) => void;

/**
 * Class definition
 */

class IframeConnection {
  private handlers = new Map<string, Handler>();

  constructor() {
    window.addEventListener('message', this.handleMessage);
  }

  // public
  send<T = any>(type: string, payload?: T) {
    const g = globalThis as unknown as Window;
    const target = g.parent === g ? this.getIframeWindow() : g.parent;

    target?.postMessage({ type, payload }, TARGET_ORIGIN);
  }

  on<T = any>(type: string, handler: Handler<T>) {
    this.handlers.set(type, handler);
  }

  off(type: string) {
    this.handlers.delete(type);
  }

  // private
  private handleMessage = (event: MessageEvent<Message>) => {
    const { type, payload } = event.data;
    const handler = this.handlers.get(type);
    handler?.(payload);
  };

  private getIframeWindow() {
    const iframe = document.querySelector(SELECTOR_IFRAME);
    return iframe?.contentWindow ?? null;
  }
}

export default new IframeConnection();
