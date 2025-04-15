import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { colorOptions } from "@/utils/colors";
import EditButton from "@/components/KeycapComponents/EditButton";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButton from "@/components/KeycapComponents/ConfirmEditButton";
import KitImageModal from "@/components/KeycapComponents/KitImageModal";
import Notes from "@/components/SharedComponents/Notes";
import {
  DetailPageContainer,
  StyledLink,
  HeaderSection,
  HeaderImage,
  BoxContainer,
  ExternalLink,
  AcceptCancelEditButtonContainer,
  StyledSpan,
  LoaderWrapper,
  StyledInput,
  SectionHeading,
} from "@/components/SharedComponents/DetailPageStyles";
import AddIcon from "@/components/icons/AddIcon";
import AddKitModal from "@/components/KeycapComponents/AddKitModal";
import { useSession } from "next-auth/react";

export default function KeyCapDetail() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { id } = router.query;

  const {
    data: userKeycaps,
    error: userKeycapError,
    mutate,
  } = useSWR(id ? "/api/inventories/userkeycaps" : null);

  const userKeycap = userKeycaps?.find((item) => item._id === id);
  const selectedColors = userKeycap?.selectedColors ?? [];
  const notes = userKeycap?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);

  const [editedKits, setEditedKits] = useState(userKeycap?.selectedKits || []);
  const [editedColors, setEditedColors] = useState(selectedColors || []);
  const [editedNotes, setEditedNotes] = useState(notes || []);
  const [innerWidth, setInnerWidth] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const [editedManufacturer, setEditedManufacturer] = useState(
    userKeycap?.manufacturer || ""
  );
  const [editedMaterial, setEditedMaterial] = useState(
    userKeycap?.material || ""
  );
  const [editedProfile, setEditedProfile] = useState(userKeycap?.profile || "");
  const [editedProfileHeight, setEditedProfileHeight] = useState(
    userKeycap?.profileHeight || ""
  );
  const [editedDesigner, setEditedDesigner] = useState(
    userKeycap?.designer || ""
  );
  const [editedGeekhackLink, setEditedGeekhackLink] = useState(
    userKeycap?.geekhacklink || ""
  );

  const [isAddKitModalOpen, setIsAddKitModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (userKeycap?.notes) {
      setEditedNotes(userKeycap.notes);
    }
  }, [userKeycap?.notes]);

  useEffect(() => {
    if (userKeycap) {
      setEditedKits(userKeycap.selectedKits || []);
      setEditedColors(userKeycap.selectedColors || []);
      setEditedManufacturer(userKeycap.manufacturer || "");
      setEditedMaterial(userKeycap.material || "");
      setEditedProfile(userKeycap.profile || "");
      setEditedProfileHeight(userKeycap.profileHeight || "");
      setEditedDesigner(userKeycap.designer || "");
      setEditedGeekhackLink(userKeycap.geekhacklink || "");
    }
  }, [userKeycap]);

  const handleKitSelection = (kitName) => {
    if (!isEditMode) return;

    setEditedKits((prevKits) => {
      if (prevKits.includes(kitName)) {
        return prevKits.filter((kit) => kit !== kitName);
      } else {
        return [...prevKits, kitName];
      }
    });
  };

  const handleColorSelection = (selectedColor, currentColors) => {
    if (currentColors.includes(selectedColor)) {
      return { error: "Color already selected" };
    }
    if (currentColors.length >= 6) {
      return { error: "Maximum 6 colors allowed" };
    }
    return { newColors: [...currentColors, selectedColor] };
  };

  const handleColorSelect = async (event) => {
    const selectedColor = event.target.value;
    const colors = isEditMode ? editedColors : selectedColors;

    const result = handleColorSelection(selectedColor, colors);
    if (result.error) {
      alert(result.error);
      return;
    }

    if (isEditMode) {
      setEditedColors(result.newColors);
      return;
    }

    //non-edit mode color selection
    if (selectedColors.includes(selectedColor)) return;
    if (selectedColors.length >= 6) {
      return alert("You can only selected up to 6 colors.");
    }

    const updatedColors = [...selectedColors, selectedColor];

    await fetch("/api/inventories/userkeycaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: userKeycap._id,
        keycapDefinitionId: userKeycap.keycapDefinitionId,
        name: userKeycap.name,
        selectedKits: userKeycap.selectedKits,
        selectedColors: updatedColors,
      }),
    });
    mutate();
  };

  const handleRemoveColor = (color) => {
    if (!isEditMode) return;

    setEditedColors((prevColors) =>
      prevColors.filter((existingColor) => existingColor !== color)
    );
  };

  const handleNotesUpdate = async (updatedNotes) => {
    if (isEditMode) {
      setEditedNotes(updatedNotes);
    } else {
      // Only make API call when not in edit mode
      await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: userKeycap._id,
          keycapDefinitionId: userKeycap.keycapDefinitionId,
          name: userKeycap.name,
          selectedKits: userKeycap.selectedKits,
          selectedColors: userKeycap.selectedColors,
          notes: updatedNotes,
        }),
      });
      await mutate();
    }
  };

  const handleSaveChanges = async () => {
    // Save all changes including notes
    await fetch("/api/inventories/userkeycaps", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: userKeycap._id,
        keycapDefinitionId: userKeycap.keycapDefinitionId,
        name: userKeycap.name,
        selectedKits: editedKits,
        selectedColors: editedColors,
        notes: editedNotes,
        manufacturer: editedManufacturer,
        material: editedMaterial,
        profile: editedProfile,
        profileHeight: editedProfileHeight,
        designer: editedDesigner,
        geekhacklink: editedGeekhackLink,
      }),
    });
    await mutate();
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setEditedColors([...selectedColors]);
    setEditedKits(userKeycap?.selectedKits || []);
    setEditedNotes([...notes]);
    setEditedManufacturer(userKeycap?.manufacturer || "");
    setEditedMaterial(userKeycap?.material || "");
    setEditedProfile(userKeycap?.profile || "");
    setEditedProfileHeight(userKeycap?.profileHeight || "");
    setEditedDesigner(userKeycap?.designer || "");
    setEditedGeekhackLink(userKeycap?.geekhacklink || "");
    setIsEditMode(false);
  };

  const handleAddKit = async (newKit) => {
    try {
      // Add the new kit to the existing kits
      const updatedKits = [...(userKeycap.kits || []), newKit];

      // Add the new kit name to selectedKits if it's not already there
      const updatedSelectedKits = userKeycap.selectedKits.includes(newKit.name)
        ? userKeycap.selectedKits
        : [...userKeycap.selectedKits, newKit.name];

      // Make the PUT request to update the keycap with the new kit
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userKeycap,
          kits: updatedKits,
          selectedKits: updatedSelectedKits,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update keycap with new kit");
      }

      // Update the local state
      mutate(); // Refetch data using SWR
    } catch (error) {
      console.error("Error adding kit:", error);
      alert("Failed to add kit. Please try again.");
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

  if (userKeycapError) return <p>Error loading keycap details.</p>;
  if (!userKeycaps) {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  const kitsAvailable = userKeycap.kits ?? [];
  const selectedKits = userKeycap?.selectedKits ?? [];

  return (
    <>
      <DetailPageContainer>
        {isEditMode ? null : (
          <StyledLink
            href="/inventories/keycaps"
            aria-label="Close Details Page"
          >
            <CloseButtonIcon />
          </StyledLink>
        )}

        <HeaderSection>
          {isEditMode ? (
            <h1>Editing {userKeycap.name}</h1>
          ) : (
            <h1>{userKeycap.name}</h1>
          )}
          {userKeycap.render && (
            <HeaderImage>
              <Image
                src={userKeycap.render}
                alt={userKeycap.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </HeaderImage>
          )}
        </HeaderSection>

        <SectionHeading>Details</SectionHeading>
        <BoxContainer>
          <li>
            <strong>Manufacturer:</strong>{" "}
            {isEditMode ? (
              <StyledInput
                type="text"
                value={editedManufacturer}
                onChange={(event) => setEditedManufacturer(event.target.value)}
                placeholder="Manufacturer (e.g., GMK)"
              />
            ) : (
              userKeycap.manufacturer || "Not specified"
            )}
          </li>
          <li>
            <strong>Material:</strong>{" "}
            {isEditMode ? (
              <StyledInput
                type="text"
                value={editedMaterial}
                onChange={(event) => setEditedMaterial(event.target.value)}
                placeholder="Material (e.g., ABS)"
              />
            ) : (
              userKeycap.material || "Not specified"
            )}
          </li>
          <li>
            <strong>Profile:</strong>{" "}
            {isEditMode ? (
              <StyledInput
                type="text"
                value={editedProfile}
                onChange={(event) => setEditedProfile(event.target.value)}
                placeholder="Profile (e.g., Cherry)"
              />
            ) : (
              userKeycap.profile || "Not specified"
            )}
          </li>
          <li>
            <strong>Profile Height:</strong>{" "}
            {isEditMode ? (
              <StyledInput
                type="text"
                value={editedProfileHeight}
                onChange={(event) => setEditedProfileHeight(event.target.value)}
                placeholder="Profile Height (e.g., 1-1-2-3-4-4)"
              />
            ) : (
              userKeycap.profileHeight || "Not specified"
            )}
          </li>
          <li>
            <strong>Designer:</strong>{" "}
            {isEditMode ? (
              <StyledInput
                type="text"
                value={editedDesigner}
                onChange={(event) => setEditedDesigner(event.target.value)}
                placeholder="Designer"
              />
            ) : (
              userKeycap.designer || "Not specified"
            )}
          </li>
          <li>
            <strong>Geekhack Thread:</strong>{" "}
            {isEditMode ? (
              <StyledInput
                type="url"
                value={editedGeekhackLink}
                onChange={(event) => setEditedGeekhackLink(event.target.value)}
                placeholder="Geekhack Link"
              />
            ) : userKeycap.geekhacklink ? (
              <ExternalLink href={userKeycap.geekhacklink} target="_blank">
                Visit Geekhack
              </ExternalLink>
            ) : (
              "Not specified"
            )}
          </li>
        </BoxContainer>
        <SectionHeading>Your Kits</SectionHeading>
        {isEditMode ? (
          <GridContainer>
            {kitsAvailable.map((kit) => {
              const wasPreviouslySelected = selectedKits.includes(kit.name);
              const isCurrentlySelected = editedKits.includes(kit.name);

              return (
                <KitCard
                  key={kit.name}
                  $isEditMode={isEditMode}
                  $isSelected={isCurrentlySelected}
                >
                  <input
                    type="checkbox"
                    checked={isCurrentlySelected}
                    onChange={() => handleKitSelection(kit.name)}
                  />
                  {kit.image ? (
                    <Image
                      src={kit.image}
                      alt={kit.name}
                      width={116}
                      height={67}
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{kit.name}</p>
                  {wasPreviouslySelected !== isCurrentlySelected && (
                    <small>
                      {isCurrentlySelected
                        ? "(Will be added)"
                        : "(Will be removed)"}
                    </small>
                  )}
                </KitCard>
              );
            })}
            <KitCard
              as="button"
              onClick={() => setIsAddKitModalOpen(true)}
              $isAddCard
            >
              <AddIcon />
              <p>Add Kit</p>
            </KitCard>
          </GridContainer>
        ) : selectedKits.length > 0 ? (
          <GridContainer>
            {kitsAvailable
              .filter((kit) => selectedKits.includes(kit.name))
              .map((kit) => (
                <KitCard
                  key={kit.name}
                  onClick={() =>
                    setSelectedImage({ url: kit.image, name: kit.name })
                  }
                >
                  {kit.image ? (
                    <Image
                      src={kit.image}
                      alt={kit.name}
                      width={116}
                      height={67}
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{kit.name}</p>
                </KitCard>
              ))}
          </GridContainer>
        ) : (
          <p>No kits selected.</p>
        )}

        {/* Opens image modal */}
        <KitImageModal
          open={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url}
          kitName={selectedImage?.name}
        />
        <SectionHeading>Choose 6 Colors</SectionHeading>
        <StyledInput
          as="select"
          onChange={handleColorSelect}
          value=""
          $maxWidth="430px"
        >
          <option value="" disabled>
            -- Choose up to 6 colors --
          </option>
          {colorOptions
            .filter((color) =>
              !isEditMode
                ? !selectedColors.includes(color.name)
                : !editedColors.includes(color.name)
            )
            .map((color) => (
              <option key={color.name} value={color.name}>
                {color.name} {color.emoji}
              </option>
            ))}
        </StyledInput>
        <SectionHeading>Selected Colors</SectionHeading>
        <ColorsContainer
          $itemCount={editedColors?.length || selectedColors?.length || 0}
        >
          {(isEditMode ? editedColors : selectedColors).length > 0
            ? (isEditMode ? editedColors : selectedColors).map((color) => {
                const colorData = colorOptions.find(
                  (option) => option.name === color
                );
                return (
                  <SelectedColorLi key={color} $bgColor={colorData?.name}>
                    {colorData?.emoji} {color}
                    {isEditMode && (
                      <RemoveColorButton
                        onClick={() => handleRemoveColor(color)}
                      >
                        x
                      </RemoveColorButton>
                    )}
                  </SelectedColorLi>
                );
              })
            : "<-- No colors selected -->"}
        </ColorsContainer>

        <Notes
          notes={isEditMode ? editedNotes : notes}
          isEditMode={isEditMode}
          onNotesUpdate={handleNotesUpdate}
        />

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
                setEditedColors([...selectedColors]);
                setEditedKits(userKeycap?.selectedKits || []);
                setEditedNotes([...notes]);
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

      <AddKitModal
        open={isAddKitModalOpen}
        onClose={() => setIsAddKitModalOpen(false)}
        onAddKit={handleAddKit}
      />
    </>
  );
}

const GridContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  width: auto;
  margin: 0 0 24px 0;
  max-width: 430px;
  background-color: transparent;

  @media (min-width: 430px) {
    max-width: 400px;
  }

  @media (min-width: 600px) {
    max-width: 600px;
  }
`;

const KitCard = styled.li`
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  opacity: ${(props) =>
    props.$isAddCard
      ? "1"
      : props.$isEditMode && !props.$isSelected
      ? "0.33"
      : "1"};
  transition: opacity 0.2s ease-in-out;
  border: none;
  min-height: ${(props) => (props.$isAddCard ? "87px" : "auto")};
  width: 100%;

  &:hover {
    opacity: ${(props) =>
      props.$isEditMode && !props.$isAddCard ? "0.8" : "1"};
    background: ${(props) => (props.$isAddCard ? "#f5f5f5" : "white")};
  }

  svg {
    color: #666;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    margin: 0;
    z-index: 1;
  }
`;

const ColorsContainer = styled.ul`
  display: ${(props) => (props.$itemCount > 1 ? "grid" : "flex")};
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
  background-color: #f9f9f9;
  padding: 10px;
  gap: 15px;
  width: 430px;
  margin: 0 0 24px 0;
  max-width: 430px;
  border: 1px solid #ccc;
  border-radius: 5px;

  /* For 0-1 items, center it in the container */
  ${(props) =>
    props.$itemCount <= 1 &&
    `
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}
`;

const SelectedColorLi = styled.li`
  background-color: #f9f9f9;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  border: 2px solid ${(props) => props.$bgColor || "black"};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 0;
`;

const RemoveColorButton = styled.button`
  background-color: #f9f9f9;
  color: black;
  font-size: 14px;
  margin-left: 5px;
  padding: 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff4d4d;
  }
`;
