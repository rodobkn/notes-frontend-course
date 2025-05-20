"use client";

import { useState } from "react";

interface NavbarProps {
  createNewNote: () => void;
  isEditing: boolean;
  isCreating: boolean;
}

export const Navbar = ({
  createNewNote,
  isEditing,
  isCreating,
}: NavbarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="h-20 w-full flex justify-between items-center bg-gray-50 border-b border-gray-300 p-4 shadow-sm">
      <h1 className="text-2xl font-bold">Browser Notes</h1>
      <div
        className="relative"
        onMouseEnter={() => (isEditing || isCreating) && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <span className="absolute top-11 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {isCreating ? "Creando nota..." : "Guarda la nota que estás editando"}
          </span>
        )}

        <button
          onClick={createNewNote}
          disabled={isCreating}
          className={`px-4 py-2 text-white rounded transition ${
            (isCreating)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          + New Note
        </button>
      </div>
    </div>
  )
}
