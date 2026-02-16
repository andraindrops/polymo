import AuthTeamList from "@/components/shared/auth/team/list";
import SubscriptionGuard from "@/components/shared/subscriptionGuard";

export default async function Page() {
  return (
    <>
      <SubscriptionGuard />
      <AuthTeamList />
    </>
  );
}
