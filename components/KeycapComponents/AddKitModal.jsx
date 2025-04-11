import { createPortal } from "react-dom";
import styled from "styled-components";
import { useState } from "react";
import ImageUploader from "@/components/SharedComponents/ImageUploader";

export default function AddKitModal({ open, onClose, onAddKit }) {
  const [kitData, setKitData] = useState({
    name: "",
    image: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setKitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!kitData.name || !kitData.image) {
      alert("Please fill out both the kit name and image URL.");
      return;
    }

    onAddKit(kitData);
    setKitData({ name: "", image: "" });
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <h2>Add New Kit</h2>
        <SectionContainer>
          <KitInputRow>
            <KitInput
              type="text"
              name="name"
              placeholder="Kit Name *"
              value={kitData.name}
              onChange={handleChange}
              required
            />
          </KitInputRow>
          <ImageUploader
            onImageUpload={(secureUrl) => {
              setKitData((prevData) => ({
                ...prevData,
                image: secureUrl,
              }));
            }}
            prePopulatedUrl={kitData.image}
            category="keycaps_kits"
          />
          <Input
            type="url"
            name="image"
            placeholder="Kit Image URL *"
            value={kitData.image}
            onChange={handleChange}
            required
          />
        </SectionContainer>

        <ButtonContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <AddButton
            onClick={handleSubmit}
            disabled={!kitData.name || !kitData.image}
          >
            Add Kit
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

const SectionContainer = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
  background-color: #f9f9f9;
  width: 100%;
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

  &:hover {
    background-color: #ff3333;
  }
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

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#007bff" : "#0056b3")};
  }
`;
