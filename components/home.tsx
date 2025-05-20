"use client";

import { useState, useEffect } from "react";
import { Note } from "@/schema/note";

interface HomeProps {
  backendUrl: string;
}

export const Home = ({
  backendUrl,
}: HomeProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transformNote = (note: any): Note => ({
    ...note,
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  })

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${backendUrl}/notes`);
        if (!response.ok) {
          throw new Error("Failes to fetch notes")
        }

        const data = await response.json();
        const allNotes: Note[] = data.notes.map(transformNote)

        setNotes(allNotes);
        if (allNotes.length > 0 && !selectedNote) {
          setSelectedNote(allNotes[0]);
        }
      } catch (error) {
        console.error("Error fetching notes: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [])


  return (
    <div className="flex flex-col" >
      <h2>My Notes</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        notes.map((note) => (
          <div key={note.id}>
            <h3 className="bg-gray-200" >{note.title}</h3>
            <p>{note.content}</p>
          </div>
        ))
      )
      }
    </div>
  )
}
