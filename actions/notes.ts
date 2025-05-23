"use server";

import { getIdentityToken } from "@/utils/server/auth/get-identity-token";
import { Note } from "@/schema/note";

export const getAllNotes = async (): Promise<Note[]> => {
    const NOTES_BACKEND_URL = process.env.NOTES_BACKEND_URL!;
    const token = await getIdentityToken();

    const res = await fetch(`${NOTES_BACKEND_URL}/notes`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch notes");
    }

    const data = await res.json();
    return data.notes.map((note: Note) => ({
        ...note,
        created_at: new Date(note.created_at),
        updated_at: new Date(note.updated_at)
    }));
}

export const createNote = async (): Promise<Note> => {
    const NOTES_BACKEND_URL = process.env.NOTES_BACKEND_URL!;
    const token = await getIdentityToken();

    const res = await fetch(`${NOTES_BACKEND_URL}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "Untitled Note", content: "" })
    })

    if (!res.ok) {
        throw new Error("Failed to create note")
    }

    const data = await res.json();
    return {
        ...data.note,
        created_at: new Date(data.note.created_at),
        updated_at: new Date(data.note.updated_at),
    }
}

export const updateNote = async (note: Note): Promise<Note> => {
    const NOTES_BACKEND_URL = process.env.NOTES_BACKEND_URL!;
    const token = await getIdentityToken();

    const res = await fetch(`${NOTES_BACKEND_URL}/notes/${note.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: note.title, content: note.content })
    })

    if (!res.ok) {
        throw new Error("Failed to update note")
    }

    const data = await res.json();
    return {
        ...data.note,
        created_at: new Date(data.note.created_at),
        updated_at: new Date(data.note.updated_at),
    }
}

export const deleteNote = async (noteId: string): Promise<void> => {
    const NOTES_BACKEND_URL = process.env.NOTES_BACKEND_URL!;
    const token = await getIdentityToken();

    const res = await fetch(`${NOTES_BACKEND_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    })

    if (!res.ok) {
        throw new Error("Failed to delete note")
    }
}
