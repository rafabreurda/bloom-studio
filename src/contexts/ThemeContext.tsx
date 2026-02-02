import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';

type ThemeMode = 'chefe' | 'standard';

interface ThemeContextType {
  themeMode: ThemeMode;
  isChefe: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { currentAdmin } = useAuth();

  const themeMode: ThemeMode = useMemo(() => {
    if (currentAdmin?.role === 'admin_chefe') {
      return 'chefe';
    }
    return 'standard';
  }, [currentAdmin]);

  const value = useMemo(() => ({
    themeMode,
    isChefe: themeMode === 'chefe',
  }), [themeMode]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={themeMode === 'chefe' ? 'theme-chefe' : 'theme-standard'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
