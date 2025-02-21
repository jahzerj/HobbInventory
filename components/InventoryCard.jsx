import styled from "styled-components";

const StyledCard = styled.div`
  background-color: lightgreen;
  width: 60%;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin: 10px;
  height: 250px;
  justify-content: space-between;
  box-shadow: 10px 5px 5px darkgreen;
`;

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 5px;
`;

export default function InventoryCard({ data }) {
  return (
    <>
      {data.map((keycap) => (
        <StyledCard key={keycap._id}>
          <h3>CYL {keycap.name}</h3>
          <StyledDetails>
            <p>Manufacturer: {keycap.keycapstype}</p>
            <p>Profile: {keycap.profile}</p>
            <p>Designer: {keycap.designer}</p>
          </StyledDetails>
        </StyledCard>
      ))}
    </>
  );
}
