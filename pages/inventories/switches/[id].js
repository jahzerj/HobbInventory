import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButton from "@/components/KeycapComponents/ConfirmEditButton";
import EditButton from "@/components/KeycapComponents/EditButton";
import useSWR from "swr";
import Image from "next/image";
import Notes from "@/components/SharedComponents/Notes";
import {
  DetailPageContainer,
  StyledLink,
  HeaderSection,
  HeaderImage,
  BoxContainer,
  AcceptCancelEditButtonContainer,
  StyledSpan,
  LoaderWrapper,
} from "@/components/SharedComponents/DetailPageStyles";

export default function SwitchDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: mxswitch, error: switchError } = useSWR(
    id ? `/api/inventories/switches/${id}` : null
  );

  const {
    data: userSwitches,
    error: userSwitchesError,
    mutate,
  } = useSWR(id ? `/api/inventories/userswitches?userId=guest_user` : null);

  const userSwitch = userSwitches?.find((item) => item._id === id);
  const notes = userSwitch?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  const [editedName, setEditedName] = useState(mxswitch?.name || "");
  const [editedManufacturer, setEditedManufacturer] = useState(
    mxswitch?.manufacturer || ""
  );
  const [editedImage, setEditedImage] = useState(mxswitch?.image || "");
  const [editedSwitchType, setEditedSwitchType] = useState(
    mxswitch?.switchType || ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    mxswitch?.quantity || ""
  );
  const [editedSpringWeight, setEditedSpringWeight] = useState(
    mxswitch?.springWeight || ""
  );
  const [editedTopMaterial, setEditedTopMaterial] = useState(
    mxswitch?.topMaterial || ""
  );
  const [editedBottomMaterial, setEditedBottomMaterial] = useState(
    mxswitch?.bottomMaterial || ""
  );
  const [editedStemMaterial, setEditedStemMaterial] = useState(
    mxswitch?.stemMaterial || ""
  );
  const [editedFactoryLubed, setEditedFactoryLubed] = useState(
    mxswitch?.factoryLubed || false
  );
  const [editedIsLubed, setEditedIsLubed] = useState(
    mxswitch?.isLubed || false
  );
  const [editedIsFilmed, setEditedIsFilmed] = useState(
    mxswitch?.isFilmed || false
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  const handleNotesUpdate = async (updatedNotes) => {
    await fetch("/api/inventories/userswitches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "guest_user",
        switchId: id,
        notes: updatedNotes,
      }),
    });
    await mutate();
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
          userId: "guest_user",
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
          notes: notes,
        }),
      });

      mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert(error.message);
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    setEditedName(mxswitch?.name || "");
    setEditedManufacturer(mxswitch?.manufacturer || "");
    setEditedImage(mxswitch?.image || "");
    setEditedSwitchType(mxswitch?.switchType || "");
    setEditedQuantity(mxswitch?.quantity || "");
    setEditedSpringWeight(mxswitch?.springWeight || "");
    setEditedTopMaterial(mxswitch?.topMaterial || "");
    setEditedBottomMaterial(mxswitch?.bottomMaterial || "");
    setEditedStemMaterial(mxswitch?.stemMaterial || "");
    setEditedFactoryLubed(mxswitch?.factoryLubed || false);
    setEditedIsLubed(mxswitch?.isLubed || false);
    setEditedIsFilmed(mxswitch?.isFilmed || false);
  };

  if (switchError || userSwitchesError) {
    return <p> Error loading switch details</p>;
  }

  if (!mxswitch) {
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
            <h1>Editing {mxswitch.name}</h1>
          ) : (
            <h1>
              {mxswitch.manufacturer} {mxswitch.name}
            </h1>
          )}
          <HeaderImage>
            <Image
              src={mxswitch.image}
              alt={mxswitch.name}
              height={200}
              width={200}
              priority
            />
          </HeaderImage>
        </HeaderSection>

        <BoxContainer>
          <li>
            <strong>Manufacturer:</strong> {mxswitch.manufacturer}
          </li>
          <li>
            <strong>Switch Type:</strong> {mxswitch.switchType}
          </li>
          <li>
            <strong>Quantity:</strong> {mxswitch.quantity}
          </li>
          <li>
            <strong>Spring Weight:</strong> {mxswitch.springWeight}
          </li>
          <li>
            <strong>Top Housing:</strong> {mxswitch.topMaterial}
          </li>
          <li>
            <strong>Bottom Housing:</strong> {mxswitch.bottomMaterial}
          </li>
          <li>
            <strong>Stem Material:</strong> {mxswitch.stemMaterial}
          </li>
          <li>
            <strong>Factory Lube:</strong> {mxswitch.factoryLubed}
          </li>
          <li>
            <strong>Hand Lubed:</strong> {mxswitch.isLubed}
          </li>
          <li>
            <strong>Filmed:</strong> {mxswitch.isFilmed}
          </li>
        </BoxContainer>

        <Notes
          notes={notes}
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
                setEditedName(mxswitch?.name || "");
                setEditedManufacturer(mxswitch?.manufacturer || "");
                setEditedImage(mxswitch?.image || "");
                setEditedSwitchType(mxswitch?.switchType || "");
                setEditedQuantity(mxswitch?.quantity || "");
                setEditedSpringWeight(mxswitch?.springWeight || "");
                setEditedTopMaterial(mxswitch?.topMaterial || "");
                setEditedBottomMaterial(mxswitch?.bottomMaterial || "");
                setEditedStemMaterial(mxswitch?.stemMaterial || "");
                setEditedFactoryLubed(mxswitch?.factoryLubed || false);
                setEditedIsLubed(mxswitch?.isLubed || false);
                setEditedIsFilmed(mxswitch?.isFilmed || false);
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
