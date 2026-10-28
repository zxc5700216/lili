"use client";

import { create } from "zustand";

type Dialog = null | "feedback" | "support" | "notice";

type UIState = {
  navOpen: boolean;
  dialog: Dialog;
  notice: string;
  toast: string;
  setNav: (open: boolean) => void;
  openDialog: (dialog: Dialog, notice?: string) => void;
  flash: (toast: string) => void;
};

export const useUI = create<UIState>((set) => ({
  navOpen: false,
  dialog: null,
  notice: "",
  toast: "",
  setNav: (navOpen) => set({ navOpen }),
  openDialog: (dialog, notice = "") => set({ dialog, notice }),
  flash: (toast) => {
    set({ toast });
    window.setTimeout(() => set({ toast: "" }), 1600);
  },
}));

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
