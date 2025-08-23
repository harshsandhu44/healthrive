"use client";

import type { PropsWithChildren } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export function Settings({ children }: PropsWithChildren) {
  const isMobile = useIsMobile();

  return isMobile ? (
    // mobile settings
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>{/* TODO: settings */}</DrawerContent>
    </Drawer>
  ) : (
    // TODO: desktop settings
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>{/* TODO: settings */}</DialogContent>
    </Dialog>
  );
}
