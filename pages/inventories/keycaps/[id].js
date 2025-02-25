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

  if (error) return <p> Error loading keycap details.</p>;
  if (!keycaps) return <p>Loading...</p>;

  const kitsAvailable = keycaps.kits?.flatMap((kit) => kit.price_list) ?? [];

  return (
    <DetailPageContainer>
      <h1>{keycaps.name}</h1>
      <CloseButton onClick={() => router.push("/inventories/keycaps")}>
        x
      </CloseButton>
      <p>Manufacturer: {keycaps.keycapstype}</p>
      <p>Profile: {keycaps.profile}</p>
      <p>Designer: {keycaps.designer}</p>
      <p>
        Geekhack Link:{" "}
        <Link href={keycaps.link} target="_blank">
          {keycaps.link}
        </Link>
      </p>
      {/* ✅ Display Kits */}
      <h3>Your Kits</h3>
      {kitsAvailable.length > 0 ? (
        <div>
          {kitsAvailable.map((kit) => (
            <div
              key={kit._id || kit.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {kit.pic && (
                <Image
                  src={kit.pic}
                  alt={kit.name}
                  width={100}
                  height={100}
                  style={{
                    objectFit: "cover",
                    marginRight: "10px",
                    borderRadius: "5px",
                  }}
                />
              )}
              <p>{kit.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No kits available for this keycap set.</p>
      )}
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
      <label>
        Notes:
        <br />
        <textarea name="userNotes" rows={6} cols={55} />
      </label>
    </DetailPageContainer>
  );
}

const DropDownSelect = styled.select`
  width: 35%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  font-size: 16px;
  background-color: #f9f9f9;
`;

const DetailPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 30px;
  right: 30px;
  background-color: #ff4d4d;
  border-radius: 100%;
  font-size: 30px;
  color: white;
  border: none;
  cursor: pointer;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
