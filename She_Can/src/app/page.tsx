import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-float absolute left-[-10%] top-[-10%] h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
        <div
          className="animate-float absolute right-[-10%] bottom-[-10%] h-150 w-150 rounded-full bg-secondary/5 blur-[120px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-32 lg:pt-40 lg:pb-48">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-24 lg:grid-cols-2 lg:items-center">
            <div className="relative lg:ml-auto w-full max-w-lg">
              <div className="absolute -inset-10 rounded-[3rem] bg-linear-to-tr from-primary/10 to-secondary/10 blur-3xl" />
              <div className="relative">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
