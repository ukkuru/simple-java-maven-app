import { MessageCircle } from "lucide-react";
import { ORG } from "@/lib/seo/site";

export function WhatsAppButton() {
  return (
    <a
      href={ORG.whatsappLink}
      target="_blank"
      rel="noopener"
      aria-label="Message us on WhatsApp"
      className="focus-ring fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-success-600 text-white shadow-lg shadow-success-600/30 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
