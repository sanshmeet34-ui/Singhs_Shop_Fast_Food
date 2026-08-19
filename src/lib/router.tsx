import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RouterValue {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterValue | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handler = () => {
      setPath(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    if (!window.location.hash) window.location.hash = '/';
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
