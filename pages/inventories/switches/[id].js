import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButton from "@/components/SharedComponents/ConfirmEditButton";
import EditButton from "@/components/SharedComponents/EditButton";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import Notes from "@/components/SharedComponents/Notes";
import {
  DetailPageContainer,
  StyledLink,
  HeaderSection,
  BoxContainer,
  AcceptCancelEditButtonContainer,
  StyledSpan,
  LoaderWrapper,
  StyledInput,
} from "@/components/SharedComponents/DetailPageStyles";
import { useSession } from "next-auth/react";

export default function SwitchDetail() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { id } = router.query;

  const {
    data: userSwitches,
    error: userSwitchesError,
    mutate,
  } = useSWR(id ? "/api/inventories/userswitches" : null);

  const userSwitch = userSwitches?.find((item) => item._id === id);
  const notes = userSwitch?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  const [editedName, setEditedName] = useState(userSwitch?.name || "");
  const [editedManufacturer, setEditedManufacturer] = useState(
    userSwitch?.manufacturer || ""
  );
  const [editedImage, setEditedImage] = useState(userSwitch?.image || "");
  const [editedSwitchType, setEditedSwitchType] = useState(
    userSwitch?.switchType || ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    userSwitch?.quantity || ""
  );
  const [editedSpringWeight, setEditedSpringWeight] = useState(
    userSwitch?.springWeight || ""
  );
  const [editedTopMaterial, setEditedTopMaterial] = useState(
    userSwitch?.topMaterial || ""
  );
  const [editedBottomMaterial, setEditedBottomMaterial] = useState(
    userSwitch?.bottomMaterial || ""
  );
  const [editedStemMaterial, setEditedStemMaterial] = useState(
    userSwitch?.stemMaterial || ""
  );
  const [editedFactoryLubed, setEditedFactoryLubed] = useState(
    userSwitch?.factoryLubed || false
  );
  const [editedIsLubed, setEditedIsLubed] = useState(
    userSwitch?.isLubed || false
  );
  const [editedIsFilmed, setEditedIsFilmed] = useState(
    userSwitch?.isFilmed || false
  );

  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (userSwitch) {
      setEditedName(userSwitch.name || "");
      setEditedManufacturer(userSwitch.manufacturer || "");
      setEditedImage(userSwitch.image || "");
      setEditedSwitchType(userSwitch.switchType || "");
      setEditedQuantity(userSwitch.quantity || "");
      setEditedSpringWeight(userSwitch.springWeight || "");
      setEditedTopMaterial(userSwitch.topMaterial || "");
      setEditedBottomMaterial(userSwitch.bottomMaterial || "");
      setEditedStemMaterial(userSwitch.stemMaterial || "");
      setEditedFactoryLubed(userSwitch.factoryLubed || false);
      setEditedIsLubed(userSwitch.isLubed || false);
      setEditedIsFilmed(userSwitch.isFilmed || false);
      setLocalNotes(userSwitch.notes ? [...userSwitch.notes] : []);
    }
  }, [userSwitch]);

  const handleNotesUpdate = (updatedNotes) => {
    setLocalNotes(updatedNotes);
  };

  const validateSwitchData = (data) => {
    const requiredFields = ["name", "manufacturer", "image", "switchType"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  };

  const handleSaveChanges = async () => {
    if (
      !editedName ||
      !editedManufacturer ||
      !editedImage ||
      !editedSwitchType
    ) {
      alert("Name, Manufacturer, Switch Type, and Image are required.");
      return;
    }

    try {
      validateSwitchData({
        name: editedName,
        manufacturer: editedManufacturer,
        image: editedImage,
        switchType: editedSwitchType,
      });
      await fetch("/api/inventories/userswitches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          switchId: id,
          name: editedName,
          manufacturer: editedManufacturer,
          image: editedImage,
          switchType: editedSwitchType,
          quantity: editedQuantity,
          springWeight: editedSpringWeight,
          topMaterial: editedTopMaterial,
          bottomMaterial: editedBottomMaterial,
          stemMaterial: editedStemMaterial,
          factoryLubed: editedFactoryLubed,
          isLubed: editedIsLubed,
          isFilmed: editedIsFilmed,
          notes: localNotes,
        }),
      });

      await mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert(error.message);
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    if (userSwitch) {
      setEditedName(userSwitch.name || "");
      setEditedManufacturer(userSwitch.manufacturer || "");
      setEditedImage(userSwitch.image || "");
      setEditedSwitchType(userSwitch.switchType || "");
      setEditedQuantity(userSwitch.quantity || "");
      setEditedSpringWeight(userSwitch.springWeight || "");
      setEditedTopMaterial(userSwitch.topMaterial || "");
      setEditedBottomMaterial(userSwitch.bottomMaterial || "");
      setEditedStemMaterial(userSwitch.stemMaterial || "");
      setEditedFactoryLubed(userSwitch.factoryLubed || false);
      setEditedIsLubed(userSwitch.isLubed || false);
      setEditedIsFilmed(userSwitch.isFilmed || false);
      setLocalNotes(userSwitch.notes ? [...userSwitch.notes] : []);
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

  if (userSwitchesError) return <p> Error loading switch details</p>;
  if (!userSwitch) {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  return (
    <>
      <DetailPageContainer>
        {!isEditMode && (
          <StyledLink
            href="/inventories/switches"
            aria-label="Close Details Page"
          >
            <CloseButtonIcon />
          </StyledLink>
        )}

        <HeaderSection>
          {isEditMode ? (
            <h1>Editing {userSwitch.name}</h1>
          ) : (
            <h1>
              {userSwitch.manufacturer} {userSwitch.name}
            </h1>
          )}
          <SwitchHeaderImage>
            <Image
              src={userSwitch.image}
              alt={userSwitch.name}
              fill
              sizes="(max-width: 600px) 200px, 300px"
              style={{ objectFit: "cover" }}
              priority
            />
          </SwitchHeaderImage>
        </HeaderSection>

        <h3>Details</h3>
        <BoxContainer>
          {isEditMode ? (
            <>
              <li>
                <strong>Manufacturer:</strong>
                <StyledInput
                  type="text"
                  value={editedManufacturer}
                  onChange={(event) =>
                    setEditedManufacturer(event.target.value)
                  }
                />
              </li>
              <li>
                <strong>Switch Type:</strong>
                <StyledInput
                  as="select"
                  value={editedSwitchType}
                  onChange={(event) => setEditedSwitchType(event.target.value)}
                >
                  <option value="">-- Select Type --</option>
                  <option value="linear">Linear</option>
                  <option value="tactile">Tactile</option>
                  <option value="clicky">Clicky</option>
                </StyledInput>
              </li>
              <li>
                <strong>Quantity:</strong>
                <StyledInput
                  type="number"
                  min="0"
                  max="9999"
                  value={editedQuantity}
                  onChange={(event) => {
                    // Ensure value is not negative and not too large
                    const value = Math.min(
                      9999,
                      Math.max(0, parseInt(event.target.value) || 0)
                    );
                    setEditedQuantity(value.toString());
                  }}
                />
              </li>
              <li>
                <strong>Spring Weight:</strong>
                <StyledInput
                  type="text"
                  value={editedSpringWeight}
                  onChange={(event) =>
                    setEditedSpringWeight(event.target.value)
                  }
                />
              </li>
              <li>
                <strong>Top Housing:</strong>
                <StyledInput
                  type="text"
                  value={editedTopMaterial}
                  onChange={(event) => setEditedTopMaterial(event.target.value)}
                />
              </li>
              <li>
                <strong>Bottom Housing:</strong>
                <StyledInput
                  type="text"
                  value={editedBottomMaterial}
                  onChange={(event) =>
                    setEditedBottomMaterial(event.target.value)
                  }
                />
              </li>
              <li>
                <strong>Stem Material:</strong>
                <StyledInput
                  type="text"
                  value={editedStemMaterial}
                  onChange={(event) =>
                    setEditedStemMaterial(event.target.value)
                  }
                />
              </li>
              <li>
                <strong>Factory Lube:</strong>
                <StyledCheckbox>
                  <input
                    type="checkbox"
                    id="factoryLubed"
                    checked={editedFactoryLubed}
                    onChange={(event) =>
                      setEditedFactoryLubed(event.target.checked)
                    }
                  />
                  <label htmlFor="factoryLubed">
                    {editedFactoryLubed ? "Yes" : "No"}
                  </label>
                </StyledCheckbox>
              </li>
              <li>
                <strong>Hand Lubed:</strong>
                <StyledCheckbox>
                  <input
                    type="checkbox"
                    id="handLubed"
                    checked={editedIsLubed}
                    onChange={(event) => setEditedIsLubed(event.target.checked)}
                  />
                  <label htmlFor="handLubed">
                    {editedIsLubed ? "Yes" : "No"}
                  </label>
                </StyledCheckbox>
              </li>
              <li>
                <strong>Filmed:</strong>
                <StyledCheckbox>
                  <input
                    type="checkbox"
                    id="filmed"
                    checked={editedIsFilmed}
                    onChange={(event) =>
                      setEditedIsFilmed(event.target.checked)
                    }
                  />
                  <label htmlFor="filmed">
                    {editedIsFilmed ? "Yes" : "No"}
                  </label>
                </StyledCheckbox>
              </li>
            </>
          ) : (
            <>
              <li>
                <strong>Manufacturer:</strong> {userSwitch.manufacturer}
              </li>
              <li>
                <strong>Switch Type:</strong> {userSwitch.switchType}
              </li>
              <li>
                <strong>Quantity:</strong> {userSwitch.quantity}
              </li>
              <li>
                <strong>Spring Weight:</strong> {userSwitch.springWeight}
              </li>
              <li>
                <strong>Top Housing:</strong> {userSwitch.topMaterial}
              </li>
              <li>
                <strong>Bottom Housing:</strong> {userSwitch.bottomMaterial}
              </li>
              <li>
                <strong>Stem Material:</strong> {userSwitch.stemMaterial}
              </li>
              <li>
                <strong>Factory Lube:</strong>
                {userSwitch.factoryLubed ? "Yes" : "No"}
              </li>
              <li>
                <strong>Hand Lubed:</strong> {userSwitch.isLubed ? "Yes" : "No"}
              </li>
              <li>
                <strong>Filmed:</strong> {userSwitch.isFilmed ? "Yes" : "No"}
              </li>
            </>
          )}
        </BoxContainer>

        <Notes
          notes={localNotes}
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
                setEditedName(userSwitch?.name || "");
                setEditedManufacturer(userSwitch?.manufacturer || "");
                setEditedImage(userSwitch?.image || "");
                setEditedSwitchType(userSwitch?.switchType || "");
                setEditedQuantity(userSwitch?.quantity || "");
                setEditedSpringWeight(userSwitch?.springWeight || "");
                setEditedTopMaterial(userSwitch?.topMaterial || "");
                setEditedBottomMaterial(userSwitch?.bottomMaterial || "");
                setEditedStemMaterial(userSwitch?.stemMaterial || "");
                setEditedFactoryLubed(userSwitch?.factoryLubed || false);
                setEditedIsLubed(userSwitch?.isLubed || false);
                setEditedIsFilmed(userSwitch?.isFilmed || false);
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

const SwitchHeaderImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (min-width: 400px) {
    width: 250px;
    height: 250px;
  }
  @media (min-width: 600px) {
    width: 300px;
    height: 300px;
  }
`;

const StyledCheckbox = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;

  input {
    margin-right: 5px;
  }

  label {
    font-size: 14px;
  }
`;
