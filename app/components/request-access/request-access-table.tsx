"use client";

import { useCallback, useState } from "react";
import { Column } from "../table/table";
import { AppTable } from "../table/app-table";
import { useRouter } from "next/navigation";
import { RequestAccessDto, RequestAccessFilterDto } from "@/app/lib/types";
import { sortBy } from "@/app/lib/utils";
import { defaultRequestAccessFilter } from "@/app/lib/constants";
import { formatDate } from "@/app/lib/utils";
import { useLoadingStore } from "@/app/store";
import Link from "next/link";
import AccessStatus from "./access-status";
import { getRequestAccess } from "@/app/lib/services/request";

const columns: Column<RequestAccessDto>[] = [
  {
    key: "requestNo",
    label: "Request No",
    class: "w-[15%]",
    sortable: false,
    render: (row) => (
      <Link href={`/request-access/${row.id}/detail`} className="font-medium text-theme_link"> {row.requestNo} </Link>
    )
  },
  {
    key: "accessDate",
    label: "Access Date",
    class: "w-[15%]",
    sortable: false,
    render: (row) => (formatDate(String(row.accessDate)))
  },
  {
    key: "buildingNameEN",
    label: "Building",
    class: "w-[20%]",
    sortable: false,
  },
  {
    key: "floorNameEN",
    label: "Floor",
    class: "w-[20%]",
    sortable: false,
  },
  {
    key: "areaNameEN",
    label: "Area",
    class: "w-[20%]",
    sortable: false,
  },
  {
    key: "accessStatusNameEN",
    label: "Status",
    class: "w-[10%]",
    sortable: false,
    render: (row) => (
      <AccessStatus id={row.accessStatusId} name={row.accessStatusNameEN} />
    ),
  },
];

export const userSorter = (data: RequestAccessDto[], asc: boolean, col: string) => {
  switch (col) {
    case "requestNo":
    case "buildingNameEN":
    case "floorNameEN":
    case "areaNameEN":
    case "accessStatusNameEN":
      return sortBy(data, col as keyof RequestAccessDto, "string", asc);
    case "accessDate":
      return sortBy(data, col as keyof RequestAccessDto, "date", asc);
    default:
      return data;
  }
};

export default function RequestAccessTable() {
  const [filter, setfilter] = useState<RequestAccessFilterDto>(defaultRequestAccessFilter);
  const [trigger, setTrigger] = useState(0);

  const { setLoading } = useLoadingStore((state) => state);
  const router = useRouter();

  const fetcherAction = useCallback(
      () => getRequestAccess(),
    [filter]
  );

  // const handleSearch = (filter: RequestAccessFilterDto) => {
  //   setfilter(filter);
  //   setTrigger((t) => t + 1);
  // };

  return (
    <AppTable<RequestAccessDto>
      title="Request Access"
      // FilterComponent={
      //   <RequestAccessFilter
      //     onSearch={(filter) => handleSearch(filter)}
      //     onCreate={() => router.push("/request-access/0/detail")}
      //   />
      // }
      tableStyleClass="w-full"
      columns={columns}
      trigger={trigger}
      fetcherAction={fetcherAction}
      sorter={userSorter}
      rowKeyAction={(row) => row.id}
    />
  );
}