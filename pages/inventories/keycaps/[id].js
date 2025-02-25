import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

export default function KeyCapDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: keycaps, error } = useSWR(
    id ? `/api/inventories/keycaps/${id}` : null
  );

  if (error) return <p>Error loading keycap details.</p>;
  if (!keycaps) return <p>Loading...</p>;

  const kitsAvailable = keycaps.kits?.flatMap((kit) => kit.price_list) ?? [];

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
      <DropDownSelect multiple size={4}>
        <option value="">-- Choose 3 colors --</option>
        <option value="red"> Red 🔴</option>
        <option value="orange"> Orange 🟠</option>
        <option value="yellow"> Yellow 🟡</option>
        <option value="green"> Green 🟢</option>
        <option value="blue"> Blue 🔵</option>
        <option value="purple"> Purple 🟣</option>
        <option value="pink"> Pink 🩷</option>
        <option value="black"> Black ⚫</option>
        <option value="brown"> Brown 🟤</option>
        <option value="white"> White ⚪</option>
        <option value="grey-beige"> Beige/Grey 🩶</option>
      </DropDownSelect>

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
