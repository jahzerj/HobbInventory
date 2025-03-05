import Link from "next/link";
import AddButtton from "@/components/SwitchComponents/AddButton";
import styled from "styled-components";
import { useState } from "react";
import Modal from "@/components/SwitchComponents/Modal";

export default function Switches() {
  const [isOpen, setIsOpen] = useState(false);
  const userId = "guest_user";

  return (
    <>
      <Link href="/"> ← Back to Hub</Link>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} />
      <h1>Switches Inventory</h1>
      
      <AddButtton onOpenModal={() => setIsOpen(true)} />
    </>
  );
}

const StyledContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
