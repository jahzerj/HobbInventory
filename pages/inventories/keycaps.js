import Dropdown from "@/components/Dropdown.js";
import Link from "next/link";

export default function Keycaps() {
  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keycap Inventory</h1>
      <p> You have no keycaps in your inventory!</p>
      <p> Click the ➕ button to add a keycap set</p>
      <Dropdown />
    </>
  );
}
