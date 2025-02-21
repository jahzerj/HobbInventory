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
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
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

  const kitsAvailable =
    selectedKeycapObj?.kits?.[0]?.price_list?.map((kit) => kit.name) ?? [];

  const handleKitSelection = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedKits([...selectedOptions]);
  };

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <h2>Select a Keycapset </h2>

        {/* First Dropdown: Select Keycap Set */}
        <select
          value={selectedKeycap}
          onChange={(e) => {
            setSelectedKeycap(e.target.value);
            setSelectedKits([]); //Reset kit selection
          }}
        >
          <option value="">-- Choose a keycap set -- </option>
          {keycaps.map((keycap) => (
            <option key={keycap._id} value={keycap.name}>
              {keycap.name}
            </option>
          ))}
        </select>

        {kitsAvailable.length > 0 ? (
          <>
            <h3>Selected Kits</h3>
            <select
              multiple={true}
              value={selectedKits}
              onChange={handleKitSelection}
            >
              {kitsAvailable.map((kitName, index) => (
                <option key={index} value={kitName}>
                  {kitName}
                </option>
              ))}
            </select>
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

        <br />
        <button onClick={onClose}>Cancel</button>
      </div>
    </>,
    document.getElementById("portal")
  );
}
