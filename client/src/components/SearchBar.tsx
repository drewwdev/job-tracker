import React from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export default function SearchBar({ searchTerm, setSearchTerm }: Props) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search job applications..."
        className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
        autoComplete="off"
        spellCheck="false"
        aria-label="Search job applications"
      />
    </div>
  );
}
