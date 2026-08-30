"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({ open, onClose, labelledBy, children, className = "" }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      document.body.classList.add("dialog-open");
      requestAnimationFrame(() => {
        dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      });
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.classList.remove("dialog-open");
      returnFocusRef.current?.focus();
    }

    return () => {
      document.body.classList.remove("dialog-open");
    };
  }, [open]);

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
