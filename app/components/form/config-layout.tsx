"use client";

import { ReactNode } from "react";
import SecondaryHeader from "../header/secondary-header";
import { ActionButton } from "../common";

interface Props {
    title: string;
    isNew: boolean;
    readonly children: ReactNode;
    onSave: (e: React.FormEvent) => void;
}

const ConfigForm = ({ title, isNew, children, onSave }: Props) => {
    return (
        <form onSubmit={onSave} className="px-6 py-8 space-y-5">
            <SecondaryHeader title={`${isNew? "Add" : "Edit"} ${title}`} />
            <div className="grid justify-center">
                <div className="w-[700px] content-card !p-10 space-y-4">
                    {children}
                </div>
            </div>
            <div className="w-full flex justify-center gap-4">
                <ActionButton type="submit" className="primary-button w-52" label="Save"/>
            </div>
        </form>
    )
}

export default ConfigForm;