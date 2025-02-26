import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";
import { useState } from "react";
import { colorOptions } from "@/utils/colors";

export default function KeyCapDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: keycaps, error } = useSWR(
    id ? `/api/inventories/keycaps/${id}` : null
  );

  const [selectedColors, setSelectedColors] = useLocalStorageState(
    `colors-${id}`,
    { defaultValue: [] }
  );

  const handleColorSelect = (event) => {
    const selectedColor = event.target.value;

    if (selectedColors.includes(selectedColor)) {
      setSelectedColors((prevColors) =>
        prevColors.filter((existingColor) => existingColor !== selectedColor)
      );
      return;
    }
    if (selectedColors.length < 3) {
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

  if (error) return <p>Error loading keycap details.</p>;
  if (!keycaps) return <p>Loading...</p>;

  const kitsAvailable = keycaps.kits?.flatMap((kit) => kit.price_list) ?? [];

  return (
    <DetailPageContainer>
      <CloseButton onClick={() => router.push("/inventories/keycaps")}>
        ×
      </CloseButton>

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
        <p>
          <strong>Manufacturer:</strong> {keycaps.keycapstype}
        </p>
        <p>
          <strong>Profile:</strong> {keycaps.profile}
        </p>
        <p>
          <strong>Designer:</strong> {keycaps.designer}
        </p>
        <p>
          <strong>Geekhack Thread:</strong>{" "}
          <ExternalLink href={keycaps.link} target="_blank">
            Visit Geekhack
          </ExternalLink>
        </p>
      </BoxContainer>

      <h3>Your Kits</h3>
      {kitsAvailable.length > 0 ? (
        <GridContainer>
          {kitsAvailable.map((kit) => (
            <KitCard key={kit.name}>
              {kit.pic && (
                <Image
                  src={kit.pic}
                  alt={kit.name}
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              )}
              <p>{kit.name}</p>
            </KitCard>
          ))}
        </GridContainer>
      ) : (
        <p>No kits available for this keycap set.</p>
      )}

      <h3>Choose 3 Colors</h3>
      <StyledInput
        as="select"
        onChange={handleColorSelect}
        value=""
        maxWidth="400px"
      >
        <option value="" disabled>
          -- Choose up to 3 colors --
        </option>
        {colorOptions.map((color) => (
          <option key={color.name} value={color.name}>
            {color.name}
            {color.emoji}
          </option>
        ))}
      </StyledInput>

      <GridContainer flexMode padding="10px" border bgColor="#f9f9f9">
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
      </GridContainer>

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

      {notes.length > 0 ? (
        notes.map((note, index) => (
          <BoxContainer bgColor="#f9f9f9" key={index}>
            <p>{note.text}</p>
            <NoteTimestamp>{note.timestamp}</NoteTimestamp>
          </BoxContainer>
        ))
      ) : (
        <p> No notes yet.</p>
      )}
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

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderImage = styled.div`
  width: 640px;
  height: 320px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
`;

const BoxContainer = styled.div`
  background: ${(props) => props.bgColor || "#f9f9f9"};
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  max-width: ${(props) => props.maxWidth || "600px"};
  text-align: ${(props) => props.align || "left"};
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: ${(props) => props.margin || "15px"};
`;

const GridContainer = styled.div`
  display: ${(props) => (props.flexMode ? "flex" : "grid")};
  flex-wrap: ${(props) => (props.flexMode ? "wrap" : "unset")};
  grid-template-columns: ${(props) =>
    props.flexMode ? "unset" : "repeat(auto-fit, minmax(150px, 1fr))"};
  gap: 15px;
  width: auto;
  margin: 10px 0;
  max-width: ${(props) => props.maxWidth || "600px"};
  padding: ${(props) => props.padding || "0"};
  border: ${(props) => (props.border ? "1px solid #ccc" : "none")};
  border-radius: ${(props) => (props.border ? "5px" : "0")};
  background-color: ${(props) => props.bgColor || "transparent"};
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

const ExternalLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const KitCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const SelectedColor = styled.span`
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
const NoteTimestamp = styled.span`
  font-size: 12px;
  color: #666;
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

const CloseButton = styled(BaseButton)`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ff4d4d;
  border-radius: 50%;
  font-size: 24px;
  height: 40px;
  width: 40px;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
