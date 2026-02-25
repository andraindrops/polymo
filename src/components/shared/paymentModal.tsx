"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PLAN_FEATURES = [
  "100 monthly credits",
  "Unlimited apps",
  "Anytime refundable subscription",
];

export default function PaymentModal({ paymentUrl }: { paymentUrl: string }) {
  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Subscription Required</DialogTitle>
          <DialogDescription>
            To use this feature, please subscribe to a plan.
          </DialogDescription>
        </DialogHeader>
        <Card className="bg-white text-[#25343F]">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="font-bold text-4xl">$20</div>
              <div className="text-[#25343F]/60 text-sm">/month</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2 text-sm">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="w-full bg-[#25343F] text-white hover:bg-[#25343F]/90"
            >
              <Link href={paymentUrl}>Subscribe</Link>
            </Button>
          </CardContent>
        </Card>
        <p className="text-muted-foreground text-sm">
          We accept{" "}
          <span className="font-bold">
            refund requests for the current month for any reason
          </span>
          . Please contact us at dev@andraindrops.dev.
        </p>
      </DialogContent>
    </Dialog>
  );
}
