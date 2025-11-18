"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import Logo from "@/public/images/AWC.BK.D.png";
import { getStatusStyle } from "@/app/lib/utils";
import * as Dialog from '@radix-ui/react-dialog';
import { toPng } from "html-to-image";

interface Props {
  id: number;
  requestNo: string;
  statusId: string;
  statusName: string;
}

export interface DownloadQrHandle {
  openAndDownload: () => void;
}

const DownloadQrModal = forwardRef<DownloadQrHandle, Props>(
  ({ id, requestNo, statusId, statusName }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [qrUrl, setQrUrl] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const { bg, text } = getStatusStyle(statusId ?? "");
    const urlBase = process.env.NEXT_PUBLIC_WEB_BASE_URL ?? "";
    const qrValue = `${urlBase}/request-access/${id}/status`;

    useEffect(() => {
      if (qrValue) {
        QRCode.toDataURL(qrValue, { width: 300, margin: 1 })
          .then(setQrUrl)
          .catch(console.error);
      }
    }, [qrValue]);

    useImperativeHandle(ref, () => ({
      openAndDownload: () => setIsOpen(true),
    }));

    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(async () => {
          try {
            const dataUrl = await toPng(containerRef.current!);
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `QR-${requestNo}.png`;
            link.click();
          } catch (err) {
            console.error("Download failed", err);
          } finally {
            setIsOpen(false);
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <Dialog.Root open={isOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-none z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 border-none outline-none">
            <Dialog.Title></Dialog.Title>
                <div
                    ref={containerRef}
                    className="overflow-hidden shadow-lg"
                    style={{ width: 500 }}
                >
                    <div className="bg-menu px-8 py-4 text-white flex justify-between">
                        <div className="flex gap-5 items-center">
                        <Image src={Logo} alt="Logo" width={80} height={80} />
                        <div className="space-y-1">
                            <span className="font-semibold">REQUEST ACCESS</span>
                            <div className="flex">
                            <div className="min-w-fit font-medium px-4 text-theme_primary bg-theme_background h-fit rounded-l">
                                {requestNo}
                            </div>
                            <div
                                className="min-w-fit font-medium px-4 h-fit rounded-r flex items-center justify-center gap-2"
                                style={{ backgroundColor: bg, color: text }}
                            >
                                {statusName}
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="border border-theme_primary bg-white p-5 flex flex-col items-center gap-4">
                        {qrUrl ? (
                        <img src={qrUrl} alt="QR Code" className="w-60 h-60 object-contain" />
                        ) : (
                        <div className="text-gray-400">Generating QR...</div>
                        )}
                    </div>
                </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

DownloadQrModal.displayName = "DownloadQrModal";
export default DownloadQrModal;