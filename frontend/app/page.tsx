import { Suspense } from "react";
import { PortfolioApp } from "@/components/portfolio/PortfolioApp";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PortfolioApp />
    </Suspense>
  );
}
