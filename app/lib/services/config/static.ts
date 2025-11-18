"use client"

import { getNewsTypeAPI } from "../../api/config";
import { DropdownDto, StaticFilter, StaticResponse } from "../../types";
import { errorValidation } from "../../utils";

export const getNewsType = async (params: StaticFilter): Promise<StaticResponse[]> => {
    const res: StaticResponse[] = [] //await getNewsTypeAPI(params);
    errorValidation(res);

    const data: StaticResponse[] = res;
    return data;
}

export const getDropdown = async (params: StaticFilter): Promise<DropdownDto> => {
    const res: DropdownDto = {} as DropdownDto //await getDropdownAPI(params);
    errorValidation(res);

    const data: DropdownDto = res;
    return data;
}