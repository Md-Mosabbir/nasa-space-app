import Link from "next/link";

export default function Header() {


    return (

  <header className="w-full flex items-center justify-center sm:justify-between py-6">
        <div className="hidden sm:block"></div>
        <Link href="/"> <h1 className="text-xl font-semibold tracking-[-0.01em]">Weatherly</h1> </Link>
        <div className="hidden sm:block"></div>
      </header>

    )
}