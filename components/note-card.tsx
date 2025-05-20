"use client";

import { Note } from "@/schema/note";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  isSelected: boolean;
}

export const NoteCard = ({
  note,
  onClick,
  isSelected,
}: NoteCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition hover:bg-gray-100 ${
        isSelected ? "bg-gray-100" : ""
      }`}
    >
      <h3 className="font-semibold text-xl truncate" >{note.title}</h3>
      <p className="text-gray-500 text-base line-clamp-2">
        {note.content}
      </p>
    </div>  
  );
}
