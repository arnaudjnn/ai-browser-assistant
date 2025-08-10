import { useEffect, useState } from "react";
import { manifest } from "@/package.json";
import cssText from "data-text:@/app/globals.css";
import type { PlasmoCSConfig } from "plasmo";
import { useSession } from "@/hooks/use-session";
import { cn, generateUUID } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

const styleElement = document.createElement("style");

export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16;

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)");
  const remRegex = /([\d.]+)rem/g;
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = Number.parseFloat(remValue) * baseFontSize;

    return `${pixelsValue}px`;
  });

  styleElement.textContent = updatedCssText;

  return styleElement;
};

export default function Overlay() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const id = generateUUID();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const messageListener = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void
    ) => {
      if (message.action === "toggle-overlay") {
        setIsVisible((prev) => !prev);
        sendResponse({ success: true });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "L") {
        event.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-2 right-2 top-2 z-[9999] box-border flex w-[320px] flex-col rounded-xl bg-sidebar p-2 text-base shadow-2xl transition-transform duration-200",
        isDarkMode && "dark text-white",
        !isVisible ? "translate-x-[340px]" : "translate-x-0"
      )}
    >
      <TooltipProvider>
        <Header onClose={() => setIsVisible(false)} />
        {session ? (
          <DataStreamProvider>
            <Chat
              key={id}
              id={id}
              initialMessages={[]}
              initialChatModel={DEFAULT_CHAT_MODEL}
              isReadonly={false}
              autoResume={false}
              session={session}
            />
            <DataStreamHandler />
          </DataStreamProvider>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-2xl font-semibold">
                You're not logged in
              </p>
              <p className="mb-4 text-muted-foreground">
                {`Please sign in to ${manifest.name} to enable the Chrome Extension`}
              </p>
              <Button variant="secondary" asChild>
                <a href={manifest.homepage_url}>Open app</a>
              </Button>
            </div>
          </div>
        )}
      </TooltipProvider>
    </div>
  );
}
