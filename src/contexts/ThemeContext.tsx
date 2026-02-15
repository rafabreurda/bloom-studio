import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  themeMode: 'chefe';
  isChefe: true;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value: ThemeContextType = { themeMode: 'chefe', isChefe: true };

  return (
    <ThemeContext.Provider value={value}>
      <div className="theme-chefe">
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
