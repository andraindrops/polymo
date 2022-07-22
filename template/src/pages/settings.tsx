import { requireSignIn } from "@/services/server/auth";

import Page from "@/components/page/Settings";

export default Page;

export const getServerSideProps = requireSignIn;
