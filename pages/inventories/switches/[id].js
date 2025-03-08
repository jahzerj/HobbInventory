import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { useState, useEffect } from "react";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButton from "@/components/KeycapComponents/ConfirmEditButton";
import EditButton from "@/components/KeycapComponents/EditButton";
import useSWR from "swr";
import Image from "next/image";
import { nanoid } from "nanoid";

export default function SwitchDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: mxswitch, error: switchError } = useSWR(
    id ? `/api/inventories/switches/${id}` : null
  );

  const {
    data: userSwitches,
    error: userSwitchesError,
    mutate,
  } = useSWR(id ? `/api/inventories/userswitches?userId=guest_user` : null);

  const userSwitch = userSwitches?.find((item) => item._id === id);
  const notes = userSwitch?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);
  const [editedNotes, setEditedNotes] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [newNote, setNewNote] = useState("");

  const [editedName, setEditedName] = useState(mxswitch?.name || "");
  const [editedManufacturer, setEditedManufacturer] = useState(
    mxswitch?.manufacturer || ""
  );
  const [editedImage, setEditedImage] = useState(mxswitch?.image || "");
  const [editedSwitchType, setEditedSwitchType] = useState(
    mxswitch?.switchType || ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    mxswitch?.quantity || ""
  );
  const [editedSpringWeight, setEditedSpringWeight] = useState(
    mxswitch?.springWeight || ""
  );
  const [editedTopMaterial, setEditedTopMaterial] = useState(
    mxswitch?.topMaterial || ""
  );
  const [editedBottomMaterial, setEditedBottomMaterial] = useState(
    mxswitch?.bottomMaterial || ""
  );
  const [editedStemMaterial, setEditedStemMaterial] = useState(
    mxswitch?.stemMaterial || ""
  );
  const [editedFactoryLubed, setEditedFactoryLubed] = useState(
    mxswitch?.factoryLubed || false
  );
  const [editedIsLubed, setEditedIsLubed] = useState(
    mxswitch?.isLubed || false
  );
  const [editedIsFilmed, setEditedIsFilmed] = useState(
    mxswitch?.isFilmed || false
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);
  useEffect(() => {
    if (userSwitch) {
      setEditedNotes(userSwitch.notes);
    }
  }, [userSwitch?.notes]);

  const handleAddNote = () => {
    if (newNote.trim() === "") return; //no empty notes please
    if (newNote.length > 100) {
      return alert("Note must be 100 characters or less.");
    }

    const newId = nanoid();
    const timestamp = new Date();
    const newNoteObj = { _id: newId, text: newNote, timestamp: timestamp };

    const updatedNotes = [...notes, newNoteObj];

    fetch("/api/inventories/userswitches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest_user",
        switchId: id,
        notes: updatedNotes,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add note");
        return response.json();
      })
      .then(() => {
        mutate();
        setNewNote("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add note. Please try again.");
      });
  };

  const handleEditNote = (noteId, currentText) => {
    setEditNoteId(noteId);
    setEditNoteText(currentText);
  };

  const handleSaveEditedNote = () => {
    if (!editNoteId || editNoteText.trim() === "") return;

    setEditedNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === editNoteId ? { ...note, text: editNoteText } : note
      )
    );

    setEditNoteId(null);
    setEditNoteText("");
  };

  const handleDeleteNote = (noteId) => {
    if (!isEditMode) return;

    const updatedNotes = editedNotes.filter((note) => note._id !== noteId);
    setEditedNotes(updatedNotes);
  };

  const handleSaveChanges = async () => {
    if (
      !editedName ||
      !editedManufacturer ||
      !editedImage ||
      !editedSwitchType
    ) {
      alert("Name, Manufacturer, Switch Type, and Image are required.");
      return;
    }

    try {
      await fetch("/api/inventories/userswitches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest_user",
          switchId: id,
          name: editedName,
          manufacturer: editedManufacturer,
          image: editedImage,
          switchType: editedSwitchType,
          quantity: editedQuantity,
          springWeight: editedSpringWeight,
          topMaterial: editedTopMaterial,
          bottomMaterial: editedBottomMaterial,
          stemMaterial: editedStemMaterial,
          factoryLubed: editedFactoryLubed,
          isLubed: editedIsLubed,
          isFilmed: editedIsFilmed,
          notes: editedNotes,
        }),
      });

      mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    setEditNoteId(null);
    setEditedName(mxswitch?.name || "");
    setEditedManufacturer(mxswitch?.manufacturer || "");
    setEditedImage(mxswitch?.image || "");
    setEditedSwitchType(mxswitch?.switchType || "");
    setEditedQuantity(mxswitch?.quantity || "");
    setEditedSpringWeight(mxswitch?.springWeight || "");
    setEditedTopMaterial(mxswitch?.topMaterial || "");
    setEditedBottomMaterial(mxswitch?.bottomMaterial || "");
    setEditedStemMaterial(mxswitch?.stemMaterial || "");
    setEditedFactoryLubed(mxswitch?.factoryLubed || false);
    setEditedIsLubed(mxswitch?.isLubed || false);
    setEditedIsFilmed(mxswitch?.isFilmed || false);
    setEditedNotes([...notes]);
  };

  if (switchError || userSwitchesError) {
    return <p> Error loading switch details</p>;
  }

  if (!mxswitch) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <DetailPageContainer>
        {!isEditMode && (
          <StyledLink
            href="/inventories/switches"
            aria-label="Close Details Page"
          >
            <CloseButtonIcon />
          </StyledLink>
        )}

        <HeaderSection>
          {isEditMode ? (
            <h1>Editing {mxswitch.name}</h1>
          ) : (
            <h1>
              {mxswitch.manufacturer} {mxswitch.name}
            </h1>
          )}
          <HeaderImage>
            <Image
              src={mxswitch.image}
              alt={mxswitch.name}
              height={200}
              width={200}
              priority
            />
          </HeaderImage>
        </HeaderSection>

        <BoxContainer>
          <li>
            <strong>Manufacturer:</strong> {mxswitch.manufacturer}
          </li>
          <li>
            <strong>Switch Type:</strong> {mxswitch.switchType}
          </li>
          <li>
            <strong>Quantity:</strong> {mxswitch.quantity}
          </li>
          <li>
            <strong>Spring Weight:</strong> {mxswitch.springWeight}
          </li>
          <li>
            <strong>Top Housing:</strong> {mxswitch.topMaterial}
          </li>
          <li>
            <strong>Bottom Housing:</strong> {mxswitch.bottomMaterial}
          </li>
          <li>
            <strong>Stem Material:</strong> {mxswitch.stemMaterial}
          </li>
          <li>
            <strong>Factory Lube:</strong> {mxswitch.factoryLubed}
          </li>
          <li>
            <strong>Hand Lubed:</strong> {mxswitch.isLubed}
          </li>
          <li>
            <strong>Filmed:</strong> {mxswitch.isFilmed}
          </li>
        </BoxContainer>

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
          {notes.length === 0 && editedNotes.length === 0 ? (
            <p> &lt; No notes yet!&gt; </p>
          ) : (
            (isEditMode ? editedNotes : notes).map((note) => (
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
            ))
          )}
        </NotesContainer>

        <AcceptCancelEditButtonContainer
          $innerWidth={innerWidth}
          $isEditMode={isEditMode}
        >
          <EditButton
            isEditMode={isEditMode}
            onToggleEdit={() => {
              if (isEditMode) {
                handleCancelEdits();
              } else {
                setEditedNotes([...notes]);
              }
              setIsEditMode(!isEditMode);
            }}
          />
          {isEditMode && (
            <ConfirmEditButton
              isEditMode={isEditMode}
              onSaveChanges={handleSaveChanges}
            />
          )}
        </AcceptCancelEditButtonContainer>
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
  padding-bottom: 60px;
