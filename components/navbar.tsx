"use client";

interface NavbarProps {
  createNewNote: () => void;
  isCreating: boolean;
}

export const Navbar = ({
  createNewNote,
  isCreating,
}: NavbarProps) => {
  return (
    <div className="h-20 w-full flex justify-between items-center bg-gray-50 border-b border-gray-300 p-4 shadow-sm">
      <h1 className="text-2xl font-bold">Browser Notes</h1>
      <div>
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
