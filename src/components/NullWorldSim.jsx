import React, { useState } from "react";

export const NullWorldSim = () => {
  const [nullResults, setNullResults] = useState([]);
  const [realResults, setRealResults] = useState([]); // NEW: State for the real experiment results
  const [step, setStep] = useState(0); // 0: initial, 1: null world shown, 2: real world shown

  // Generates high CFU counts for the "no effect" world
  const generateNullResult = () => Math.floor(Math.random() * 41) + 130; // 130-170

  // Generates low CFU counts for the "real effect" world
  const generateRealResult = () => Math.floor(Math.random() * 21) + 20; // 20-40

  const handleRunNull = () => {
    setNullResults(Array.from({ length: 101 }, generateNullResult));
    setStep(1);
  };

  const handleRunReal = () => {
    setRealResults(Array.from({ length: 100 }, generateRealResult));
    setStep(2);
  };

  const handleReset = () => {
    setNullResults([]);
    setRealResults([]);
    setStep(0);
  };

  return (
    <section id="null-world" className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
          The P-Value: A Tale of Two Worlds 🔬
        </h2>
        {step > 0 && (
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
          >
            Reset
          </button>
        )}
      </div>

      <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
        <div className="text-center">
          <p>
            <strong>Question:</strong> Does "Bac-Be-Gone" actually kill
            bacteria?
          </p>
          <p className="text-cyan-300">
            <strong>Null Hypothesis (H₀):</strong> "Bac-Be-Gone" is just sterile
            water. It has no effect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6 items-start">
          {/* --- Null World Chart --- */}
          <div className="text-center">
            <h4 className="font-bold">"Null World" Results</h4>
            <p className="text-xs text-gray-400 mb-2">
              (Disinfectant has NO effect)
            </p>
            {step === 0 && (
              <button
                onClick={handleRunNull}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
              >
                Run 101 Null Experiments
              </button>
            )}
            <div className="relative w-full h-48 bg-gray-800 rounded-lg mt-2 overflow-hidden">
              {nullResults.map((result, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-fade-in"
                  style={{
                    left: `${((result - 20) / 160) * 100}%`,
                    top: `${Math.random() * 85 + 5}%`,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <p>~20 CFUs</p>
              <p>~180 CFUs</p>
            </div>
          </div>

          {/* --- Real World Chart --- */}
          <div className="text-center">
            <h4 className="font-bold">"Real World" Results</h4>
            <p className="text-xs text-gray-400 mb-2">
              (Disinfectant DOES have an effect)
            </p>
            {step === 1 && (
              <button
                onClick={handleRunReal}
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
              >
                Run 100 REAL Experiments 🔥
              </button>
            )}
            <div
              className={`relative w-full h-48 rounded-lg mt-2 overflow-hidden ${
                step < 2 ? "bg-gray-800/50" : "bg-gray-800"
              }`}
            >
              {realResults.map((result, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-amber-400 rounded-full animate-fade-in"
                  style={{
                    left: `${((result - 20) / 160) * 100}%`,
                    top: `${Math.random() * 85 + 5}%`,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <p>~20 CFUs</p>
              <p>~180 CFUs</p>
            </div>
          </div>
        </div>

        {/* --- Verdict Section --- */}
        {step === 2 && (
          <div className="mt-6 border-t-2 border-gray-700 pt-6 text-center animate-fade-in">
            <h4 className="text-xl font-semibold text-amber-300">
              The Verdict
            </h4>
            <p className="mt-2 max-w-2xl mx-auto">
              Look at the two charts. The results from the "Real World" (orange
              dots) form a completely separate group from the "Null World" (blue
              dots). There is no overlap.
            </p>
            <p className="font-bold text-2xl my-2">p-value &lt; 0.0001</p>
            <p className="p-3 bg-green-900/50 rounded-lg text-green-300 max-w-2xl mx-auto">
              <strong>Conclusion:</strong> The chance of getting our real-world
              results if the disinfectant was useless is practically zero. We
              **Reject the Null Hypothesis**. "Bac-Be-Gone" works!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
