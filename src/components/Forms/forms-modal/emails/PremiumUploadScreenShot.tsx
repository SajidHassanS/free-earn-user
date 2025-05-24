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
import { useUploadPremiumEmail } from "@/hooks/apis/useDashboard";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PremiumUploadScreenshotModal: React.FC<{
  open: boolean;
  onOpenChange: (val: boolean) => void;
  premiumData: {
    username: string;
    password: string;
    email: string;
  };
  refetch: () => Promise<any>;
}> = ({ open, onOpenChange, premiumData, refetch }) => {
  const { token } = useContextConsumer();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [email, setEmail] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [cropData, setCropData] = useState<string>("");

  const { mutate: uploadPremiumEmail, isPending } = useUploadPremiumEmail();

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
      return cropperRef.current.cropper.getCroppedCanvas().toDataURL();
    }
    return null;
  };

  const handleUpload = async () => {
    if (!premiumData || (!image && !email)) {
      toast.error("Missing required data");
      return;
    }

    const base64 = getCropData();
    const formData = new FormData();

    formData.append("name", premiumData.username);
    formData.append("password", premiumData.password);
    formData.append("recoveryEmail", premiumData.email);

    if (base64) {
      const blob = await (await fetch(base64)).blob();
      formData.append("emailScreenshot", blob, "cropped.jpg");
    }

    if (email.trim()) {
      formData.append("email", email.trim());
    }

    uploadPremiumEmail(
      { data: formData, token },
      {
        onSuccess: async () => {
          toast.success("Uploaded successfully");
          setImage("");
          setCropData("");
          setEmail("");
          onOpenChange(false);
          await refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (!open) {
      setImage("");
      setCropData("");
      setEmail("");
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
          <div className="mt-4">
            <Cropper
              src={image}
              style={{ height: 400, width: "100%" }}
              guides={true}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              viewMode={0}
              preview=".img-preview"
              width="100%"
              ref={cropperRef}
              autoCrop={true}
              ready={() => {
                const cropper = cropperRef.current?.cropper;
                if (cropper) {
                  const imageData = cropper.getImageData();
                  cropper.setData({
                    x: 0,
                    y: 0,
                    width: imageData.naturalWidth,
                    height: imageData.naturalHeight,
                  });
                }
              }}
            />
          </div>
        )}

        <LabelInputContainer className="!pb-0">
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="outline-none focus:border-primary"
          />
        </LabelInputContainer>

        <Button
          onClick={handleUpload}
          className="w-full flex items-center gap-2 mt-4"
          disabled={isPending || (!image && !email)}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUploadScreenshotModal;
