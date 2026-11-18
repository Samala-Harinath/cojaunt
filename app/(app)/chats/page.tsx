import type { Metadata } from "next";
import { ChatsView } from "@/components/chats-view";

export const metadata: Metadata = { title: "Chats" };

export default function ChatsPage() {
  return <ChatsView />;
}
