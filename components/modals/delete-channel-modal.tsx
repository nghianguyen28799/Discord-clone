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
import { useRouter } from "next/navigation";
import qs from "query-string";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteChannel";

  const { server, channel } = data;

  const [isLoading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onClick = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${server?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
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
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br />
            <span className="text-indigo-500 font-semibold">
              #{channel?.name}
            </span>{" "}
            will be permanently deleted.
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
