import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";

export default function InventoryCard({ data, isEditMode, onDelete }) {
  const router = useRouter();

  return data.map((keycap) => (
    <StyledCard
      key={keycap._id}
      onClick={() =>
        router.push(`/inventories/keycaps/${keycap.keycapSetId._id}`)
      }
    >
      {isEditMode ? (
        <DeleteInventoryItemButton
          onClick={(event) => onDelete(keycap.keycapSetId._id, event)}
          aria-label="Delete Keycap Button"
        >
          <DeleteIcon />
        </DeleteInventoryItemButton>
      ) : (
        ""
      )}
      <h3>{keycap.keycapSetId?.name}</h3>
      {keycap.keycapSetId?.render_pics?.length > 0 ? (
        <ImageWrapper>
          <Image
            src={keycap.keycapSetId.render_pics[0]}
            alt={keycap.keycapSetId.name}
            width={320}
            height={180}
            priority
          />
        </ImageWrapper>
      ) : (
        <p> No Image available</p>
      )}
    </StyledCard>
  ));
}

const StyledCard = styled.li`
  position: relative;
  background-color: lightgrey;
  width: 80%;
  min-width: 350px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin: 10px;
  height: 250px;
  justify-content: space-around;
  box-shadow: 10px 5px 5px grey;
  cursor: pointer;

  @media (min-width: 600px) {
    width: 50%;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  aspect-ratio: 16 / 9;

  @media (max-width: 320px) {
    width: 90%;
  }
`;

const DeleteInventoryItemButton = styled.button`
  display: flex;
  position: absolute;
  top: 5%;
  right: 5%;
  color: white;
  background: #ff4d4d;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
