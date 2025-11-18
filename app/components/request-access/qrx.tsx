"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import Logo from "@/assets/logo.png"; // ปรับ path ตามจริง

interface QrTemplateProps {
  dataSource: any;
  bg?: string;
  text?: string;
}

export default function QrTemplate({ dataSource, bg = "#fff", text = "#000" }: QrTemplateProps) {
  const [qrUrl, setQrUrl] = useState<string>("");

  const qrValue = dataSource?.requestAccess?.qrValue ?? "NO DATA";

  useEffect(() => {
    if (qrValue) {
      QRCode.toDataURL(qrValue, { margin: 1, width: 300 })
        .then(setQrUrl)
        .catch(console.error);
    }
  }, [qrValue]);

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `qr-${dataSource?.requestAccess?.requestNo}.png`;
    link.click();
  };

  return (
    <div className="w-screen p-4 bg-theme_background">
      <div>
        {/* Header */}
        <div className="bg-menu px-8 py-4 text-white rounded-t-xl flex justify-between">
          <div className="flex gap-5 items-center">
            <Image priority src={Logo} alt="Logo" width={80} />

            <div className="space-y-1">
              <span>REQUEST ACCESS</span>
              <div className="flex">
                <div className="min-w-fit font-medium px-4 text-theme_primary bg-theme_background h-fit rounded-l">
                  {dataSource?.requestAccess?.requestNo ?? ""}
                </div>
                <div
                  className="min-w-fit font-medium px-4 h-fit rounded-r flex items-center justify-center gap-2"
                  style={{ backgroundColor: bg, color: text }}
                >
                  {dataSource?.requestAccess?.accessStatusNameEN ?? ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="border border-theme_primary bg-white p-5 rounded-b-xl flex flex-col items-center gap-4">
          {/* QR Code */}
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code" className="w-60 h-60 object-contain" />
          ) : (
            <div className="text-gray-400">Generating QR...</div>
          )}

          {/* Download button */}
          <button
            onClick={downloadQR}
            className="bg-theme_primary text-white px-6 py-2 rounded-lg hover:opacity-80"
          >
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}
