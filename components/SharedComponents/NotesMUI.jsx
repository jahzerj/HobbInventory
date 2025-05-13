import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  Stack,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function NotesMUI({ notes, isEditMode, onNotesUpdate }) {
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
      {/* Section header matching other section headers */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
          alignSelf: "center",
        }}
      >
        Notes
      </Typography>

      {/* Add note input - always visible */}
      <Box sx={{ width: "100%", maxWidth: 430, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          inputProps={{ maxLength: 100 }}
          placeholder="Write a note (max 100 chars)..."
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleAddNote}
          sx={{ mb: 2 }}
        >
          Submit Note
        </Button>
      </Box>

      {/* Notes list container */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 4,
          width: "100%",
          maxWidth: 430,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        {localNotes.length === 0 ? (
          <Typography align="center" color="text.secondary">
            &lt;-- No notes yet! --&gt;
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {localNotes.map((note, index) => (
              <ListItem
                key={note._id}
                sx={{
                  p: 1.5,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom:
                    index < localNotes.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
                disableGutters
                disablePadding
              >
                {editNoteId === note._id ? (
                  <Box sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 100 }}
                      value={editNoteText}
                      onChange={(event) => setEditNoteText(event.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveEditedNote}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEditNoteId(null);
                          setEditNoteText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        width: "100%",
                        wordBreak: "break-word",
                      }}
                    >
                      {note.text}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: isEditMode ? 1 : 0 }}
                    >
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
                    </Typography>

                    {isEditMode && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditNote(note._id, note.text)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteNote(note._id)}
                          sx={{
                            "&:hover": {
                              bgcolor: "error.main",
                              color: "error.contrastText",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    )}
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </>
  );
}
