"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { useModalStore } from "@/app/hooks/use-modal-store";

import axios from "axios";
import qs from "query-string";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const isModalOpen = isOpen && type === "deleteMessage";

  const { apiUrl, query } = data;

  const [isLoading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onClick = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            The message will be permanently deleted.
          </DialogDescription>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                variant={"primary"}
                onClick={onClick}
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
