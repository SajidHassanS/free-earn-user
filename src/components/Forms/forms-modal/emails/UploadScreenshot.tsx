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
import { Loader2, UploadCloud } from "lucide-react";
import { useContextConsumer } from "@/context/Context";
import { useUploadEmailScreenshot } from "@/hooks/apis/useEmails";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const UploadScreenshotModal: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [cropData, setCropData] = useState<string>("");

  //
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
    if (remarks.trim()) {
      formData.append("remarks", remarks.trim());
    }

    uploadScreenshot(
      { data: formData, token },
      {
        onSuccess: () => {
          setImage("");
          setCropData("");
          setRemarks("");
          onOpenChange(false);
        },
      }
    );
  };

  useEffect(() => {
    if (!open) {
      setImage("");
      setCropData("");
      setRemarks("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[80vw] md:max-w-2xl h-[85vh] overflow-y-auto scrollbar-custom",
          !image && "h-[35vh]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold">
            Upload & Crop Screenshot
          </DialogTitle>
        </DialogHeader>

        <Label>Select Image</Label>
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
                width="100%"
                ref={cropperRef}
                autoCrop={true}
                ready={() => {
                  const cropper = cropperRef.current?.cropper;
                  if (cropper) {
                    const imageData = cropper.getImageData();
                    const cropBoxWidth = imageData.width;
                    const cropBoxHeight = cropBoxWidth / (4 / 3);
                    cropper.setCropBoxData({
                      left: 0,
                      top: (imageData.height - cropBoxHeight) / 2,
                      width: cropBoxWidth,
                      height: cropBoxHeight,
                    });
                  }
                }}
              />
            </div>
          </>
        )}

        <LabelInputContainer className="!pb-0">
          <Label htmlFor="remarks">Remarks</Label>
          <Input
            type="text"
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks"
            className="outline-none focus:border-primary"
          />
        </LabelInputContainer>

        <Button
          onClick={handleUpload}
          className="w-full flex items-center gap-2 mt-4"
          disabled={isPending || !image}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {isPending ? "Uploading..." : "Upload Image"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadScreenshotModal;
