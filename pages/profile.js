import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@/components/icons/MenuIcon";
import {
  LoaderWrapper,
  StyledSpan,
} from "@/components/SharedComponents/DetailPageStyles";

export default function Profile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState("light"); // Default theme

  // Fetch counts for each inventory type
  const { data: keycaps } = useSWR("/api/inventories/userkeycaps");
  const { data: switches } = useSWR("/api/inventories/userswitches");
  const { data: keyboards } = useSWR("/api/inventories/userkeyboards");

  useEffect(() => {
    // Redirect if not authenticated or during loading
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  const handleThemeToggle = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    console.log(`${newTheme.toUpperCase()} MODE`);
    // Later: Add logic here to update the <html> data-theme attribute
    // document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (status === "loading") {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  if (!session) {
    return null;
  }

  const keycapCount = keycaps?.length ?? 0;
  const switchCount = switches?.length ?? 0;
  const keyboardCount = keyboards?.length ?? 0;

  return (
    <>
      {/* Added HomeBurger Link */}
      <HomeBurger href="/" aria-label="Go to Homepage">
        <MenuIcon />
      </HomeBurger>

      <ProfileContainer>
        {session.user.image && (
          <Avatar
            src={session.user.image}
            alt="User Avatar"
            width={100}
            height={100}
            priority
          />
        )}
        <UserName>{session.user.name || session.user.email}</UserName>

        <StatsContainer>
          <StatItem>
            <span>{keycapCount}</span> Keycaps
          </StatItem>
          <StatItem>
            <span>{switchCount}</span> Switches
          </StatItem>
          <StatItem>
            <span>{keyboardCount}</span> Keyboards
          </StatItem>
        </StatsContainer>

        <ControlsContainer>
          <ThemeToggleButton onClick={handleThemeToggle}>
            Toggle Theme ({currentTheme === "light" ? "Dark" : "Light"})
          </ThemeToggleButton>
          <LogoutButton onClick={() => signOut()}>Sign out</LogoutButton>
        </ControlsContainer>
      </ProfileContainer>
    </>
  );
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  max-width: 600px;
  margin: 40px auto;
  background-color: var(
    --color-surface-1,
    #f8f9fa
  ); /* Use CSS var if available */
  border-radius: 10px;
  box-shadow: 0 4px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
`;

const Avatar = styled(Image)`
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid var(--color-primary, #007bff);
`;

const UserName = styled.h2`
  margin-bottom: 20px;
  color: var(--color-text-primary, #333);
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  text-align: center;
`;

const StatItem = styled.div`
  color: var(--color-text-secondary, #666);
  span {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-primary, #333);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 250px;
`;

const ThemeToggleButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-accent, #cb9df0); /* Use accent color */
  color: var(--color-primary-fg, white);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: var(--color-destructive, #dc3545);
  color: var(--color-destructive-fg, white);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  width: 100%;

  &:hover {
    background-color: #c82333; /* Keep specific hover for logout */
  }
`;

const HomeBurger = styled(Link)`
  position: fixed; /* Or absolute if preferred */
  display: flex;
  align-items: center; /* Center icon */
  justify-content: center; /* Center icon */
  background-color: var(--color-primary, #007bff);
  height: 40px;
  width: 40px;
  color: var(--color-primary-fg, white);
  left: 10px;
  top: 8px;
  z-index: 1000;
  border-radius: 10px;
  text-decoration: none; /* Remove underline from link */

  svg {
    /* Style the SVG icon */
    width: 24px;
    height: 24px;
  }
`;
