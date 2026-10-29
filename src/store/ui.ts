"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Dialog = null | "feedback" | "support" | "notice";

type UIState = {
  navOpen: boolean;
  dialog: Dialog;
  notice: string;
  toast: string;
  sandboxExtras: boolean;
  setNav: (open: boolean) => void;
  openDialog: (dialog: Dialog, notice?: string) => void;
  flash: (toast: string) => void;
  setSandboxExtras: (on: boolean) => void;
};

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      navOpen: false,
      dialog: null,
      notice: "",
      toast: "",
      sandboxExtras: false,
      setNav: (navOpen) => set({ navOpen }),
      openDialog: (dialog, notice = "") => set({ dialog, notice }),
      flash: (toast) => {
        set({ toast });
        window.setTimeout(() => set({ toast: "" }), 3200);
      },
      setSandboxExtras: (sandboxExtras) => set({ sandboxExtras }),
    }),
    { name: "dby-ui", partialize: (state) => ({ sandboxExtras: state.sandboxExtras }) },
  ),
);

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
}
