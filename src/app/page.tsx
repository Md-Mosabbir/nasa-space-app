import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-bg flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-start mt-32 text-center flex-1 px-4">
        <h1 className="headline text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-[980px]">
          More than forecasts.
          <br className="hidden sm:block" />
          Personalized comfort for your plans.
        </h1>

        <p className="subcopy mt-5 text-base sm:text-lg md:text-xl max-w-[820px] text-white/80">
          Whether you’re planning a trip, a wedding, or a weekend getaway, we
          tell you not just the forecast — but how the weather will actually
          feel. Plan with confidence, enjoy with comfort.
        </p>

        <Button
          asChild
          className="mt-12 text-lg sm:text-2xl px-16 py-8 text-black bg-[#52B788] hover:bg-[#52B788]/90"
        >
          <Link href="/input">Let’s Plan</Link>
        </Button>
      </main>
    </div>
  );
}
