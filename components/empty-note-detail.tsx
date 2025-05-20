"use client";

interface EmptyNoteDetailProps {
  onCreate: () => void;
}

export const EmptyNoteDetail = ({
  onCreate
}: EmptyNoteDetailProps) => {
  return (
    <div className="h-full w-2/3 flex flex-col items-center justify-center p-6">
      <p className="text-gray-500 mb-4">Create your first note to get started</p>
      <button
        onClick={onCreate}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center space-x-2"
      >
        <span>+ New Note</span>
      </button>
    </div>
  )
}
