/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import {
  ILatestData,
  IMappedLatestData,
  MOCK_LATEST_DATA,
} from "../constants/lastest";

const columns: ColumnDef<IMappedLatestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue(
              "name"
            )}`}
            alt="user-image"
          />
          <p>{row.getValue("name")} </p>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Employee id",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "activeDate",
    header: "Active Date",
  },
  {
    accessorKey: "activeTime",
    header: "Check-Out Time",
  },
];

export default function CheckOutPage() {
  const [checkOutReport, setCheckOutReport] = useState<IMappedLatestData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckOutData = async () => {
    try {
      const response = await fetch("/api/clock-in-out/check-out-report");
      const result: Array<ILatestData> = await response.json();

      // Map the data
      const filteredData = result.map((item) => ({
        name: `${item.employee.firstName} ${item.employee.lastName}`,
        id: item.employeeId,
        department: item.employee.department,
        activeDate: item.date,
        activeTime: item.time,
      }));

      setCheckOutReport(filteredData);
    } catch (error) {
      console.log("fetch check-out error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckOutData();
  }, []);

  const reportData = [...checkOutReport, ...MOCK_LATEST_DATA];

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Report check-out time" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={reportData} />
      )}
    </div>
  );
}
