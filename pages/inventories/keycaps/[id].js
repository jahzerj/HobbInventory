import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";

export default function KeyCapDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: keycaps, error } = useSWR(
    id ? `/api/inventories/keycaps/${id}` : null
  );

  const [selectedColors, setSelectedColors] = useLocalStorageState(
    `colors-${id}`,
    { defaultValue: [] }
  );

  if (error) return <p>Error loading keycap details.</p>;
  if (!keycaps) return <p>Loading...</p>;

  const kitsAvailable = keycaps.kits?.flatMap((kit) => kit.price_list) ?? [];

  const handleColorSelect = (event) => {
    const selectedColor = event.target.value;

    if (selectedColors.includes(selectedColor)) {
      setSelectedColors((prevColors) =>
        prevColors.filter((existingColor) => existingColor !== selectedColor)
      );
      return;
    }
    if (selectedColors.length < 3) {
      setSelectedColors((prevColors) => [...prevColors, selectedColor]);
    }
  };

  const handleRemoveColor = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.filter((existingColor) => existingColor !== color)
    );
  };

  const colorOptions = [
    { name: "Red", emoji: "🔴" },
    { name: "Orange", emoji: "🟠" },
    { name: "Yellow", emoji: "🟡" },
    { name: "Green", emoji: "🟢" },
    { name: "Blue", emoji: "🔵" },
    { name: "Purple", emoji: "🟣" },
    { name: "Pink", emoji: "🩷" },
    { name: "Black", emoji: "⚫" },
    { name: "Brown", emoji: "🟤" },
    { name: "White", emoji: "⚪" },
    { name: "Beige/Grey", emoji: "🩶" },
  ];

  return (
    <DetailPageContainer>
      <CloseButton onClick={() => router.push("/inventories/keycaps")}>
        ×
      </CloseButton>

      <HeaderSection>
        <h1>{keycaps.name}</h1>
        {keycaps.render_pics?.length > 0 && (
          <HeaderImage>
            <Image
              src={keycaps.render_pics[0]}
              alt={keycaps.name}
              layout="fill"
              objectFit="cover"
            />
          </HeaderImage>
        )}
      </HeaderSection>

      <DetailsContainer>
        <p>
          <strong>Manufacturer:</strong> {keycaps.keycapstype}
        </p>
        <p>
          <strong>Profile:</strong> {keycaps.profile}
        </p>
        <p>
          <strong>Designer:</strong> {keycaps.designer}
        </p>
        <p>
          <strong>Geekhack Thread:</strong>{" "}
          <ExternalLink href={keycaps.link} target="_blank">
            Visit Geekhack
          </ExternalLink>
        </p>
      </DetailsContainer>

      <h3>Your Kits</h3>
      {kitsAvailable.length > 0 ? (
        <KitsContainer>
          {kitsAvailable.map((kit) => (
            <KitCard key={kit.name}>
              {kit.pic && (
                <Image
                  src={kit.pic}
                  alt={kit.name}
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              )}
              <p>{kit.name}</p>
            </KitCard>
          ))}
        </KitsContainer>
      ) : (
        <p>No kits available for this keycap set.</p>
      )}

      <h3>Choose 3 Colors</h3>
      <DropDownSelect onChange={handleColorSelect} value="">
        <option value="" disabled>
          -- Choose up to 3 colors --
        </option>
        {colorOptions.map((color) => (
          <option key={color.name} value={color.name}>
            {color.name}
            {color.emoji}
          </option>
        ))}
      </DropDownSelect>

      <SelectedColorsContainer>
        {selectedColors.length > 0
          ? selectedColors.map((color) => {
              const colorData = colorOptions.find((c) => c.name === color);
              return (
                <SelectedColor key={color} bgColor={colorData?.name}>
                  {colorData?.emoji} {color}
                  <RemoveColorButton onClick={() => handleRemoveColor(color)}>
                    x
                  </RemoveColorButton>
                </SelectedColor>
              );
            })
          : "No colors selected"}
      </SelectedColorsContainer>

      <h3>Notes</h3>
      <TextArea placeholder="Write your notes here..." />
    </DetailPageContainer>
  );
}

const DetailPageContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderImage = styled.div`
  width: 640px;
  height: 320px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
`;

const DetailsContainer = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const ExternalLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const KitsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 600px;
`;

const KitCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

const DropDownSelect = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #f9f9f9;
`;

const SelectedColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const SelectedColor = styled.span`
  background-color: #f9f9f9;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  border: 2px solid ${(props) => props.bgColor || "black"};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RemoveColorButton = styled.button`
  background-color: #f9f9f9;
  border: none;
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
  &hover {
    color: #ff4d4d;
  }
`;

const TextArea = styled.textarea`
  width: 60%;
  max-width: 600px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #f9f9f9;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ff4d4d;
  border-radius: 50%;
  font-size: 24px;
  color: white;
  border: none;
  cursor: pointer;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: background 0.3s ease-in-out;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
