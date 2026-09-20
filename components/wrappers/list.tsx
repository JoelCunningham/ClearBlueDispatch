import React from "react";
import InfoAlert from "../alerts/info-alert";

interface ListProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  emptyText?: string;
}

export default function List({ title, subtitle, children, emptyText }: ListProps) {
  return (
    <div className="space-y-3">
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        </div>
      )}
      {React.Children.count(children) > 0 ? children : emptyText && <InfoAlert text={emptyText} />}
    </div>
  );
}
