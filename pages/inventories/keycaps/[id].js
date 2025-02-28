import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import { useState } from "react";
import { colorOptions } from "@/utils/colors";
import Link from "next/link";
import { nanoid } from "nanoid";

export default function KeyCapDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: keycaps, error: keycapError } = useSWR(
    id ? `/api/inventories/keycaps/${id}` : null
  );

  const [selectedColors, setSelectedColors] = useLocalStorageState(
    `colors-${id}`,
    { defaultValue: [] }
  );

  const { data: userKeycaps, error: userKeycapError } = useSWR(
    id ? `/api/inventories/userkeycaps?userId=guest_user` : null
  );

  const userKeycap = userKeycaps?.find((item) => item.keycapSetId?._id === id);

  const handleColorSelect = (event) => {
    const selectedColor = event.target.value;

    if (selectedColors.includes(selectedColor)) {
      setSelectedColors((prevColors) =>
        prevColors.filter((existingColor) => existingColor !== selectedColor)
      );
      return;
    }
    if (selectedColors.length < 4) {
      setSelectedColors((prevColors) => [...prevColors, selectedColor]);
    }
  };

  const handleRemoveColor = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.filter((existingColor) => existingColor !== color)
    );
  };

  const [notes, setNotes] = useLocalStorageState(`notes-${id}`, {
    defaultValue: [],
  });
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim() === "") return; //no empty notes please
    if (newNote.length > 100)
      return alert("Note must be 100 characters or less.");

    const timestamp = new Date().toLocaleString(); //get date and time for note

    setNotes([...notes, { text: newNote, timestamp }]); //add new note to notes array

    setNewNote(""); //clear input field
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
    <DetailPageContainer>
      <StyledLink href="/inventories/keycaps">×</StyledLink>

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
      {selectedKits.length > 0 ? (
        <GridContainer>
          {kitsAvailable
            .filter((kit) => selectedKits.includes(kit.name)) // ✅ Show only selected kits
            .map((kit) => (
              <KitCard key={kit.name}>
                {kit.pic ? (
                  <Image
                    src={kit.pic}
                    alt={kit.name}
                    layout="intrinsic"
                    width={100}
                    height={100}
                    objectFit="cover"
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
        {colorOptions.map((color) => (
          <option key={color.name} value={color.name}>
            {color.name}
            {color.emoji}
          </option>
        ))}
      </StyledInput>

      <ColorsContainer>
        {selectedColors.length > 0
          ? selectedColors.map((color) => {
              const colorData = colorOptions.find(
                (option) => option.name === color
              );
              return (
                <SelectedColor key={color} bgColor={colorData?.name}>
                  {colorData?.emoji} {color}
                  <RemoveColorButton onClick={() => handleRemoveColor(color)}>
                    x
                  </RemoveColorButton>
                </SelectedColor>
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
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem key={nanoid()}>
              <span>{note.text}</span>
              <NoteTimestamp>{note.timestamp}</NoteTimestamp>
            </NoteItem>
          ))
        ) : (
          <p> No notes yet.</p>
        )}
      </NotesContainer>
    </DetailPageContainer>
  );
}

const DetailPageContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
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
  font-size: 24px;
  height: 40px;
  width: 40px;
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

const SelectedColor = styled.li`
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
`;

const NoteTimestamp = styled.span`
  font-size: 12px;
  color: #666;
`;
