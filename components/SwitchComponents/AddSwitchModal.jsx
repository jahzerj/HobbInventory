import { createPortal } from "react-dom";
import { useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import SwitchCard from "./SwitchCard";
import useSWR from "swr";
import ImageUploader from "@/components/SharedComponents/ImageUploader";

export default function AddSwitchModal({ open, onClose, onAddSwitch, userId }) {
  const [activeTab, setActiveTab] = useState("dropdown");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedSwitchId, setSelectedSwitchId] = useState("");

  const { data: dbSwitches, error: dbSwitchesError } = useSWR(
    activeTab === "dropdown" ? "/api/inventories/switches" : null
  );

  //Get unique manufacturers and sort alphabetically
  const manufacturers = dbSwitches
    ? [...new Set(dbSwitches.map((sw) => sw.manufacturer))].sort()
    : [];

  //Get Switches filtered by selected manufacturer
  const filteredSwitches = dbSwitches
    ? dbSwitches
        .filter((sw) => sw.manufacturer === selectedManufacturer)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleManufacturerChange = (event) => {
    const manufacturer = event.target.value;
    setSelectedManufacturer(manufacturer);
    setSelectedSwitchId(""); //resets switch selection when manufacturer changes
  };

  const handleSwitchChange = (event) => {
    const switchId = event.target.value;
    setSelectedSwitchId(switchId);

    if (switchId) {
      const selectedSwitch = dbSwitches.find((sw) => sw._id === switchId);
      if (selectedSwitch) {
        //populate selectedSwitch data to switchData
        setSwitchData({
          name: selectedSwitch.name,
          manufacturer: selectedSwitch.manufacturer,
          image: selectedSwitch.image,
          quantity: 1,
          switchType: selectedSwitch.switchType,
          factoryLubed: selectedSwitch.factoryLubed || false,
          springWeight: selectedSwitch.springWeight || "",
          topMaterial: selectedSwitch.topMaterial || "",
          bottomMaterial: selectedSwitch.bottomMaterial || "",
          stemMaterial: selectedSwitch.stemMaterial || "",
          isLubed: selectedSwitch.isLubed || false,
          isFilmed: selectedSwitch.isFilmed || false,
          notes: [],
        });
      }
    }
  };

  const resetForm = () => {
    setSelectedManufacturer("");
    setSelectedSwitchId("");
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
    setNoteText("");
    setIsAdditionalFieldsVisible(false);
  };

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

    // Add length validation for text fields
    if (name === "name" && value.length > 40) {
      alert("Switch name cannot exceed 40 characters.");
      return;
    }

    if (name === "manufacturer" && value.length > 25) {
      alert("Manufacturer name cannot exceed 25 characters.");
      return;
    }

    if (name === "image") {
      const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))(?:\?.*)?$/i;
      if (!urlRegex.test(value) && value !== "") {
        alert(
          "Please enter a valid image URL (must be .jpg, .jpeg, .png, .gif, or .webp"
        );
        return;
      }
    }

    // Add quantity validation
    if (name === "quantity") {
      const numValue = parseInt(value) || 0;
      if (numValue > 9999) {
        setSwitchData((prevData) => ({
          ...prevData,
          [name]: 9999,
        }));
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
      // Validation for manual entry
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
    } else if (activeTab === "dropdown") {
      // Validation for dropdown selection
      if (!selectedSwitchId) {
        alert("Please select a manufacturer and switch.");
        return;
      }
    }

    onAddSwitch(switchData);

    resetForm();
    onClose();
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
        <Title>Add Switch to Inventory</Title>

        {/* Tab Navigation */}
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

        {/* Tab Content */}
        {activeTab === "manual" ? (
          // Manual Entry Tab Content
          <>
            <SectionContainer>
              <Label>Switch Details</Label>
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

              <ImageUploader
                onImageUpload={(secureUrl) => {
                  setSwitchData((prevData) => ({
                    ...prevData,
                    image: secureUrl,
                  }));
                }}
                prePopulatedUrl={switchData.image}
                category="switches"
                userId={userId}
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
            </SectionContainer>

            {isPreviewVisible && (
              <SectionContainer>
                <h3>Preview</h3>
                <PreviewWrapper>
                  <SwitchCard
                    itemObj={{
                      _id: "preview",
                      ...switchData,
                    }}
                    isEditMode={false}
                    onDelete={() => {}}
                    isPreview={true}
                  />
                </PreviewWrapper>
              </SectionContainer>
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
              <SectionContainer>
                <label htmlFor="quantity">Quantity</label>
                <Input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  min="0"
                  max="9999"
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
                        {note.text} (
                        {new Date(note.timestamp).toLocaleDateString()})
                      </NoteItem>
                    ))
                  ) : (
                    <p>No notes for this switch.</p>
                  )}
                </NotesContainer>
              </SectionContainer>
            )}
          </>
        ) : (
          // Dropdown Selection Tab Content
          <TabContent>
            <p>Choose a switch to add to your inventory:</p>

            {dbSwitchesError ? (
              <p>Error loading switches. Please try again.</p>
            ) : !dbSwitches ? (
              <LoaderWrapper>
                <StyledSpan />
              </LoaderWrapper>
            ) : (
              <>
                <SectionContainer>
                  {/* Step 1: Select Manufacturer */}
                  <Label>Manufacturer</Label>
                  <Select
                    value={selectedManufacturer}
                    onChange={handleManufacturerChange}
                  >
                    <option value="">-- Select Manufacturer --</option>
                    {manufacturers.map((manufacturer) => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))}
                  </Select>

                  {/* Step 2: Select Switch (only shown if manufacturer is selected) */}
                  {selectedManufacturer && (
                    <>
                      <Label>Switch</Label>
                      <Select
                        value={selectedSwitchId}
                        onChange={handleSwitchChange}
                      >
                        <option value="">-- Select Switch --</option>
                        {filteredSwitches.map((sw) => (
                          <option key={sw._id} value={sw._id}>
                            {sw.name}
                          </option>
                        ))}
                      </Select>
                    </>
                  )}
                </SectionContainer>

                {/* Step 3: Quantity and Preview (only shown if switch is selected) */}
                {selectedSwitchId && (
                  <SectionContainer>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      max="9999"
                      value={switchData.quantity}
                      onChange={(event) => {
                        const value = Math.min(
                          9999,
                          Math.max(0, parseInt(event.target.value) || 0)
                        );
                        setSwitchData((prev) => ({
                          ...prev,
                          quantity: value,
                        }));
                      }}
                    />

                    <CheckboxContainer>
                      <label>
                        <input
                          type="checkbox"
                          checked={switchData.isLubed}
                          onChange={(event) =>
                            setSwitchData((prev) => ({
                              ...prev,
                              isLubed: event.target.checked,
                            }))
                          }
                        />
                        Hand Lubed
                      </label>
                    </CheckboxContainer>

                    <CheckboxContainer>
                      <label>
                        <input
                          type="checkbox"
                          checked={switchData.isFilmed}
                          onChange={(event) =>
                            setSwitchData((prev) => ({
                              ...prev,
                              isFilmed: event.target.checked,
                            }))
                          }
                        />
                        Filmed
                      </label>
                    </CheckboxContainer>

                    <Label>Notes</Label>
                    <TextArea
                      placeholder="Add a note..."
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                    />
                    <AddNoteButton onClick={handleAddNote} type="button">
                      Add Note
                    </AddNoteButton>

                    {switchData.notes.length > 0 && (
                      <>
                        <h4>Notes</h4>
                        <NotesContainer>
                          {switchData.notes.map((note) => (
                            <NoteItem key={nanoid()}>
                              {note.text} (
                              {new Date(note.timestamp).toLocaleDateString()})
                            </NoteItem>
                          ))}
                        </NotesContainer>
                      </>
                    )}

                    <h3>Preview</h3>
                    <PreviewWrapper>
                      <SwitchCard
                        itemObj={{
                          _id: "preview",
                          ...switchData,
                        }}
                        isEditMode={false}
                        onDelete={() => {}}
                        isPreview={true}
                      />
                    </PreviewWrapper>
                  </SectionContainer>
                )}
              </>
            )}
          </TabContent>
        )}

        <ButtonContainer>
          <CancelButton
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </CancelButton>
          <AddButton
            onClick={handleSubmit}
            disabled={
              (activeTab === "manual" &&
                (!switchData.name ||
                  !switchData.manufacturer ||
                  !switchData.image ||
                  !switchData.switchType)) ||
              (activeTab === "dropdown" && !selectedSwitchId)
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

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  align-items: center;
  padding: 5px;
  text-align: center;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

const StyledSpan = styled.span`
  width: 32px;
  height: 32px;
  border: 3px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  border-color: #007bff;
  border-bottom-color: transparent;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

const SectionContainer = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  width: 100%;
`;
