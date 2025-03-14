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
  ButtonContainer,
} from "@/components/SharedComponents/DetailPageStyles";

export default function KeyCapDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: keycaps, error: keycapError } = useSWR(
    id ? `/api/inventories/keycaps/${id}` : null
  );

  const {
    data: userKeycaps,
    error: userKeycapError,
    mutate,
  } = useSWR(id ? `/api/inventories/userkeycaps?userId=guest_user` : null);

  const userKeycap = userKeycaps?.find((item) => item.keycapSetId?._id === id);

  const selectedColors = userKeycap?.selectedColors ?? [];
  const notes = userKeycap?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);

  const [editedKits, setEditedKits] = useState(userKeycap?.selectedKits || []);
  const [editedColors, setEditedColors] = useState(selectedColors || []);
  const [editedNotes, setEditedNotes] = useState(notes || []);
  const [innerWidth, setInnerWidth] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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
    if (currentColors.length >= 4) {
      return { error: "Maximum 4 colors allowed" };
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
    if (selectedColors.length >= 4) {
      return alert("You can only selected up to 4 colors.");
    }

    const updatedColors = [...selectedColors, selectedColor];

    await fetch("/api/inventories/userkeycaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest_user",
        keycapSetId: id,
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
          userId: "guest_user",
          keycapSetId: id,
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
        userId: "guest_user",
        keycapSetId: id,
        selectedKits: editedKits,
        selectedColors: editedColors,
        notes: editedNotes,
      }),
    });
    await mutate();
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setEditedColors([...selectedColors]);
    setEditedKits(userKeycap?.selectedKits || []);
    setEditedNotes([...notes]);
    setIsEditMode(false);
  };

  if (keycapError || userKeycapError) {
    return <p>Error loading keycap details.</p>;
  }

  if (!keycaps || !userKeycaps) {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  const kitsAvailable = keycaps.kits?.flatMap((kit) => kit.price_list) ?? [];
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
            <h1>Editing {keycaps.name}</h1>
          ) : (
            <h1>{keycaps.name}</h1>
          )}
          {keycaps.render_pics?.length > 0 && (
            <HeaderImage>
              <Image
                src={keycaps.render_pics[0]}
                alt={keycaps.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </HeaderImage>
          )}
        </HeaderSection>
        <BoxContainer>
          <li>
            <strong>Manufacturer:</strong> {keycaps.keycapstype}
          </li>
          <li>
            <strong>Profile:</strong> {keycaps.profile}
          </li>
          <li>
            <strong>Designer:</strong> {keycaps.designer}
          </li>
          <li>
            <strong>Geekhack Thread:</strong>{" "}
            <ExternalLink href={keycaps.link} target="_blank">
              Visit Geekhack
            </ExternalLink>
          </li>
        </BoxContainer>
        <h3>Your Kits</h3>
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
                  {kit.pic ? (
                    <Image
                      src={kit.pic}
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
          </GridContainer>
        ) : selectedKits.length > 0 ? (
          <GridContainer>
            {kitsAvailable
              .filter((kit) => selectedKits.includes(kit.name))
              .map((kit) => (
                <KitCard
                  key={kit.name}
                  onClick={() =>
                    setSelectedImage({ url: kit.pic, name: kit.name })
                  }
                >
                  {kit.pic ? (
                    <Image
                      src={kit.pic}
                      alt={kit.name}
                      width={116}
                      height={67}
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
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url}
          kitName={selectedImage?.name}
        />
        <h3>Choose 4 Colors</h3>
        <StyledInput
          as="select"
          onChange={handleColorSelect}
          value=""
          $maxWidth="430px"
        >
          <option value="" disabled>
            -- Choose up to 4 colors --
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
        <h3> Selected Colors</h3>
        <ColorsContainer>
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
            : "No colors selected"}
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
    </>
  );
}

const GridContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  width: auto;
  margin: 10px 0;
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
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  opacity: ${(props) =>
    props.$isEditMode && !props.$isSelected ? "0.33" : "1"};
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: ${(props) => (props.$isEditMode ? "0.8" : "1")};
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  background-color: #f9f9f9;
  padding: 10px;
  gap: 15px;
  width: auto;
  margin: 10px 0;
  max-width: 365px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
