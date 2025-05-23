"use client";

import { useState, useEffect } from "react";
import { NoteList } from "@/components/note-list";
import { NoteDetail } from "@/components/note-detail";
import { Navbar } from "@/components/navbar";
import { EmptyNoteDetail } from "@/components/empty-note-detail";
import { Note } from "@/schema/note";
import { Loader2 } from "lucide-react";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote
} from "@/actions/notes";

export const Home = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditingSelectedNote, setIsEditingSelectedNote] = useState(false);
  const [isProcessingNote, setIsProcessingNote] = useState(false); // Updating or Deleting the Note
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleNewNote = async () => {
    setIsCreatingNote(true);
    try {
      const newNote = await createNote();
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
      const updatedNoteFromBackend = await updateNote(updatedNote)

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
    if (isEditingSelectedNote === true) {
      setIsEditingSelectedNote(false);
    }
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

      await deleteNote(selectedNote.id);

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
        const allNotes = await getAllNotes();

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
        isEditing={isEditingSelectedNote}
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
          <EmptyNoteDetail onCreate={handleNewNote} />
        )}
      </div>
    </div>
  )
}
