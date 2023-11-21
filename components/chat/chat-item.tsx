import { useModalStore } from "@/app/hooks/use-modal-store";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { UserAvatar } from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import qs from "query-string";
import axios from "axios";
import { Button } from "../ui/button";

interface ChatItemsProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = yup.object({
  content: yup.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { onOpen } = useModalStore();
  const params = useParams();
  const router = useRouter();

  const method = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const {
    reset,
    control,
    formState: { isSubmitting: isLoading },
    handleSubmit,
  } = method;

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const onSubmit = async (data: yup.InferType<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, data);

      setIsEditing(false);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reset({
      content: content,
    });
  }, [content, reset]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full gap-x-2">
      <div className="group flex-1 flex gap-x-2 items-start w-full h-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
      </div>
      <div className="flex  flex-col w-full">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center">
            <p
              onClick={onMemberClick}
              className="font-semibold text-sm hover:underline cursor-pointer"
            >
              {member.profile.name}
            </p>
            <ActionTooltip label={member.role}>
              {roleIconMap[member.role]}
            </ActionTooltip>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {timestamp}
          </span>
        </div>
        {isImage && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
          >
            <Image src={fileUrl} alt={content} fill className="object-cover" />
          </a>
        )}
        {isPDF && (
          <div className="relative flex gap-x-2 p-2 mt-2 bg-background/10 items-center">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
            <a
              href={fileUrl || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              PDF File
            </a>
          </div>
        )}
        {!fileUrl && !isEditing && (
          <p
            className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}
          >
            {content}
            {isUpdated && !deleted && (
              <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                (edited)
              </span>
            )}
          </p>
        )}
        {!fileUrl && isEditing && (
          <Form {...method}>
            <form
              className="flex item-center w-full gap-x-2 pt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          disabled={isLoading}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited message"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} size="sm" variant="primary">
                Save
              </Button>
            </form>
          </Form>
        )}
        {canDeleteMessage && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            {canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete">
              <Trash
                onClick={() =>
                  onOpen("deleteMessage", {
                    apiUrl: `/${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                }
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
