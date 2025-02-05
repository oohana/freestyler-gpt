import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <Link href="/" className="flex space-x-3">
        {/* <Image
          alt="header text"
          src="/writingIcon.png"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={32}
        /> */}
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          Freestyler AI
        </h1>
      </Link>
      {/* <a
        href="#"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          alt="Vercel Icon"
          src="/vercelLogo.png"
          className="sm:w-8 sm:h-[27px] w-8 h-[28px]"
          width={32}
          height={28}
        />
      </a> */}
    </header>
  );
}
