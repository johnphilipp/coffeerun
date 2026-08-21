import Link from "next/link";

interface HeaderProps {
  light?: boolean;
}

export default function Header({ light }: HeaderProps) {
  return (
    <header className="mt-4 flex items-center justify-between px-6 z-50">
      <Link
        href="/"
        className={`text-xl hover:cursor-pointer mx-auto hover:scale-105 transition-all duration-300 font-sans ${
          light
            ? "text-gray-800 hover:text-gray-900"
            : "text-gray-200 hover:text-gray-300"
        }`}
      >
        coffee<span className="font-bold">run</span>
      </Link>
    </header>
  );
}
