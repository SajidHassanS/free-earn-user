"use client";

import React, { useMemo } from "react";
import { useContextConsumer } from "@/context/Context";
import DataTable from "@/components/Table/DataTable";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { useGetDuplicateEmailList } from "@/hooks/apis/useEmails";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

const DuplicateEmails = () => {
  const { token } = useContextConsumer();

  const { data: duplicateEmailData, isLoading: duplicateEmailLoading } =
    useGetDuplicateEmailList(token);

  const duplicateEmails = duplicateEmailData?.data || [];

  const duplicateEmailColumns = useMemo<ColumnDef<any>[] | any[]>(
    () => [
      {
        Header: "Duplicated Details",
        id: "uploadedDetails",
        columns: [
          {
            Header: "Email",
            accessor: "originalEmail.email",
          },
          {
            Header: "Duplicate File Name",
            accessor: "fileName",
          },
          {
            Header: "Uploaded At",
            accessor: "createdAt",
            Cell: ({ row }: any) =>
              format(
                new Date(row.original.originalEmail.createdAt),
                "dd MMM yyyy, hh:mm a"
              ),
          },
        ],
      },
      {
        Header: "Original Details",
        id: "originalDetails",
        columns: [
          {
            Header: "Original File",
            accessor: "originalEmail.fileName",
          },
          {
            Header: "Uploaded By",
            accessor: "uploader.username",
          },
          {
            Header: "Uploaded At",
            accessor: "originalEmail.createdAt",
            Cell: ({ row }: any) =>
              format(
                new Date(row.original.originalEmail.createdAt),
                "dd MMM yyyy, hh:mm a"
              ),
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-10 rounded-2xl">
        <h2 className="text-2xl font-bold text-primary">Duplicate Emails</h2>
        {duplicateEmailLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : duplicateEmails.length <= 0 ? (
          <p>No Duplicate Emails Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={duplicateEmailColumns as any}
              data={duplicateEmails}
              paginate={duplicateEmails.length > 100}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DuplicateEmails;
