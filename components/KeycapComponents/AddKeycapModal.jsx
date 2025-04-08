import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import { colorOptions } from "@/utils/colors";

export default function AddKeycapModal({ open, onClose, onAddKeycap }) {
  const [activeTab, setActiveTab] = useState("dropdown");
  const [selectedKeycap, setSelectedKeycap] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);
  const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] =
    useState(false);

  const [keycapData, setKeycapData] = useState({
    name: "",
    kits: [{ name: "", image: "" }],
    render: "",
    manufacturer: "",
    material: "",
    profile: "",
    profileHeight: "",
    designer: "",
    geekhacklink: "",
    selectedKits: [],
    selectedColors: [],
    notes: [],
  });

  const { data: dbKeycaps, error: dbKeycapsError } = useSWR(
    activeTab === "dropdown" ? "/api/inventories/keycaps" : null
  );

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedKeycap("");
    setSelectedKits([]);
    setKeycapData({
      name: "",
      kits: [{ name: "", image: "" }],
      render: "",
      manufacturer: "",
      material: "",
      profile: "",
      profileHeight: "",
      designer: "",
      geekhacklink: "",
      selectedKits: [],
      selectedColors: [],
      notes: [],
    });
    setIsAdditionalFieldsVisible(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setKeycapData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKitChange = (index, field, value) => {
    const newKits = [...keycapData.kits];
    newKits[index][field] = value;
    setKeycapData((prevData) => ({
      ...prevData,
      kits: newKits,
    }));
  };

  const handleAddKit = () => {
    if (keycapData.kits.length < 8) {
      setKeycapData((prevData) => ({
        ...prevData,
        kits: [...prevData.kits, { name: "", image: "" }],
      }));
    }
  };

  // Code for Checkbox Selection in dropdown mode
  const handleKitSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedKits(
      (prevSelected) =>
        checked
          ? [...prevSelected, value] // Add kit
          : prevSelected.filter((kit) => kit !== value) // Remove kit
    );
  };

  const handleSubmit = () => {
    if (activeTab === "manual") {
      // Validation for manual entry
      if (
        !keycapData.name ||
        !keycapData.kits[0].name ||
        !keycapData.kits[0].image ||
        !keycapData.render
      ) {
        alert(
          "Please fill out all required fields: Name, Kit Name, Kit Image, and Render."
        );
        return;
      }

      // For manual entry, set the selectedKits to be the kit names
      const kitNames = keycapData.kits.map((kit) => kit.name);

      // Create a complete keycap object with all fields
      const keycapToAdd = {
        userId: "guest_user",
        name: keycapData.name,
        manufacturer: keycapData.manufacturer,
        profile: keycapData.profile || "",
        material: keycapData.material || "",
        profileHeight: keycapData.profileHeight || "",
        designer: keycapData.designer || "",
        geekhacklink: keycapData.geekhacklink || "",
        render: keycapData.render,
        kits: keycapData.kits,
        selectedKits: kitNames,
        selectedColors: [],
        notes: [],
      };

      // Add to inventory (send complete object)
      onAddKeycap(keycapToAdd);
    } else if (activeTab === "dropdown") {
      // Validation for dropdown selection
      if (!selectedKeycap || selectedKits.length === 0) {
        alert("Please select a keycap set and at least one kit.");
        return;
      }

      // Find the selected keycap object
      const selectedKeycapObj = dbKeycaps.find(
        (keycap) => keycap.name === selectedKeycap
      );

      if (!selectedKeycapObj) {
        alert("Error: Could not find selected keycap set.");
        return;
      }

      // Normalize the database colors to match colorOptions case
      const normalizedColors =
        selectedKeycapObj.colors
          ?.map((dbColor) => {
            const matchingColor = colorOptions.find(
              (option) => option.name.toLowerCase() === dbColor.toLowerCase()
            );
            return matchingColor ? matchingColor.name : null;
          })
          .filter(Boolean) || [];

      // Create the keycap to add with all fields
      const keycapToAdd = {
        userId: "guest_user",
        keycapDefinitionId: selectedKeycapObj._id,
        name: selectedKeycapObj.name,
        manufacturer: selectedKeycapObj.manufacturer,
        profile: selectedKeycapObj.profile || "",
        material: selectedKeycapObj.material || "",
        profileHeight: selectedKeycapObj.profileHeight || "",
        designer: selectedKeycapObj.designer || "",
        geekhacklink: selectedKeycapObj.geekhacklink || "",
        render: selectedKeycapObj.render,
        kits: selectedKeycapObj.kits || [],
        selectedKits: selectedKits,
        selectedColors: normalizedColors,
        notes: [],
      };

      // Add to inventory (send complete object)
      onAddKeycap(keycapToAdd);
    }

    resetForm();
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <h2>Add Keycap Set</h2>

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
        {activeTab === "dropdown" ? (
          // Database Selection Content
          <TabContent>
            {dbKeycapsError ? (
              <p>Error loading keycaps. Please try again.</p>
            ) : !dbKeycaps ? (
              <p>Loading keycaps...</p>
            ) : (
              <>
                {/* Dropdown: Select Keycap Set */}
                <FormGroup>
                  <Label>Keycap Set</Label>
                  <DropDownSelect
                    value={selectedKeycap}
                    onChange={(event) => {
                      setSelectedKeycap(event.target.value);
                      setSelectedKits([]); // Reset kit selection
                    }}
                  >
                    <option value="">-- Choose a keycap set --</option>
                    {dbKeycaps
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((keycap) => (
                        <option key={keycap._id} value={keycap.name}>
                          {keycap.name}
                        </option>
                      ))}
                  </DropDownSelect>
                </FormGroup>

                {/* Checkbox Selection for Kits */}
                {selectedKeycap && (
                  <FormGroup>
                    <Label>Available Kits</Label>
                    <KitList>
                      {dbKeycaps
                        .find((keycap) => keycap.name === selectedKeycap)
                        ?.kits?.map((kit) => (
                          <KitItem key={kit.name}>
                            <input
                              type="checkbox"
                              value={kit.name}
                              checked={selectedKits.includes(kit.name)}
                              onChange={handleKitSelection}
                            />
                            {kit.image && (
                              <Image
                                src={kit.image}
                                alt={kit.name}
                                width={50}
                                height={50}
                                style={{
                                  objectFit: "cover",
                                  marginRight: "10px",
                                  borderRadius: "5px",
                                }}
                                priority
                              />
                            )}
                            {kit.name}
                          </KitItem>
                        )) || <p>No kits available for this set.</p>}
                    </KitList>
                  </FormGroup>
                )}

                {/* Display Selected Items */}
                {selectedKeycap && (
                  <p>
                    <strong>Set:</strong> {selectedKeycap}
                  </p>
                )}
                {selectedKits.length > 0 && (
                  <p>
                    <strong>Selected Kits:</strong> {selectedKits.join(", ")}
                  </p>
                )}

                {selectedKeycap && selectedKits.length === 0 && (
                  <HelperText>
                    Please select at least one kit before adding this keycap
                    set.
                  </HelperText>
                )}
              </>
            )}
          </TabContent>
        ) : (
          // Manual Entry Content
          <TabContent>
            <FormGroup>
              <Label>Keycap Set Details</Label>
              <Input
                type="text"
                name="name"
                placeholder="Keycap Name *"
                value={keycapData.name}
                onChange={handleChange}
                required
              />

              {keycapData.kits.map((kit, index) => (
                <div key={index}>
                  <KitInputRow>
                    {index > 0 && (
                      <KitButton
                        $remove
                        onClick={() => {
                          const newKits = [...keycapData.kits];
                          newKits.splice(index, 1);
                          setKeycapData((prevData) => ({
                            ...prevData,
                            kits: newKits,
                          }));
                        }}
                      >
                        -
                      </KitButton>
                    )}
                    <KitInput
                      type="text"
                      name={`kitName${index}`}
                      placeholder="Kit Name *"
                      value={kit.name}
                      onChange={(event) =>
                        handleKitChange(index, "name", event.target.value)
                      }
                      required
                    />
                    {index === keycapData.kits.length - 1 &&
                      keycapData.kits.length < 8 && (
                        <KitButton $add onClick={handleAddKit}>
                          +
                        </KitButton>
                      )}
                  </KitInputRow>
                  <Input
                    type="url"
                    name={`kitImage${index}`}
                    placeholder="Kit Image URL *"
                    value={kit.image}
                    onChange={(event) =>
                      handleKitChange(index, "image", event.target.value)
                    }
                    required
                  />
                </div>
              ))}

              <Input
                type="url"
                name="render"
                placeholder="Render Image URL *"
                value={keycapData.render}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <ToggleAdditionalFieldsButton
              onClick={() =>
                setIsAdditionalFieldsVisible(!isAdditionalFieldsVisible)
              }
            >
              {isAdditionalFieldsVisible
                ? "Hide Additional Information"
                : "Add Additional Information"}
            </ToggleAdditionalFieldsButton>

            {isAdditionalFieldsVisible && (
              <AdditionalFieldsContainer>
                <Input
                  type="text"
                  name="manufacturer"
                  placeholder="Manufacturer (e.g., GMK)"
                  value={keycapData.manufacturer}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="material"
                  placeholder="Material (e.g., ABS)"
                  value={keycapData.material}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="profile"
                  placeholder="Profile (e.g., Cherry)"
                  value={keycapData.profile}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="profileHeight"
                  placeholder="Profile Height (e.g., 1-1-2-3-4-4)"
                  value={keycapData.profileHeight}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="designer"
                  placeholder="Designer"
                  value={keycapData.designer}
                  onChange={handleChange}
                />
                <Input
                  type="url"
                  name="geekhacklink"
                  placeholder="Geekhack Link"
                  value={keycapData.geekhacklink}
                  onChange={handleChange}
                />
              </AdditionalFieldsContainer>
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
                (!keycapData.name ||
                  !keycapData.kits[0].name ||
                  !keycapData.kits[0].image ||
                  !keycapData.render)) ||
              (activeTab === "dropdown" &&
                (!selectedKeycap || selectedKits.length === 0))
            }
          >
            Add Keycaps
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
  padding: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

const DropDownSelect = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  font-size: 16px;
  background-color: #f9f9f9;
`;

const KitList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const KitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

const HelperText = styled.p`
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  font-style: italic;
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

const KitInputRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  position: relative;
`;

const KitInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 0;
`;

const KitButton = styled.button`
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
