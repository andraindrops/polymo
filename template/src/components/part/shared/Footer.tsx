import Link from "next/link";

import { FaTwitter } from "react-icons/fa";

import { Stack } from "@/components/ui/layout/Stack";

export const Footer = () => {
  return (
    <div className="bg-base-200">
      <div className="mx-auto flex max-w-screen-sm justify-center p-4">
        <Stack>
          <div className="flex justify-center gap-6">
            <Link href="https://example.com/">
              <a>
                <FaTwitter size="2em" />
              </a>
            </Link>
          </div>
          <div>&copy; Example 2022 All Rights Reserved.</div>
        </Stack>
      </div>
    </div>
  );
};
