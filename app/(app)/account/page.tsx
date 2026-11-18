import type { Metadata } from "next";
import { AccountView } from "@/components/account/account-view";

export const metadata: Metadata = { title: "Account & security" };

export default function AccountPage() {
  return <AccountView />;
}
