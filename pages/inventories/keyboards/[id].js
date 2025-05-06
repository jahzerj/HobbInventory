import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButtonMUI from "@/components/SharedComponents/ConfirmEditButtonMUI";
import EditButtonMUI from "@/components/SharedComponents/EditButtonMUI";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import { useSession } from "next-auth/react";

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
} from "@/components/SharedComponents/DetailPageStyles";

export default function KeyboardDetail() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { id } = router.query;

  //Fetching userkeyboard details
  const {
    data: userKeyboards,
    error: userKeyboardError,
    mutate,
  } = useSWR(id ? `/api/inventories/userkeyboards?userId=guest_user` : null);

  const userKeyboard = userKeyboards?.find((item) => item._id === id);

  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  // State for editable fields
  const [editedName, setEditedName] = useState(userKeyboard?.name || "");
  const [editedDesigner, setEditedDesigner] = useState(
    userKeyboard?.designer || ""
  );
  const [editedLayout, setEditedLayout] = useState(userKeyboard?.layout || "");
  const [editedBlocker, setEditedBlocker] = useState(
    userKeyboard?.blocker || ""
  );
  const [editedSwitchType, setEditedSwitchType] = useState(
    userKeyboard?.switchType || ""
  );
  const [editedPlateMaterial, setEditedPlateMaterial] = useState(
    userKeyboard?.plateMaterial || []
  );
  const [editedMounting, setEditedMounting] = useState(
    userKeyboard?.mounting || []
  );
  const [editedTypingAngle, setEditedTypingAngle] = useState(
    userKeyboard?.typingAngle || ""
  );
  const [editedFrontHeight, setEditedFrontHeight] = useState(
    userKeyboard?.frontHeight || ""
  );
  const [editedSurfaceFinish, setEditedSurfaceFinish] = useState(
    userKeyboard?.surfaceFinish || ""
  );
  const [editedColor, setEditedColor] = useState(userKeyboard?.color || "");
  const [editedWeightMaterial, setEditedWeightMaterial] = useState(
    userKeyboard?.weightMaterial || ""
  );
  const [editedBuildWeight, setEditedBuildWeight] = useState(
    userKeyboard?.buildWeight || ""
  );

  // Add this state to store the current active render image
  const [activeRenderIndex, setActiveRenderIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (userKeyboard) {
      setEditedName(userKeyboard.name || "");
      setEditedDesigner(userKeyboard.designer || "");
      setEditedLayout(userKeyboard.layout || "");
      setEditedBlocker(userKeyboard.blocker || "");
      setEditedSwitchType(userKeyboard.switchType || "");
      setEditedPlateMaterial(userKeyboard.plateMaterial || []);
      setEditedMounting(userKeyboard.mounting || []);
      setEditedTypingAngle(userKeyboard.typingAngle || "");
      setEditedFrontHeight(userKeyboard.frontHeight || "");
      setEditedSurfaceFinish(userKeyboard.surfaceFinish || "");
      setEditedColor(userKeyboard.color || "");
      setEditedWeightMaterial(userKeyboard.weightMaterial || "");
      setEditedBuildWeight(userKeyboard.buildWeight || "");
    }
  }, [userKeyboard]);

  const handleNotesUpdate = async (updatedNotes) => {
    try {
      const response = await fetch("/api/inventories/userkeyboards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest_user",
          keyboardId: id,
          notes: updatedNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notes");
      }

      mutate();
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Failed to save notes. Please try again.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/inventories/userkeyboards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest_user",
          _id: id,
          name: editedName,
          designer: editedDesigner,
          layout: editedLayout,
          renders: userKeyboard.renders,
          blocker: editedBlocker,
          switchType: editedSwitchType,
          plateMaterial: editedPlateMaterial,
          mounting: editedMounting,
          typingAngle: editedTypingAngle,
          frontHeight: editedFrontHeight,
          surfaceFinish: editedSurfaceFinish,
          color: editedColor,
          weightMaterial: editedWeightMaterial,
          buildWeight: editedBuildWeight,
          pcbOptions: userKeyboard.pcbOptions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update keyboard");
      }

      // Trigger SWR to revalidate data
      mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating keyboard:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    // Reset all edited states to original values
    if (userKeyboard) {
      setEditedName(userKeyboard.name || "");
      setEditedDesigner(userKeyboard.designer || "");
      setEditedLayout(userKeyboard.layout || "");
      setEditedBlocker(userKeyboard.blocker || "");
      setEditedSwitchType(userKeyboard.switchType || "");
      setEditedPlateMaterial(userKeyboard.plateMaterial || []);
      setEditedMounting(userKeyboard.mounting || []);
      setEditedTypingAngle(userKeyboard.typingAngle || "");
      setEditedFrontHeight(userKeyboard.frontHeight || "");
      setEditedSurfaceFinish(userKeyboard.surfaceFinish || "");
      setEditedColor(userKeyboard.color || "");
      setEditedWeightMaterial(userKeyboard.weightMaterial || "");
      setEditedBuildWeight(userKeyboard.buildWeight || "");
    }
  };

  if (status === "loading") {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  if (!session) {
    return null;
  }

  if (userKeyboardError) return <p>Error loading keyboards</p>;
  if (!userKeyboard) {
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
          <h1>Editing {userKeyboard.name}</h1>
        ) : (
          <h1>{userKeyboard.name}</h1>
        )}
        {userKeyboard.renders && userKeyboard.renders.length > 0 && (
          <>
            <HeaderImage>
              <Image
                src={userKeyboard.renders[activeRenderIndex]}
                alt={userKeyboard.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </HeaderImage>

            {userKeyboard.renders.length > 1 && (
              <ThumbnailGallery>
                {userKeyboard.renders.map((render, index) => (
                  <ThumbnailContainer
                    key={index}
                    $isActive={index === activeRenderIndex}
                    onClick={() => setActiveRenderIndex(index)}
                  >
                    <Image
                      src={render}
                      alt={`${userKeyboard.name} render ${index + 1}`}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                  </ThumbnailContainer>
                ))}
              </ThumbnailGallery>
            )}
          </>
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
                <option value="Winkey">WK</option>
                <option value="Winkeyless">WKL</option>
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
              <strong>Designer:</strong> {userKeyboard.designer}
            </li>
            <li>
              <strong>Layout:</strong> {userKeyboard.layout}
            </li>
            <li>
              <strong>Blocker:</strong> {userKeyboard.blocker}
            </li>
            <li>
              <strong>Switch Type:</strong> {userKeyboard.switchType}
            </li>
            <li>
              <strong>Plate Material: </strong>
              {userKeyboard.plateMaterial.join(", ")}
            </li>
            <li>
              <strong>Mounting Style:</strong>{" "}
              {userKeyboard.mounting.join(", ")}
            </li>
            <li>
              <strong>Typing Angle:</strong> {userKeyboard.typingAngle}
            </li>
            <li>
              <strong>Front Height:</strong> {userKeyboard.frontHeight}
            </li>
            <li>
              <strong>Surface Finish:</strong> {userKeyboard.surfaceFinish}
            </li>
            <li>
              <strong>Color:</strong> {userKeyboard.color}
            </li>
            <li>
              <strong>Weight Material:</strong> {userKeyboard.weightMaterial}
            </li>
            <li>
              <strong>Build Weight:</strong> {userKeyboard.buildWeight}
            </li>
          </>
        )}
      </BoxContainer>

      <AcceptCancelEditButtonContainer
        $innerWidth={innerWidth}
        $isEditMode={isEditMode}
      >
        <EditButtonMUI
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
          <ConfirmEditButtonMUI
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

const ThumbnailGallery = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  max-width: 100%;
  padding: 10px 0;
  justify-content: center;
`;

const ThumbnailContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2px solid ${(props) => (props.$isActive ? "#007bff" : "transparent")};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;
