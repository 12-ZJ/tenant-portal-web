"use client"

import { getNewsAPI, getNewsDetailAPI, saveNewsAPI } from "../../api/config/news";
import { NewsFilterDto, NewsDto, NewsDetailDto, SaveNewsDetailDto } from "../../types";
import { errorValidation } from "../../utils";

export const getNews = async (filter: NewsFilterDto): Promise<NewsDto[]> => {
    const res = await getNewsAPI(filter);
    errorValidation(res);

    const data: NewsDto[] = res.news;
    return data;
}

export const getNewsDetail = async (id: number): Promise<NewsDetailDto> => {
    const res: NewsDetailDto = await getNewsDetailAPI(id);
    errorValidation(res);

    const data: NewsDetailDto = res;
    return data;
}

export const saveNews= async (req: SaveNewsDetailDto) => {
    const res = await saveNewsAPI(req);
    errorValidation(res);

    const data = res;
    return data;
}