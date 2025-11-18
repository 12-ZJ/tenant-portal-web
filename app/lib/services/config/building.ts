"use client"

import { getBuildingAPI } from "../../api/config";
import { BuildingModel, StaticFilter, StaticResponse } from "../../types";
import { errorValidation } from "../../utils";

export const getBuilding = async (params: StaticFilter): Promise<BuildingModel[]> => {
    const res: BuildingModel[] = [
        {
            id: 1,
            nameTH: "อาคาร A",
            nameEN: "Building A",
            createdOn: "",
            createdBy: 0,
            updatedOn: "",
            updatedBy: 0
        },
        {
            id: 2,
            nameTH: "อาคาร B",
            nameEN: "Building B",
            createdOn: "",
            createdBy: 0,
            updatedOn: "",
            updatedBy: 0
        }
    ] //await getBuildingAPI(params);
    errorValidation(res);

    const data: BuildingModel[] = res;
    return data;
}
