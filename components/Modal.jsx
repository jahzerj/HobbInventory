import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

export default function Modal({ open, onClose, onAddKeycap }) {
  const { data: keycaps, error } = useSWR("/api/inventories/keycaps");
  const [selectedKeycap, setSelectedKeycap] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);

  useEffect(() => {
    if (open) {
      setSelectedKeycap(""); //Resets selected keycaps when modal is opened
    }
  }, [open]);

  if (!open) return null;
  if (error) return <p>Error loading keycaps...</p>;
  if (!keycaps) return <p> Loading keycaps...</p>;

  const selectedKeycapObj = keycaps.find(
    (keycap) => keycap.name === selectedKeycap
  );

  const kitsAvailable =
    selectedKeycapObj?.kits?.flatMap((kit) => kit.price_list) ?? [];

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
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <h2>Select a Keycap Set</h2>

        {/* Dropdown: Select Keycap Set */}
        <select
          value={selectedKeycap}
          onChange={(e) => {
            setSelectedKeycap(e.target.value);
            setSelectedKits([]); // Reset kit selection
          }}
          style={SELECT_STYLES}
        >
          <option value="">-- Choose a keycap set --</option>

          {keycaps.map((keycap) => (
            <option key={keycap._id} value={keycap.name}>
              {keycap.name}
            </option>
          ))}
        </select>

        {/* Checkbox Selection for Kits */}
        {kitsAvailable?.length > 0 ? (
          <>
            <h3>Available Kits</h3>
            <div style={CHECKBOX_CONTAINER_STYLES}>
              {kitsAvailable.map((kit) => (
                <label key={kit._id || kit.name} style={CHECKBOX_LABEL_STYLES}>
                  <input
                    type="checkbox"
                    value={kit.name}
                    checked={selectedKits.includes(kit.name)}
                    onChange={handleKitSelection}
                  />
                  {kit.pic && (
                    <Image
                      src={kit.pic}
                      alt={kit.name}
                      width={50}
                      height={50}
                      style={{
                        objectFit: "cover",
                        marginRight: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                  {kit.name}
                </label>
              ))}
            </div>
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

        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <AddButton
          onClick={() =>
            selectedKeycapObj && (onAddKeycap(selectedKeycapObj._id), onClose())
          }
          disabled={!selectedKeycapObj}
        >
          Add Keycaps
        </AddButton>
      </div>
    </>,
    document.getElementById("portal")
  );
}

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  width: "400px",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  zIndex: 1000,
};

const SELECT_STYLES = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  marginBottom: "15px",
  fontSize: "16px",
  backgroundColor: "#f9f9f9",
};

const CHECKBOX_CONTAINER_STYLES = {
  display: "flex",
  flexDirection: "column",
};

const CHECKBOX_LABEL_STYLES = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "8px",
  fontSize: "14px",
  cursor: "pointer",
};

const CancelButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
  width: 50%;
  text-align: center;
`;
const AddButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
  width: 50%;
  text-align: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
