import styled from "styled-components";
import Link from "next/link";

export default function InventoryHub() {
  return (
    <Container>
      <Title>📦 Welcome to HobbInventory! 🎉</Title>
      <InfoText>
        HobbInventory is your go-to app for managing and tracking your favorite
        hobby collections. Whether it’s keyboards, photography gear, or trading
        cards, we help you stay organized!
      </InfoText>

      <Alert>🚧 Under Maintenance 🚧</Alert>

      <InfoText>
        Currently, we only have the <strong>Keycap Inventory</strong>, but soon
        we will be expanding to <strong>Switches</strong> and{" "}
        <strong>Keyboard Kits</strong>. In the future, we plan to support many
        other hobbies like{" "}
        <strong>gardening, photography, trading cards</strong>, and more!
      </InfoText>

      <CategorySection>
        <CategoryLink href="/inventories/keycaps">
          <CategoryCard>
            <Emoji>🗝️</Emoji> Keycaps
          </CategoryCard>
        </CategoryLink>
        <CategoryLink href="/inventories/switches">
          <CategoryCard>
            <Emoji>🎛️</Emoji> Switches
          </CategoryCard>
        </CategoryLink>
        <CategoryCard disabled>
          <Emoji>⌨️</Emoji> Keyboard Kits <br />
          (🚧 Coming Soon)
        </CategoryCard>
      </CategorySection>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 500px;
  margin: 10px 0;
  line-height: 1.5;
  text-align: justify;
`;

const Alert = styled.div`
  background: #ffcc00;
  color: #333;
  padding: 8px 12px;
  font-weight: bold;
  border-radius: 5px;
  display: inline-block;
  margin: 10px 0;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
`;

const CategoryLink = styled(Link)`
  text-decoration: none;
`;

const CategoryCard = styled.div`
  background: ${({ disabled }) => (disabled ? "darkgrey" : "#007bff")};
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 1.2rem;
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: 0.3s ease;
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "2px 2px 5px rgba(0, 0, 0, 0.2)"};

  &:hover {
    background: ${({ disabled }) => (disabled ? "#darkgrey" : "#0056b3")};
  }
`;

const Emoji = styled.span`
  margin-right: 8px;
`;

const StyledLink = styled(Link)`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
