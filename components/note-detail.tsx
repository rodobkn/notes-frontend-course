"use client";

import { Note } from "@/schema/note";

interface NoteDetailProps {
  note: Note;
}

export const NoteDetail = ({
  note,
}: NoteDetailProps) => {
  return (
    <div className="h-full w-2/3 flex flex-col p-6 border border-gray-300 rounded-lg transition-colors" >
      <>
        <div className="flex-1 w-full overflow-y-auto" >
          <h2 className="text-xl font-bold truncate">{note.title}</h2>
          <p className="text-gray-600 break-all mt-2">
            {note.content === "" ? (
              <span className="text-gray-400 italic" >Write your note here...</span>
            ) : (
              note.content
            )}
          </p>
        </div>
        <div className="w-full flex justify-between items-center mt-4" >
          <div className="text-sm text-gray-500">
            Last Update: {note.updated_at.toLocaleString()}
          </div>
          <button
            onClick={() => console.log("Try to edit note")}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Edit Note
          </button>
        </div>
      </>
    </div>
  )
}
