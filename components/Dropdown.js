import useSWR from "swr";
import React from "react";

export default function Dropdown() {
  const { data, isLoading, error } = useSWR("/api/inventories/keycaps");

  if (isLoading) {
    return <h1> Loading...</h1>;
  }

  if (!data) {
    return;
  }
  console.log(data);
  return (
    <ul>
      {data.map((keycap) => (
        <li key={keycap._id}>
          <p>{keycap.name}</p>
          <p>{keycap.profile}</p>
        </li>
      ))}
    </ul>
  );
}
