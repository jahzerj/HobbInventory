import Link from "next/link";
import styled from "styled-components";

const StyledButton = styled(button)`
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
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
  &: hover {
    background-color: rgb(37, 17, 216);
  }
`;

export default function HomePage() {
  return (
    <div>
      <StyledButton>Keycap Inventory</StyledButton>
    </div>
  );
}
