import React, { useState } from "react";
import { WhyWeTest } from "../components/WhyWeTest";
import { HypothesisCourtroom } from "../components/HypothesisCourtroom";
import { FalsifiabilityTutorial } from "../components/FalsifiabilityTutorial";
import { CoinFlipLab } from "../components/CoinFlipLab";
import { DataTypeSorter } from "../components/DataTypeSorter";
import { ChiSquareJourney } from "../components/ChiSquareJourney";

// A small component for a single bacterium icon to keep the main component clean
const Bacterium = ({ color, isFaded }) => (
  <div
    className={`w-4 h-4 rounded-full ${color} ${
      isFaded ? "opacity-20" : "opacity-100"
    } transition-opacity duration-500`}
  ></div>
);

// Main component for the page
export const PrerequisitesPage = () => {
  const [experimentRun, setExperimentRun] = useState(false);
  const totalBacteria = 100;
  const gramPositiveSurvived = 20;
  const gramNegativeSurvived = 40;

  const handleRunExperiment = () => {
    setExperimentRun(true);
  };

  // NEW: Reset handler for the disinfectant experiment
  const handleResetExperiment = () => {
    setExperimentRun(false);
  };

  return (
    // NOTE: Added "md:pl-64" to the main div to make space for the desktop sidebar
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8 font-sans md:pl-72">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
            Prerequisites for the Chi-Square Test
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            This concepts are crucial if you want to understand the chi-square
            test
          </p>
        </header>

        {/* Section 1: The Core Idea */}
        <section
          id="core-idea"
          className="bg-gray-800 p-6 rounded-lg shadow-xl"
        >
          <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
            The Core Idea: What Question Are We Answering?
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            The <strong className="text-cyan-400">Chi-square (χ²)</strong> test
            is a statistical tool for{" "}
            <strong className="text-amber-300">comparison</strong>. It measures
            if there's a{" "}
            <strong className="text-amber-300">significant difference</strong>{" "}
            between your <strong className="text-cyan-400">observed</strong>{" "}
            data and the data you would{" "}
            <strong className="text-purple-300">expect</strong> if your
            hypothesis were true.
          </p>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Essentially, it's a{" "}
            <strong className="text-amber-300">"goodness of fit"</strong> test.
            It's especially powerful when your data is sorted into{" "}
            <strong className="text-cyan-400">categories</strong>, like testing
            an disinfectant's effect on Gram-positive vs. Gram-negative
            bacteria.
          </p>

          {/* Interactive Lab Bench */}
          <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
            <h3 className="text-2xl font-medium text-center mb-4 text-cyan-300">
              The Interactive Lab Bench
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Is the <strong className="text-cyan-400">new disinfectant</strong>{" "}
              <strong className="text-amber-300"> more effective</strong> on
              one type of bacteria?{" "}
            </p>

            <div className="flex flex-col md:flex-row justify-around items-center gap-8 mb-6">
              {/* Petri Dish 1: Gram-positive */}
              <div className="text-center">
                <h4 className="text-lg font-bold mb-2">Gram-positive 🟣</h4>
                <div className="w-48 h-48 bg-gray-700 rounded-full p-2 grid grid-cols-10 gap-1 content-center justify-center">
                  {Array.from({ length: totalBacteria }).map((_, i) => (
                    <Bacterium
                      key={i}
                      color="bg-purple-500"
                      isFaded={experimentRun && i >= gramPositiveSurvived}
                    />
                  ))}
                </div>
              </div>

              {/* Petri Dish 2: Gram-negative */}
              <div className="text-center">
                <h4 className="text-lg font-bold mb-2">Gram-negative 🧼</h4>
                <div className="w-48 h-48 bg-gray-700 rounded-full p-2 grid grid-cols-10 gap-1 content-center justify-center">
                  {Array.from({ length: totalBacteria }).map((_, i) => (
                    <Bacterium
                      key={i}
                      color="bg-pink-500"
                      isFaded={experimentRun && i >= gramNegativeSurvived}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Experiment Controls & Results */}
            <div className="text-center mt-6">
              {/* UPDATED: Conditionally show Apply or Reset button */}
              {!experimentRun ? (
                <button
                  onClick={handleRunExperiment}
                  className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-6 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
                >
                  Apply Disinfectant
                </button>
              ) : (
                <button
                  onClick={handleResetExperiment}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
                >
                  Reset Experiment
                </button>
              )}

              {/* Contingency Table (Results) */}
              {experimentRun && (
                <div className="animate-fade-in mt-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold mb-2 text-amber-300">
                    Observed Results
                  </h3>
                  <table className="w-full text-center border border-gray-600 rounded-lg">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-2 border-r border-gray-600">
                          Bacteria
                        </th>
                        <th className="p-2 border-r border-gray-600">Died</th>
                        <th className="p-2">Survived</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800">
                      <tr>
                        <td className="font-bold p-2 border-r border-gray-600">
                          Gram-positive
                        </td>
                        <td className="p-2 border-r border-gray-600">
                          {totalBacteria - gramPositiveSurvived}
                        </td>
                        <td className="p-2">{gramPositiveSurvived}</td>
                      </tr>
                      <tr>
                        <td className="font-bold p-2 border-r border-gray-600">
                          Gram-negative
                        </td>
                        <td className="p-2 border-r border-gray-600">
                          {totalBacteria - gramNegativeSurvived}
                        </td>
                        <td className="p-2">{gramNegativeSurvived}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        <WhyWeTest />

        <FalsifiabilityTutorial />

        <HypothesisCourtroom />

        <CoinFlipLab />

        <DataTypeSorter />

        <ChiSquareJourney />
      </div>
    </div>
  );
};
