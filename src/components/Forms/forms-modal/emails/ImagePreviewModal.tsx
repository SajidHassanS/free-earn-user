// components/ui/modals/ImagePreviewModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";
import Image from "next/image";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  onClose,
  imageUrl,
}) => {
  //donwload image
  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const extensionMatch = imageUrl.match(/\.(\w+)(\?|$)/);
      const extension = extensionMatch ? extensionMatch[1] : "png";

      const link = document.createElement("a");
      link.href = url;
      link.download = `screenshot.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        "Sorry, this image cannot be downloaded due to cross-origin restrictions."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-xl p-4 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg">Screenshot Preview</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <Image
            width={600}
            height={600}
            src={imageUrl}
            alt="Screenshot Preview"
            className="w-full max-h-[60vh] object-contain rounded border"
          />
        )}
        <Button
          onClick={handleDownload}
          className="w-full flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Image
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
