"use client";

import { Note } from "@/schema/note";
import { NoteCard } from "@/components/note-card";
import { Loader2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  selectedNote: Note | null;
  isLoading: boolean;
}

export const NoteList = ({
  notes,
  onSelectNote,
  selectedNote,
  isLoading
}: NoteListProps) => {
  return (
    <div className="h-full w-1/3 border border-gray-300 p-4 rounded-lg overflow-y-auto" >
      <h2 className="font-semibold text-lg mb-4" >My Notes</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-20" >
          <Loader2 className="h-8 w-8 text-black animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-gray-500" >No notes yet</p>
      ) : (
        notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => onSelectNote(note)}
            isSelected={selectedNote?.id === note.id}
          />
        ))
      )}
    </div>
  )
}
