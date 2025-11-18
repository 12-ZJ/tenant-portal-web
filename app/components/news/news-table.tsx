"use client";

import { useCallback, useState } from "react";
import { Column } from "../table/table";
import { AppTable } from "../table/app-table";
import { useRouter } from "next/navigation";
import { NewsDto, NewsFilterDto } from "@/app/lib/types";
import { sortBy } from "@/app/lib/utils";
import { defaultNewsFilter } from "@/app/lib/constants";
import { formatDate } from "@/app/lib/utils";
import Link from "next/link";
import NewsFilter from "./news-filter";
import { getNews } from "@/app/lib/services";

const columns: Column<NewsDto>[] = [
  {
    key: "topicEN",
    label: "Topic",
    class: "w-[30%]",
    sortable: false,
    render: (row) => (
      <Link href={`/news/${row.id}/detail`} className="font-medium text-theme_link"> {row.topicEN} </Link>
    )
  },
  {
    key: "newsTypeNameEN",
    label: "Type",
    class: "w-[15%]",
    sortable: false,
  },
  {
    key: "displayDate",
    label: "Display Date",
    class: "w-[15%]",
    sortable: false,
    render: (row) => (formatDate(row.displayDateStart)+" - "+formatDate(row.displayDateEnd))
  },
  {
    key: "createdOn",
    label: "Created Date",
    class: "w-[10%]",
    sortable: false,
    render: (row) => (formatDate(String(row.createdOn)))
  },
  {
    key: "createdByName",
    label: "Created By",
    class: "w-[20%]",
    sortable: false,
  },
  {
    key: "isActive",
    label: "Status",
    class: "w-[10%]",
    sortable: false,
    render: (row) => (row.isActive ? "Active" : "Inactive"),
  },
];

export const userSorter = (data: NewsDto[], asc: boolean, col: string) => {
  switch (col) {
    case "topicEN":
    case "newsTypeNameEN":
    case "createdByName":
      return sortBy(data, col as keyof NewsDto, "string", asc);
    case "displayDate":
    case "createdOn":
      return sortBy(data, col as keyof NewsDto, "date", asc);
    case "active":
      return sortBy(data, "isActive", "boolean", asc);
    default:
      return data;
  }
};

export default function NewsTable() {
  const [filter, setfilter] = useState<NewsFilterDto>(defaultNewsFilter);
  const [trigger, setTrigger] = useState(0);

  const router = useRouter();

  const fetcherAction = useCallback(
      () => getNews({...filter}),
    [filter]
  );

  const handleSearch = (newFilter: NewsFilterDto) => {
    console.log(newFilter);
    setfilter(newFilter);
    setTrigger((t) => t + 1);
  };

  return (
    <AppTable<NewsDto>
      title="News Management"
      FilterComponent={
        <NewsFilter
          onSearch={(filter) => handleSearch(filter)}
          onCreate={() => router.push("/news/0/detail")}
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