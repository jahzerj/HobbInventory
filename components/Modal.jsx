import ReactDom from "react-dom";
import useSWR from "swr";
import { useState } from "react";

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

const CANCEL_BUTTON_STYLES = {
  padding: "10px 15px",
  border: "none",
  backgroundColor: "#ff4d4d",
  color: "white",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px",
  marginTop: "15px",
  width: "50%",
  textAlign: "center",
};

const ADD_BUTTON_STYLES = {
  padding: "10px 15px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px",
  marginTop: "15px",
  width: "50%",
  textAlign: "center",
};

export default function Modal({ open, onClose }) {
  const { data: keycaps, error } = useSWR("/api/inventories/keycaps");
  const [selectedKeycap, setSelectedKeycap] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);

  if (!open) return null;
  if (error) return <p>Error loading keycaps...</p>;
  if (!keycaps) return <p> Loading keycaps...</p>;

  const selectedKeycapObj = keycaps.find(
    (k) => k.name.toString() === selectedKeycap.toString()
  );

  const kitsAvailable = selectedKeycapObj?.kits?.[0]?.price_list ?? [];

  // Handle Checkbox Selection
  const handleKitSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedKits(
      (prevSelected) =>
        checked
          ? [...prevSelected, value] // Add kit
          : prevSelected.filter((kit) => kit !== value) // Remove kit
    );
  };

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <h2>Select a Keycap Set</h2>

        {/* First Dropdown: Select Keycap Set */}
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
        {kitsAvailable.length > 0 ? (
          <>
            <h3>Available Kits</h3>
            <div style={CHECKBOX_CONTAINER_STYLES}>
              {kitsAvailable.map((kit, index) => (
                <label key={index} style={CHECKBOX_LABEL_STYLES}>
                  <input
                    type="checkbox"
                    value={kit.name}
                    checked={selectedKits.includes(kit.name)}
                    onChange={handleKitSelection}
                  />
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

        <button onClick={onClose} style={CANCEL_BUTTON_STYLES}>
          Cancel
        </button>
        <button onClick={onClose} style={ADD_BUTTON_STYLES}>
          Add Keycap
        </button>
      </div>
    </>,
    document.getElementById("portal")
  );
}
