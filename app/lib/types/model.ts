export type User = {
    id: number;
    code: string;
    fullname: string;
    email: string;
    password?: string;
    isActive?: boolean;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number
}

export type NewsModel = {
    id: number;
    topicTH: string;
    topicEN: string;
    detailTh: string;
    detailEn: string;
    newsTypeId: string;
    displayDateStart: string;
    displayDateEnd: string;
    isActive: boolean;
    isTenant: boolean;
    isTenantService: boolean;
    isPropertyService: boolean;
    isSafety: boolean;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
}

export type NewsAttachmentModel = {
    id: number;
    newsId: number;
    filename: string;
    createdOn: string;
    createdBy: number;
}

export type RequestAccessModel = {
    id: number;
    requestNo: string;
    buildingId: number;
    floorId: number;
    areaId: number;
    accessDate: string;
    note: string;
    accessStatusId: string;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
}

export type RequestAccessPeopleModel = {
    id: number;
    requestAccessId: number;
    genderId: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
}

export type RequestAccessPeopleAttachmentModel = {
    id: number;
    requestAccessPeopleId: number;
    filename: string;
    createdOn?: string;
    createdBy?: number;
}

export type RequestAccessLogModel = {
    id: number;
    requestAccessId: number;
    accessActivityId: string;
    userId: number;
    timestamp: string;
    remark: string;
}

export type BuildingModel = {
    id: number;
    nameTH: string;
    nameEN: string;
    createdOn: string;
    createdBy: number;
    updatedOn: string;
    updatedBy: number;
}

export type FloorModel = {
    id: number;
    nameTH: string;
    nameEN: string;
    createdOn: string;
    createdBy: number;
    updatedOn: string;
    updatedBy: number;
}

export type AreaModel = {
    id: number;
    nameTH: string;
    nameEN: string;
    createdOn: string;
    createdBy: number;
    updatedOn: string;
    updatedBy: number;
}

export type NewsBuildingModel = {
    id: number;
    newsId: number;
    buildingId: number;
    createdOn: string;
    createdBy: number;
}