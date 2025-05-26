import React, { createContext, useContext, useState } from "react";

const ShowDemoContext = createContext<{
  showDemoJobs: boolean;
  setShowDemoJobs: (val: boolean) => void;
} | null>(null);

export function ShowDemoProvider({ children }: { children: React.ReactNode }) {
  const [showDemoJobs, setShowDemoJobs] = useState(true);
  return (
    <ShowDemoContext.Provider value={{ showDemoJobs, setShowDemoJobs }}>
      {children}
    </ShowDemoContext.Provider>
  );
}

export function useShowDemo() {
  const ctx = useContext(ShowDemoContext);
  if (!ctx) throw new Error("useShowDemo must be used within ShowDemoProvider");
  return ctx;
}
