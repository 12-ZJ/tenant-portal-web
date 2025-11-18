import { NewsFilterDto, RequestAccessDetailDto, RequestAccessFilterDto, RequestAccessModel, SaveNewsDto, SaveRequestAccess, SaveRequestAccessPeople } from "../types";

export const defaultNewsFilter: NewsFilterDto = {
    keyword: "",
    newsTypeId: "",
    displayDate: "",
    isActive: 0
}

export const defaultRequestAccessFilter: RequestAccessFilterDto = {
    keyword: ""
}

export const defaultNews: SaveNewsDto = {
    id: 0,
    topicTH: "",
    topicEN: "",
    detailTH: "",
    detailEN: "",
    newsTypeId: "",
    displayDateStart: "",
    displayDateEnd: "",
    isActive: false,
    isTenant: false,
    isTenantService: false,
    isPropertyService: false,
    isSafety: false
}

export const defaultRequestAccess: SaveRequestAccess = {
    id: 0,
    requestNo: "",
    buildingId: 0,
    floorId: 0,
    areaId: 0,
    accessDate: "",
    note: "",
    accessStatusId: ""
}

export const defaultRequestAccessPeople: SaveRequestAccessPeople = {
    id: 0,
    requestAccessId: 0,
    genderId: "",
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    requestAccessPeopleAttachment: []
}

export const defaultRequestAccessDetail: RequestAccessDetailDto = {
    requestAccess: {
        id: 1,
        requestNo: "",
        buildingId: 0,
        floorId: 0,
        areaId: 0,
        accessDate: "",
        note: "",
        accessStatusId: "",
        accessStatusNameTH: "",
        accessStatusNameEN: "",
        createdByName: "",
        updatedByName: "",
    },
    requestAccessPeople: [],
    requestAccessLog: []
}