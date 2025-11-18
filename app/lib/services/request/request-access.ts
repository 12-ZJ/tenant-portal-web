"use client"

import { changeRequestAccessStatusAPI, getRequestAccessAPI, getRequestAccessDetailAPI, saveRequestAccessAPI } from "../../api/request";
import { RequestAccessDto, SaveRequestAccessDto, RequestAccessDetailDto, ChangeRequestAccessStatusDto } from "../../types";
import { errorValidation } from "../../utils";

export const getRequestAccess = async (): Promise<RequestAccessDto[]> => {
    const res = await getRequestAccessAPI();
    errorValidation(res);

    const data: RequestAccessDto[] = res;
    return data;
}

export const getRequestAccessDetail = async (id: number): Promise<RequestAccessDetailDto> => {
    const res = await getRequestAccessDetailAPI(id);
    errorValidation(res);

    const data: RequestAccessDetailDto = res;
    return data;
}

export const saveRequestAccess= async (req: SaveRequestAccessDto) => {
    const res = await saveRequestAccessAPI(req);
    errorValidation(res);

    const data = res.id;
    return data;
}

export const changeRequestAccessStatus= async (req: ChangeRequestAccessStatusDto) => {
    const res = await changeRequestAccessStatusAPI(req);
    errorValidation(res);

    const data = res;
    return data;
}