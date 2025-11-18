"use client"

import { useState } from "react"
import PrimaryHeader from "../header/primary-header"

export default function ManualForm() {
    const [maintainNo, setMaintainNo] = useState("");
    const [accessNo, setAccessNo] = useState("");

    const handleMaintainChange = (act: string) => {
        alert("Change status");
    }

    const handleAccessChange = (act: string) => {
        alert("Change status");
    }

    return (
        <div className="px-6 py-8 space-y-8">
            <PrimaryHeader title={"Change Status"} />
            <div className="content-card">
                <div className="text-xl font-medium">Maintain Request</div>
                <div className="mt-4 flex gap-4">
                    <input className="w-80"
                        type="text"
                        name="input_maintain_no"
                        maxLength={50}
                        onChange={(e) => setMaintainNo(e.target.value)}
                        value={maintainNo}
                    />
                    <button type="button" className="primary-button !bg-yellow-500 hover:font-semibold" onClick={() => handleMaintainChange("")}> Submit </button>
                    <button type="button" className="primary-button !bg-orange-500 hover:font-semibold" onClick={() => handleMaintainChange("")}> In Progress </button>
                    <button type="button" className="primary-button !bg-cyan-600 hover:font-semibold" onClick={() => handleMaintainChange("")}> Complete </button>
                </div>
            </div>
            <div className="content-card">
                <div className="text-xl font-medium">Request Access</div>
                <div className="mt-4 flex gap-4">
                    <input className="w-80"
                        type="text"
                        name="input_maintain_no"
                        maxLength={50}
                        onChange={(e) => setMaintainNo(e.target.value)}
                        value={maintainNo}
                    />
                    <button type="button" className="primary-button !bg-yellow-500 hover:font-semibold" onClick={() => handleAccessChange("")}> Pending </button>
                    <button type="button" className="primary-button !bg-orange-500 hover:font-semibold" onClick={() => handleAccessChange("")}> Reject </button>
                    <button type="button" className="primary-button !bg-cyan-600 hover:font-semibold" onClick={() => handleAccessChange("")}> Approve </button>
                </div>
            </div>
        </div>
    )
}