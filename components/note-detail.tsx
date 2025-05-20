"use client";

import { useState, useEffect } from "react";
import { Note } from "@/schema/note";
import { Loader2, Trash2 } from "lucide-react";

interface NoteDetailProps {
  note: Note;
  onSaveNote: (updatedNote: Note) => void;
  isProcessing: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onDeleteNote: () => void;
}

export const NoteDetail = ({
  note,
  onSaveNote,
  isProcessing,
  isEditing,
  setIsEditing,
  onDeleteNote,
}: NoteDetailProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    onSaveNote({ ...note, title, content });
  }

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note])

  return (
    <div className={`h-full w-2/3 flex flex-col p-6 border border-gray-300 rounded-lg transition-colors
      ${isEditing ? "bg-gray-100" : ""}`}
    >
      {isEditing ? (
        <>
          <div className="flex-1 flex flex-col space-y-2">
            <input
              className="w-full bg-transparent text-xl font-bold outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="flex-1 w-full bg-transparent text-gray-600 outline-none"
              value={content}
              placeholder="Write your note here..."
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-between items-center mt-4">
            <button
              onClick={() => onDeleteNote()}
              disabled={isProcessing}
              className={`px-4 py-2 bg-red-600 text-white rounded flex items-center transition ${
                isProcessing ? "bg-red-400 cursor-not-allowed" : "hover:bg-red-700"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ): (
                <>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </>
              )}
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isProcessing}
                className={`px-4 py-2 border border-gray-400 rounded transtition ${
                  isProcessing ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className={`px-4 py-2 text-white rounded transition ${
                  isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </>
      ) : (
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
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Edit Note
            </button>
          </div>
        </>
      )}
    </div>
  )
}
