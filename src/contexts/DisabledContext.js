import { createContext, useContext, useState } from 'react';

const DisabledContext = createContext();

export function DisabledProvider({ children }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <DisabledContext.Provider value={{ disabled, setDisabled }}>
      {children}
    </DisabledContext.Provider>
  );
}

export function useDisabled() {
  const context = useContext(DisabledContext);
  if (context === undefined) {
    throw new Error('useDisabled must be used within a DisabledProvider');
  }
  return context;
}