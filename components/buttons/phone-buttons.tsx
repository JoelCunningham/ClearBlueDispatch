import { MessageSquare, Phone } from "lucide-react";
import LinkButton from "./link-button";

interface PhoneButtonsProps {
  phoneNumber: string;
}

export default function PhoneButtons({ phoneNumber }: PhoneButtonsProps) {
  return (
    <div className="flex gap-2">
      <LinkButton icon={MessageSquare} href={`sms:${phoneNumber}`} secondary />
      <LinkButton icon={Phone} href={`tel:${phoneNumber}`} />
    </div>
  );
}
