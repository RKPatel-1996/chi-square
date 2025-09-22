import React, { useState } from "react";

// Main component for this section
export const CoinFlipLab = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: Expected shown, 2: Observed shown
  const [observed, setObserved] = useState({ heads: 0, tails: 0 });

  const totalFlips = 100;
  const expected = { heads: 50, tails: 50 };

  const handleShowExpected = () => setStep(1);

  const handleFlipCoins = () => {
    // Simulate a slightly skewed result to make the "gap" visible
    const heads = Math.round(Math.random() * 15) + 45; // Result between 45 and 60
    setObserved({
      heads: heads,
      tails: totalFlips - heads,
    });
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setObserved({ heads: 0, tails: 0 });
  };

  return (
    <section
      id="observed-vs-expected"
      className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8"
    >
      <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
        Prerequisite 2: Observed vs. Expected Counts 🪙
      </h2>

      <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700 space-y-6">
        {/* Step 1: Setting the Stage */}
        <div className="text-center">
          <p className="text-lg">
            Our starting assumption (Null Hypothesis H₀):{" "}
            <span className="font-bold text-white">This coin is fair.</span>
          </p>
          {step === 0 && (
            <button
              onClick={handleShowExpected}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
            >
              What do we EXPECT from 100 flips?
            </button>
          )}
        </div>

        {/* Step 2: Showing Expected and Running the Experiment */}
        {step >= 1 && (
          <div className="animate-fade-in text-center border-t-2 border-gray-700 pt-6">
            <h3 className="text-xl font-medium text-cyan-300 mb-4">
              The Theoretical Expectation
            </h3>
            <div className="flex justify-center gap-4">
              <div className="bg-gray-800 p-4 rounded-lg w-40">
                <p className="font-bold text-lg">Expected Heads</p>
                <p className="font-mono text-4xl my-2">
                  {expected.heads} <span className="text-2xl">🎯</span>
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg w-40">
                <p className="font-bold text-lg">Expected Tails</p>
                <p className="font-mono text-4xl my-2">
                  {expected.tails} <span className="text-2xl">🎯</span>
                </p>
              </div>
            </div>
            {step === 1 && (
              <button
                onClick={handleFlipCoins}
                className="mt-6 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
              >
                Flip the Coin 100 Times!
              </button>
            )}
          </div>
        )}

        {/* Step 3 & 4: Showing Observed, Comparing, and Posing the Question */}
        {step === 2 && (
          <div className="animate-fade-in text-center border-t-2 border-gray-700 pt-6">
            <h3 className="text-xl font-medium text-cyan-300 mb-4">
              The Experimental Observation
            </h3>
            <div className="flex justify-center gap-4">
              <div className="bg-gray-800 p-4 rounded-lg w-40 border-2 border-amber-400/50">
                <p className="font-bold text-lg">Observed Heads</p>
                <p className="font-mono text-4xl my-2">
                  {observed.heads} <span className="text-2xl">🧑‍🔬</span>
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg w-40 border-2 border-amber-400/50">
                <p className="font-bold text-lg">Observed Tails</p>
                <p className="font-mono text-4xl my-2">
                  {observed.tails} <span className="text-2xl">🧑‍🔬</span>
                </p>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">
                Visualizing the "Gap"
              </h4>
              <div className="bg-gray-800 p-4 rounded-lg max-w-md mx-auto space-y-2">
                <div>
                  <p className="text-left text-sm font-bold">Expected:</p>
                  <div className="flex h-8 rounded overflow-hidden">
                    <div
                      className="bg-cyan-500 flex items-center justify-center"
                      style={{ width: `${expected.heads}%` }}
                    >
                      {expected.heads}
                    </div>
                    <div
                      className="bg-cyan-700 flex items-center justify-center"
                      style={{ width: `${expected.tails}%` }}
                    >
                      {expected.tails}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-left text-sm font-bold">Observed:</p>
                  <div className="flex h-8 rounded overflow-hidden">
                    <div
                      className="bg-amber-500 flex items-center justify-center"
                      style={{ width: `${observed.heads}%` }}
                    >
                      {observed.heads}
                    </div>
                    <div
                      className="bg-amber-700 flex items-center justify-center"
                      style={{ width: `${observed.tails}%` }}
                    >
                      {observed.tails}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Question */}
            <div className="mt-6 bg-gray-800 p-4 rounded-lg max-w-xl mx-auto">
              <p className="font-semibold text-lg">
                The Chi-square test helps us answer the critical question:
              </p>
              <p className="mt-2 text-amber-300">
                "Is the difference between our Observed and Expected results big
                enough to be considered significant, or could a gap this size
                have happened just by random chance?"
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