`;
const StyledLink = styled(Link)`
  position: fixed;
  top: 5px;
  right: 5px;
  text-decoration: none;
  color: white;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  font-size: 24px;
  height: 45px;
  width: 45px;
  z-index: 1000;

  &:hover {
    background-color: darkgrey;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-top: 25px;
  align-items: center;
`;

const HeaderImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
`;

const AcceptCancelEditButtonContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: ${(props) =>
    props.$innerWidth > 400 && props.$isEditMode ? "" : "10px"};
  display: flex;
  gap: 10px;
  z-index: 1000;
  align-self: ${(props) =>
    props.$innerWidth > 600 && props.$isEditMode ? "center" : ""};
`;

const BoxContainer = styled.ul`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 90%;
  max-width: ${(props) => props.$maxWidth || "600px"};
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  list-style-type: none;
`;

const NotesContainer = styled.ul`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  list-style-type: none;
  overflow-x: hidden;
`;

const StyledInput = styled.input`
  width: 100%;
  max-width: ${(props) => props.$maxWidth || "600px"};
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: ${(props) => props.$bgColor || "#f9f9f9"};
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

const BaseButton = styled.button`
  margin-top: ${(props) => props.margin || "10px"};
  padding: 8px 15px;
  background-color: ${(props) => props.$bgColor || "#28a745"};
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
const NoteTimestamp = styled.span`
  font-size: 12px;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
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
