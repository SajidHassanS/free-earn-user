"use client";

import React, { useMemo, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { useGetAllEmails } from "@/hooks/apis/useEmails";
import { baseURL } from "@/api/auth";
import UploadScreenshotModal from "@/components/Forms/forms-modal/emails/UploadScreenshot";

const Emails = () => {
  const { token } = useContextConsumer();
  const [isUploadScreenshotModalOpen, setIsUploadScreenshotModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useGetAllEmails(token);
  const emails = data?.data || [];

  const emailColumns = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: any) => (
          <Badge
            variant={
              row.original.status === "pending" ? "secondary" : "success"
            }
            className={
              row.original.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        Header: "Screenshot",
        accessor: "emailScreenshot",
        Cell: ({ row }: any) => (
          <div className="w-16 h-16">
            <img
              src={row.original.emailScreenshot}
              alt="Email Screenshot"
              className="object-cover w-full h-full rounded-md border border-gray-200 shadow-sm"
            />
          </div>
        ),
      },
      {
        Header: "Uploaded At",
        accessor: "createdAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-10 rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Available Emails</h2>
          <Button
            className="text-xs"
            size="sm"
            onClick={() => setIsUploadScreenshotModalOpen(true)}
          >
            Upload Screenshot
            <Plus className="h-4 w-4 ml-1 font-bold" />
          </Button>
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : emails.length <= 0 ? (
          <p>No Email Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={emailColumns}
              data={emails}
              paginate={emails.length > 100}
            />
          </div>
        )}
      </div>
      <UploadScreenshotModal
        open={isUploadScreenshotModalOpen}
        onOpenChange={setIsUploadScreenshotModalOpen}
      />
    </>
  );
};

export default Emails;
