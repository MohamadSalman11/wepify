import { useEffect, useRef } from 'react';

export function useOutsideClick<T extends HTMLElement = HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handler]);

  return ref;
}

export default useOutsideClick;
