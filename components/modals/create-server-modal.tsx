"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { useModalStore } from "@/app/hooks/use-modal-store";
import { FileUpload } from "../file-upload";

const schema = yup.object({
  name: yup.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: yup.string().min(1, {
    message: "Server image is required",
  }),
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createServer";

  const methods = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: yupResolver(schema),
  });

  const { formState, handleSubmit, control, reset } = methods;

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      await axios.post("/api/servers", data);
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={control}
                  name="imageUrl"
                  render={({ field: { value = "", onChange } }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={value}
                          onChange={onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
