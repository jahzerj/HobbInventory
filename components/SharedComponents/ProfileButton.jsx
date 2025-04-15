import Link from "next/link";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserIcon from "@/components/icons/UserIcon";

export default function ProfileButton() {
  const { data: session, status } = useSession();

  // Don't render if loading or not authenticated
  if (status === "loading" || !session) {
    return null;
  }

  return (
    <StyledProfileLink href="/profile" aria-label="View Profile">
      {session.user?.image ? (
        <Image
          src={session.user.image}
          alt="User Avatar"
          width={40} // Match container size
          height={40} // Match container size
          priority // Load avatar quickly
        />
      ) : (
        <UserIcon /> // Default icon if no image
      )}
    </StyledProfileLink>
  );
}

const StyledProfileLink = styled(Link)`
  position: fixed;
  top: 8px;
  right: 10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-surface-2, #e9ecef);
  border: 2px solid var(--color-primary, #007bff);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  z-index: 1000; // Ensure it's above most other content
  text-decoration: none;
  box-shadow: 0 2px 5px var(--shadow-color, rgba(0, 0, 0, 0.2));
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  img {
    /* Ensure image fills the circle */
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    /* Style for the default icon */
    width: 24px;
    height: 24px;
    fill: var(--color-text-secondary, #6c757d);
  }
`;
