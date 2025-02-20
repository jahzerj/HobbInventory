import Link from "next/link";

export default function Keyboards() {
  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keyboard Kit Inventory</h1>
      <p> You have no keyboard kits in your inventory!</p>
      <p> Click the ➕ button to add a keyboard kit</p>
    </>
  );
}
