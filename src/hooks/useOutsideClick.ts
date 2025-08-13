import { RefObject, useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  handler: () => void,
  extraRef?: RefObject<HTMLElement | null>,
  containerRef?: RefObject<HTMLElement | null>
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!extraRef?.current || !extraRef.current.contains(event.target as Node))
      ) {
        handler();
      }
    };

    const iframe = document.querySelector('iframe');
    const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
    const listenTarget = containerRef?.current || document;

    listenTarget.addEventListener('click', handleClick);
    iframeDoc?.addEventListener('click', handleClick);

    return () => {
      listenTarget.removeEventListener('click', handleClick);
      iframeDoc?.removeEventListener('click', handleClick);
    };
  }, [handler, containerRef, extraRef]);

  return ref;
};

export default useOutsideClick;
