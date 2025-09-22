import React, { useState } from "react";

const prerequisiteLinks = [
  { href: "#core-idea", title: "The Core Idea" },
  { href: "#why-we-test", title: "Why We Test" },
  { href: "#falsifiability", title: "Why the Null?" },
  { href: "#hypothesis-testing", title: "Hypothesis Testing" },
  { href: "#observed-vs-expected", title: "Observed vs. Expected" },
  { href: "#data-types", title: "Data Types" },
  { href: "#summary", title: "Summary" },
];

export const TableOfContents = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800/80 backdrop-blur-sm"
        aria-label="Open navigation menu"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <nav
        className={`fixed top-0 z-40 h-full w-64 bg-gray-800/90 backdrop-blur-sm p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:left-0`}
      >
        <h2 className="text-xl font-bold text-amber-400 mb-4">Navigation</h2>
        {/* --- Page Links --- */}
        <button
          onClick={() => {
            onNavigate("prerequisites"); /*...*/
          }}
          className="..."
        >
          Prerequisites Guide
        </button>
        <button
          onClick={() => {
            onNavigate("p-value"); /*...*/
          }}
          className="..."
        >
          P-Value Explorer
        </button>
        <button
          onClick={() => {
            onNavigate("df"); /*...*/
          }}
          className="block w-full text-left py-2 font-bold text-cyan-300 hover:text-cyan-100"
        >
          Degrees of Freedom
        </button>{" "}
        {/* Add new page link */}
        <button
          onClick={() => {
            onNavigate("wizard"); /*...*/
          }}
          className="..."
        >
          Test Checklist Wizard
        </button>
        <button onClick={() => onNavigate("calculator")}>
          Interactive Calculator
        </button>
        <hr className="my-4 border-gray-600" />
        {/* --- Section Links (Only show on the prerequisites page) --- */}
        {currentPage === "prerequisites" && (
          <>
            <h3 className="font-bold text-amber-400">Prerequisite Sections</h3>
            <ul>
              {prerequisiteLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="block py-2 text-gray-300 hover:text-cyan-400"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </>
  );
};
