"use client";

import { useCallback, useEffect, useState } from "react";
import { SelectField, SearchInput, ActionButton } from "../common";
import { NewsFilterDto, Option  } from "@/app/lib/types";
import DatePicker from "../common/date-picker";
import { createChangeHandler, formatDate, handleApiErrorWithRedirect, handleRangeDateChange } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useLoadingStore, useUserStore } from "@/app/store";
import { defaultNewsFilter } from "@/app/lib/constants/default";
import { activeStatus } from "@/app/lib/constants";
import { getNewsType } from "@/app/lib/services";
import { MdOutlineCreate } from "react-icons/md";

interface Props {
    onSearch: (filter: NewsFilterDto) => void;
    onCreate: () => void;
}

const NewsFilter = ({ onSearch, onCreate }: Props) => {
    const [filter, setFilter] = useState<NewsFilterDto>(defaultNewsFilter);
    const [typeOption, setTypeOption] = useState<Option[]>([]);
    const [mounted, setMounted] = useState(false);

    const { loading } = useLoadingStore((state) => state);
    const { userInfo } = useUserStore((state) => state);

    const { multi: handleMultiChange } = createChangeHandler(filter, setFilter);

    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const type = await getNewsType({isActive: 1});
            setTypeOption(type.map(e => ({ value: String(e.id), label: e.nameEN })));
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        }
    }, [router]);

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, [fetchData]);

    if (!mounted) { return null; }

    const handleReset = () => {
        setFilter(defaultNewsFilter);
        onSearch(defaultNewsFilter);
    };

    return (
        <div className="space-y-5">
            <div className="w-full flex items-center space-x-3">
                <div className="w-full flex space-x-3">
                    <div className="w-4/6 h-fit flex items-center space-x-3">
                        <div className="w-2/5">
                            <SearchInput
                                placeholder="Keyword"
                                onChange={(e) => handleMultiChange({keyword: e.target.value})}
                                value={filter?.keyword}
                            />
                        </div>

                        <SelectField
                            id="select_newsTypeId"
                            name="newsTypeId"
                            placeholder="Type"
                            className="w-1/5"
                            clearable={true}
                            options={typeOption}
                            value={filter.newsTypeId}
                            selectAction={(option) => handleMultiChange({newsTypeId: option?.value})}
                        />

                        <DatePicker
                            className="w-1/5"
                            placeholder={"Display Date"}
                            start={filter.displayDate ? new Date(filter.displayDate) : null}
                            end={filter.displayDate ? new Date(filter.displayDate) : null}
                            onChange={(e) => handleMultiChange({displayDate: formatDate(e.startDate, "YYYY-MM-DD")})}
                        />

                        <SelectField
                            id="select_status"
                            name="status"
                            placeholder="Status"
                            className="w-1/5"
                            clearable={true}
                            options={activeStatus}
                            value={String(filter.isActive)}
                            selectAction={(option) => handleMultiChange({isActive: Number(option?.value)})}
                        />
                    </div>
                    <div className="w-1/6 flex gap-5">
                        <button type="button" className="primary-button" onClick={() => onSearch(filter)}> Search </button>
                        <button type="button" className="clear-button" onClick={handleReset}> Reset </button>
                    </div>
                    <div className="w-1/6 flex justify-end">
                        <ActionButton className="tertiary-button" label="Create" icon={<MdOutlineCreate />} onClick={onCreate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsFilter;