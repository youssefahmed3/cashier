import "@/app/globals.css";

export default function CashierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      {children}
    </div>
  );
}
