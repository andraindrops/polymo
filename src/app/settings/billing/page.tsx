import Link from "next/link";

import * as authService from "@/services/shared/auth";

import * as subscriptionService from "@/services/domain/subscription";

import { Button } from "@/components/ui/button";

import SubscriptionGuard from "@/components/shared/subscriptionGuard";

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export default async function BillingPage() {
  const userId = await authService.getUserId();

  const subscription = await subscriptionService.findByUserId({ userId });

  const settingUrl = process.env.NEXT_PUBLIC_STRIPE_SETTING_URL;

  const active =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <>
      <SubscriptionGuard />
      <div className="space-y-8">
        <div className="space-y-4">
          {subscription ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Status:</span>
                  <span
                    className={`text-sm ${active ? "text-green-600" : "text-red-600"}`}
                  >
                    {subscription.status}
                  </span>
                </div>
                {subscription.periodEnterDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Enter date:</span>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(subscription.periodEnterDate)}
                    </span>
                  </div>
                )}
                {subscription.accessLeaveDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Leave date:</span>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(subscription.accessLeaveDate)}
                    </span>
                  </div>
                )}
              </div>
              {settingUrl && (
                <Button variant="secondary" asChild>
                  <Link
                    href={settingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage Subscription
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              You are not subscribed to any plan.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
