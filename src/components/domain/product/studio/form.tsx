"use client";

import { useChat } from "@ai-sdk/react";
import { useClerk } from "@clerk/nextjs";
import { DefaultChatTransport, getToolName } from "ai";
import { Download, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import * as productAction from "@/actions/domain/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PENDING_MESSAGE_KEY = "polymo:pendingMessage";

interface FrameData {
  id: number;
  animateEntry: boolean;
  loaded: boolean;
  leaving: boolean;
  pending: boolean;
}

function PreviewFrame({
  previewSrc,
  frame,
  onLeaveComplete,
}: {
  previewSrc: string;
  frame: FrameData;
  onLeaveComplete: (id: number) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(
    !frame.animateEntry && !frame.pending,
  );

  useEffect(() => {
    if (frame.pending || !frame.animateEntry) return;

    requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)));
  }, [frame.animateEntry, frame.pending]);

  useEffect(() => {
    if (!frame.leaving) {
      return;
    }

    const wrapper = wrapperRef.current;

    // NOTE: This should never happen.
    if (wrapper == null) {
      return;
    }

    const animation = wrapper.animate(
      [
        { transform: "none", opacity: "1" },
        { transform: "translateY(120%)", opacity: "0" },
      ],
      { duration: 2000, easing: "ease-in", fill: "forwards" },
    );

    animation.onfinish = () => onLeaveComplete(frame.id);

    return () => animation.cancel();
  }, [frame.leaving, frame.id, onLeaveComplete]);

  return (
    <div
      ref={wrapperRef}
      style={{
        gridArea: "1/1",
        overflow: "hidden",
        zIndex: frame.leaving ? 30 : 20,
        maxHeight: expanded ? "512px" : "0px",
        transition:
          frame.animateEntry && !frame.pending
            ? "max-height 10s ease-out"
            : undefined,
      }}
    >
      <div className="relative mx-4 overflow-hidden rounded-b-xl border bg-white">
        <div className="aspect-square w-full p-2">
          <iframe
            src={frame.loaded ? `${previewSrc}?v=${frame.id}` : "about:blank"}
            className="h-full w-full"
            title="Product Preview"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gray-800"
          style={{
            opacity: frame.loaded ? 0 : 1,
            transition: "opacity 3s ease-out",
          }}
        />
      </div>
    </div>
  );
}

