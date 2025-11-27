"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [activeCity, setActiveCity] = useState("India");

  return (
    <>
      <TopBar city={activeCity} onCityChange={setActiveCity} />
      {children}
      <Footer />
    </>
  );
}

