import React, { useState } from "react";

// Demo 1: The Noise of Nature (Random Chance)
const DemoRandomChance = () => {
  const [trials, setTrials] = useState([]);

  const handleFlipCoins = () => {
    const heads = Math.round(Math.random() * 20) + 40; // Simulate variability around 50
    const tails = 100 - heads;
    setTrials((prev) => [...prev, { heads, tails }]);
  };

  // NEW: Reset handler to clear the trials
  const handleReset = () => {
    setTrials([]);
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <h3 className="text-xl font-medium text-cyan-300 mb-2">
        Demo 1: The Noise of Nature
      </h3>
      <p className="text-red-400 mb-4">
        <strong>
          Why can't we just look at the numbers and claim that yes disinfectant
          indeed kills both types differently!
        </strong>{" "}
        what is stopping us?.
      </p>
      <p className="text-white-400 mb-4">
        Let's take the example of coin toss and understand the issue of natural
        variation.
      </p>
      <p>
        This is a perfectly fair coin (50/50 probability). Click the button
        multiple times to see how randomness creates{" "}
        <strong className="text-red-400 mb-4"> natural variation.</strong>
      </p>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleFlipCoins}
          className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
        >
          Flip 100 Times
        </button>
        {/* NEW: Reset button appears only when there are trials to clear */}
        {trials.length > 0 && (
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Reset
          </button>
        )}
      </div>
      {trials.length > 0 && (
        <div className="bg-gray-800 p-4 rounded animate-fade-in">
          <p className="font-semibold mb-2">Results:</p>
          <div className="space-y-3">
            {trials.map((trial, index) => (
              <div key={index} className="text-sm">
                <p>
                  Trial {index + 1}:{" "}
                  <span className="font-mono">{trial.heads} Heads</span>,{" "}
                  <span className="font-mono">{trial.tails} Tails</span>
                </p>
                <div className="flex items-center gap-1 h-6 bg-gray-700 rounded overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${trial.heads}%` }}
                  ></div>
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: `${trial.tails}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-amber-300 font-semibold text-center">
            Notice how the result is almost never exactly 50/50. This is random
            noise!
          </p>
        </div>
      )}
    </div>
  );
};

// Demo 2: The Power of Scale (Sample Size)
const DemoSampleSize = () => {
  const initialSampleSize = 10;
  const [sampleSize, setSampleSize] = useState(initialSampleSize);
  const proportionA = 0.8;
  const proportionB = 0.6;

  const killedA = Math.round(sampleSize * proportionA);
  const killedB = Math.round(sampleSize * proportionB);

  const confidence = Math.min(100, 20 * Math.log10(sampleSize) + 20);

  let confidenceText;
  if (sampleSize < 50)
    confidenceText = `A difference of ${
      killedA - killedB
    }. Could this be luck?`;
  else if (sampleSize < 500)
    confidenceText = `A difference of ${
      killedA - killedB
    }. This feels more meaningful.`;
  else
    confidenceText = `A difference of ${
      killedA - killedB
    }. This seems like a real effect!`;

  // NEW: Reset handler to return slider to its initial value
  const handleReset = () => {
    setSampleSize(initialSampleSize);
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700 mt-6">
      <h3 className="text-xl font-medium text-cyan-300 mb-2">
        Demo 2: The Power of Scale
      </h3>
      <p className="text-gray-400 mb-4">
        Scenario: Disinfectant A killed 80% of bacteria, while B killed 60%. Use
        the slider to see how sample size affects our confidence.
      </p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="sample-size" className="block font-mono">
            Number of Bacteria Tested (N) = {sampleSize}
          </label>
          {/* NEW: Reset button for the slider */}
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
          >
            Reset
          </button>
        </div>
        <input
          type="range"
          id="sample-size"
          min="10"
          max="1000"
          value={sampleSize}
          onChange={(e) => setSampleSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex justify-around items-end gap-4 h-48 bg-gray-800 p-4 rounded">
        <div className="text-center w-1/2">
          <div
            className="bg-green-500 mx-auto"
            style={{ height: `${proportionA * 100}%`, width: "50%" }}
          ></div>
          <p className="mt-2 font-bold">A: {killedA} killed</p>
        </div>
        <div className="text-center w-1/2">
          <div
            className="bg-blue-500 mx-auto"
            style={{ height: `${proportionB * 100}%`, width: "50%" }}
          ></div>
          <p className="mt-2 font-bold">B: {killedB} killed</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-1 font-semibold">Confidence Meter:</p>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-red-500 to-green-500 h-4 rounded-full"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <p className="mt-2 text-amber-300 font-semibold text-center">
          {confidenceText}
        </p>
        <p> </p>
        <p>
          {" "}
          Understands that more number of samples and repetitions stronger the
          confidence for the results. As the number gets bigger differences also
          get bigger.
        </p>
      </div>
    </div>
  );
};

// Demo 3: Gut Feeling vs. Hard Data (Objectivity)
const DemoObjectivity = () => {
  const initialGutFeeling = 50;
  const [gutFeeling, setGutFeeling] = useState(initialGutFeeling);
  const [showResult, setShowResult] = useState(false);

  // NEW: Reset handler for the slider and the result display
  const handleReset = () => {
    setGutFeeling(initialGutFeeling);
    setShowResult(false);
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700 mt-6">
      <h3 className="text-xl font-medium text-cyan-300 mb-2">
        Demo 3: Gut Feeling vs. Hard Data
      </h3>
      <p className="text-gray-400 mb-4">
        Given a result of 80 dead bacteria vs. 60, how significant does this
        feel to you? Then, see what the science says.
      </p>

      <p className="text-red-400 mb-4">
        Insignificant things can look significant from biased eyes! Always
        verify with science and statistics.
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="gut-feeling" className="block font-semibold">
              Your Subjective Feeling:
            </label>
            {/* NEW: Reset button */}
            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
            >
              Reset
            </button>
          </div>
          <input
            type="range"
            id="gut-feeling"
            min="0"
            max="100"
            value={gutFeeling}
            onChange={(e) => setGutFeeling(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1 text-gray-400">
            <span>Probably Random</span>
            <span>Definitely Real</span>
          </div>
        </div>
        <div className="text-center">
          {!showResult ? (
            <button
              onClick={() => setShowResult(true)}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105"
            >
              Run χ² Test
            </button>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg border border-cyan-400/50 animate-fade-in">
              <h4 className="font-bold text-lg text-cyan-400">
                Objective Result
              </h4>
              <p className="text-2xl font-mono my-2">p-value = 0.04</p>
              <p className="text-sm">
                A p-value less than 0.05 is typically considered **statistically
                significant**.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main export component
export const WhyWeTest = () => {
  return (
    <section
      id="why-we-test"
      className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8"
    >
      <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
        What Stops Us From Using Plain Numbers?
      </h2>
      <div className="space-y-6">
        <DemoRandomChance />
        <DemoSampleSize />
        <DemoObjectivity />
      </div>
    </section>
  );
};
