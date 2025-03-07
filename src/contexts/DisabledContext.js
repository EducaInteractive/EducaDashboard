import { createContext, useContext, useState } from 'react';

const DisabledContext = createContext();

export function DisabledProvider({ children }) {
  const [disabled, setDisabled] = useState(false);
  const [disabledTour, setDisabledTour] = useState(false);

  return (
    <DisabledContext.Provider value={{ disabled, setDisabled, disabledTour, setDisabledTour }}>
      {children}
    </DisabledContext.Provider>
  );
}

export function useDisabled() {
  const context = useContext(DisabledContext);
  if (!context) {
    throw new Error('useDisabled must be used within a DisabledProvider');
  }
  return context;
}

export function useDisabledTour() {
  const context = useContext(DisabledContext);
  if (!context) {
    throw new Error('useDisabledTour must be used within a DisabledProvider');
  }
  return context;
}
