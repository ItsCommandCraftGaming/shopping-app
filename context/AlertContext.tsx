import { createContext } from "react";

export interface AlertOptions {
    title: string;
    message: string;
    type?: "success" | "error" | "info";
    onConfirm?: () => void;
}

export interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);
