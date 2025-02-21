import Link from "next/link";
import AddButtton from "@/components/AddButtton";
import Modal from "@/components/Modal";
import { useState } from "react";

const BUTTON_WRAPPER_STYLES = {
  position: "relative",
  zIndex: 1,
};

const OTHER_CONTENT_STYLES = {
  position: "relative",
  zIndex: 2,
  backgroundColor: "orange",
  padding: "10px",
};

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keycap Inventory</h1>
      <div style={BUTTON_WRAPPER_STYLES}>
        <button onClick={() => setIsOpen(true)}> Open Modal </button>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
          Fancy Modal
        </Modal>
      </div>
      <div style={OTHER_CONTENT_STYLES}>Other Content</div>
      <AddButtton />
    </>
  );
}
