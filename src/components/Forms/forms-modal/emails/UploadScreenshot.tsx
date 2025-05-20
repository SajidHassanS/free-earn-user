"use client";

import React, { useState, useRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useContextConsumer } from "@/context/Context";
import { useUploadEmailScreenshot } from "@/hooks/apis/useEmails";

const UploadScreenshotModal: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();
  const cropperRef = useRef<ReactCropperElement>(null);

  const [image, setImage] = useState<string>("");
  const [cropData, setCropData] = useState<string>("");
  const { mutate: uploadScreenshot, isPending } = useUploadEmailScreenshot();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setCropData("");
    };
    reader.readAsDataURL(file);
  };

  const getCropData = () => {
    if (cropperRef.current?.cropper) {
      const croppedBase64 = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      setCropData(croppedBase64);
      return croppedBase64;
    }
    return null;
  };

  const handleUpload = async () => {
    const base64 = getCropData();
    if (!base64) return;

    const blob = await (await fetch(base64)).blob();
    const formData = new FormData();
    formData.append("emailScreenshot", blob, "cropped.jpg");

    uploadScreenshot(
      { data: formData, token },
      {
        onSuccess: () => {
          setImage("");
          setCropData("");
          onOpenChange(false);
        },
      }
    );
  };

  useEffect(() => {
    if (!open) {
      setImage("");
      setCropData("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-2xl h-auto overflow-y-auto scrollbar-custom">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold">
            Upload & Crop Screenshot
          </DialogTitle>
        </DialogHeader>

        <Input type="file" accept="image/*" onChange={handleFileChange} />

        {image && (
          <>
            <div className="mt-4">
              <Cropper
                src={image}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={4 / 3}
                guides={true}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                viewMode={1}
                preview=".img-preview"
                ref={cropperRef}
              />
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Live Preview
              </p>
              <div className="img-preview w-full h-48 border rounded-md overflow-hidden" />
            </div>

            <Button
              onClick={handleUpload}
              className="w-full flex items-center gap-2 mt-4"
              disabled={isPending}
            >
              <UploadCloud className="w-4 h-4" />
              Upload Cropped Image
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadScreenshotModal;
