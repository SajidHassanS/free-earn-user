"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { useContextConsumer } from "@/context/Context";
import { useUploadEmailScreenshot } from "@/hooks/apis/useEmails";
import { getCroppedImg } from "@/lib/getCroppedImg";

const UploadScreenshotModal: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { mutate: uploadScreenshot, isPending } = useUploadEmailScreenshot();

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    const updatePreview = async () => {
      if (!imageSrc || !croppedAreaPixels) return;
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(blob);
      setCroppedImage(previewUrl);
    };
    updatePreview();
  }, [crop, zoom, imageSrc, croppedAreaPixels]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!croppedImage) return;

    const response = await fetch(croppedImage);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("emailScreenshot", blob, "cropped-image.jpg");

    uploadScreenshot(
      { data: formData, token },
      {
        onSuccess: () => {
          handleReset();
          onOpenChange(false);
        },
      }
    );
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  useEffect(() => {
    if (!open) handleReset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-[80vw] md:max-w-md overflow-y-auto scrollbar-custom ${
          imageSrc ? "h-[96vh]" : "h-auto"
        }`}
      >
        <DialogHeader className="!py-0">
          <DialogTitle className="text-primary text-xl font-bold">
            Upload & Crop Screenshot
          </DialogTitle>
        </DialogHeader>

        <Input type="file" accept="image/*" onChange={handleFileChange} />

        {imageSrc && (
          <div className="relative h-64 bg-black rounded-md overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {imageSrc && (
          <>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Zoom</span>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(val) => setZoom(val[0])}
                className="w-full"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleReset}
                title="Reset Image"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {croppedImage && (
              <div className="mt-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Live Preview
                </p>
                <img
                  src={croppedImage}
                  alt="Cropped"
                  className="w-full max-h-48 rounded-md border object-contain"
                />
              </div>
            )}

            <Button
              onClick={handleUpload}
              className="w-full flex items-center gap-2 mt-4"
              disabled={!croppedImage || isPending}
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
