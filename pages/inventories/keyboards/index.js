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

  // Mock data - later this will come from your API
  const mockKeyboards = [
    {
      userId: "guest_user",
      name: "Dune65",
      designer: "Kenny from Grit",
      layout: "65%",
      blocker: "Winkeyless",
      photos: [
        "https://i.imgur.com/wg1Geuu.jpeg",
        "https://i.imgur.com/i6jpkss.jpeg",
      ],
      _id: "mock_id_1", // Added _id for the key prop
    },
  ];

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
        <h1>Keyboard Inventory</h1>

        <CardContainer $itemCount={mockKeyboards.length}>
          {mockKeyboards.length === 0 ? (
            <EmptyStateMessage>
              <p>No keyboards added yet!</p>
              <p>Click the ➕ button to add a keyboard to your inventory</p>
            </EmptyStateMessage>
          ) : (
            mockKeyboards.map((keyboard) => (
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
    blocker: "Winkeyless", // The post mentions WKL layout option
    switchType: "MX",
    plateMaterial: ["Aluminum", "Polycarbonate"],
    mounting: ["Leaf Spring Top Mount", "Gasket Mount"],
    typingAngle: "8°",
    frontHeight: "16.5mm",
    surfaceFinish: "Anodization",
    color: "Sand Gold", // One of their colorways
    weightMaterial: "Brass", // Post mentions brass bottom case
    buildWeight: "Not specified",
    photos: ["https://i.imgur.com/wg1Geuu.jpeg"],
    pcbOptions: {
      thickness: "1.6mm", // Specifically mentioned in post
      material: "FR4", // Mentioned as black core PCB
      backspace: ["Full BS", "Split BS"], // Both options supported per layout image
      layoutStandard: ["ISO", "ANSI"], // Both mentioned as supported
      leftShift: ["Split LS", "Full LS"],
      capslock: ["NormalCapslock", "SteppedCapslock"],
      rightShift: ["Split Right Shift", "Full Right Shift"],
      numpad: {
        enter: [], // No numpad on 65%
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: ["7u", "6.25u"], // Post mentions both WK (6.25U) and WKL (7U) options
      flexCuts: false, // Specifically mentioned as "without flex-cuts"
    },
    notes: [
      {
        _id: "note1",
        text: "Dual mounting style with Leaf Spring Top Mount and Gasket Mount options",
        timestamp: new Date(),
      },
    ],
  },
  {
    userId: "guest_user",
    name: "Derivative R1",
    designer: "JJWKB",
    layout: "60%",
    blocker: "Winkeyless", // Supports WK/WKL/HHKB
    switchType: "MX",
    plateMaterial: "Aluminum", // Full/Half aluminum options available
    mounting: [
      "O-ring Gasket Mount",
      "Top Mount",
      "Relief Mount",
      "Gasket Relief Mount",
    ],
    typingAngle: "6.5°", // Specified in technical details
    frontHeight: "22.4mm", // EKH mentioned in specs
    surfaceFinish: "Anodization",
    color: "Mercury", // One of the color options: Mercury (Silver)
    weightMaterial: "Stainless Steel 304", // Mentioned in materials
    buildWeight: "1200g", // ~1200g / 2.70 lbs built
    photos: ["https://i.imgur.com/example.jpg"], // You'll need to replace with actual image
    _id: "mock_id_2",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: ["Full BS", "Split BS"], // PCB supports split backspace
      layoutStandard: ["ANSI"], // Plates only support ANSI
      leftShift: ["Split LS", "Full LS"], // PCB supports split left shift
      capslock: ["NormalCapslock"],
      rightShift: ["Split Right Shift", "Full Right Shift"], // PCB supports split right shift
      numpad: {
        enter: [], // No numpad on 60%
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: ["7u"], // WK and WKL options available
      flexCuts: false,
    },
    notes: [
      {
        _id: "note2",
        text: "Features three mounting options and comes with 50A O-ring by default. Additional 30A and 70A O-rings available.",
        timestamp: new Date(),
      },
    ],
    keyboardKitId: "67af15ccba07c6a2595b0978",
  },
];
