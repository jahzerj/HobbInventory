import styled from "styled-components";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import ProfileButton from "@/components/SharedComponents/ProfileButton";
import Image from "next/image";

export default function InventoryHub() {
  // Get session data and status
  const { data: session, status } = useSession();

  // Function to clear scroll position for a specific inventory page
  const handleNavigation = (pageId) => {
    sessionStorage.removeItem(`scrollPosition_${pageId}`);
  };

  // Show loading state
  if (status === "loading") {
    return null;
  }

  // If user is not authenticated, show splash screen
  if (!session) {
    return (
      <SplashScreen>
        <ImageSection>
          <Image
            src="https://res.cloudinary.com/dgn86s1e2/image/upload/v1745845655/F1_wk1fpp.jpg"
            alt="F1-8x ISO-DE GMK Dualshot"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </ImageSection>
        <ContentSection>
          <h1>HobbInventory</h1>
          <p>The one stop shop for all your hobby needs</p>
          <button onClick={() => signIn()}>Sign in</button>
        </ContentSection>
      </SplashScreen>
    );
  }

  // Minimal hub view for authenticated users
  return (
    <>
      <ProfileButton />
      <MinimalContainer>
        <HubTitle>Inventory Hub</HubTitle>

        <InventoryGrid>
          <CategoryItem>
            <CategoryLabel>Keycaps</CategoryLabel>
            <Link
              href="/inventories/keycaps"
              onClick={() => handleNavigation("keycaps")}
            >
              <ImageWrapper>
                <Image
                  src="https://res.cloudinary.com/dgn86s1e2/image/upload/v1744729995/Keycap_nshyrk.png"
                  alt="Keycaps"
                  width={300}
                  height={300}
                  style={{ objectFit: "contain" }}
                />
              </ImageWrapper>
            </Link>
          </CategoryItem>

          <CategoryItem>
            <CategoryLabel>Switches</CategoryLabel>
            <Link
              href="/inventories/switches"
              onClick={() => handleNavigation("switches")}
            >
              <ImageWrapper>
                <Image
                  src="https://res.cloudinary.com/dgn86s1e2/image/upload/v1744730282/MX_Switch_um3qef.png"
                  alt="Switches"
                  width={300}
                  height={300}
                  style={{ objectFit: "contain" }}
                />
              </ImageWrapper>
            </Link>
          </CategoryItem>

          <CategoryItem>
            <CategoryLabel>Keyboard Kits</CategoryLabel>
            <Link
              href="/inventories/keyboards"
              onClick={() => handleNavigation("keyboards")}
            >
              <ImageWrapper>
                <Image
                  src="https://res.cloudinary.com/dgn86s1e2/image/upload/v1744730460/Keyboard_q2kisx.png"
                  alt="Keyboard Kits"
                  width={300}
                  height={300}
                  style={{ objectFit: "contain" }}
                />
              </ImageWrapper>
            </Link>
          </CategoryItem>
        </InventoryGrid>
      </MinimalContainer>
    </>
  );
}

// Simple, flat splash screen components
const SplashScreen = styled.div`
  display: grid;
  width: 100%;
  height: 100vh;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 767px) {
    grid-template-rows: 1fr 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  h1 {
    color: #007bff;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
  }

  p {
    color: #333;
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 2rem;
    padding: 0.8rem 3rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgb(10, 37, 66);
    }
  }
`;

// New minimal hub components
const MinimalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HubTitle = styled.h1`
  font-size: 2 rem;
  margin-bottom: 10px;
  text-align: center;
`;

const InventoryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CategoryLabel = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ImageWrapper = styled.div`
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
`;
