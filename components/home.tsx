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
  const [isEditingSelectedNote, setIsEditingSelectedNote] = useState(false);
  const [isProcessingNote, setIsProcessingNote] = useState(false); // Updating or Deleting the Note
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
      setIsEditingSelectedNote(true);
    } catch (error) {
      console.error("Error creating note: ", error);
    } finally {
      setIsCreatingNote(false);
    }
  }

  const handleSaveNote = async (updatedNote: Note) => {
    setIsProcessingNote(true);
    try {
      const response = await fetch(`${backendUrl}/notes/${updatedNote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedNote.title,
          content: updatedNote.content,
        }),
      })

      if (!response.ok) {
        throw new Error("Error updating note");
      }

      const data = await response.json();
      const updatedNoteFromBackend: Note = transformNote(data.note);

      setNotes((prev) => {
        return prev.map((note) => {
          if (note.id === updatedNoteFromBackend.id) {
            return updatedNoteFromBackend;
          }
          return note;
        });
      })

      setSelectedNote(updatedNoteFromBackend);
      setIsEditingSelectedNote(false);
    } catch (error) {
      console.error("Error updating note: ", error);
    } finally {
      setIsProcessingNote(false);
    }
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  }

  const handleDeleteNote = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setIsProcessingNote(true);
    try {
      if (!selectedNote) {
        throw new Error("Error deleting note because selectedNote is null");
      }

      const response = await fetch(`${backendUrl}/notes/${selectedNote.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting note");
      }

      setNotes((prev) => {
        const updatedNotes = prev.filter((note) => note.id !== selectedNote.id);
        setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
        return updatedNotes;
      });
      if (isEditingSelectedNote === true) {
        setIsEditingSelectedNote(false);
      };
    } catch (error) {
      console.error("Error deleting note: ", error);
    } finally {
      setIsProcessingNote(false);
    }
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
            onSaveNote={handleSaveNote}
            isProcessing={isProcessingNote}
            isEditing={isEditingSelectedNote}
            setIsEditing={setIsEditingSelectedNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : (
          <div>No hay nota seleccionada</div>
        )}
      </div>
    </div>
  )
}
