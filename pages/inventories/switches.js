import Link from "next/link";

export default function Switches() {
  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Switch Inventory</h1>
      <p> You have no switches in your inventory!</p>
      <p> Click the ➕ button to add switches</p>
    </>
  );
}
