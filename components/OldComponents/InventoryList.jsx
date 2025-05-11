import useSWR from "swr";

export default function InventoryList({
  data,
  isEditMode,
  onDelete,
  ItemComponent,
}) {

  return (
    <>
      {data.map((itemObj) => (
        <ItemComponent
          key={itemObj._id}
          itemObj={itemObj}
          isEditMode={isEditMode}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
