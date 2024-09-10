import Header from "./header";
import Footer from "./footer";

export default function TopLayout({ children } : React.PropsWithChildren<unknown>) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}