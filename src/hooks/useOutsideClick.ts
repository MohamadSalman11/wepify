import { useEffect, useRef, type RefObject } from 'react';

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  handler: () => void,
  containerRef?: RefObject<HTMLElement | null>,
  extraRef?: RefObject<HTMLElement | null>
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(event: Event) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!extraRef?.current || !extraRef.current.contains(event.target as Node))
      ) {
        handler();
      }
    }

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
