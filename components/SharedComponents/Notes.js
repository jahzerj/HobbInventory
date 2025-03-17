import { useState, useEffect } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import {
  StyledInput,
  BaseButton,
  ButtonContainer,
} from "@/components/SharedComponents/DetailPageStyles";

export default function Notes({ notes, isEditMode, onNotesUpdate }) {
  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  // Add effect to watch for isEditMode changes
  useEffect(() => {
    if (!isEditMode) {
      setEditNoteId(null);
      setEditNoteText("");
    }
  }, [isEditMode]);

  // Update local notes when props change
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const validateNote = (note) => {
    if (note.trim() === "") {
      throw new Error("Note cannot be empty");
    }
    if (note.length > 100) {
      throw new Error("Note must be 100 characters or less");
    }
  };

  const createNoteObject = (noteText) => ({
    _id: nanoid(),
    text: noteText,
    timestamp: new Date(),
  });

  const handleAddNote = async () => {
    try {
      validateNote(newNote);
      const newNoteObj = createNoteObject(newNote);
      const updatedNotes = [...localNotes, newNoteObj];
      setLocalNotes(updatedNotes);
      await onNotesUpdate(updatedNotes);
      setNewNote("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditNote = (noteId, currentText) => {
    setEditNoteId(noteId);
    setEditNoteText(currentText);
  };

  const handleSaveEditedNote = async () => {
    if (!editNoteId || editNoteText.trim() === "") return;

    try {
      validateNote(editNoteText);
      const updatedNotes = localNotes.map((note) =>
        note._id === editNoteId ? { ...note, text: editNoteText } : note
      );
      setLocalNotes(updatedNotes);
      await onNotesUpdate(updatedNotes);
      setEditNoteId(null);
      setEditNoteText("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!isEditMode) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = localNotes.filter((note) => note._id !== noteId);
      setLocalNotes(updatedNotes);
      await onNotesUpdate(updatedNotes);
    }
  };

  return (
    <>
      <h3>Notes</h3>
      <StyledInput
        type="text"
        maxLength={100}
        placeholder="Write a note (max 100 chars)..."
        value={newNote}
        onChange={(event) => setNewNote(event.target.value)}
      />
      <BaseButton $bgColor="#28a745" onClick={handleAddNote}>
        Submit Note
      </BaseButton>

      <NotesContainer>
        {localNotes.length === 0 ? (
          <p>&lt; No notes yet!&gt;</p>
        ) : (
          localNotes.map((note) => (
            <NoteItem key={note._id}>
              {editNoteId === note._id ? (
                <>
                  <StyledInput
                    type="text"
                    maxLength={100}
                    value={editNoteText}
                    onChange={(event) => setEditNoteText(event.target.value)}
                  />
                  <ButtonContainer>
                    <BaseButton onClick={handleSaveEditedNote}>
                      💾 Save
                    </BaseButton>
                    <BaseButton
                      onClick={() => {
                        setEditNoteId(null);
                        setEditNoteText("");
                      }}
                    >
                      ❌ Cancel
                    </BaseButton>
                  </ButtonContainer>
                </>
              ) : (
                <>
                  <span>{note.text}</span>
                  <NoteTimestamp>
                    {new Date(note.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {new Date(note.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    })}
                  </NoteTimestamp>
                  {isEditMode && (
                    <ButtonContainer>
                      <BaseButton
                        onClick={() => handleEditNote(note._id, note.text)}
                      >
                        ✏️ Edit
                      </BaseButton>
                      <RemoveNoteButton
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        🗑️ Delete
                      </RemoveNoteButton>
                    </ButtonContainer>
                  )}
                </>
              )}
            </NoteItem>
          ))
        )}
      </NotesContainer>
    </>
  );
}

const NotesContainer = styled.ul`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 90%;
  max-width: 430px;
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  list-style-type: none;
  overflow-x: hidden;
`;

const NoteItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;
  &:last-child {
    border-bottom: none;
  }
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  max-width: 100%;
  width: 100%;
`;

const NoteTimestamp = styled.span`
  font-size: 12px;
  color: #666;
`;

const RemoveNoteButton = styled(BaseButton)`
  background-color: #f9f9f9;
  color: black;
  font-size: 14px;
  margin-left: 5px;
  padding: 0;

  &:hover {
    background-color: #ff4d4d;
  }
`;
