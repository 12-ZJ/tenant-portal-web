"use client"

import { useState } from "react"
import PrimaryHeader from "../header/primary-header"
import { ChangeRequestAccessStatusDto, ChangeRequestMaintainStatusDto } from "@/app/lib/types";
import { useUserStore } from "@/app/store";
import { changeRequestAccessStatus, changeRequestMaintainStatus } from "@/app/lib/services/request";
import { handleApiErrorWithRedirect, toastSuccess, toastWarning } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { ACCESS_ACTIVITY, MAINTAIN_ACTIVITY } from "@/app/lib/constants";

export default function ManualForm() {
    const [maintainNo, setMaintainNo] = useState("");
    const [accessNo, setAccessNo] = useState("");
    const { userId } = useUserStore((state) => state);

    const router = useRouter();

    const handleMaintainChange = async (act: string) => {
        if (!maintainNo) {
            toastWarning("Please enter request access number.");
            return; 
        }

        try {
            const data: ChangeRequestAccessStatusDto = {
                requestNo: accessNo,
                remark: "",
                userId: userId,
                accessActivityId: act
            };
            console.log("payload:", data);
            await changeRequestAccessStatus(data);
            toastSuccess("Operation completed successfully.");
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        }
    }

    const handleAccessChange = async (act: string) => {
        if (!accessNo) {
            toastWarning("Please enter request access number.");
            return; 
        }

        try {
            const data: ChangeRequestMaintainStatusDto = {
                requestMaintain: {
                    requestNo: maintainNo,
                    satisfaction: 0,
                    suggestion: ""
                },
                remark: "",
                userId: userId,
                maintainActivityId: act
            };
            console.log("payload:", data);
            await changeRequestMaintainStatus(data);
            toastSuccess("Operation completed successfully.");
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        }
    }

    return (
        <div className="px-6 py-8 space-y-8">
            <PrimaryHeader title={"Change Status"} />
            <div className="content-card">
                <div className="text-xl font-medium">Request Access</div>
                <div className="mt-4 flex gap-4">
                    <input className="w-80"
                        type="text"
                        name="input_accessNo"
                        placeholder="Request Access No."
                        maxLength={10}
                        onChange={(e) => setAccessNo(e.target.value)}
                        value={accessNo}
                    />
                    <button type="button" className="primary-button !bg-yellow-500 hover:font-semibold" onClick={() => handleAccessChange(ACCESS_ACTIVITY.SUBMIT)}> Submit </button>
                    <button type="button" className="primary-button !bg-orange-500 hover:font-semibold" onClick={() => handleAccessChange(ACCESS_ACTIVITY.REJECT)}> Reject </button>
                    <button type="button" className="primary-button !bg-cyan-600 hover:font-semibold" onClick={() => handleAccessChange(ACCESS_ACTIVITY.APPROVE)}> Approve </button>
                </div>
            </div>
            <div className="content-card">
                <div className="text-xl font-medium">Request Maintain</div>
                <div className="mt-4 flex gap-4">
                    <input className="w-80"
                        type="text"
                        name="input_maintain_no"
                        placeholder="Request Maintain No."
                        maxLength={10}
                        onChange={(e) => setMaintainNo(e.target.value)}
                        value={maintainNo}
                    />
                    <button type="button" className="primary-button !bg-yellow-500 hover:font-semibold" onClick={() => handleMaintainChange(MAINTAIN_ACTIVITY.SUBMIT)}> Submit </button>
                    <button type="button" className="primary-button !bg-orange-500 hover:font-semibold" onClick={() => handleMaintainChange(MAINTAIN_ACTIVITY.IN_PRO)}> In Progress </button>
                    <button type="button" className="primary-button !bg-cyan-600 hover:font-semibold" onClick={() => handleMaintainChange(MAINTAIN_ACTIVITY.COMPLETE)}> Complete </button>
                </div>
            </div>
        </div>
    )
}