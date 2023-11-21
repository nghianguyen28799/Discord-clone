"use client";
import { Plus } from "lucide-react";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { useModalStore } from "@/app/hooks/use-modal-store";

const NavigationAction = () => {
  const { onOpen } = useModalStore();

  return (
    <div className="group flex item-center">
      <ActionTooltip label="Add a server" side="right" align="center">
        <button
          onClick={() => onOpen("createServer")}
          className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center  bg-background dark:bg-neutral-700 group-hover:bg-emerald-500"
        >
          <Plus
            className="group-hover:text-white transition text-emerald-500"
            size={25}
          />
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
