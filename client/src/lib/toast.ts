type Listener = (msg: string) => void;

let listener: Listener | null = null;

/** 订阅 Toast 消息，返回取消订阅函数。 */
export function onToast(fn: Listener): () => void {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

/** 发送一条 Toast 消息。 */
export function toast(msg: string) {
  listener?.(msg);
}