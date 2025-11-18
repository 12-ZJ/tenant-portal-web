import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

interface LayoutProps {
    readonly children: ReactNode;
}

export default function FullScreenLayout({ children }: LayoutProps) {
    return (
        <div className="w-screen flex flex-col items-center justify-center min-h-screen py-8">
            {children}
            <ToastContainer />
        </div>
    )
}