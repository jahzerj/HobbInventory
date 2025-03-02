import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";

export default function InventoryCard({ data }) {
  const router = useRouter();

  return data.map((keycap) => (
    <StyledCard
      key={keycap._id}
      onClick={() =>
        router.push(`/inventories/keycaps/${keycap.keycapSetId._id}`)
      }
    >
      <h3>{keycap.keycapSetId?.name}</h3>
      {keycap.keycapSetId?.render_pics?.length > 0 ? (
        <ImageWrapper>
          <Image
            src={keycap.keycapSetId.render_pics[0]}
            alt={keycap.keycapSetId.name}
            layout="responsive"
            objectFit="cover"
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
  background-color: lightgrey;
  width: 80%;
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

  @media (min-width: 768px) {
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
