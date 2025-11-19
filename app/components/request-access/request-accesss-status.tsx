"use client"

import { useCallback, useEffect, useState } from "react";
import { DropdownDto, RequestAccessDetailDto } from "@/app/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useLoadingStore } from "@/app/store";
import { formatDate, getStatusStyle, handleApiErrorWithRedirect } from "@/app/lib/utils";
import { defaultRequestAccessDetail } from "@/app/lib/constants";
import { getDropdown } from "@/app/lib/services/config/static";
import { getRequestAccessDetail } from "@/app/lib/services/request";
import Image from "next/image";
import Logo from "@/public/images/AWC.BK.D.png"

export default function RequestAccessStatus() {
    const [mounted, setMounted] = useState(false);
    const [dataSource, setDataSource] = useState<RequestAccessDetailDto>();
    const [dropdownMaster, setDropdownMaster] = useState<DropdownDto>();
    const { fetching, setFetching } = useLoadingStore((state) => state);

    const router = useRouter();
    const searchParams = useParams();
    const id = Number(searchParams.id);

    // if (!id) {
    //     return null;
    // }

    const fetchData = useCallback(async () => {
        try {
            const dropdown = await getDropdown({});
            const res = await getRequestAccessDetail(id);

            // if (!res.requestAccess.id) {
            //     return null;
            // }

            setDropdownMaster(dropdown);
            setDataSource(res ?? defaultRequestAccessDetail);
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        } finally {
            setFetching(false);
        }
    }, [id, router]);

    useEffect(() => {
        setMounted(true);
        setFetching(true);
        fetchData();
    }, [fetchData]);

    if (!mounted || fetching) return null;

    const buildingName = dropdownMaster?.building?.find(item => item.id === dataSource?.requestAccess?.buildingId)?.nameEN ?? "";
    const floorName = dropdownMaster?.floor?.find(item => item.id === dataSource?.requestAccess?.floorId)?.nameEN ?? "";
    const areaName = dropdownMaster?.area?.find(item => item.id === dataSource?.requestAccess?.areaId)?.nameEN ?? "";

    const { bg, text } = getStatusStyle(dataSource?.requestAccess?.accessStatusId ?? "");
    
    return (
        <div className="w-screen p-4 bg-theme_background">
            <div>
                <div className="bg-menu px-8 py-4 text-white rounded-t-xl flex justify-between">
                    <div className="flex gap-5 items-center">
                        <Image
                            priority={true}
                            src={Logo}
                            alt="Logo"
                            width={80}
                        />
                        
                        <div className="space-y-1">
                            <span>REQUEST ACCESS</span>
                            <div className="flex">
                                <div className="min-w-fit font-medium px-4 text-theme_primary bg-theme_background h-fit rounded-l">{dataSource?.requestAccess?.requestNo ?? ""}</div>
                                <div className="min-w-fit font-medium px-4 text-theme_primary bg-theme_background h-fit rounded-r"
                                    style={{ backgroundColor: bg, color: text }}>
                                    <div className="flex items-center justify-center gap-2">
                                    {dataSource?.requestAccess?.accessStatusNameEN ?? ""}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                </div>
                <div className="border border-theme_primary bg-white p-5 rounded-b-xl">
                    <div className="space-y-2 pb-4 border-b">
                        <div className="flex gap-4">
                            <span className="font-medium w-[30%] flex justify-end">Access Date : </span>
                            <span className="w-[70%]">{formatDate(dataSource?.requestAccess?.accessDate ?? "")}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-medium w-[30%] flex justify-end">Building : </span>
                            <span className="w-[70%]">{buildingName}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-medium w-[30%] flex justify-end">Floor : </span>
                            <span className="w-[70%]">{floorName}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-medium w-[30%] flex justify-end">Area : </span>
                            <span className="w-[70%]">{areaName}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-medium w-[30%] flex justify-end">Note : </span>
                            <span className="w-[70%]">{dataSource?.requestAccess?.note || "-"}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {dataSource?.requestAccessPeople?.map((item, index) => {
                            const genderName = dropdownMaster?.gender.find(e => e.id === item.genderId)?.nameEN;
                            return (
                                <div key={item.id} className={`space-y-2 py-4 ${(index+1) < dataSource?.requestAccessPeople?.length ? "border-b" : ""}`}>
                                    <div className="flex gap-4">
                                        <span className="font-medium w-[30%] flex justify-end">Gender : </span>
                                        <span className="w-[70%]">{genderName}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-medium w-[30%] flex justify-end">Firstname : </span>
                                        <span className="w-[70%]">{item.firstname}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-medium w-[30%] flex justify-end">Lastname : </span>
                                        <span className="w-[70%]">{item.lastname}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-medium w-[30%] flex justify-end">Email : </span>
                                        <span className="w-[70%]">{item.email || "-"}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="font-medium w-[30%] flex justify-end">Phone number : </span>
                                        <span className="w-[70%]">{item.phoneNumber}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}