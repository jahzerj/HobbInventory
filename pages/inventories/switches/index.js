import Link from "next/link";
import AddButtton from "@/components/SwitchComponents/AddButton";
import styled from "styled-components";

export default function Switches() {
  return (
    <>
      <Link href="/"> ← Back to Hub</Link>
      <h1>Switches Inventory</h1>
      <AddButtton />
    </>
  );
}

const StyledContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
