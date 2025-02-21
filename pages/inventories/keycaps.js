import Link from "next/link";
import AddButtton from "@/components/AddButtton";
import Modal from "@/components/Modal";
import { useState } from "react";

const BUTTON_WRAPPER_STYLES = {
  position: "relative",
  zIndex: 1,
};

export default function Keycaps() {
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

      <AddButtton onOpenModal={() => setIsOpen(true)} />
    </>
  );
}
