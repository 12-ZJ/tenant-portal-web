"use client"

import { LuLogOut } from "react-icons/lu"
import NavLink from "./nav-link"
import { useUserStore } from "@/app/store"
import { useRouter } from "next/navigation";
import { signOut } from "@/app/lib/api";

export default function TopNav() {
    const { userInfo } = useUserStore((state) => state);
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        localStorage.clear();
        router.replace("/login");
    }
    return (
        <div className="flex gap-10 h-full px-2">
            <div className="w-[12%] flex items-center">
                <span className="text-white font-medium bg-theme_primary px-4 py-2 text-center rounded w-full">TENANT PORTAL</span>
            </div>

            <div className="w-[68%] text-sm">
                <NavLink />
            </div>

            <div className="w-[20%] flex justify-end items-center gap-2">
                <span> { userInfo.fullname } </span>
                <button onClick={handleLogout}>
                    <LuLogOut size={14} className="cursor-pointer" />
                </button>
            </div>
        </div>
    )
}