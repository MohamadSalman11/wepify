import { useEffect, useState } from 'react';
import UnsupportedDevice from './UnsupportedDevice';

/**
 * Types
 */

interface RequireDesktopProps {
  children: React.ReactNode;
  minWidth?: number;
}

/**
 * Component definition
 */

export default function RequireDesktop({ children, minWidth = 1280 }: RequireDesktopProps) {
  const [isSupported, setIsSupported] = useState(window.innerWidth >= minWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsSupported(window.innerWidth >= minWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth]);

  if (!isSupported) return <UnsupportedDevice />;
  return <>{children}</>;
}
