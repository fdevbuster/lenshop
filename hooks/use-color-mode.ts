import { useEffect, useState } from 'react';

export function useColorMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', listener);
    
    // Check for manual theme selection in localStorage or DOM
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      setIsDark(true);
    }
    
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return { isDark };
} 