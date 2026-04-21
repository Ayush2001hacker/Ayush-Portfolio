import { Suspense } from "react";
import { PortfolioApp } from "@/features/portfolio/PortfolioApp";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PortfolioApp />
    </Suspense>
  );
}
