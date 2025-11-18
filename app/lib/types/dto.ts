import { ID } from './common';
import { AreaModel, BuildingModel, FloorModel, NewsAttachmentModel, NewsBuildingModel, NewsModel, RequestAccessLogModel, RequestAccessModel, RequestAccessPeopleAttachmentModel, RequestAccessPeopleModel } from "./model";

export type LoginDto = {
  email: string;
  password: string;
}

export type StaticFilter = {
  id?: string;
  isActive?: number;
}

export type StaticResponse = {
  id: string;
  nameTH: string;
  nameEN: string;
}

export type NewsFilterDto = {
  keyword: string;
  newsTypeId: string;
  displayDate: string;
  isActive: number;
}

export type NewsAttachmentDto = NewsAttachmentModel & {
  base64: string;
  createdByName: string;
}

export type NewsDto = NewsModel & {
  newsTypeNameTH: string;
  newsTypeNameEN: string;
  createdByName: string;
  updatedByName: string;
  newsAttachment: NewsAttachmentDto[]
}

export type NewsBuildingDto = NewsBuildingModel & {
  createdByName: string;
}

export type NewsDetailDto = NewsDto & {
  newsBuilding: NewsBuildingDto[];
}

export type SaveNewsBuildingDto = {
  id: number;
  newsId: number;
  buildingId: number;
}

export type SaveNewsAttachmentDto = {
  id: number;
  newsId: number;
  filename: string;
  base64: string;
}

export type SaveNewsDto = Omit<NewsModel, "createdOn" | "createdBy" | "updatedOn" | "updatedBy">;

export type SaveNewsDetailDto = {
  news: SaveNewsDto;
  newsBuilding: SaveNewsBuildingDto[];
  newsAttachment: SaveNewsAttachmentDto[];
  userId: number;
}

export type RequestAccessDto = RequestAccessModel & {
  buildingNameTH: string;
  buildingNameEN: string;
  floorNameTH: string;
  floorNameEN: string;
  areaNameTH: string;
  areaNameEN: string;
  accessStatusNameTH: string;
  accessStatusNameEN: string;
  createdByName: string;
  updatedByName: string;
};

export type RequestAccessExtended = RequestAccessModel & {
  accessStatusNameTH: string;
  accessStatusNameEN: string;
  createdByName: string;
  updatedByName: string;
};

export type RequestAccessPeopleAttachmentExtended = 
  RequestAccessPeopleAttachmentModel & {
    createdByName: string;
    base64: string;
  };

export type RequestAccessPeopleExtended = 
  RequestAccessPeopleModel & {
    createdByName: string;
    updatedByName: string;
    requestAccessPeopleAttachment: RequestAccessPeopleAttachmentExtended[];
  };

export type RequestAccessLogExtended = 
  RequestAccessLogModel & {
    requestAccessActivityName: string;
    userName: string;
  };

export type RequestAccessDetailDto = {
  requestAccess: RequestAccessExtended;
  requestAccessPeople: RequestAccessPeopleExtended[];
  requestAccessLog: RequestAccessLogExtended[];
};

export type SaveRequestAccess = Omit<RequestAccessModel, "createdOn" | "createdBy" | "updatedOn" | "updatedBy">;
export type SaveRequestAccessPeopleAttachment = Omit<RequestAccessPeopleAttachmentModel, "createdOn" | "createdBy"> & { base64: string };
export type SaveRequestAccessPeople = Omit<RequestAccessPeopleModel, "createdOn" | "createdBy" | "updatedOn" | "updatedBy"> & {
  requestAccessPeopleAttachment: SaveRequestAccessPeopleAttachment[];
};

export type SaveRequestAccessDto = {
  requestAccess: SaveRequestAccess;
  requestAccessPeople: SaveRequestAccessPeople[];
  userId: number;
}

export type ChangeRequestAccessStatusDto = {
  requestAccessId: number;
  remark: string;
  userId: number;
  accessActivityId: string;
}

export type ChangeRequestMaintainStatusDto = {
  requestMaintain: {
    id: number;
    satisfaction: number;
    suggestion: string;
  }
  remark: string;
  userId: number;
  maintainActivityId: string;
}

export type StaticDto = {
  id: string;
  nameTH: string;
  nameEN: string;
};

export type DropdownDto = {
  newsType: StaticDto[];
  building: Omit<BuildingModel, "createdOn" | "createdBy" | "updatedOn" | "updatedBy">[];
  floor: (Omit<FloorModel, "createdOn" | "createdBy" | "updatedOn" | "updatedBy"> & { 
    buildingId: number; 
  })[];
  area: (Omit<AreaModel, "createdOn" | "createdBy" | "updatedOn" | "updatedBy"> & { 
    buildingId: number; 
    floorId: number; 
  })[];
  gender: StaticDto[];
};

