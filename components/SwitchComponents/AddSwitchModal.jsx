import { createPortal } from "react-dom";
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { nanoid } from "nanoid";

export default function AddSwitchModal({ open, onClose, onAddSwitch }) {
  const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] =
    useState(false);
  const [switchData, setSwitchData] = useState({
    name: "",
    manufacturer: "",
    image: "",
    quantity: 1,
    switchType: "",
    factoryLubed: false,
    springWeight: "",
    topMaterial: "",
    bottomMaterial: "",
    stemMaterial: "",
    isLubed: false,
    isFilmed: false,
    notes: [],
  });

  const [noteText, setNoteText] = useState("");

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "image") {
      const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))(?:\?.*)?$/i;
      if (!urlRegex.test(value) && value !== "") {
        alert(
          "Please enter a valid image URL (must be .jpg, .jpeg, .png, .gif, or .webp"
        );
        return;
      }
    }

    setSwitchData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNote = () => {
    if (noteText.trim() === "") return;

    setSwitchData((prevData) => ({
      ...prevData,
      notes: [...prevData.notes, { text: noteText, timestamp: new Date() }],
    }));

    setNoteText("");
  };

  const handleSubmit = () => {
    if (
      !switchData.name ||
      !switchData.manufacturer ||
      !switchData.image ||
      !switchData.switchType
    ) {
      alert(
        "Please fill out all required fields: Name, Manufacturer, Image, and Switch Type."
      );
      return;
    }

    onAddSwitch(switchData);
    onClose();
    setSwitchData({
      name: "",
      manufacturer: "",
      image: "",
      quantity: 1,
      switchType: "",
      factoryLubed: false,
      springWeight: "",
      topMaterial: "",
      bottomMaterial: "",
      stemMaterial: "",
      isLubed: false,
      isFilmed: false,
      notes: [],
    });
  };

  const isPreviewVisible =
    switchData.name &&
    switchData.manufacturer &&
    switchData.image &&
    switchData.switchType;

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <Title>Add your Switch&apos;s Information</Title>

        <Input
          type="text"
          name="name"
          placeholder="Switch Name *"
          value={switchData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer *"
          value={switchData.manufacturer}
          onChange={handleChange}
          required
        />
        <Input
          type="url"
          name="image"
          placeholder="Image URL *"
          value={switchData.image}
          onChange={handleChange}
          pattern="https?://.*"
          required
        />

        <Select
          name="switchType"
          value={switchData.switchType}
          onChange={handleChange}
        >
          <option value="">Select Switch Type *</option>
          <option value="Linear">Linear</option>
          <option value="Tactile">Tactile</option>
          <option value="Clicky">Clicky</option>
        </Select>

        {isPreviewVisible && (
          <>
            <h3>Preview</h3>
            <PreviewContainer>
              <SwitchCard>
                <Image
                  src={switchData.image}
                  alt={switchData.name}
                  width={100}
                  height={100}
                />
                <p>{switchData.manufacturer}</p>
                <p>
                  <strong>{switchData.name}</strong>
                </p>
              </SwitchCard>
            </PreviewContainer>
          </>
        )}

        <ToggleAdditionalFieldsButton
          onClick={() => {
            setIsAdditionalFieldsVisible(!isAdditionalFieldsVisible);
            setSwitchData((prevData) => ({
              ...prevData,
              quantity: 1,
              factoryLubed: false,
              springWeight: "",
              topMaterial: "",
              bottomMaterial: "",
              stemMaterial: "",
              isLubed: false,
              isFilmed: false,
              notes: [],
            }));
          }}
        >
          {isAdditionalFieldsVisible
            ? "Hide Additional Information"
            : "Add Additional Information"}
        </ToggleAdditionalFieldsButton>
        {isAdditionalFieldsVisible && (
          <AdditionalFieldsContainer>
            <label htmlFor="quantity">Quantity</label>
            <Input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={switchData.quantity}
              onChange={handleChange}
            />

            <Input
              type="text"
              name="springWeight"
              placeholder="Spring Weight"
              value={switchData.springWeight}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="topMaterial"
              placeholder="Top Housing Material"
              value={switchData.topMaterial}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="bottomMaterial"
              placeholder="Bottom Housing Material"
              value={switchData.bottomMaterial}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="stemMaterial"
              placeholder="Stem Material"
              value={switchData.stemMaterial}
              onChange={handleChange}
            />
            <CheckboxContainer>
              <label>
                <input
                  type="checkbox"
                  name="factoryLubed"
                  checked={switchData.factoryLubed}
                  onChange={handleChange}
                />
                Factory Lubed
              </label>
            </CheckboxContainer>

            <CheckboxContainer>
              <label>
                <input
                  type="checkbox"
                  name="isLubed"
                  checked={switchData.isLubed}
                  onChange={handleChange}
                />
                Hand Lubed
              </label>
            </CheckboxContainer>
            <CheckboxContainer>
              <label>
                <input
                  type="checkbox"
                  name="isFilmed"
                  checked={switchData.isFilmed}
                  onChange={handleChange}
                />
                Filmed
              </label>
            </CheckboxContainer>

            <TextArea
              name="notesText"
              placeholder="Add a note..."
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
            />
            <AddButton onClick={handleAddNote}> Add Note</AddButton>

            <h4>User Notes</h4>
            <NotesContainer>
              {switchData.notes.length > 0 ? (
                switchData.notes.map((note) => (
                  <NoteItem key={nanoid()}>
                    {note.text} ({new Date(note.timestamp).toLocaleDateString()}
                    )
                  </NoteItem>
                ))
              ) : (
                <p>No notes for this switch.</p>
              )}
            </NotesContainer>
          </AdditionalFieldsContainer>
        )}

        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <AddButton
            onClick={handleSubmit}
            disabled={
              !switchData.name ||
              !switchData.manufacturer ||
              !switchData.image ||
              !switchData.switchType
            }
          >
            Add Switch
          </AddButton>
        </ButtonContainer>
      </ModalWrapper>
    </>,
    document.getElementById("portal")
  );
}

const ModalWrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 50px;
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const CancelButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
  width: 49%;
  text-align: center;
  cursor: pointer;
  margin-right: 2px;
`;
const AddButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
  width: 49%;
  text-align: center;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  text-align: center;
`;

const SwitchCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 200px;

  img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const AdditionalFieldsContainer = styled.div`
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
`;
const ToggleAdditionalFieldsButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  margin: 10px 0;
`;

const Title = styled.h2`
  text-align: center;
`;
