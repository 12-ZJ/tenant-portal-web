"use client";

import { ReactNode } from "react";
import SecondaryHeader from "../header/secondary-header";
import { ActionButton } from "../common";
import RequestHeader from "./request-header";
import { ACCESS_STATUS } from "@/app/lib/constants";

interface Props {
    title: string;
    requestNo: string;
    statusId: string;
    statusName: string;
    readonly sideTopForm: ReactNode;
    readonly sideBottomForm: ReactNode;
    readonly centerForm: ReactNode;
    onSave: (e: React.FormEvent) => void;
}

const RequestForm = ({ title, requestNo = "", statusId, statusName, sideTopForm, sideBottomForm, centerForm, onSave }: Props) => {
    return (
        <form onSubmit={onSave} className="px-6 py-8 space-y-5">
            <RequestHeader 
                title={`${title}`}
                requestNo={requestNo}
                statusId={statusId}
                statusName={statusName}
                id={0}
                openQr={false} 
                onDownload={() => console.log("Download QR")} />
            <div className="w-full flex justify-center gap-4">
                <ActionButton type="submit" className="primary-button w-52" label="Save"/>
            </div>
        </form>
    )
}

export default RequestForm;