import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
// import Image from "next/image";
import styled from "styled-components";

export default function Modal({ open, onClose, onAddKeycap }) {
  const { data: switches, error } = useSWR("/api/inventories/switches");
  // const [selectedKeycap, setSelectedKeycap] = useState("");
  // const [selectedKits, setSelectedKits] = useState([]);

  if (!open) return null;
  if (error) return <p>Error loading keycaps...</p>;
  if (!switches) return <p> Loading keycaps...</p>;

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <h2>Add your Switch's Information</h2>

        

        
        {/*preivew section for the added switch */}
        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <AddButton
          onClick={() => {
            if (!selectedKeycap) return;

            onAddKeycap(selectedKeycapObj._id, selectedKits);
            onClose();
          }}
          // disabled={!selectedKeycapObj}
          // Add a collection of required inputs !requiredInputs = > disabled
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
