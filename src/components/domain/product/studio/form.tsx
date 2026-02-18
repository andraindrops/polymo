"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName } from "ai";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page({ productId }: { productId: string }) {
  const [input, setInput] = useState("Can you build a minimal Todo app?");
  const [route] = useState<string>("/api/apply");
  const [iframeKey, setIframeKey] = useState(0);
  const prevStatusRef = useRef<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${route}?productId=${encodeURIComponent(productId)}`,
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (prevStatusRef.current === "streaming" && status === "ready") {
      setIframeKey((k) => k + 1);
    }
    prevStatusRef.current = status;
  }, [status]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/status change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <main className="mx-auto w-full space-y-8 md:max-w-[528px]">
      <div className="mx-auto grid h-[512px] w-[512px] items-center justify-center border">
        {isLoading ? (
          <div className="text-gray-500">🍞</div>
        ) : (
          <iframe
            key={iframeKey}
            src={`/api/products/${productId}/preview`}
            className="h-full w-full"
            title="Product Preview"
          />
        )}
      </div>
      <div className="space-y-4 rounded-2xl border py-8">
        <div className="h-20 bg-gray-100 px-8 py-4">
          <div className="h-full space-y-1 overflow-y-auto text-xs">
            <div>Hi</div>
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
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const text = input.trim();

              if (text === "") {
                return;
              }

              sendMessage({ text });

              setInput("");
            }}
          >
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} />
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
