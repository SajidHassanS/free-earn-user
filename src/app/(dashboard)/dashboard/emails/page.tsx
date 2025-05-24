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
import UploadScreenshotModal from "@/components/Forms/forms-modal/emails/UploadScreenshot";
import ImagePreviewModal from "@/components/Forms/forms-modal/emails/ImagePreviewModal";
import InsertEmailsModals from "@/components/Forms/forms-modal/emails/InsertBulkEmails";

const Emails = () => {
  const { token } = useContextConsumer();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isInsertEmailModalOpen, setIsInsertEmailModalOpen] =
    useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isUploadScreenshotModalOpen, setIsUploadScreenshotModalOpen] =
    useState<boolean>(false);

  const { data, isLoading } = useGetAllEmails(token);
  const emails = data?.data || [];

  const openImageModal = (url: string) => {
    setSelectedImageUrl(url);
    setIsPreviewModalOpen(true);
  };

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
        Header: "Recovery Email",
        accessor: "recoveryEmail",
        Cell: ({ row }: any) => {
          const recoveryEmail = row.original.recoveryEmail;
          return recoveryEmail?.trim() ? recoveryEmail : "-";
        },
      },
      {
        Header: "Remarks",
        accessor: "remarks",
        Cell: ({ row }: any) => {
          const remarks = row.original.remarks;
          return remarks?.trim() ? remarks : "-";
        },
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
                : row.original.status === "bad"
                ? "bg-red-100 text-yellow-700"
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
        disableFilter: true,
        Cell: ({ row }: any) => {
          const imageUrl = row.original.emailScreenshot;
          return (
            <div
              className="w-16 h-16 cursor-pointer"
              onClick={() => openImageModal(imageUrl)}
            >
              <img
                src={imageUrl}
                alt="Email Screenshot"
                className="object-cover w-full h-full rounded-md border border-gray-200 shadow-sm"
              />
            </div>
          );
        },
      },
      {
        Header: "Uploaded At",
        accessor: "createdAt",
        disableFilter: true,
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="p-2 lg:p-10 space-y-4 rounded-2xl">
        <div className="lg:flex justify-between">
          <h2 className="text-xl lg:text-2xl font-bold text-primary">
            Available Emails
          </h2>
          <div className="flex gap-2 mt-2 lg:mt-0">
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsInsertEmailModalOpen(true)}
            >
              Insert Emails
              <Plus className="h-4 w-4 ml-1 font-bold" />
            </Button>
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsUploadScreenshotModalOpen(true)}
            >
              Upload Screenshot
              <Plus className="h-4 w-4 ml-1 font-bold" />
            </Button>
          </div>
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
              // data={groupEmailsByKey(emails, "emailScreenshot")}
              paginate={emails.length > 100}
            />
          </div>
        )}
      </div>
      <UploadScreenshotModal
        open={isUploadScreenshotModalOpen}
        onOpenChange={setIsUploadScreenshotModalOpen}
      />
      <ImagePreviewModal
        open={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        imageUrl={selectedImageUrl}
      />
      <InsertEmailsModals
        open={isInsertEmailModalOpen}
        onOpenChange={setIsInsertEmailModalOpen}
      />
    </>
  );
};

export default Emails;
