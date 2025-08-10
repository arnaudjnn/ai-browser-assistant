import { useCallback, useEffect, useState } from "react";
import type { Session } from "@/lib/auth";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);

  const isExtensionContextValid = useCallback(() => {
    try {
      return !!(chrome?.runtime?.id && !chrome.runtime.lastError);
    } catch (error) {
      return false;
    }
  }, []);

  const fetchSession = useCallback(() => {
    if (!isExtensionContextValid()) {
      console.warn("Extension context invalidated: cannot fetch session");
      setSession(null);
      return;
    }

    try {
      chrome.runtime.sendMessage(
        { action: "getSession" },
        (response: Session) => {
          if (!isExtensionContextValid()) {
            console.warn("Extension context invalidated during callback");
            setSession(null);
            return;
          }

          if (chrome.runtime.lastError) {
            console.warn(
              "Could not get session:",
              chrome.runtime.lastError.message
            );
            setSession(null);
            return;
          }

          setSession(response);
        }
      );
    } catch (err) {
      console.warn("Extension context invalidated (caught):", err);
      setSession(null);
    }
  }, [isExtensionContextValid]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    data: session,
    refetch: fetchSession,
    isContextValid: isExtensionContextValid(),
  };
};
