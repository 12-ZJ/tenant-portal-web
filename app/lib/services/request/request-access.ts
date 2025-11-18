"use client"

import { saveNewsAPI } from "../../api/config/news";
import { saveRequestAccessAPI } from "../../api/request";
import { NewsFilterDto, NewsDto, SaveNewsDto, NewsDetailDto, SaveNewsDetailDto, RequestAccessDto, SaveRequestAccessDto, RequestAccessDetailDto } from "../../types";
import { errorValidation } from "../../utils";

export const getRequestAccess = async (): Promise<RequestAccessDto[]> => {
    const res: RequestAccessDto[] = [] //await getRequestAccessAPI();
    errorValidation(res);

    const data: RequestAccessDto[] = res;
    return data;
}

export const getRequestAccessDetail = async (id: number): Promise<RequestAccessDetailDto> => {
    const res: RequestAccessDetailDto = {} as RequestAccessDetailDto //await getRequestAccessAPI(id);
    errorValidation(res);

    const data: RequestAccessDetailDto = res;
    return data;
}

export const saveRequestAccess= async (req: SaveRequestAccessDto) => {
    const res = await saveRequestAccessAPI(req);
    errorValidation(res);

    const data = res;
    return data;
}