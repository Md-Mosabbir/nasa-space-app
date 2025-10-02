export default function Home() {
  return (
    <div className="container">


      <main className="pt-6 pb-20 md:pt-14 lg:pt-20 flex flex-col items-center text-center">
        <h2 className="headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-[980px]">
          More than forecasts.
          <br className="hidden sm:block" />
          Personalized comfort for your plans.
        </h2>

        <p className="subcopy mt-5 text-base sm:text-lg md:text-xl max-w-[820px]">
          Whether you’re planning a trip, a wedding, or a weekend getaway, we tell you not just
          the forecast — but how the weather will actually feel. Plan with confidence, enjoy with comfort.
        </p>

        <a href="#plan" className="btn mt-10 text-lg sm:text-xl px-8 py-4">
          Let’s Plan
        </a>
      </main>
    </div>
  );
}
