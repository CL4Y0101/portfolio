import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found shell">
      <p className="eyebrow">404 · Not found</p>
      <h1>This page is not part of the portfolio.</h1>
      <p>The link may be outdated, or the project may no longer be published at this path.</p>
      <Link className="button button-primary" href="/">
        <ArrowLeft aria-hidden="true" size={17} /> Return home
      </Link>
    </main>
  );
}
