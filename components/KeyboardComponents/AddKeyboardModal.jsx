import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import { nanoid } from "nanoid";
import ImageUploader from "../SharedComponents/ImageUploader";

export default function AddKeyboardModal({ open, onClose, onAddKeyboard }) {
  const [activeTab, setActiveTab] = useState("dropdown");
  const [selectedKeyboard, setSelectedKeyboard] = useState("");
  const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] =
    useState(false);
  const [noteText, setNoteText] = useState("");

  const [keyboardData, setKeyboardData] = useState({
    name: "",
    designer: "",
    layout: "",
    renders: [""],
    blocker: "",
    switchType: "",
    plateMaterial: [],
    mounting: [],
    typingAngle: "",
    frontHeight: "",
    surfaceFinish: "",
    color: "",
    weightMaterial: "",
    buildWeight: "",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: [],
      layoutStandard: [],
      leftShift: [],
      capslock: [],
      rightShift: [],
      numpad: {
        enter: [],
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: [],
      flexCuts: false,
    },
    builds: [],
    notes: [],
  });

  const { data: dbKeyboards, error: dbKeyboardsError } = useSWR(
    activeTab === "dropdown" ? "/api/inventories/keyboards" : null
  );

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedKeyboard("");
    setKeyboardData({
      name: "",
      designer: "",
      layout: "",
      renders: [""],
      blocker: "",
      switchType: "",
      plateMaterial: [],
      mounting: [],
      typingAngle: "",
      frontHeight: "",
      surfaceFinish: "",
      color: "",
      weightMaterial: "",
      buildWeight: "",
      pcbOptions: {
        thickness: "1.6mm",
        material: "FR4",
        backspace: [],
        layoutStandard: [],
        leftShift: [],
        capslock: [],
        rightShift: [],
        numpad: {
          enter: [],
          plus: [],
          zero: [],
          orientation: [],
        },
        spacebar: [],
        flexCuts: false,
      },
      builds: [],
      notes: [],
    });
    setNoteText("");
    setIsAdditionalFieldsVisible(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Validation for length
    if (name === "name" && value.length > 40) {
      alert("Keyboard name cannot exceed 40 characters.");
      return;
    }

    // Handle PCB options
    if (name.startsWith("pcbOptions.")) {
      const option = name.split(".")[1];
      setKeyboardData((prevData) => ({
        ...prevData,
        pcbOptions: {
          ...prevData.pcbOptions,
          [option]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    // Handle regular fields
    setKeyboardData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRenderChange = (index, value) => {
    const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))(?:\?.*)?$/i;
    if (!urlRegex.test(value) && value !== "") {
      alert(
        "Please enter a valid image URL (must be .jpg, .jpeg, .png, .gif, or .webp)"
      );
      return;
    }

    const newRenders = [...keyboardData.renders];
    newRenders[index] = value;
    setKeyboardData((prevData) => ({
      ...prevData,
      renders: newRenders,
    }));
  };

  const handleAddRender = () => {
    if (keyboardData.renders.length < 5) {
      setKeyboardData((prevData) => ({
        ...prevData,
        renders: [...prevData.renders, ""],
      }));
    }
  };

  const handleAddNote = () => {
    if (noteText.trim() === "") return;

    setKeyboardData((prevData) => ({
      ...prevData,
      notes: [
        ...prevData.notes,
        {
          _id: nanoid(),
          text: noteText,
          timestamp: new Date(),
        },
      ],
    }));

    setNoteText("");
  };

  const handleSubmit = () => {
    if (activeTab === "manual") {
      //Validation for manual entry
      if (
        !keyboardData.name ||
        !keyboardData.designer ||
        !keyboardData.layout ||
        !keyboardData.renders[0] ||
        !keyboardData.blocker ||
        !keyboardData.switchType
      ) {
        alert(
          "Please fill out all required fields: Name, Designer, Layout, Render, Blocker, and Switch Type."
        );
        return;
      }

      // Create the keyboard to add
      const keyboardToAdd = {
        name: keyboardData.name,
        designer: keyboardData.designer,
        layout: keyboardData.layout,
        renders: keyboardData.renders.filter((url) => url !== ""),
        blocker: keyboardData.blocker,
        switchType: keyboardData.switchType,
        plateMaterial: keyboardData.plateMaterial,
        mounting: keyboardData.mounting,
        typingAngle: keyboardData.typingAngle,
        frontHeight: keyboardData.frontHeight,
        surfaceFinish: keyboardData.surfaceFinish,
        color: keyboardData.color,
        weightMaterial: keyboardData.weightMaterial,
        buildWeight: keyboardData.buildWeight,
        pcbOptions: keyboardData.pcbOptions,
        builds: keyboardData.builds,
        notes: [],
      };

      onAddKeyboard(keyboardToAdd);
    } else if (activeTab === "dropdown") {
      //Validation for dropdown entry
      if (!selectedKeyboard) {
        alert("Please select a keyboard from the dropdown.");
        return;
      }

      const selectedKeyboardObj = dbKeyboards.find(
        (keyboard) => keyboard.name === selectedKeyboard
      );

      if (!selectedKeyboardObj) {
        alert("Error: Could not find selected keyboard.");
        return;
      }

      //Create the keyboard to add with all fields
      const keyboardToAdd = {
        keyboardId: selectedKeyboardObj._id,
        name: selectedKeyboardObj.name,
        designer: selectedKeyboardObj.designer,
        layout: selectedKeyboardObj.layout,
        renders: selectedKeyboardObj.renders,
        blocker: selectedKeyboardObj.blocker,
        switchType: selectedKeyboardObj.switchType,
        plateMaterial: selectedKeyboardObj.plateMaterial,
        mounting: selectedKeyboardObj.mounting,
        typingAngle: selectedKeyboardObj.typingAngle,
        frontHeight: selectedKeyboardObj.frontHeight,
        surfaceFinish: selectedKeyboardObj.surfaceFinish,
        color: selectedKeyboardObj.color,
        weightMaterial: selectedKeyboardObj.weightMaterial,
        buildWeight: selectedKeyboardObj.buildWeight,
        pcbOptions: selectedKeyboardObj.pcbOptions,
        builds: selectedKeyboardObj.builds,
        notes: [],
      };

      onAddKeyboard(keyboardToAdd);
    }
    resetForm();
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <Title>Add Keyboard to Inventory</Title>

        <TabContainer>
          <TabButton
            $isActive={activeTab === "dropdown"}
            onClick={() => {
              if (activeTab !== "dropdown") {
                resetForm();
                setActiveTab("dropdown");
              }
            }}
          >
            Select from Database
          </TabButton>
          <TabButton
            $isActive={activeTab === "manual"}
            onClick={() => {
              if (activeTab !== "manual") {
                resetForm();
                setActiveTab("manual");
              }
            }}
          >
            Manual Entry
          </TabButton>
        </TabContainer>

        {activeTab === "dropdown" ? (
          <TabContent>
            <p>Choose a keyboard to add to your inventory:</p>
            {dbKeyboardsError ? (
              <p>Error loading keyboards. Please try again.</p>
            ) : !dbKeyboards ? (
              <p>Loading keyboards...</p>
            ) : (
              <>
                <SectionContainer>
                  <Label>Keyboard</Label>
                  <DropDownSelect
                    value={selectedKeyboard}
                    onChange={(event) =>
                      setSelectedKeyboard(event.target.value)
                    }
                  >
                    <option value="">-- Choose a keyboard --</option>
                    {dbKeyboards
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((keyboard) => (
                        <option key={keyboard._id} value={keyboard.name}>
                          {keyboard.name}
                        </option>
                      ))}
                  </DropDownSelect>
                </SectionContainer>

                {selectedKeyboard && (
                  <KeyboardPreview>
                    {dbKeyboards.find(
                      (keyboard) => keyboard.name === selectedKeyboard
                    )?.renders?.[0] && (
                      <Image
                        src={
                          dbKeyboards.find(
                            (keyboard) => keyboard.name === selectedKeyboard
                          )?.renders[0]
                        }
                        alt={selectedKeyboard}
                        width={300}
                        height={200}
                        style={{
                          objectFit: "cover",
                          borderRadius: "5px",
                          marginBottom: "10px",
                        }}
                      />
                    )}
                    <KeyboardDetails>
                      <h3>{selectedKeyboard}</h3>
                      <p>
                        <strong>Designer:</strong>{" "}
                        {
                          dbKeyboards.find(
                            (keyboard) => keyboard.name === selectedKeyboard
                          )?.designer
                        }
                      </p>
                      <p>
                        <strong>Layout:</strong>{" "}
                        {
                          dbKeyboards.find(
                            (keyboard) => keyboard.name === selectedKeyboard
                          )?.layout
                        }
                      </p>
                    </KeyboardDetails>
                  </KeyboardPreview>
                )}
              </>
            )}
          </TabContent>
        ) : (
          <>
            <SectionContainer>
              <Label>Keyboard Details</Label>
              <Input
                type="text"
                name="name"
                placeholder="Keyboard Name *"
                value={keyboardData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="designer"
                placeholder="Designer *"
                value={keyboardData.designer}
                onChange={handleChange}
                required
              />
              <Select
                name="layout"
                value={keyboardData.layout}
                onChange={handleChange}
                required
              >
                <option value="">Select Layout *</option>
                <option value="40%">40%</option>
                <option value="60%">60%</option>
                <option value="65%">65%</option>
                <option value="75%">75%</option>
                <option value="TKL">TKL</option>
                <option value="1800">1800</option>
                <option value="Full Size">Full Size</option>
              </Select>
              <Select
                name="blocker"
                value={keyboardData.blocker}
                onChange={handleChange}
                required
              >
                <option value="">Select Blocker Type *</option>
                <option value="Winkey">Winkey</option>
                <option value="Winkeyless">Winkeyless</option>
                <option value="HHKB">HHKB</option>
              </Select>
              <Select
                name="switchType"
                value={keyboardData.switchType}
                onChange={handleChange}
                required
              >
                <option value="">Select Switch Type *</option>
                <option value="MX">MX</option>
                <option value="EC">EC</option>
                <option value="HE">HE</option>
                <option value="Alps">Alps</option>
              </Select>
            </SectionContainer>

            <SectionContainer>
              {keyboardData.renders.map((render, index) => (
                <SectionContainer key={index}>
                  <RenderInputRow>
                    {index > 0 && (
                      <RenderButton
                        $remove
                        onClick={() => {
                          const newRenders = [...keyboardData.renders];
                          newRenders.splice(index, 1);
                          setKeyboardData((prevData) => ({
                            ...prevData,
                            renders: newRenders,
                          }));
                        }}
                      >
                        -
                      </RenderButton>
                    )}
                    <ImageUploader
                      onImageUpload={(secureUrl) => {
                        const newRenders = [...keyboardData.renders];
                        newRenders[index] = secureUrl;
                        setKeyboardData((prevData) => ({
                          ...prevData,
                          renders: newRenders,
                        }));
                      }}
                      prePopulatedUrl={render}
                      category="keyboards_renders"
                    />
                    <Input
                      type="url"
                      placeholder={`Render ${index + 1} Image URL ${
                        index === 0 ? "*" : ""
                      }`}
                      value={render}
                      onChange={(event) =>
                        handleRenderChange(index, event.target.value)
                      }
                      required={index === 0}
                    />
                    {index === keyboardData.renders.length - 1 &&
                      keyboardData.renders.length < 5 && (
                        <RenderButton $add onClick={handleAddRender}>
                          +
                        </RenderButton>
                      )}
                  </RenderInputRow>
                </SectionContainer>
              ))}
            </SectionContainer>

            <ToggleAdditionalFieldsButton
              onClick={() => {
                if (isAdditionalFieldsVisible) {
                  resetForm();
                }
                setIsAdditionalFieldsVisible(!isAdditionalFieldsVisible);
              }}
            >
              {isAdditionalFieldsVisible
                ? "Hide Additional Information"
                : "Add Additional Information"}
            </ToggleAdditionalFieldsButton>

            {isAdditionalFieldsVisible && (
              <AdditionalFieldsContainer>
                <Input
                  type="text"
                  name="color"
                  placeholder="Color (e.g., Navy Blue)"
                  value={keyboardData.color}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="surfaceFinish"
                  placeholder="Surface Finish (e.g., Anodization)"
                  value={keyboardData.surfaceFinish}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="typingAngle"
                  placeholder="Typing Angle (e.g., 7°)"
                  value={keyboardData.typingAngle}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="frontHeight"
                  placeholder="Front Height (e.g., 19mm)"
                  value={keyboardData.frontHeight}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="weightMaterial"
                  placeholder="Weight Material (e.g., Brass, Stainless Steel)"
                  value={keyboardData.weightMaterial}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="buildWeight"
                  placeholder="Build Weight (e.g., 1.5kg)"
                  value={keyboardData.buildWeight}
                  onChange={handleChange}
                />

                <h4>PCB Options</h4>
                <Select
                  name="pcbOptions.thickness"
                  value={keyboardData.pcbOptions.thickness}
                  onChange={handleChange}
                >
                  <option value="1.2mm">1.2mm</option>
                  <option value="1.6mm">1.6mm</option>
                </Select>

                <Select
                  name="pcbOptions.material"
                  value={keyboardData.pcbOptions.material}
                  onChange={handleChange}
                >
                  <option value="FR4">FR4</option>
                  <option value="CEM">CEM</option>
                </Select>

                <CheckboxContainer>
                  <label>
                    <input
                      type="checkbox"
                      name="pcbOptions.flexCuts"
                      checked={keyboardData.pcbOptions.flexCuts}
                      onChange={handleChange}
                    />
                    Flex Cuts
                  </label>
                </CheckboxContainer>

                <h4>Notes</h4>
                <TextArea
                  name="notesText"
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                />
                <AddNoteButton onClick={handleAddNote} type="button">
                  Add Note
                </AddNoteButton>

                {keyboardData.notes.length > 0 && (
                  <NotesContainer>
                    {keyboardData.notes.map((note) => (
                      <NoteItem key={note._id || nanoid()}>
                        {note.text} (
                        {new Date(note.timestamp).toLocaleDateString()})
                      </NoteItem>
                    ))}
                  </NotesContainer>
                )}
              </AdditionalFieldsContainer>
            )}
          </>
        )}

        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <AddButton
            onClick={handleSubmit}
            disabled={
              (activeTab === "manual" &&
                (!keyboardData.name ||
                  !keyboardData.designer ||
                  !keyboardData.layout ||
                  !keyboardData.renders[0] ||
                  !keyboardData.blocker ||
                  !keyboardData.switchType)) ||
              (activeTab === "dropdown" && !selectedKeyboard)
            }
          >
            Add Keyboard
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

const Title = styled.h2`
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  background: ${(props) => (props.$isActive ? "#f0f8ff" : "#f5f5f5")};
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.$isActive ? "#007bff" : "transparent")};
  cursor: pointer;
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isActive ? "#f0f8ff" : "#e9e9e9")};
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  text-align: center;
  padding: 5px;
`;

const SectionContainer = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
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
  border: 1px solid #ccc;
`;

const DropDownSelect = styled(Select)`
  background-color: #f9f9f9;
  font-size: 16px;
`;

const KeyboardPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const KeyboardDetails = styled.div`
  width: 100%;
  text-align: left;

  p {
    margin: 5px 0;
  }
`;

const ToggleAdditionalFieldsButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  margin: 10px 0;
`;

const AdditionalFieldsContainer = styled.div`
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  min-height: 80px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  border-radius: 5px;
  font-size: 16px;
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
  width: 49%;
  text-align: center;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const AddNoteButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0069d9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
`;

const RenderInputRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  position: relative;
`;

const RenderButton = styled.button`
  background: ${(props) =>
    props.$add ? "#007bff" : props.$remove ? "#dc3545" : "#007bff"};
  border: none;
  border-radius: 50%;
  font-size: 16px;
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  position: absolute;
  z-index: 5;

  /* Position the button outside the input field */
  ${(props) => (props.$add ? `right: -30px;` : `left: -30px;`)}

  &:hover {
    opacity: 0.8;
  }
`;
