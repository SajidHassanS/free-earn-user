import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddBulkPhoneForm from "./AddBulkPhoneForm";

const BulkPhoneModal: React.FC<any> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-fit overflow-y-auto scrollbar-custom">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold pt-4">
            Add Bulk Phones No
          </DialogTitle>
        </DialogHeader>
        <AddBulkPhoneForm onClose={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default BulkPhoneModal;
