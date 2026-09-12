import type { Metadata } from "next";
import HackerSpace from "@/components/hacker-space/HackerSpace";

export const metadata: Metadata = {
  title: "Hacker Space · 生活資安調查室 | Hack My Way In",
  description: "從釣魚簡訊、冒名匯款到 Wi-Fi 與 AI 助理，用四個生活情境練習資安判斷。查看證據、採取行動，帶走真正用得上的防禦方法。",
};

export default function HackerSpacePage() {
  return <HackerSpace />;
}