export default function Page({
  productId: productIdFromProps,
  isAuthenticated = true,
  hasSubscription = true,
}: {
  productId?: string;
  isAuthenticated?: boolean;
  hasSubscription?: boolean;
}) {
  const [input, setInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const clerk = useClerk();
  const router = useRouter();
  const isDefaultMode = productIdFromProps == null;
  const productId = productIdFromProps ?? "";

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/apply?productId=${encodeURIComponent(productId)}`,
    }),
  });

  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    if (isDefaultMode) return;
    if (initialMessageSentRef.current) return;

    const pendingMessage = localStorage.getItem(PENDING_MESSAGE_KEY);
    if (pendingMessage == null) return;

    initialMessageSentRef.current = true;
    localStorage.removeItem(PENDING_MESSAGE_KEY);
    setInput(pendingMessage);
    setIsCreating(false);
    sendMessage({ text: pendingMessage });
  }, [isDefaultMode, sendMessage]);

  const pendingMessageHandledRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !hasSubscription || !isDefaultMode) return;
    if (pendingMessageHandledRef.current) return;

    const pendingMessage = localStorage.getItem(PENDING_MESSAGE_KEY);
    if (pendingMessage == null) return;

    pendingMessageHandledRef.current = true;
    setInput(pendingMessage);
    setIsCreating(true);

    productAction
      .create({ data: { name: "Untitled" } })
      .then((product) => {
        router.push(`/products/${product.id}/studio`);
      })
      .catch(() => {
        setIsCreating(false);
      });
  }, [isAuthenticated, hasSubscription, isDefaultMode, router]);

  const prevStatusRef = useRef<string | undefined>(undefined);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [frames, setFrames] = useState<FrameData[]>([
    {
      id: 0,
      animateEntry: true,
      loaded: false,
      leaving: false,
      pending: false,
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFrames((prev) =>
        prev.map((f) => (f.id === 0 && !f.loaded ? { ...f, loaded: true } : f)),
      );
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const nextIdRef = useRef(1);

  const isLoading =
    isCreating || status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "submitted") {
      const id = nextIdRef.current;

      nextIdRef.current += 1;

      setFrames((prev) => [
        ...prev.map((f) => ({ ...f, leaving: true })),
        {
          id,
          animateEntry: true,
          loaded: false,
          leaving: false,
          pending: true,
        },
      ]);
    }

    if (prevStatusRef.current === "streaming" && status === "ready") {
      setFrames((prev) =>
        prev.map((f) => (f.leaving ? f : { ...f, loaded: true })),
      );
    }

    prevStatusRef.current = status;
  }, [status]);

  const handleLeaveComplete = useCallback((id: number) => {
    setFrames((prev) => {
      const remainingFrames = prev.filter((f) => f.id !== id);

      if (remainingFrames.some((f) => f.leaving)) {
        return remainingFrames;
      }

      return remainingFrames.map((f) => {
        if (f.pending) {
          return { ...f, pending: false };
        } else {
          return { ...f };
        }
      });
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/status change
  useEffect(() => {
    if (messages.length === 0) return;
    const container = messagesContainerRef.current;
    if (container == null) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const previewSrc =
    productId !== ""
      ? `/api/products/${productId}/preview`
      : "/boilerplate/index.html";

  return (
    <div className="mx-auto max-w-md space-y-8 rounded-2xl border bg-white py-8 shadow-sm">
      <div className="px-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const text = input.trim();
            if (text === "" || isLoading) return;
            if (isDefaultMode && !isAuthenticated) {
              localStorage.setItem(PENDING_MESSAGE_KEY, text);
              clerk.redirectToSignUp({ signUpFallbackRedirectUrl: "/" });
              return;
            }
            if (isDefaultMode) {
              setIsCreating(true);
              try {
                const product = await productAction.create({
                  data: { name: "Untitled" },
                });
                localStorage.setItem(PENDING_MESSAGE_KEY, text);
                router.push(`/products/${product.id}/studio`);
              } catch {
                setIsCreating(false);
              }
            } else {
              sendMessage({ text });
            }
          }}
        >
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              value={input}
              placeholder="Can you build a example web app?"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="icon"
              className="shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      <div className="h-20 bg-gray-100 px-8 py-4">
        <div
          ref={messagesContainerRef}
          className="h-full space-y-1 overflow-y-auto text-justify text-xs"
        >
          <div>
            Hi, I'm Polymo. I can build a web app for you with simple and stable
            the boilerplate code. What would you like to create?
          </div>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="whitespace-pre-wrap">
                {message.parts.map((part) => {
                  if (part.type === "text") {
                    return <div key={part.text}>{part.text}</div>;
                  }
                  if (part.type.startsWith("tool-")) {
                    const toolPart = part as {
                      type: string;
                      toolCallId: string;
                      input: { filePath?: string };
                    };
                    return (
                      <div key={toolPart.toolCallId}>
                        {`✏️ ${getToolName(part as never)}: ${toolPart.input?.filePath ?? ""}`}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
          <div />
        </div>
      </div>
      <div className="px-8">
        <div className="relative overflow-hidden">
          <div className="relative z-10 h-10 rounded-2xl bg-primary" />
          <div className="-mt-6 grid overflow-hidden">
            <div className="invisible" style={{ gridArea: "1/1" }}>
              <div className="mx-4 overflow-hidden rounded-b-xl border">
                <div className="aspect-square w-full p-2" />
              </div>
            </div>
            {frames.map((frame) => (
              <PreviewFrame
                key={frame.id}
                previewSrc={previewSrc}
                frame={frame}
                onLeaveComplete={handleLeaveComplete}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 z-50 h-6 rounded-t-2xl bg-primary shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
        </div>
      </div>
      <div className="flex justify-end px-8">
        <Button
          variant="outline"
          size="icon"
          disabled={isDefaultMode}
          onClick={async () => {
            const response = await fetch(previewSrc);
            const html = await response.text();
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "index.html";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download />
        </Button>
      </div>
    </div>
  );
}
