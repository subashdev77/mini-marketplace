"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCallback, useRef, useState } from "react";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
}

interface DialogState extends ConfirmOptions {
  alert?: boolean;
}

export function useConfirm() {
  const [state, setState] = useState<DialogState | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setState({ ...options, alert: false });
    });
  }, []);

  const alert = useCallback(
    (options: Omit<ConfirmOptions, "cancelLabel" | "variant">) => {
      return new Promise<void>((resolve) => {
        resolveRef.current = () => {
          resolve();
          return true;
        };
        setState({
          ...options,
          confirmLabel: options.confirmLabel ?? "OK",
          alert: true,
        });
      });
    },
    []
  );

  const close = (result: boolean) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setState(null);
  };

  const dialog = (
    <ConfirmDialog
      open={state !== null}
      title={state?.title ?? ""}
      description={state?.description}
      confirmLabel={state?.confirmLabel}
      cancelLabel={state?.cancelLabel}
      variant={state?.variant}
      alert={state?.alert}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, alert, dialog };
}
