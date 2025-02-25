import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";

const StyledCard = styled.div`
  background-color: lightgreen;
  width: 50%;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin: 10px;
  height: 250px;
  justify-content: space-around;
  box-shadow: 10px 5px 5px darkgreen;
  cursor: pointer;
`;

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 5px;
`;

const ImageWrapper = styled.div`
  width: 320px;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
`;

export default function InventoryCard({ data }) {
  const router = useRouter();

  return data.map((keycap) => (
    <StyledCard
      key={keycap._id}
      onClick={() => router.push(`/inventories/keycaps/${keycap._id}`)}
    >
      <h3>{keycap.name}</h3>
      <StyledDetails>
        {keycap.render_pics?.length > 0 && (
          <ImageWrapper>
            <Image
              src={keycap.render_pics[0]}
              alt={keycap.name}
              layout="fill"
              objectFit="cover"
            />
          </ImageWrapper>
        )}
      </StyledDetails>
    </StyledCard>
  ));
}
