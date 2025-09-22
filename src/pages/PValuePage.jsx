import React, { useState, useMemo } from "react";
import { NullWorldSim } from "../components/NullWorldSim";

// --- Interactive P-Value Map Component ---
const InteractivePValueMap = () => {
  const [resultValue, setResultValue] = useState(150);
  const pValue = useMemo(() => {
    const distance = Math.abs(resultValue - 150);
    const p = Math.exp(-0.005 * Math.pow(distance, 1.8));
    return Math.max(0.0001, p);
  }, [resultValue]);
  const markerPositionX = ((resultValue - 20) / 160) * 100;

  let zone, verdict;
  if (pValue > 0.1) {
    zone = '📍 In the "Not Surprising" Zone';
    verdict = "✅ Consistent with random chance. Fail to reject H₀.";
  } else if (pValue > 0.05) {
    zone = '📍 In the "A Bit Weird" Zone';
    verdict = "🤔 Evidence is inconclusive. Fail to reject H₀.";
  } else {
    zone = '📍 In the "Highly Surprising" Zone';
    verdict =
      "🚨 Statistically Significant! This result is too unlikely to be a fluke. Reject H₀.";
  }

  const handleReset = () => setResultValue(150);

  return (
    <div
      id="interactive-map"
      className="bg-gray-900/50 p-6 rounded-md border border-gray-700 mt-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-cyan-300 mb-4">
          The Interactive "Null World" Map 🗺️
        </h3>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          Reset
        </button>
      </div>
      <div className="relative">
        <svg viewBox="0 0 200 100" className="w-full h-auto font-sans">
          <path
            d="M 50,90 C 70,90 70,40 100,40 C 130,40 130,90 150,90 Z"
            fill="#166534"
            opacity="0.3"
          />
          <path
            d="M 25,90 C 45,90 45,60 50,60 L 50,90 Z"
            fill="#a16207"
            opacity="0.3"
          />
          <path
            d="M 150,90 C 155,90 155,60 175,60 L 175,90 Z"
            fill="#a16207"
            opacity="0.3"
          />
          <path
            d="M 10,90 C 20,90 20,70 25,70 L 25,90 Z"
            fill="#991b1b"
            opacity="0.4"
          />
          <path
            d="M 175,90 C 180,90 180,70 190,70 L 190,90 Z"
            fill="#991b1b"
            opacity="0.4"
          />
          <path
            d="M 10,90 C 40,90 40,10 100,10 C 160,10 160,90 190,90"
            stroke="#06b6d4"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <clipPath id="pValueClipPath">
              <rect
                x={markerPositionX * 2}
                y="0"
                width={200 - markerPositionX * 2}
                height="100"
              />
            </clipPath>
          </defs>
          <rect
            x="0"
            y="0"
            width="200"
            height="100"
            fill="#f59e0b"
            opacity="0.5"
            clipPath="url(#pValueClipPath)"
          />
          <line
            x1={markerPositionX * 2}
            y1="5"
            x2={markerPositionX * 2}
            y2="95"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="2"
          />
        </svg>
        <div
          className="absolute font-bold text-amber-300 text-sm"
          style={{ left: `calc(${markerPositionX}% - 25px)`, bottom: "-10px" }}
        >
          P-Value
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-center mb-2">
          Slide to Set Your Experiment's Result (CFU Count):{" "}
          <span className="font-mono font-bold">{resultValue}</span>
        </label>
        <input
          type="range"
          min="20"
          max="180"
          step="1"
          value={resultValue}
          onChange={(e) => setResultValue(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600 space-y-2 text-center">
        <p>
          <span className="font-bold">Result Location:</span> {zone}
        </p>
        <p>
          <span className="font-bold">P-Value:</span>{" "}
          <span className="font-mono">
            {pValue < 0.001 ? "p < 0.001" : `p = ${pValue.toFixed(3)}`}
          </span>
        </p>
        <p>
          <span className="font-bold">Verdict:</span> {verdict}
        </p>
      </div>
    </div>
  );
};

// --- Error Simulator Component ---
const ErrorSimulator = () => {
  const [alpha, setAlpha] = useState(0.05);
  const [scenario, setScenario] = useState("type1");
  const [dots, setDots] = useState([]);

  const randn_bm = (mean, std) => {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * std + mean;
  };

  const zScores = {
    "0.20": 1.28,
    "0.10": 1.645,
    0.05: 1.96,
    0.01: 2.576,
    0.001: 3.291,
  };

  const results = useMemo(() => {
    if (dots.length === 0) return { correct: 0, errors: 0 };
    const cutoff = zScores[alpha.toFixed(2)] || 1.96;
    let errors = 0;
    dots.forEach((dot) => {
      if (Math.abs(dot.x) > cutoff) {
        errors++;
      }
    });
    return { correct: 100 - errors, errors: errors };
  }, [dots, alpha]);

  const runSimulation = () => {
    const mean = scenario === "type1" ? 0 : 2.2;
    const std = 1;
    const newDots = Array.from({ length: 100 }, () => ({
      x: randn_bm(mean, std),
      y: Math.random() * 85 + 5,
    }));
    setDots(newDots);
  };

  const handleReset = () => {
    setDots([]);
    setAlpha(0.05);
  };

  const cutoffPercent = ((zScores[alpha.toFixed(2)] || 1.96) / 4) * 50;

  return (
    <section
      id="error-simulator"
      className="bg-gray-900/50 p-6 rounded-md border border-gray-700 mt-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-cyan-300 mb-4">
          The Lab Director Simulator ⚖️
        </h3>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          Reset All
        </button>
      </div>
      <p className="text-gray-300 mb-4">
        Setting α = {alpha.toFixed(3)} is like drawing a line in the sand. You
        are pre-declaring: "If my result falls into the red{" "}
        {Math.round(alpha * 100)}% 'highly surprising' zone, I will reject the
        null hypothesis." This choice has consequences...
      </p>
      <svg
        viewBox="-50 -10 100 60"
        className="w-full h-auto bg-gray-800 rounded"
      >
        <path
          d="M -40,50 C -20,50 -20,0 0,0 C 20,0 20,50 40,50"
          stroke="#06b6d4"
          strokeWidth="1"
          fill="none"
        />
        {scenario === "type2" && (
          <path
            d="M -18,50 C 2,50 2,0 22,0 C 42,0 42,50 62,50"
            stroke="#f59e0b"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="2"
          />
        )}
        <rect
          x={-50}
          y={-10}
          width={50 - cutoffPercent}
          height={60}
          fill="#991b1b"
          opacity="0.3"
        />
        <rect
          x={50 - cutoffPercent}
          y={-10}
          width={cutoffPercent * 2}
          height={60}
          fill="transparent"
        />
        <rect
          x={50 + cutoffPercent}
          y={-10}
          width={50 - cutoffPercent}
          height={60}
          fill="#991b1b"
          opacity="0.3"
        />
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x * 10}
            cy={dot.y * 0.5}
            r="0.8"
            fill={scenario === "type1" ? "#67e8f9" : "#fcd34d"}
            className="animate-fade-in"
          />
        ))}
      </svg>
      <div className="grid md:grid-cols-2 gap-4 mt-4 bg-gray-800 p-4 rounded-lg">
        <div
          className={`p-4 rounded ${scenario === "type1" ? "bg-gray-700" : ""}`}
        >
          <h4 className="font-bold">Scenario A: The False Alarm Test 📢</h4>
          <p className="text-sm text-gray-300 mt-2 mb-2">
            <b>What is a Type I Error?</b> A false positive. You conclude there
            is an effect when there isn't one. We'll give your lab a useless
            disinfectant (H₀ is true). How many get a random fluke and
            mistakenly claim a discovery?
          </p>
          <button
            onClick={() => {
              setScenario("type1");
              runSimulation();
            }}
            className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Run 100 Trials
          </button>
          {scenario === "type1" && dots.length > 0 && (
            <div className="mt-2 text-center animate-fade-in">
              <p>
                Correct "No Effect" Findings:{" "}
                <span className="font-bold text-green-400">
                  {results.correct}
                </span>
              </p>
              <p>
                False Alarms (Type I Errors):{" "}
                <span className="font-bold text-red-400">{results.errors}</span>
              </p>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded ${scenario === "type2" ? "bg-gray-700" : ""}`}
        >
          <h4 className="font-bold">
            Scenario B: The Missed Discovery Test 🤫
          </h4>
          <p className="text-sm text-gray-300 mt-2 mb-2">
            <b>What is a Type II Error?</b> A false negative. You fail to detect
            an effect that is actually real. We'll test a disinfectant with a
            real, modest effect (H₀ is false). How often will your lab miss it?
          </p>
          <button
            onClick={() => {
              setScenario("type2");
              runSimulation();
            }}
            className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
          >
            Run 100 Trials
          </button>
          {scenario === "type2" && dots.length > 0 && (
            <div className="mt-2 text-center animate-fade-in">
              <p>
                Correct Discoveries:{" "}
                <span className="font-bold text-green-400">
                  {results.correct}
                </span>
              </p>
              <p>
                Missed Discoveries (Type II):{" "}
                <span className="font-bold text-red-400">{results.errors}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 p-4 text-center bg-gray-900/50 rounded">
        <h4 className="font-bold">You've Discovered the Trade-Off!</h4>
        <p className="text-sm text-gray-300">
          A higher alpha catches more real effects but leads to more false
          alarms. A lower alpha reduces false alarms but misses more real
          effects. The standard α = 0.05 is the classic compromise between these
          two risks.
        </p>
      </div>
    </section>
  );
};

// --- Final Verdict Component ---
const FinalVerdict = () => {
  const [revealed, setRevealed] = useState(false);
  const handleReset = () => setRevealed(false);

  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700 mt-6 text-center">
      <div className="flex justify-center items-center mb-4">
        <h3 className="text-xl font-medium text-cyan-300 mx-auto">
          The Final Verdict: Your Disinfectant Test 🔬
        </h3>
        {revealed && (
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
          >
            Reset
          </button>
        )}
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg text-lg"
        >
          Reveal P-Value
        </button>
      )}
      {revealed && (
        <div className="animate-fade-in space-y-4">
          <p className="text-2xl">
            Your Chi-Square test result:{" "}
            <span className="font-mono font-bold text-amber-300">p = 0.03</span>
          </p>
          <div className="p-4 bg-gray-800 rounded-lg max-w-md mx-auto">
            <p className="text-xl font-bold">
              <span className="text-amber-300">0.03</span> is less than{" "}
              <span className="text-cyan-300">α = 0.05</span>
            </p>
          </div>
          <div>
            <p className="font-bold text-lg text-green-400">
              Decision: Reject the Null Hypothesis.
            </p>
            <p className="text-gray-300 max-w-xl mx-auto">
              Interpretation: There's only a 3% chance you'd see this result by
              pure luck. This is statistically significant, providing strong
              evidence that the disinfectant works differently on the two
              bacteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
export const PValuePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8 font-sans md:pl-72">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
            Understanding the P-Value
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            The final piece of evidence in our courtroom trial.
          </p>
        </header>
        <div className="space-y-8">
          <NullWorldSim />
          <InteractivePValueMap />
          <ErrorSimulator />
          <FinalVerdict />
        </div>
      </div>
    </div>
  );
};
