import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { colorOptions } from "@/utils/colors";
import Link from "next/link";
import { nanoid } from "nanoid";
import EditButton from "@/components/EditButton";
import CloseButtonIcon from "@/components/icons/Closebutton";

export default function KeyCapDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: keycaps, error: keycapError } = useSWR(
    id ? `/api/inventories/keycaps/${id}` : null
  );

  const {
    data: userKeycaps,
    error: userKeycapError,
    mutate,
  } = useSWR(id ? `/api/inventories/userkeycaps?userId=guest_user` : null);

  const userKeycap = userKeycaps?.find((item) => item.keycapSetId?._id === id);

  const selectedColors = userKeycap?.selectedColors ?? [];
  const notes = userKeycap?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);

  const [editedKits, setEditedKits] = useState(userKeycap?.selectedKits || []);
  const [editedColors, setEditedColors] = useState(selectedColors || []);

  const [editedNotes, setEditedNotes] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");

  useEffect(() => {
    if (userKeycap?.notes) {
      setEditedNotes(userKeycap.notes);
    }
  }, [userKeycap?.notes]);

  const handleKitSelection = (kitName) => {
    if (!isEditMode) return;

    setEditedKits((prevKits) => {
      if (prevKits.includes(kitName)) {
        return prevKits.filter((kit) => kit !== kitName);
      } else {
        return [...prevKits, kitName];
      }
    });
  };

  const handleColorSelect = async (event) => {
    const selectedColor = event.target.value;

    if (isEditMode) {
      if (editedColors.includes(selectedColor)) return;
      if (editedColors.length >= 4) {
        return alert("You can only select up to 4 colors.");
      }
      setEditedColors((prevColors) => [...prevColors, selectedColor]);
      return;
    }

    //non-edit mode color selection
    if (selectedColors.includes(selectedColor)) return;
    if (selectedColors.length >= 4) {
      return alert("You can only selected up to 4 colors.");
    }

    const updatedColors = [...selectedColors, selectedColor];

    await fetch("/api/inventories/userkeycaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest_user",
        keycapSetId: id,
        selectedKits: userKeycap.selectedKits,
        selectedColors: updatedColors,
      }),
    });
    mutate();
  };

  const handleRemoveColor = (color) => {
    if (!isEditMode) return;

    setEditedColors((prevColors) =>
      prevColors.filter((existingColor) => existingColor !== color)
    );
  };

  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim() === "") return; //no empty notes please
    if (newNote.length > 100) {
      return alert("Note must be 100 characters or less.");
    }

    const newId = nanoid();
    const timestamp = new Date();
    const newNoteObj = { _id: newId, text: newNote, timestamp: timestamp };

    const updatedNotes = [...notes, newNoteObj];

    fetch("/api/inventories/userkeycaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest_user",
        keycapSetId: id,
        selectedKits: userKeycap.selectedKits,
        selectedColors: userKeycap.selectedColors,
        notes: updatedNotes,
      }),
    }).then(() => {
      mutate();
      setNewNote("");
    });
  };

  const handleEditNote = (noteId, currentText) => {
    console.log("Editing note:", noteId, currentText);
    setEditNoteId(noteId); //Set the note being edited
    setEditNoteText(currentText); // Only store the current note being edited
  };

  const handleSaveEditedNote = () => {
    if (!editNoteId || editNoteText.trim() === "") return;

    setEditedNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === editNoteId ? { ...note, text: editNoteText } : note
      )
    );

    setEditNoteId(null); // ✅ Close edit mode
    setEditNoteText(""); // Clear the edit texts state
  };

  const handleDeleteNote = (noteId) => {
    if (!isEditMode) return;

    const updatedNotes = editedNotes.filter((note) => note._id !== noteId);
    setEditedNotes(updatedNotes);
  };

  const handleSaveChanges = async () => {
    await fetch("/api/inventories/userkeycaps", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest_user",
        keycapSetId: id,
        selectedKits: editedKits,
        selectedColors: editedColors,
        notes: editedNotes,
      }),
    });
    await mutate();
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setEditedColors([...selectedColors]);
    setEditedKits(userKeycap?.selectedKits || []);
    setIsEditMode(false);
  };

  if (keycapError || userKeycapError) {
    return <p>Error loading keycap details.</p>;
  }

  if (!keycaps || !userKeycaps) {
    return <p>Loading...</p>;
  }

  const kitsAvailable = keycaps.kits?.flatMap((kit) => kit.price_list) ?? [];
  const selectedKits = userKeycap?.selectedKits ?? [];

  return (
    <>
      <EditButton
        onToggleEdit={() => {
          if (isEditMode) {
            handleCancelEdits();
          } else {
            setIsEditMode(true);
            setEditedColors([...selectedColors]);
            setEditedKits(userKeycap?.selectedKits || []);
            setEditedNotes([...notes]);
          }
        }}
      />
      <DetailPageContainer>
        {isEditMode ? null : (
          <StyledLink href="/inventories/keycaps">
            <CloseButtonIcon />
          </StyledLink>
        )}

        <HeaderSection>
          <h1>{keycaps.name}</h1>
          {keycaps.render_pics?.length > 0 && (
            <HeaderImage>
              <Image
                src={keycaps.render_pics[0]}
                alt={keycaps.name}
                layout="fill"
                objectFit="cover"
              />
            </HeaderImage>
          )}
        </HeaderSection>
        <BoxContainer>
          <li>
            <strong>Manufacturer:</strong> {keycaps.keycapstype}
          </li>
          <li>
            <strong>Profile:</strong> {keycaps.profile}
          </li>
          <li>
            <strong>Designer:</strong> {keycaps.designer}
          </li>
          <li>
            <strong>Geekhack Thread:</strong>{" "}
            <ExternalLink href={keycaps.link} target="_blank">
              Visit Geekhack
            </ExternalLink>
          </li>
        </BoxContainer>
        <h3>Your Kits</h3>
        {isEditMode ? (
          <GridContainer>
            {kitsAvailable.map((kit) => {
              const wasPreviouslySelected = selectedKits.includes(kit.name);
              const isCurrentlySelected = editedKits.includes(kit.name);

              return (
                <KitCard key={kit.name}>
                  <input
                    type="checkbox"
                    checked={isCurrentlySelected}
                    onChange={() => handleKitSelection(kit.name)}
                  />
                  {kit.pic ? (
                    <Image
                      src={kit.pic}
                      alt={kit.name}
                      // layout="intrinsic"
                      width={100}
                      height={100}
                      objectFit="cover"
                      priority
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{kit.name}</p>
                  {wasPreviouslySelected !== isCurrentlySelected && (
                    <small>
                      {isCurrentlySelected
                        ? "(Will be added"
                        : "(Will be removed)"}
                    </small>
                  )}
                </KitCard>
              );
            })}
          </GridContainer>
        ) : selectedKits.length > 0 ? (
          <GridContainer>
            {kitsAvailable
              .filter((kit) => selectedKits.includes(kit.name))
              .map((kit) => (
                <KitCard key={kit.name}>
                  {kit.pic ? (
                    <Image
                      src={kit.pic}
                      alt={kit.name}
                      // layout="intrinsic"
                      width={100}
                      height={100}
                      objectFit="cover"
                      priority
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{kit.name}</p>
                </KitCard>
              ))}
          </GridContainer>
        ) : (
          <p>No kits selected.</p>
        )}
        <h3>Choose 4 Colors</h3>
        <StyledInput
          as="select"
          onChange={handleColorSelect}
          value=""
          maxWidth="400px"
        >
          <option value="" disabled>
            -- Choose up to 4 colors --
          </option>
          {colorOptions
            .filter((color) =>
              !isEditMode
                ? !selectedColors.includes(color.name)
                : !editedColors.includes(color.name)
            )
            .map((color) => (
              <option key={color.name} value={color.name}>
                {color.name} {color.emoji}
              </option>
            ))}
        </StyledInput>
        <h3> Selected Colors</h3>
        <ColorsContainer>
          {(isEditMode ? editedColors : selectedColors).length > 0
            ? (isEditMode ? editedColors : selectedColors).map((color) => {
                const colorData = colorOptions.find(
                  (option) => option.name === color
                );
                return (
                  <SelectedColorLi key={color} bgColor={colorData?.name}>
                    {colorData?.emoji} {color}
                    {isEditMode && (
                      <RemoveColorButton
                        onClick={() => handleRemoveColor(color)}
                      >
                        x
                      </RemoveColorButton>
                    )}
                  </SelectedColorLi>
                );
              })
            : "No colors selected"}
        </ColorsContainer>

        <h3>Notes</h3>
        <StyledInput
          type="text"
          maxLength={100}
          placeholder="Write a note (max 100 chars)..."
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <BaseButton bgColor="#28a745" onClick={handleAddNote}>
          Submit Note
        </BaseButton>

        <NotesContainer>
          {(isEditMode ? editedNotes : notes).map((note) => (
            <NoteItem key={note._id}>
              {editNoteId === note._id ? (
                <>
                  <StyledInput
                    type="text"
                    maxLength={100}
                    value={editNoteText}
                    onChange={(event) => setEditNoteText(event.target.value)}
                  />
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
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this note?"
                            )
                          ) {
                            handleDeleteNote(note._id);
                          }
                        }}
                      >
                        🗑️ Delete
                      </RemoveNoteButton>
                    </ButtonContainer>
                  )}
                </>
              )}
            </NoteItem>
          ))}
        </NotesContainer>

        {isEditMode && (
          <ContainerAcceptCancleEdits>
            <BaseButton bgColor="#ff4d4d" onClick={handleCancelEdits}>
              ❌ Cancel
            </BaseButton>

            <BaseButton bgColor="#28a745" onClick={handleSaveChanges}>
              {" "}
              ✅ Confirm Edits
            </BaseButton>
          </ContainerAcceptCancleEdits>
        )}
      </DetailPageContainer>
    </>
  );
}

const DetailPageContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const StyledLink = styled(Link)`
  position: fixed;
  top: 5px;
  right: 5px;
  text-decoration: none;
  color: white;
  background-color: #ff4d4d;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  font-size: 24px;
  height: 50px;
  width: 50px;
  z-index: 1000;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const HeaderImage = styled.div`
  width: 340px;
  height: 170px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (min-width: 430px) {
    width: 387px;
    height: 195px;
  }

  @media (min-width: 600px) {
    width: 640px;
    height: 320px;
  }
`;

const BoxContainer = styled.ul`
  background: ${(props) => props.bgColor || "#f9f9f9"};
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  max-width: ${(props) => props.maxWidth || "600px"};
  text-align: ${(props) => props.align || "left"};
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: ${(props) => props.margin || "15px"};
  list-style-type: none;
`;

const ExternalLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const GridContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  width: auto;
  margin: 10px 0;
  max-width: 365px;
  background-color: transparent;

  @media (min-width: 430px) {
    max-width: 400px;
  }

  @media (min-width: 600px) {
    max-width: 600px;
  }
`;

const KitCard = styled.li`
  background: white;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  width: 100%;
  max-width: ${(props) => props.maxWidth || "600px"};
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: ${(props) => props.bgColor || "#f9f9f9"};
`;

const ColorsContainer = styled.ul`
  display: flex;
  background-color: #f9f9f9;
  padding: 10px;
  flex-wrap: wrap;
  gap: 15px;
  width: auto;
  margin: 10px 0;
  max-width: 365px;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (min-width: 430px) {
    max-width: 400px;
  }
`;

const SelectedColorLi = styled.li`
  background-color: #f9f9f9;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  border: 2px solid ${(props) => props.bgColor || "black"};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BaseButton = styled.button`
  margin-top: ${(props) => props.margin || "10px"};
  padding: 8px 15px;
  background-color: ${(props) => props.bgColor || "#28a745"};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: ${(props) => props.fontSize || "16px"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#218838"};
  }
`;

const RemoveColorButton = styled(BaseButton)`
  background-color: #f9f9f9;
  color: black;
  font-size: 14px;
  margin-left: 5px;
  padding: 0;

  &:hover {
    background-color: #ff4d4d;
  }
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const NotesContainer = styled.ul`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  list-style-type: none;
  width: 100%;
  max-width: 400px;
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

const EditKeycapsButton = styled(BaseButton)`
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
`;

const ContainerAcceptCancleEdits = styled.div`
  display: flex;
  justify-content: space-between;
`;
