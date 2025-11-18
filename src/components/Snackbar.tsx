import React, { createContext, useContext, useState, useCallback } from "react";

type Variant = "success" | "error";

interface SnackbarState {
  message: string;
  variant: Variant;
  open: boolean;
}

interface SnackbarContextType {
  show: (message: string, variant?: Variant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    variant: "success",
    open: false,
  });

  const show = useCallback((message: string, variant: Variant = "success") => {
    setSnackbar({ message, variant, open: true });

    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 2500);
  }, []);

  const success = (msg: string) => show(msg, "success");
  const error = (msg: string) => show(msg, "error");

  return (
    <SnackbarContext.Provider value={{ show, success, error }}>
      {children}

      <div
        className={`
          fixed top-5 right-5 -translate-x-1/2  
          px-4 py-2 rounded-lg text-white text-sm shadow-md
          transition-opacity duration-200 pointer-events-none
          ${snackbar.variant === "success" ? "bg-green-600" : "bg-red-600"}
          ${snackbar.open ? "opacity-100" : "opacity-0"}
        `}
      >
        {snackbar.message}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used inside SnackbarProvider");
  return ctx;
}