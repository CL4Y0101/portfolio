"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { motionDurations } from "@/components/motion/motion";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({ open, onClose, onAfterClose, labelledBy, children, className = "" }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const finishClose = () => {
      if (dialog.open) dialog.close();
      dialog.dataset.state = "closed";
      document.body.classList.remove("dialog-open");
      returnFocusRef.current?.focus();
      onAfterClose?.();
    };

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    if (open) {
      if (!dialog.open) {
        returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.showModal();
      }
      dialog.dataset.state = "opening";
      document.body.classList.add("dialog-open");
      requestAnimationFrame(() => {
        dialog.dataset.state = "open";
        dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      });
    } else if (!open && dialog.open) {
      dialog.dataset.state = "closing";
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.dataset.motion === "off";
      closeTimerRef.current = setTimeout(finishClose, reduceMotion ? 0 : motionDurations.fast);
    }

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [onAfterClose, open]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    document.body.classList.remove("dialog-open");
  }, []);

  function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={`app-dialog ${className}`.trim()}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={handleBackdrop}
    >
      {children}
    </dialog>
  );
}
