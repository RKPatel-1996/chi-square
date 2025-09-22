import React, { useState } from "react";

// Data for our journey steps
const journeySteps = [
  {
    id: 1,
    title: "Question ❓",
    text: "It all begins with a question about a potential relationship between two categorical variables.",
  },
  {
    id: 2,
    title: "Null Hypothesis ⚖️",
    text: "Next, you state the Null Hypothesis (H₀)—the default assumption that there is no relationship.",
  },
  {
    id: 3,
    title: "Collect Data 🔬",
    text: "You run your experiment and gather data, making sure it's sorted into distinct categories.",
  },
  {
    id: 4,
    title: "Observed Counts 👀",
    text: "You then count the actual results to get your Observed Counts. This is your real-world evidence.",
  },
  {
    id: 5,
    title: "Expected Counts 🎯",
    text: "Based on your H₀, you calculate the theoretical Expected Counts—what you'd see if there was no effect.",
  },
  {
    id: 6,
    title: "The Chi-Square Test 🏁",
    text: "You've arrived! Now you use the χ² test to compare your Observed and Expected counts and reach a conclusion.",
  },
];

export const ChiSquareJourney = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = not started, 1-6 = steps

  const handleNextStep = () => {
    if (currentStep < journeySteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const activeStepData = journeySteps.find((step) => step.id === currentStep);
  const isComplete = currentStep === journeySteps.length;

  return (
    <section id="summary" className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8">
      <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
        Final Summary: The Complete Logical Flow 🗺️
      </h2>
      <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700 flex flex-col lg:flex-row gap-6 items-center">
        {/* --- The SVG Flowchart --- */}
        <div className="w-full lg:w-1/2">
          <svg viewBox="0 0 300 400" className="w-full h-auto">
            <defs>
              <style>
                {`.node { transition: all 0.5s ease-in-out; }
                                .inactive-node { fill: #374151; }
                                .active-node { fill: #06b6d4; }
                                .path { transition: stroke 0.5s ease-in-out; }
                                .inactive-path { stroke: #4b5563; }
                                .active-path { stroke: #f59e0b; }`}
              </style>
            </defs>

            {/* Nodes (Boxes) */}
            <rect
              x="100"
              y="10"
              width="100"
              height="30"
              rx="5"
              className={`node ${
                currentStep >= 1 ? "active-node" : "inactive-node"
              }`}
            />
            <text x="150" y="30" fill="white" textAnchor="middle" fontSize="10">
              Question ❓
            </text>

            <rect
              x="100"
              y="70"
              width="100"
              height="30"
              rx="5"
              className={`node ${
                currentStep >= 2 ? "active-node" : "inactive-node"
              }`}
            />
            <text x="150" y="90" fill="white" textAnchor="middle" fontSize="10">
              Null Hypothesis ⚖️
            </text>

            <rect
              x="100"
              y="130"
              width="100"
              height="30"
              rx="5"
              className={`node ${
                currentStep >= 3 ? "active-node" : "inactive-node"
              }`}
            />
            <text
              x="150"
              y="150"
              fill="white"
              textAnchor="middle"
              fontSize="10"
            >
              Collect Data 🔬
            </text>

            <rect
              x="100"
              y="190"
              width="100"
              height="30"
              rx="5"
              className={`node ${
                currentStep >= 4 ? "active-node" : "inactive-node"
              }`}
            />
            <text
              x="150"
              y="210"
              fill="white"
              textAnchor="middle"
              fontSize="10"
            >
              Observed Counts 👀
            </text>

            <rect
              x="100"
              y="250"
              width="100"
              height="30"
              rx="5"
              className={`node ${
                currentStep >= 5 ? "active-node" : "inactive-node"
              }`}
            />
            <text
              x="150"
              y="270"
              fill="white"
              textAnchor="middle"
              fontSize="10"
            >
              Expected Counts 🎯
            </text>

            <rect
              x="100"
              y="310"
              width="100"
              height="30"
              rx="5"
              className={`node ${
                currentStep >= 6 ? "active-node" : "inactive-node"
              }`}
            />
            <text
              x="150"
              y="330"
              fill="white"
              textAnchor="middle"
              fontSize="10"
            >
              Chi-Square Test 🏁
            </text>

            {/* Paths (Lines) */}
            <path
              d="M150 40 V 70"
              strokeWidth="2"
              fill="none"
              className={`path ${
                currentStep >= 2 ? "active-path" : "inactive-path"
              }`}
            />
            <path
              d="M150 100 V 130"
              strokeWidth="2"
              fill="none"
              className={`path ${
                currentStep >= 3 ? "active-path" : "inactive-path"
              }`}
            />
            <path
              d="M150 160 V 190"
              strokeWidth="2"
              fill="none"
              className={`path ${
                currentStep >= 4 ? "active-path" : "inactive-path"
              }`}
            />
            <path
              d="M150 220 V 250"
              strokeWidth="2"
              fill="none"
              className={`path ${
                currentStep >= 5 ? "active-path" : "inactive-path"
              }`}
            />
            <path
              d="M150 280 V 310"
              strokeWidth="2"
              fill="none"
              className={`path ${
                currentStep >= 6 ? "active-path" : "inactive-path"
              }`}
            />
          </svg>
        </div>

        {/* --- The Info Panel & Controls --- */}
        <div className="w-full lg:w-1/2 text-center flex flex-col justify-center items-center min-h-[300px]">
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">
                Ready to review the entire process?
              </h3>
              <button
                onClick={handleNextStep}
                className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-6 rounded-lg text-lg"
              >
                Start the Journey
              </button>
            </div>
          )}
          {activeStepData && (
            <div className="bg-gray-800 p-6 rounded-lg animate-fade-in">
              <h3 className="text-xl font-bold text-cyan-300">
                {activeStepData.title}
              </h3>
              <p className="mt-2 text-gray-300">{activeStepData.text}</p>
            </div>
          )}
          {isComplete && (
            <div className="mt-4 bg-green-900/50 p-4 rounded-lg text-green-300 animate-fade-in">
              <p className="font-bold">
                And that's the complete journey! You now see how every step
                logically leads to the next.
              </p>
            </div>
          )}
          {currentStep > 0 && !isComplete && (
            <button
              onClick={handleNextStep}
              className="mt-6 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
            >
              Next Step →
            </button>
          )}
          {isComplete && (
            <button
              onClick={handleReset}
              className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Review Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
