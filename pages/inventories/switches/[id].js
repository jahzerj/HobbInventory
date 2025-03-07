import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { useState, useEffect } from "react";
import CloseButtonIcon from "@/components/icons/ClosebuttonIcon";
import ConfirmEditButton from "@/components/KeycapComponents/ConfirmEditButton";
import EditButton from "@/components/KeycapComponents/EditButton";
import useSWR from "swr";
import Image from "next/image";

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

  const userSwitch = userSwitches?.find((item) => item.switchId === id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  const handleSaveChanges = async () => {
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
  };

  if (switchError || userSwitchesError) {
    return <p> Error loading switch details</p>;
  }

  if (!mxswitch) {
    return <p>Loading...</p>;
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
                // setEditedColors([...selectedColors]);
                // setEditedKits(userKeycap?.selectedKits || []);
                // setEditedNotes([...notes]);
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

const DetailPageContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 60px;
`;
const StyledLink = styled(Link)`
  position: fixed;
  top: 5px;
  right: 5px;
  text-decoration: none;
  color: white;
  background-color: lightgrey;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  font-size: 24px;
  height: 45px;
  width: 45px;
  z-index: 1000;

  &:hover {
    background-color: darkgrey;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-top: 25px;
  align-items: center;
`;

const HeaderImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
`;

const AcceptCancelEditButtonContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: ${(props) =>
    props.$innerWidth > 400 && props.$isEditMode ? "" : "10px"};
  display: flex;
  gap: 10px;
  z-index: 1000;
  align-self: ${(props) =>
    props.$innerWidth > 600 && props.$isEditMode ? "center" : ""};
`;

const BoxContainer = styled.ul`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 90%;
  max-width: ${(props) => props.$maxWidth || "600px"};
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  list-style-type: none;
`;
