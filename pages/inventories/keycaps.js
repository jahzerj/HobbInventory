import Link from "next/link";
import AddButtton from "@/components/AddButtton";
import Modal from "@/components/Modal";
import { useState } from "react";

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keycap Inventory</h1>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        THIS TEXT APPEARS INSIDE MODAL
      </Modal>

      <AddButtton onOpenModal={() => setIsOpen(true)} />
    </>
  );
}
