import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButton from "@/components/KeycapComponents/ConfirmEditButton";
import EditButton from "@/components/KeycapComponents/EditButton";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import { mockKeyboardData } from "./index"; // Import mock data
import {
  DetailPageContainer,
  StyledLink,
  HeaderSection,
  HeaderImage,
  BoxContainer,
  AcceptCancelEditButtonContainer,
  StyledSpan,
  LoaderWrapper,
  StyledInput,
  SectionHeading,
} from "@/components/SharedComponents/DetailPageStyles";

export default function KeyboardDetail() {
  const router = useRouter();
  const { id } = router.query;

  // For now, we'll use mock data instead of SWR
  const keyboard = mockKeyboardData?.find((item) => item._id === id);
  const notes = keyboard?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  // State for editable fields
  const [editedName, setEditedName] = useState(keyboard?.name || "");
  const [editedDesigner, setEditedDesigner] = useState(
    keyboard?.designer || ""
  );
  const [editedLayout, setEditedLayout] = useState(keyboard?.layout || "");
  const [editedBlocker, setEditedBlocker] = useState(keyboard?.blocker || "");
  const [editedSwitchType, setEditedSwitchType] = useState(
    keyboard?.switchType || ""
  );
  const [editedPlateMaterial, setEditedPlateMaterial] = useState(
    keyboard?.plateMaterial || []
  );
  const [editedMounting, setEditedMounting] = useState(
    keyboard?.mounting || []
  );
  const [editedTypingAngle, setEditedTypingAngle] = useState(
    keyboard?.typingAngle || ""
  );
  const [editedFrontHeight, setEditedFrontHeight] = useState(
    keyboard?.frontHeight || ""
  );
  const [editedSurfaceFinish, setEditedSurfaceFinish] = useState(
    keyboard?.surfaceFinish || ""
  );
  const [editedColor, setEditedColor] = useState(keyboard?.color || "");
  const [editedWeightMaterial, setEditedWeightMaterial] = useState(
    keyboard?.weightMaterial || ""
  );
  const [editedBuildWeight, setEditedBuildWeight] = useState(
    keyboard?.buildWeight || ""
  );
  const [editedPhotos, setEditedPhotos] = useState(keyboard?.photos || []);

  // Add these state variables near the other state declarations
  const [editedBuildName, setEditedBuildName] = useState("");
  const [editedStabType, setEditedStabType] = useState("");
  const [editedStabBrand, setEditedStabBrand] = useState("");
  const [editedStabLubed, setEditedStabLubed] = useState(false);
  const [editedBuildPhotos, setEditedBuildPhotos] = useState([]);

  // Fetch user's switches
  const { data: userSwitches } = useSWR(
    "/api/inventories/userswitches?userId=guest_user"
  );

  // Add state for builds
  const [editedBuilds, setEditedBuilds] = useState(keyboard?.builds || []);
  const [selectedSwitches, setSelectedSwitches] = useState([]);

  // Add these new state variables
  const [editedPlate, setEditedPlate] = useState(keyboard?.currentPlate || "");
  const [editedSwitches, setEditedSwitches] = useState(
    keyboard?.installedSwitches || []
  );
  const [editedModifications, setEditedModifications] = useState(
    keyboard?.modifications || []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (keyboard) {
      setEditedName(keyboard.name || "");
      setEditedDesigner(keyboard.designer || "");
      setEditedLayout(keyboard.layout || "");
      setEditedBlocker(keyboard.blocker || "");
      setEditedSwitchType(keyboard.switchType || "");
      setEditedPlateMaterial(keyboard.plateMaterial || []);
      setEditedMounting(keyboard.mounting || []);
      setEditedTypingAngle(keyboard.typingAngle || "");
      setEditedFrontHeight(keyboard.frontHeight || "");
      setEditedSurfaceFinish(keyboard.surfaceFinish || "");
      setEditedColor(keyboard.color || "");
      setEditedWeightMaterial(keyboard.weightMaterial || "");
      setEditedBuildWeight(keyboard.buildWeight || "");
      setEditedPhotos(keyboard.photos || []);
      setEditedPlate(keyboard.currentPlate || "");
      setEditedSwitches(keyboard.installedSwitches || []);
      setEditedModifications(keyboard.modifications || []);
    }
  }, [keyboard]);

  const handleNotesUpdate = async (updatedNotes) => {
    // This would be replaced with actual API call in production
    console.log("Updating notes:", updatedNotes);
  };

  const handleSaveChanges = async () => {
    const newBuild = {
      name: editedBuildName,
      plate: editedPlate,
      switches: selectedSwitches,
      stabilizers: {
        type: editedStabType,
        brand: editedStabBrand,
        lubed: editedStabLubed,
      },
      modifications: editedModifications,
      photos: editedBuildPhotos,
      active: true,
      buildDate: new Date(),
    };

    const updatedBuilds = [...editedBuilds, newBuild];

    // This would be replaced with actual API call in production
    console.log("Saving changes with builds:", updatedBuilds);
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    // Reset all edited states to original values
    if (keyboard) {
      setEditedName(keyboard.name || "");
      setEditedDesigner(keyboard.designer || "");
      // ... reset all other fields
    }
  };

  // Function to handle switch selection
  const handleSwitchSelection = (switchId) => {
    setEditedSwitches((prev) =>
      prev.includes(switchId)
        ? prev.filter((id) => id !== switchId)
        : [...prev, switchId]
    );
  };

  // Add these handler functions
  const handleAddPhoto = () => {
    // Implement photo upload logic
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

  if (!keyboard) {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  return (
    <DetailPageContainer>
      {!isEditMode && (
        <StyledLink
          href="/inventories/keyboards"
          aria-label="Close Details Page"
        >
          <CloseButtonIcon />
        </StyledLink>
      )}

      <HeaderSection>
        {isEditMode ? (
          <h1>Editing {keyboard.name}</h1>
        ) : (
          <h1>{keyboard.name}</h1>
        )}
        {keyboard.photos[0] && (
          <HeaderImage>
            <Image
              src={keyboard.photos[0]}
              alt={keyboard.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </HeaderImage>
        )}
      </HeaderSection>

      <h3>Details</h3>
      <BoxContainer>
        {isEditMode ? (
          <>
            <li>
              <strong>Name:</strong>
              <StyledInput
                type="text"
                value={editedName}
                onChange={(event) => setEditedName(event.target.value)}
              />
            </li>
            <li>
              <strong>Designer:</strong>
              <StyledInput
                type="text"
                value={editedDesigner}
                onChange={(event) => setEditedDesigner(event.target.value)}
              />
            </li>
            <li>
              <strong>Layout:</strong>
              <StyledInput
                as="select"
                value={editedLayout}
                onChange={(event) => setEditedLayout(event.target.value)}
              >
                <option value="">-- Select Layout --</option>
                <option value="60%">60%</option>
                <option value="65%">65%</option>
                <option value="75%">75%</option>
                <option value="TKL">TKL</option>
                <option value="Full Size">Full Size</option>
              </StyledInput>
            </li>
            <li>
              <strong>Blocker:</strong>
              <StyledInput
                as="select"
                value={editedBlocker}
                onChange={(event) => setEditedBlocker(event.target.value)}
              >
                <option value="">-- Select Blocker --</option>
                <option value="WK">WK</option>
                <option value="WKL">WKL</option>
                <option value="HHKB">HHKB</option>
              </StyledInput>
            </li>
            <li>
              <strong>Switch Type:</strong>
              <StyledInput
                as="select"
                value={editedSwitchType}
                onChange={(event) => setEditedSwitchType(event.target.value)}
              >
                <option value="">-- Select Switch Type --</option>
                <option value="MX">MX</option>
                <option value="Alps">Alps</option>
                <option value="Topre">Topre</option>
              </StyledInput>
            </li>
            <li>
              <strong>Plate Material:</strong>
              <StyledCheckboxGroup>
                {[
                  "Aluminum",
                  "Brass",
                  "Carbon Fiber",
                  "FR4",
                  "POM",
                  "Polycarbonate",
                ].map((material) => (
                  <label key={material}>
                    <input
                      type="checkbox"
                      checked={editedPlateMaterial.includes(material)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setEditedPlateMaterial([
                            ...editedPlateMaterial,
                            material,
                          ]);
                        } else {
                          setEditedPlateMaterial(
                            editedPlateMaterial.filter((m) => m !== material)
                          );
                        }
                      }}
                    />
                    {material}
                  </label>
                ))}
              </StyledCheckboxGroup>
            </li>
            <li>
              <strong>Mounting Style:</strong>
              <StyledCheckboxGroup>
                {[
                  "Top Mount",
                  "Gasket Mount",
                  "O-ring Mount",
                  "Burger Mount",
                  "Leaf Spring",
                ].map((mount) => (
                  <label key={mount}>
                    <input
                      type="checkbox"
                      checked={editedMounting.includes(mount)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setEditedMounting([...editedMounting, mount]);
                        } else {
                          setEditedMounting(
                            editedMounting.filter((m) => m !== mount)
                          );
                        }
                      }}
                    />
                    {mount}
                  </label>
                ))}
              </StyledCheckboxGroup>
            </li>
            <li>
              <strong>Typing Angle:</strong>
              <StyledInput
                type="text"
                value={editedTypingAngle}
                onChange={(event) => setEditedTypingAngle(event.target.value)}
                placeholder="e.g., 6.5°"
              />
            </li>
            <li>
              <strong>Front Height:</strong>
              <StyledInput
                type="text"
                value={editedFrontHeight}
                onChange={(event) => setEditedFrontHeight(event.target.value)}
                placeholder="e.g., 19mm"
              />
            </li>
            <li>
              <strong>Surface Finish:</strong>
              <StyledInput
                as="select"
                value={editedSurfaceFinish}
                onChange={(event) => setEditedSurfaceFinish(event.target.value)}
              >
                <option value="">-- Select Finish --</option>
                <option value="Anodization">Anodization</option>
                <option value="E-coating">E-coating</option>
                <option value="Cerakote">Cerakote</option>
                <option value="Raw">Raw</option>
              </StyledInput>
            </li>
            <li>
              <strong>Color:</strong>
              <StyledInput
                type="text"
                value={editedColor}
                onChange={(event) => setEditedColor(event.target.value)}
              />
            </li>
            <li>
              <strong>Weight Material:</strong>
              <StyledInput
                as="select"
                value={editedWeightMaterial}
                onChange={(event) =>
                  setEditedWeightMaterial(event.target.value)
                }
              >
                <option value="">-- Select Material --</option>
                <option value="Brass">Brass</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Aluminum">Aluminum</option>
                <option value="Tungsten">Tungsten</option>
              </StyledInput>
            </li>
            <li>
              <strong>Build Weight:</strong>
              <StyledInput
                type="text"
                value={editedBuildWeight}
                onChange={(event) => setEditedBuildWeight(event.target.value)}
                placeholder="e.g., 1200g"
              />
            </li>
          </>
        ) : (
          <>
            <li>
              <strong>Designer:</strong> {keyboard.designer}
            </li>
            <li>
              <strong>Layout:</strong> {keyboard.layout}
            </li>
            <li>
              <strong>Blocker:</strong> {keyboard.blocker}
            </li>
            <li>
              <strong>Switch Type:</strong> {keyboard.switchType}
            </li>
            <li>
              <strong>Plate Material: </strong>
              {keyboard.plateMaterial.join(", ")}
            </li>
            <li>
              <strong>Mounting Style:</strong> {keyboard.mounting.join(", ")}
            </li>
            <li>
              <strong>Typing Angle:</strong> {keyboard.typingAngle}
            </li>
            <li>
              <strong>Front Height:</strong> {keyboard.frontHeight}
            </li>
            <li>
              <strong>Surface Finish:</strong> {keyboard.surfaceFinish}
            </li>
            <li>
              <strong>Color:</strong> {keyboard.color}
            </li>
            <li>
              <strong>Weight Material:</strong> {keyboard.weightMaterial}
            </li>
            <li>
              <strong>Build Weight:</strong> {keyboard.buildWeight}
            </li>
          </>
        )}
      </BoxContainer>

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
              {keyboard.plateMaterial.map((plate) => (
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
              {keyboard.photos && keyboard.photos[0] ? (
                <Image
                  src={keyboard.photos[0]}
                  alt={`${keyboard.name} build photo`}
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
                {keyboard.currentPlate || "Not specified"}
              </BuildInfoItem>

              <BuildInfoItem>
                <strong>Switches:</strong>
                {keyboard.installedSwitches &&
                keyboard.installedSwitches.length > 0
                  ? keyboard.installedSwitches.map((switchData, index) => (
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
                {keyboard.modifications && keyboard.modifications.length > 0
                  ? keyboard.modifications.map((mod, index) => (
                      <Modification key={index}>{mod}</Modification>
                    ))
                  : "No modifications recorded"}
              </BuildInfoItem>
            </BuildDetails>
          </BuildLayout>
        </BuildContainer>
      )}

      <AcceptCancelEditButtonContainer
        $innerWidth={innerWidth}
        $isEditMode={isEditMode}
      >
        <EditButton
          isEditMode={isEditMode}
          onToggleEdit={() => {
            if (isEditMode) {
              handleCancelEdits();
            } else {
              setIsEditMode(true);
            }
          }}
        />
        {isEditMode && (
          <ConfirmEditButton
            isEditMode={isEditMode}
            onSaveChanges={handleSaveChanges}
          />
        )}
      </AcceptCancelEditButtonContainer>
    </DetailPageContainer>
  );
}

const KeyboardHeaderImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  margin: 20px 0;

  @media (min-width: 400px) {
    width: 250px;
    height: 250px;
  }
  @media (min-width: 600px) {
    width: 300px;
    height: 300px;
  }
`;

const SwitchOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
  }

  input[type="number"] {
    width: 80px;
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

const SwitchList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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

const BuildSection = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-bottom: 10px;
    color: #333;
  }
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