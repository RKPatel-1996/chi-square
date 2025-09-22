import React, { useState } from "react";
import { PrerequisitesPage } from "./pages/PrerequisitesPage";
import { PValuePage } from "./pages/PValuePage";
import { ChiSquareWizardPage } from "./pages/ChiSquareWizardPage";
import { ChiSquareCalculatorPage } from "./pages/ChiSquareCalculatorPage";
import { DegreesOfFreedomPage } from "./pages/DegreesOfFreedomPage"; // Import new page
import { TableOfContents } from "./components/TableOfContents";

function App() {
  const [currentPage, setCurrentPage] = useState("prerequisites");

  return (
    <main>
      <TableOfContents onNavigate={setCurrentPage} currentPage={currentPage} />
      {currentPage === "prerequisites" && <PrerequisitesPage />}
      {currentPage === "p-value" && <PValuePage />}
      {currentPage === "wizard" && <ChiSquareWizardPage />}
      {currentPage === "df" && <DegreesOfFreedomPage />}
      {currentPage === "calculator" && <ChiSquareCalculatorPage />}
      {/* Add new page */}
    </main>
  );
}

export default App;
