// components/SharedComponents/Builds.js
import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { StyledInput, SectionHeading } from "./DetailPageStyles";

export default function Builds({
  isEditMode,
  userKeyboard,
  userSwitches,
  editedPlate,
  setEditedPlate,
  editedSwitches,
  setEditedSwitches,
  selectedSwitches,
  setSelectedSwitches,
  editedPhotos,
  setEditedPhotos,
  editedModifications,
  setEditedModifications,
}) {
  // Handler functions
  const handleSwitchSelection = (switchId) => {
    setEditedSwitches((prev) =>
      prev.includes(switchId)
        ? prev.filter((id) => id !== switchId)
        : [...prev, switchId]
    );
    // Also update selectedSwitches for the new build
    setSelectedSwitches((prev) =>
      prev.includes(switchId)
        ? prev.filter((id) => id !== switchId)
        : [...prev, switchId]
    );
  };

  const handleAddPhoto = () => {
    const newPhotoUrl = prompt("Enter photo URL:", "");
    if (newPhotoUrl && newPhotoUrl.trim() !== "") {
      setEditedPhotos([...editedPhotos, newPhotoUrl.trim()]);
    }
  };

  const handleRemovePhoto = (index) => {
    setEditedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddModification = () => {
    setEditedModifications((prev) => [...prev, ""]);
  };

  const handleRemoveModification = (index) => {
    setEditedModifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModificationChange = (event, index) => {
    setEditedModifications((prev) =>
      prev.map((mod, i) => (i === index ? event.target.value : mod))
    );
  };

  return (
    <>
      <SectionHeading>Builds</SectionHeading>
      {isEditMode ? (
        <>
          <BuildSection>
            <h4>Plate Selection</h4>
            <StyledInput
              as="select"
              value={editedPlate}
              onChange={(event) => setEditedPlate(event.target.value)}
            >
              <option value="">-- Select Plate --</option>
              {userKeyboard.plateMaterial.map((plate) => (
                <option key={plate} value={plate}>
                  {plate}
                </option>
              ))}
            </StyledInput>
          </BuildSection>

          <BuildSection>
            <h4>Switches</h4>
            <StyledCheckboxGroup>
              {userSwitches && userSwitches.length > 0 ? (
                userSwitches.map((switchItem) => (
                  <label key={switchItem._id || switchItem.id}>
                    <input
                      type="checkbox"
                      checked={editedSwitches.includes(
                        switchItem._id || switchItem.id
                      )}
                      onChange={() =>
                        handleSwitchSelection(switchItem._id || switchItem.id)
                      }
                    />
                    {switchItem.name}
                  </label>
                ))
              ) : (
                <p>
                  No switches available. Please add some in the switches
                  inventory.
                </p>
              )}
            </StyledCheckboxGroup>
          </BuildSection>

          <BuildSection>
            <h4>Build Photos</h4>
            <ImageCarousel>
              {editedPhotos.map((photo, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={photo}
                    alt={`Build photo ${index + 1}`}
                    width={150}
                    height={150}
                    style={{ objectFit: "cover" }}
                  />
                  <RemoveButton onClick={() => handleRemovePhoto(index)}>
                    ×
                  </RemoveButton>
                </CarouselItem>
              ))}
              <AddPhotoButton onClick={handleAddPhoto}>
                + Add Photo
              </AddPhotoButton>
            </ImageCarousel>
          </BuildSection>

          <BuildSection>
            <h4>Modifications</h4>
            <ModificationsList>
              {editedModifications.map((mod, index) => (
                <ModificationItem key={index}>
                  <StyledInput
                    type="text"
                    value={mod}
                    onChange={(event) => handleModificationChange(event, index)}
                  />
                  <RemoveButton onClick={() => handleRemoveModification(index)}>
                    ×
                  </RemoveButton>
                </ModificationItem>
              ))}
              <AddButton onClick={handleAddModification}>
                + Add Modification
              </AddButton>
            </ModificationsList>
          </BuildSection>
        </>
      ) : (
        <BuildContainer>
          <BuildLayout>
            <BuildPhotoContainer>
              {userKeyboard.builds?.[0]?.photos?.[0] ? (
                <Image
                  src={userKeyboard.builds[0].photos[0]}
                  alt={`${userKeyboard.name} build photo`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No Photos
                </div>
              )}
            </BuildPhotoContainer>

            <BuildDetails>
              <BuildInfoItem>
                <strong>Plate:</strong>
                {userKeyboard.currentPlate || "Not specified"}
              </BuildInfoItem>

              <BuildInfoItem>
                <strong>Switches:</strong>
                {userKeyboard.installedSwitches &&
                userKeyboard.installedSwitches.length > 0
                  ? userKeyboard.installedSwitches.map((switchData, index) => (
                      <SwitchListItem
                        key={switchData.id || switchData._id || index}
                      >
                        {switchData.name}{" "}
                        {switchData.description
                          ? `: ${switchData.description}`
                          : ""}
                      </SwitchListItem>
                    ))
                  : "No switches installed"}
              </BuildInfoItem>

              <BuildInfoItem>
                <strong>Modifications:</strong>
                {userKeyboard.modifications &&
                userKeyboard.modifications.length > 0
                  ? userKeyboard.modifications.map((mod, index) => (
                      <Modification key={index}>{mod}</Modification>
                    ))
                  : "No modifications recorded"}
              </BuildInfoItem>
            </BuildDetails>
          </BuildLayout>
        </BuildContainer>
      )}
    </>
  );
}

// Styled components
const BuildSection = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-bottom: 10px;
    color: #333;
  }
`;

const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 8px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
`;

const ImageCarousel = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
`;

const CarouselItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const AddButton = styled.button`
  background: #f0f0f0;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
`;

const AddPhotoButton = styled(AddButton)`
  min-width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModificationsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ModificationItem = styled.li`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const BuildContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 360px;
  max-width: 430px;
`;

const BuildLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BuildPhotoContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 250px;
  width: 250px;
`;

const BuildDetails = styled.div`
  text-align: left;
`;

const BuildInfoItem = styled.div`
  margin-bottom: 16px;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #333;
  }
`;

const SwitchListItem = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
`;

const Modification = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;
