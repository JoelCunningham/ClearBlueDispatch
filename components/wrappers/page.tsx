interface PageProps {
  centred?: boolean;
  children: React.ReactNode;
}

export default function Page({ centred, children }: PageProps) {
  return <div className={`flex flex-col p-4 space-y-3 min-h-full ${centred ? "items-center justify-center" : ""}`}>{children}</div>;
}
