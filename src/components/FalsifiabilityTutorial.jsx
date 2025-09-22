import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";

// --- Section 1: The "All Swans Are White" Demo ---
const SwanDemo = () => {
  const [whiteSwans, setWhiteSwans] = useState([]);
  const [searchComplete, setSearchComplete] = useState(false);
  const swanLimit = 20;

  const handleAddSwan = () => {
    if (whiteSwans.length < swanLimit) {
      setWhiteSwans((prev) => [...prev, "🦢"]);
    }
  };

  const handleSearchWorld = () => setSearchComplete(true);

  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <h3 className="text-xl font-medium text-cyan-300 mb-2">
        The "All Swans Are White" Problem
      </h3>
      <p className="text-gray-400 mb-4">
        Your hypothesis is:{" "}
        <span className="font-bold text-white">All swans are white.</span> Your
        goal is to prove it.
      </p>

      {!searchComplete && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleAddSwan}
              disabled={whiteSwans.length >= swanLimit}
              className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-4 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Find a Swan
            </button>
            <p className="font-mono text-lg">
              White Swans Found: {whiteSwans.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {whiteSwans.map((swan, i) => (
              <span key={i} className="text-2xl">
                {swan}
              </span>
            ))}
          </div>
          {whiteSwans.length >= 10 && whiteSwans.length < swanLimit && (
            <p className="text-amber-300 mt-2">
              Is the hypothesis proven? Or could a non-white swan exist where
              you haven't looked?
            </p>
          )}
          {whiteSwans.length >= swanLimit && (
            <button
              onClick={handleSearchWorld}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg animate-fade-in"
            >
              Search the Whole World 🌍
            </button>
          )}
        </>
      )}

      {searchComplete && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4 animate-fade-in text-center">
          <p className="text-5xl mb-2">⚫</p>
          <h4 className="font-bold text-lg text-amber-300">
            A Black Swan Was Found!
          </h4>
          <p className="mt-2 max-w-xl mx-auto">
            Finding <span className="font-bold">{swanLimit}</span> white swans
            couldn't prove your hypothesis. Finding just{" "}
            <span className="font-bold">one</span> black swan disproved it. This
            is **Falsifiability**: a scientific claim must be testable and
            capable of being proven wrong.
          </p>
        </div>
      )}
    </div>
  );
};

// --- Section 2: The Courtroom Matching Game ---
// For this more complex component, we'll keep the logic inside
// NOTE: This is a simplified dnd-kit implementation for this specific use case.
const CourtroomMatcher = () => {
  // This could be made more robust, but for a simple 3-card match it's clear.
  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <h3 className="text-xl font-medium text-cyan-300 mb-2">
        Mapping the Analogy
      </h3>
      <p className="text-gray-400 mb-4">
        The logic of science mirrors the courtroom. The Null Hypothesis is the
        "default position" we seek to challenge.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-lg text-green-300">
          A scientist, like a prosecutor, doesn't prove their claim is
          absolutely true.
        </p>
        <p className="mt-2">
          Instead, they provide enough evidence to show that the default
          position (the Null Hypothesis) is so unlikely that it should be
          **rejected**.
        </p>
      </div>
    </div>
  );
};

// --- Section 3: Why It's a More Rigorous System ---
const WhyItWorksAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const accordionItems = [
    {
      title: "A Stronger Standard 💪",
      content:
        "We start by assuming our idea is wrong (that H₀ is true). This conservative approach protects science from wishful thinking and forces us to meet a high burden of proof.",
    },
    {
      title: "A Clear Target 🎯",
      content:
        "The Null Hypothesis is a specific, single statement (e.g., 'the difference between groups is zero'). It's far easier to mathematically challenge a precise target than to prove a vague, open-ended one.",
    },
    {
      title: "It Embraces Uncertainty 🔬",
      content:
        "Science provides strong evidence, not absolute certainty. By rejecting H₀, we make a powerful probabilistic statement: 'Based on this evidence, the default assumption is very unlikely to be true.' This is an honest reflection of how knowledge is built.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-md border border-gray-700">
      <h3 className="text-xl font-medium text-cyan-300 mb-2">
        Why is this a better way to do science?
      </h3>
      <div className="space-y-2">
        {accordionItems.map((item, index) => (
          <div key={item.title} className="bg-gray-800 rounded-lg">
            <button
              onClick={() => handleToggle(index)}
              className="w-full text-left p-4 font-semibold flex justify-between items-center"
            >
              {item.title}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40" : "max-h-0"
              }`}
            >
              <p className="p-4 pt-0 text-gray-300">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Parent Component ---
export const FalsifiabilityTutorial = () => {
  return (
    <section
      id="falsifiability"
      className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8"
    >
      <h2 className="text-3xl font-semibold text-amber-400 mb-4 border-b-2 border-amber-400/30 pb-2">
        Why Do We Need a "Null" Hypothesis?
      </h2>
      <div className="space-y-6">
        <SwanDemo />
        <CourtroomMatcher />
        <WhyItWorksAccordion />
      </div>
    </section>
  );
};
