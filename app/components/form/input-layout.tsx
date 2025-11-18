import { ReactNode } from "react";
import ErrorContent from "../common/error-content";

interface Props {
    label: string;
    isRequired?: boolean;
    error?: string;
    className?: string;
    readonly children: ReactNode;
}

export const InputLayout = ({ label, isRequired = true, error, className = "w-full", children }: Props) => {
    return (
        <div className={`space-y-2 grid ${className}`}>
            <div className={`${isRequired ? "required" : ""}`}>{label}</div>
            <div className="font-semibold items-center gap-10">
                { children }
                <ErrorContent errorMsg={error} />
            </div>
        </div>
    )
}