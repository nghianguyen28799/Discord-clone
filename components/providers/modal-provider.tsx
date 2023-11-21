"use client";
import React, { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import MessageFileModal from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <React.Fragment>
      <CreateServerModal />
      <EditServerModal />
      <InviteModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </React.Fragment>
  );
};

export default ModalProvider;
