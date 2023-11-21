"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/app/hooks/use-modal-store";
import qs from "query-string";

const schema = yup.object({
  fileUrl: yup.string().min(1, {
    message: "Server name is required",
  }),
});

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";

  const { apiUrl, query } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const methods = useForm({
    defaultValues: {
      fileUrl: "",
    },
    resolver: yupResolver(schema),
  });

  const { reset, formState, handleSubmit, control } = methods;

  const isLoading = formState.isSubmitting;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...data,
        content: data.fileUrl,
      });
      reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={control}
                  name="fileUrl"
                  render={({ field: { value = "", onChange } }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={value}
                          onChange={onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
