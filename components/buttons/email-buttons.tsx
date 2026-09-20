import { Mail } from "lucide-react";
import LinkButton from "./link-button";

interface EmailButtonsProps {
  emailAddress: string;
}

export default function EmailButtons({ emailAddress }: EmailButtonsProps) {
  return (
    <div className="flex gap-2">
      <LinkButton icon={Mail} href={`mailto:${emailAddress}`} />
    </div>
  );
}
