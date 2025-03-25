import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

export default function AddKeycapModal({ open, onClose, onAddKeycap }) {
  const { data: keycaps, error } = useSWR("/api/inventories/keycaps");
  const [selectedKeycap, setSelectedKeycap] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);

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

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <h2>Select a Keycap Set</h2>

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
