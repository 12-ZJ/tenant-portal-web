"use client";

import { useCallback, useState } from "react";
import { Column } from "../table/table";
import { AppTable } from "../table/app-table";
import { useRouter } from "next/navigation";
import { NewsDto, NewsFilterDto, RequestAccessDto } from "@/app/lib/types";
import { sortBy } from "@/app/lib/utils";
import { defaultNewsFilter } from "@/app/lib/constants";
import { formatDate, formatNumber } from "@/app/lib/utils";
import { useLoadingStore } from "@/app/store";
import Link from "next/link";
import RequestAccessFilter from "./request-access-filter";
import { getNews } from "@/app/lib/services";
import AccessStatus from "./access-status";

const columns: Column<RequestAccessDto>[] = [
  {
    key: "requestNo",
    label: "Request No",
    class: "w-[15%]",
    sortable: false,
    render: (row) => (
      <Link href={`/news/${row.id}/detail`} className="font-medium text-theme_link"> {row.requestNo} </Link>
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

export const userSorter = (data: NewsDto[], asc: boolean, col: string) => {
  switch (col) {
    case "requestNo":
    case "buildingNameEN":
    case "floorNameEN":
    case "areaNameEN":
    case "accessStatusNameEN":
      return sortBy(data, col as keyof NewsDto, "string", asc);
    case "accessDate":
      return sortBy(data, col as keyof NewsDto, "date", asc);
    default:
      return data;
  }
};

export default function RequestAccessTable() {
  const [filter, setfilter] = useState<NewsFilterDto>(defaultNewsFilter);
  const [trigger, setTrigger] = useState(0);

  const { setLoading } = useLoadingStore((state) => state);
  const router = useRouter();

  const fetcherAction = useCallback(
      () => getNews({...filter}),
    [filter]
  );

  const handleSearch = (filter: NewsFilterDto) => {
    setfilter(filter);
    setTrigger((t) => t + 1);
  };

  return (
    <AppTable<NewsDto>
      title="Request Access"
      FilterComponent={
        <RequestAccessFilter
          onSearch={(filter) => handleSearch(filter)}
          onCreate={() => router.push("/request-access/0/detail")}
        />
      }
      tableStyleClass="w-full"
      columns={columns}
      trigger={trigger}
      fetcherAction={fetcherAction}
      sorter={userSorter}
      rowKeyAction={(row) => row.id}
    />
  );
}