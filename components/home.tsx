"use client";

import { useState, useEffect } from "react";
import { NoteList } from "@/components/note-list";
import { NoteDetail } from "@/components/note-detail";
import { Navbar } from "@/components/navbar";
import { Note } from "@/schema/note";
import { Loader2 } from "lucide-react";

interface HomeProps {
  backendUrl: string;
}

export const Home = ({
  backendUrl,
}: HomeProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const transformNote = (note: any): Note => ({
    ...note,
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  })

  const handleNewNote = async () => {
    setIsCreatingNote(true);
    try {
      const response = await fetch(`${backendUrl}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitle Note",
          content: "",
        })
      })

      if (!response.ok) {
        throw new Error("Error creating note")
      }

      const data = await response.json();
      const newNote: Note = transformNote(data.note);

      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
    } catch (error) {
      console.error("Error creating note: ", error);
    } finally {
      setIsCreatingNote(false);
    }
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  }

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
    <div className="h-screen">
      <Navbar
        createNewNote={handleNewNote}
        isCreating={isCreatingNote}
      />
      <div className="h-[calc(100vh-80px)] w-full flex space-x-4 p-4 px-8 bg-gray-50">
        <NoteList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
          isLoading={isLoading}
        />
        {isLoading ? (
          <div className="h-full w-2/3 flex justify-center items-center">
            <Loader2 className="h-12 w-12 text-black animate-spin" />
          </div>
        ) : selectedNote ? (
          <NoteDetail
            note={selectedNote}
          />
        ) : (
          <div>No hay nota seleccionada</div>
        )}
      </div>
    </div>
  )
}
