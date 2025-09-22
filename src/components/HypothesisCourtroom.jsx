import React, { useState } from "react";

// Main component for this section
export const HypothesisCourtroom = () => {
  const [step, setStep] = useState(0); // 0: Hypotheses, 1: Evidence, 2: Feedback
  const [userVerdict, setUserVerdict] = useState(null); // 'reject' or 'fail_to_reject'

  // We'll use a simulated "strong" p-value for this specific observed result
  const pValue = 0.04;
  const isSignificant = pValue < 0.05;

  const handleGatherEvidence = () => setStep(1);

  const handleVerdict = (verdict) => {
    setUserVerdict(verdict);
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setUserVerdict(null);
  };

  return (
    <section
      id="hypothesis-testing"
      className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8"
    >
      <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
        Prerequisite 1: The Scientific Mindset ⚖️
      </h2>

      <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
        {/* Step 1: The Hypotheses */}
        <div className="text-center">
          <h3 className="text-2xl font-medium text-cyan-300 mb-4">
            The Courtroom Trial
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-bold text-lg">
                The Default Position (Presumed Innocent)
              </h4>
              <p className="text-cyan-400 font-mono text-xl my-2">
                Null Hypothesis (H₀)
              </p>
              <p className="text-gray-300">
                "The disinfectant has **no difference** in effect between
                Gram-positive and Gram-negative bacteria."
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-bold text-lg">The Researcher's Claim</h4>
              <p className="text-amber-400 font-mono text-xl my-2">
                Alternative Hypothesis (Hₐ)
              </p>
              <p className="text-gray-300">
                "The disinfectant **does have a different** effect on the two
                types of bacteria."
              </p>
            </div>
          </div>
          {step === 0 && (
            <button
              onClick={handleGatherEvidence}
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-6 rounded-lg text-lg transition-transform duration-200 hover:scale-105"
            >
              Examine the Evidence
            </button>
          )}
        </div>

        {/* Step 2: The Evidence & Verdict */}
        {step >= 1 && (
          <div className="mt-8 border-t-2 border-gray-700 pt-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-center mb-4">
              The Evidence is In!
            </h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Bar chart visualization */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="font-bold mb-2">
                  Percentage of Bacteria That Died
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-28">Gram-positive:</span>
                    <div className="h-6 bg-purple-500 w-[80%] rounded-r-md flex items-center pl-2 font-bold">
                      80%
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-28">Gram-negative:</span>
                    <div className="h-6 bg-pink-500 w-[60%] rounded-r-md flex items-center pl-2 font-bold">
                      60%
                    </div>
                  </div>
                </div>
              </div>
              {/* P-Value Meter */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="font-bold mb-2">
                  Likelihood of this result happening by random chance:
                </p>
                <div className="w-full bg-gray-700 rounded-full h-6 relative">
                  <div className="bg-gradient-to-r from-green-500 to-red-500 h-6 rounded-full"></div>
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                    style={{ left: `${pValue * 100}%` }}
                    title={`p-value = ${pValue}`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-400">
                  <span>Likely by Chance</span>
                  <span>Unlikely by Chance</span>
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="mt-6 text-center">
                <h4 className="text-lg font-semibold mb-3">
                  You are the Judge. What is your verdict?
                </h4>
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => handleVerdict("fail_to_reject")}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    "No significant difference" (Fail to Reject H₀)
                  </button>
                  <button
                    onClick={() => handleVerdict("reject")}
                    className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
                  >
                    "A significant difference" (Reject H₀)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Feedback */}
        {step === 2 && (
          <div className="mt-8 border-t-2 border-gray-700 pt-6 animate-fade-in text-center">
            <h3 className="text-xl font-semibold mb-2">The Reasoning</h3>
            {userVerdict === "reject" && isSignificant && (
              <p className="bg-green-900/50 p-4 rounded-lg text-green-300">
                <span className="font-bold">Correct!</span> The evidence was
                strong. A result this different is very unlikely to be random
                chance (p = 0.04). We **reject the null hypothesis** and
                conclude the disinfectant's effect is significantly different
                between the two bacteria.
              </p>
            )}
            {userVerdict === "fail_to_reject" && isSignificant && (
              <p className="bg-amber-900/50 p-4 rounded-lg text-amber-300">
                <span className="font-bold">
                  Close, but the evidence was stronger than it looked.
                </span>{" "}
                Because the result was so unlikely to happen by chance (p-value
                was less than 0.05), the standard scientific conclusion is to
                **reject the null hypothesis**.
              </p>
            )}
            <button
              onClick={handleReset}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
