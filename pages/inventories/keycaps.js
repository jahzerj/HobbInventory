import InventoryCard from "@/components/InventoryCard";
import Link from "next/link";
import AddButtton from "@/components/AddButtton";
import Modal from "@/components/Modal";
import { useState } from "react";
import styled from "styled-components";

const BUTTON_WRAPPER_STYLES = {
  position: "relative",
  zIndex: 1,
};

const OTHER_CONTENT_STYLES = {
  position: "relative",
  zIndex: 2,
  backgroundColor: "orange",
  padding: "10px",
};


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keycap Inventory</h1>
      <div style={BUTTON_WRAPPER_STYLES}>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
          THIS TEXT APPEARS INSIDE MODAL
        </Modal>
      </div>
      <div style={OTHER_CONTENT_STYLES}>Other Content</div>
      <AddButtton />
      <StyledContainer>
        <h1>Keycap Inventory</h1>
        {data?.length ? (
          <InventoryCard data={data} />
        ) : (
          <>
            <p> You have no keycaps in your inventory!</p>
            <p> Click the ➕ button to add a keycap set</p>
          </>
        )}
      </StyledContainer>
    </>
  );
}

const data = [
  {
    _id: {
      $oid: "67af15ccba07c6a2595b086d",
    },
    name: 1520,
    keycapstype: "GMK",
    designer: "hark",
    profile: "1-1-2-3-4-4",
    link: "https://geekhack.org/index.php?topic=122578.0",
    render_pics: [
      "https://novelkeys.com/cdn/shop/files/CYL_1520_Quetzal_Wide_1512x.png",
    ],
    kits: {
      $oid: "67b72605f6356be9084cae6b",
    },
  },
  {
    _id: {
      $oid: "67af15ccba07c6a2595b0898",
    },
    name: "Botanical R2",
    keycapstype: "GMK",
    designer: "Hazzy",
    profile: "1-1-2-3-4-4",
    render_pics: [
      "https://cdn.shopify.com/s/files/1/0054/0878/4458/products/GMK_Botanical_2_OMNI_Bauer_X_001V2_dist_800x.jpg",
    ],
    kits: {
      $oid: "67b72605f6356be9084cae96",
    },
  },
  {
    _id: {
      $oid: "67af15ccba07c6a2595b08d3",
    },
    name: "Foundation",
    keycapstype: "GMK",
    designer: "HungHingDaiLo",
    profile: "1-1-2-3-4-4",
    link: "https://geekhack.org/index.php?topic=113538.0",
    render_pics: ["https://i.imgur.com/FkJ57Po.png"],
    kits: {
      $oid: "67b72605f6356be9084caed1",
    },
  },
];
