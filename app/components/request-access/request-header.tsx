"use client"

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import AccessStatus from "./access-status";
import DownloadQrModal, { DownloadQrHandle } from "./qr";
import { useEffect, useRef, useState } from "react";

interface Props {
    id: number;
    title: string;
    requestNo: string;
    statusId: string;
    statusName: string;
    openQr: boolean;
}

const RequestHeader = ({ id, title, requestNo = "", statusId, statusName, openQr }: Props) => {
    const router = useRouter();
    const [isOpenQr, setIsOpenQr] = useState(false);
    const qrRef = useRef<any>(null);

    useEffect(() => {
        if (openQr) {
        setIsOpenQr(true);
        qrRef.current?.openAndDownload?.();
        }
    }, [openQr]);

    const handleBack = () => {
      router.back();
    };

    return (
        <div>
            <button type="button" 
                className="flex text-sm items-center gap-2 text-theme_back hover:text-theme_label cursor-pointer mb-2"
                onClick={handleBack}>
                <IoIosArrowBack size={10} /> Back
            </button>
            <div className="flex justify-between items-center">
                <div className="text-2xl font-semibold text-theme_topic">
                    {`${title}: ${requestNo}`}
                </div>
                { true &&
                <div className="flex gap-4">
                    <button onClick={() => qrRef.current?.openAndDownload?.()} className="secondary-button !min-w-36 !min-h-5 !p-0">
                        QR Code
                    </button>

                    <DownloadQrModal
                        ref={qrRef}
                        id={id}
                        requestNo={requestNo}
                        statusId={statusId}
                        statusName={statusName}
                    />
                    <div className="min-w-36">
                        <AccessStatus id={statusId} name={statusName} />
                    </div> 
                </div> }
            </div>
        </div>
    )
}

export default RequestHeader;