import Link from "next/link";
import styled from "styled-components";
import MenuIcon from "@/components/icons/MenuIcon";
import KeyboardCard from "@/components/KeyboardComponents/KeyboardCard";
import AddButton from "@/components/KeyboardComponents/AddButton";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";
import { useState } from "react";

export default function Keyboards() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Simplified handlers - these will be expanded later
  const handleOpenModal = () => setIsOpen(true);
  const handleDeleteKeyboard = (keyboardId, event) => {
    event.stopPropagation();
    console.log("Delete keyboard:", keyboardId);
  };

  return (
    <>
      <HomeBurger href="/">
        <MenuIcon />
      </HomeBurger>

      <StyledContainer>
        <LongTitle>Keyboard Inventory</LongTitle>

        <CardContainer $itemCount={mockKeyboardData.length}>
          {mockKeyboardData.length === 0 ? (
            <EmptyStateMessage>
              <p>No keyboards added yet!</p>
              <p>Click the ➕ button to add a keyboard to your inventory</p>
            </EmptyStateMessage>
          ) : (
            mockKeyboardData.map((keyboard) => (
              <KeyboardCard
                key={keyboard._id}
                itemObj={keyboard}
                isEditMode={isEditMode}
                onDelete={handleDeleteKeyboard}
              />
            ))
          )}
        </CardContainer>
      </StyledContainer>

      <AddButton onOpenModal={handleOpenModal} isEditMode={isEditMode} />
      <EditInventoryButton
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode((prev) => !prev)}
      />
    </>
  );
}

const StyledContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;
`;

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 50px;

  @media (min-width: 900px) {
    /* Only use grid layout when we have multiple items */
    display: ${(props) => (props.$itemCount > 1 ? "grid" : "flex")};
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 90%;
    max-width: 1200px;
    margin: 20px auto 0;
    justify-content: center;
    align-items: ${(props) => (props.$itemCount > 1 ? "start" : "center")};
    flex-direction: column;
  }
`;

const HomeBurger = styled(Link)`
  position: fixed;
  display: flex;
  background-color: #007bff;
  height: 40px;
  width: 40px;
  color: white;
  left: 10px;
  top: 8px;
  z-index: 1000;
  border-radius: 10px;
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #f8f8f8;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  p:first-child {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  p:last-child {
    color: #666;
  }
`;
const LongTitle = styled.h1`
  @media screen and (max-width: 390px) {
    font-size: 28px;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledSpan = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Mock data for keyboard card development
export const mockKeyboardData = [
  {
    userId: "guest_user",
    _id: "mock_id_1",
    name: "Dune65",
    designer: "Kenny from Grit",
    layout: "65%",
    renders: [
      "https://i.imgur.com/wg1Geuu.jpeg",
      "https://i.imgur.com/i6jpkss.jpeg",
    ],
    blocker: "Winkeyless",
    switchType: "MX",
    plateMaterial: ["Aluminum", "Polycarbonate"],
    mounting: ["Leaf Spring Top Mount", "Gasket Mount"],
    typingAngle: "8°",
    frontHeight: "16.5mm",
    surfaceFinish: "Anodization",
    color: "Sand Gold",
    weightMaterial: "Brass",
    buildWeight: "Not specified",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: ["Full BS", "Split BS"],
      layoutStandard: ["ISO", "ANSI"],
      leftShift: ["Split LS", "Full LS"],
      capslock: ["NormalCapslock", "SteppedCapslock"],
      rightShift: ["Split Right Shift", "Full Right Shift"],
      numpad: {
        enter: [],
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: ["7u", "6.25u"],
      flexCuts: false,
    },
    builds: [
      {
        name: "Initial Build",
        plate: "Aluminum",
        switches: [
          {
            switchId: "some_switch_objectid",
            quantity: 67,
            position: "All positions",
          },
        ],
        stabilizers: {
          type: "Screw-in",
          brand: "Durock V2",
          lubed: true,
        },
        modifications: [
          {
            type: "Initial Build",
            description: "Stock configuration",
            date: "2024-03-19T00:00:00.000Z",
          },
        ],
        photos: ["https://i.imgur.com/EbIdAxU.jpeg"],
        active: true,
        buildDate: "2024-03-19T00:00:00.000Z",
      },
    ],
  },
  {
    userId: "guest_user",
    _id: "mock_id_2",
    name: "Derivative R1",
    designer: "JJWKB",
    layout: "60%",
    renders: [
      "https://i.imgur.com/KhTVEmZ.png",
      "https://i.imgur.com/2UErHhw.png",
      "https://i.imgur.com/mU4WF4g.png",
    ],
    blocker: "Winkey",
    switchType: "MX",
    plateMaterial: ["Aluminum", "Polycarbonate"],
    mounting: [
      "O-ring Gasket Mount",
      "Top Mount",
      "Relief Mount",
      "Gasket Relief Mount",
    ],
    typingAngle: "6.5°",
    frontHeight: "22.4mm",
    surfaceFinish: "Anodization",
    color: "Amphibian",
    weightMaterial: "Stainless Steel 304",
    buildWeight: "1200g",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: ["Full BS", "Split BS"],
      layoutStandard: ["ANSI"],
      leftShift: ["Split LS", "Full LS"],
      rightShift: ["Split Right Shift", "Full Right Shift"],
      numpad: {
        enter: [],
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: ["7u"],
      flexCuts: false,
    },
    notes: [
      {
        _id: "note2",
        text: "Features three mounting options and comes with 50A O-ring by default. Additional 30A and 70A O-rings available.",
        timestamp: "2024-03-19T00:00:00.000Z",
      },
    ],
    builds: [
      {
        name: "Initial Build",
        plate: "Aluminum",
        switches: [
          {
            switchId: "some_switch_objectid",
            quantity: 61,
            position: "All positions",
          },
        ],
        stabilizers: {
          type: "Screw-in",
          brand: "Durock V2",
          lubed: true,
        },
        modifications: [
          {
            type: "Initial Build",
            description: "Stock configuration",
            date: "2024-03-19T00:00:00.000Z",
          },
        ],
        photos: ["https://i.imgur.com/YbxAoDS.png"],
        active: true,
        buildDate: "2024-03-19T00:00:00.000Z",
      },
    ],
  },
];
