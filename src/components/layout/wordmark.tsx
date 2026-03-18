import Link from "next/link";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "900",
});

export function Wordmark({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} aria-label="Zynapse Startseite" className={className}>
      <span
        className={`${outfit.className} inline-block pr-[0.04em] text-[1.85rem] leading-none font-black tracking-[-0.04em] lowercase text-[var(--foreground)]`}
      >
        zynaps
        <span className="title-accent">e</span>
      </span>
    </Link>
  );
}
