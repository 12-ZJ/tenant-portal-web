"use client"

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
    title: string
}

const SecondaryHeader = ({ title }: Props) => {
    const router = useRouter();

    const handleBack = () => {
      router.back();
    };

    return (
        <div>
            <button type="button" className="absolute flex items-center gap-2 text-theme_back hover:text-theme_label cursor-pointer"
                onClick={handleBack}>
                <IoIosArrowBack size={12} /> Back
            </button>
            <div className="text-2xl font-semibold text-theme_topic text-center">
                {title} 
            </div>
        </div>
    )
}

export default SecondaryHeader;