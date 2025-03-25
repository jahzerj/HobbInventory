import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

export default function AddKeycapModal({ open, onClose, onAddKeycap }) {
  const { data: keycaps, error } = useSWR("/api/inventories/keycaps");
  const [selectedKeycap, setSelectedKeycap] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);
  const [activeTab, setActiveTab] = useState("dropdown");
  const [manualKeycapData, setManualKeycapData] = useState({
    name: "",
    kits: [{ name: "", image: "" }],
    render: "",
    manufacturer: "",
    material: "",
    profile: "",
    profileHeight: "",
    designer: "",
    geekhacklink: "",
  });

  useEffect(() => {
    if (open) {
      setSelectedKeycap(""); //Resets selected keycaps when modal is opened
      setSelectedKits([]); // Also reset selected kits
    }
  }, [open]);

  if (!open) return null;
  if (error) return <p>Error loading keycaps...</p>;
  if (!keycaps) return <p> Loading keycaps...</p>;

  // Sort keycaps alphabetically by name
  const sortedKeycaps = [...keycaps].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const selectedKeycapObj = keycaps.find(
    (keycap) => keycap.name === selectedKeycap
  );

  // Updated to use the new data structure - kits are now directly available
  const kitsAvailable = selectedKeycapObj?.kits || [];

  // Code for Checkbox Selection
  const handleKitSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedKits(
      (prevSelected) =>
        checked
          ? [...prevSelected, value] // Add kit
          : prevSelected.filter((kit) => kit !== value) // Remove kit
    );
  };

  const handleManualChange = (event) => {
    const { name, value } = event.target;
    setManualKeycapData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKitChange = (index, field, value) => {
    const newKits = [...manualKeycapData.kits];
    newKits[index][field] = value;
    setManualKeycapData((prevData) => ({
      ...prevData,
      kits: newKits,
    }));
  };

  const handleManualSubmit = async () => {
    if (
      !manualKeycapData.name ||
      !manualKeycapData.kits[0].name ||
      !manualKeycapData.kits[0].image ||
      !manualKeycapData.render
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest_user",
          ...manualKeycapData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add keycap");
      }

      onAddKeycap(manualKeycapData);
      onClose();
    } catch (error) {
      console.error("Failed to add keycap:", error);
    }
  };

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <h2>Add Keycap Set</h2>

        {/* Tab Navigation */}
        <TabContainer>
          <TabButton
            $isActive={activeTab === "dropdown"}
            onClick={() => setActiveTab("dropdown")}
          >
            Select from Database
          </TabButton>
          <TabButton
            $isActive={activeTab === "manual"}
            onClick={() => setActiveTab("manual")}
          >
            Manual Entry
          </TabButton>
        </TabContainer>

        {activeTab === "dropdown" ? (
          // Existing dropdown content
          <>
            {/* Dropdown: Select Keycap Set */}
            <DropDownSelect
              value={selectedKeycap}
              onChange={(event) => {
                setSelectedKeycap(event.target.value);
                setSelectedKits([]); // Reset kit selection
              }}
            >
              <option value="">-- Choose a keycap set --</option>

              {sortedKeycaps.map((keycap) => (
                <option key={keycap._id} value={keycap.name}>
                  {keycap.name}
                </option>
              ))}
            </DropDownSelect>

            {/* Checkbox Selection for Kits */}
            {kitsAvailable?.length > 0 ? (
              <>
                <h3>Available Kits</h3>
                <KitList>
                  {kitsAvailable.map((kit) => (
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
                  ))}
                </KitList>
              </>
            ) : selectedKeycap ? (
              <p>No kits available for this set.</p>
            ) : null}

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
                Please select at least one kit before adding this keycap set.
              </HelperText>
            )}

            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <AddButton
              onClick={() => {
                if (!selectedKeycap) return;

                onAddKeycap(selectedKeycapObj._id, selectedKits);
                onClose();
              }}
              disabled={!selectedKeycapObj || selectedKits.length === 0}
            >
              Add Keycaps
            </AddButton>
          </>
        ) : (
          // Manual Entry Content
          <>
            <Input
              type="text"
              name="name"
              placeholder="Keycap Name *"
              value={manualKeycapData.name}
              onChange={handleManualChange}
              required
            />
            <Input
              type="text"
              name="kitName"
              placeholder="Kit Name *"
              value={manualKeycapData.kits[0].name}
              onChange={(event) =>
                handleKitChange(0, "name", event.target.value)
              }
              required
            />
            <Input
              type="url"
              name="kitImage"
              placeholder="Kit Image URL *"
              value={manualKeycapData.kits[0].image}
              onChange={(event) =>
                handleKitChange(0, "image", event.target.value)
              }
              required
            />
            <Input
              type="url"
              name="render"
              placeholder="Render Image URL *"
              value={manualKeycapData.render}
              onChange={handleManualChange}
              required
            />
            <Input
              type="text"
              name="manufacturer"
              placeholder="Manufacturer (e.g., GMK)"
              value={manualKeycapData.manufacturer}
              onChange={handleManualChange}
            />
            <Input
              type="text"
              name="material"
              placeholder="Material (e.g., ABS)"
              value={manualKeycapData.material}
              onChange={handleManualChange}
            />
            <Input
              type="text"
              name="profile"
              placeholder="Profile (e.g., Cherry)"
              value={manualKeycapData.profile}
              onChange={handleManualChange}
            />
            <Input
              type="text"
              name="profileHeight"
              placeholder="Profile Height (e.g., 1-1-2-3-4-4)"
              value={manualKeycapData.profileHeight}
              onChange={handleManualChange}
            />
            <Input
              type="text"
              name="designer"
              placeholder="Designer"
              value={manualKeycapData.designer}
              onChange={handleManualChange}
            />
            <Input
              type="url"
              name="geekhacklink"
              placeholder="Geekhack Link"
              value={manualKeycapData.geekhacklink}
              onChange={handleManualChange}
            />

            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <AddButton onClick={handleManualSubmit}>Add Keycap</AddButton>
          </>
        )}
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

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;
