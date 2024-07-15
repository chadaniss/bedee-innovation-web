/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { IEmployee, IMappedUserData } from "../constants/employee";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { useRouter } from "next/router";

const columns: ColumnDef<IMappedUserData>[] = [
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
    id: "edit",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => window.location.href = `/upload?employee=${user.id}`}
        >
          <Pen />
        </Button>
      );
    },
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<IMappedUserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckInData = async () => {
    try {
      const response = await fetch("/api/employee");
      const result: Array<IEmployee> = await response.json();

      const userData = result.map((item) => ({
        name: `${item.firstName} ${item.lastName}`,
        id: item.employeeId,
        department: item.department,
      }));

      setUsers(userData);
    } catch (error) {
      console.log("fetch users error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckInData();
  }, []);

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Users" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
}
