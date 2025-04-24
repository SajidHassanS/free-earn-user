import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useUploadEmailScreenshot } from "@/hooks/apis/useEmails";
import { useContextConsumer } from "@/context/Context";

const UploadScreenshotModal: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: uploadScreenshot, isPending } = useUploadEmailScreenshot();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("emailScreenshot", selectedFile);
    uploadScreenshot({ data: formData, token });
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [open]);

  //
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-auto overflow-y-auto scrollbar-custom space-y-4">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            Upload Screenshot
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <div className="rounded-md border p-2 w-full max-h-64 overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto rounded object-contain"
              />
            </div>
          )}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
            className="w-full flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadScreenshotModal;
