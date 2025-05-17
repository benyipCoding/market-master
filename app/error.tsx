"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("这里是全局异常捕获：", error);
  }, [error]);

  const refresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onClick={refresh}>Refresh</Button>
    </div>
  );
}
