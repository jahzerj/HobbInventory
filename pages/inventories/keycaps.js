import InventoryCard from "@/components/InventoryCard";
import Link from "next/link";
import AddButtton from "@/components/AddButtton";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const userId = "guest_user";

  //Fetch user keycaps
  const { data, error, mutate } = useSWR(
    `/api/inventories/userkeycaps?userId=${userId}`
  );

  useEffect(() => {
    if (data) {
      setUserKeycaps(data.map((keycap) => keycap._id));
    }
  }, [data]);

  //Function for adding keycap ID to the userKeycaps array
  const handleAddKeycap = async (keycapId) => {
    if (!userKeycaps.includes(keycapId)) {
      const updatedKeycaps = [...userKeycaps, keycapId];
      setUserKeycaps(updatedKeycaps);

      //Save the update in DB
      await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keycapId }),
      });
    }
    console.log(userKeycaps); //Console log the new userKeycaps
    mutate();
  };

  if (error) return <p> Error loading keycaps...</p>;
  if (!data) return <p> Loading keycaps....</p>;

  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keycap Inventory</h1>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onAddKeycap={handleAddKeycap}
      />

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
      <AddButtton onOpenModal={() => setIsOpen(true)} />
    </>
  );
}

// const userKeycapsIDs = [
//   "67af15ccba07c6a2595b086d",
//   "67af15ccba07c6a2595b0898",
//   "67af15ccba07c6a2595b08d3",
// ];

// const data = [
//   {
//     _id: {
//       $oid: "67af15ccba07c6a2595b086d",
//     },
//     name: 1520,
//     keycapstype: "GMK",
//     designer: "hark",
//     profile: "1-1-2-3-4-4",
//     link: "https://geekhack.org/index.php?topic=122578.0",
//     render_pics: [
//       "https://novelkeys.com/cdn/shop/files/CYL_1520_Quetzal_Wide_1512x.png",
//     ],
//     kits: {
//       $oid: "67b72605f6356be9084cae6b",
//     },
//   },
//   {
//     _id: {
//       $oid: "67af15ccba07c6a2595b0898",
//     },
//     name: "Botanical R2",
//     keycapstype: "GMK",
//     designer: "Hazzy",
//     profile: "1-1-2-3-4-4",
//     render_pics: [
//       "https://cdn.shopify.com/s/files/1/0054/0878/4458/products/GMK_Botanical_2_OMNI_Bauer_X_001V2_dist_800x.jpg",
//     ],
//     kits: {
//       $oid: "67b72605f6356be9084cae96",
//     },
//   },
//   {
//     _id: {
//       $oid: "67af15ccba07c6a2595b08d3",
//     },
//     name: "Foundation",
//     keycapstype: "GMK",
//     designer: "HungHingDaiLo",
//     profile: "1-1-2-3-4-4",
//     link: "https://geekhack.org/index.php?topic=113538.0",
//     render_pics: ["https://i.imgur.com/FkJ57Po.png"],
//     kits: {
//       $oid: "67b72605f6356be9084caed1",
//     },
//   },
// ];
