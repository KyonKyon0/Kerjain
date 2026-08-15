"use client";

import { useEffect } from "react";

export function ClientBootstrap() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof Element !== "undefined") {
      const originalReleasePointerCapture = Element.prototype.releasePointerCapture;
      if (originalReleasePointerCapture) {
        Element.prototype.releasePointerCapture = function (pointerId: number) {
          try {
            if (this.hasPointerCapture && this.hasPointerCapture(pointerId)) {
              return originalReleasePointerCapture.call(this, pointerId);
            }
          } catch {
            // Silently ignore stale pointer release exceptions from devtools/radix
          }
        };
      }
    }
  }, []);

  return null;
}
