import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";

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
    <div>
      <h1>{keycaps.name}</h1>
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
    </div>
  );
}
