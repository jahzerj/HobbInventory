import Link from "next/link";
import styled from "styled-components";

const StyledButton1 = styled.button`
  box-shadow: 6px 4px 6px 0px rgb(194, 38, 27);
  background-color: rgb(190, 88, 47);
  border-radius: 21px;
  border: 2px solid rgb(171, 24, 24);
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  font-weight: bold;
  padding: 32px 76px;
  height: 250px;
  width: 250px;
  margin: 10px;
  text-decoration: none;
  text-shadow: 0px 1px 0px rgb(102, 48, 39);
  &: hover {
    background-color: rgb(216, 17, 156);
  }
`;

const StyledButton3 = styled.button`
  box-shadow: 6px 4px 6px 0px rgb(27, 30, 194);
  background-color: rgb(68, 157, 199);
  border-radius: 21px;
  border: 2px solid rgb(24, 63, 171);
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  font-weight: bold;
  padding: 32px 46px;
  height: 250px;
  width: 250px;
  margin: 10px;
  text-decoration: none;
  text-shadow: 0px 1px 0px rgb(43, 39, 102);
  &: hover {
    background-color: rgb(55, 201, 238);
  }
`;

const StyledButton2 = styled.button`
  box-shadow: 6px 4px 6px 0px #3dc21b;
  background-color: #44c767;
  border-radius: 21px;
  border: 2px solid #18ab29;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  font-weight: bold;
  padding: 32px 76px;
  height: 250px;
  width: 250px;
  margin: 10px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
  &: hover {
    background-color: rgb(103, 236, 132);
  }
`;
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

export default function HomePage() {
  return (
    <>
      <StyledContainer>
        <StyledButton1>Keycap Inventory</StyledButton1>
        <StyledButton2>Switch Inventory</StyledButton2>
        <StyledButton3>Keyboard Kit Inventory</StyledButton3>
      </StyledContainer>
    </>
  );
}
