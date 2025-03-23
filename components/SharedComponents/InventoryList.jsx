import useSWR from "swr";

export default function InventoryList({
  data,
  isEditMode,
  onDelete,
  ItemComponent,
  dataEndpoint,
  findFullItemData,
}) {
  const { data: inventoryData } = useSWR(dataEndpoint);

  return data.map((itemObj) => {
    const fullItemData = findFullItemData?.(inventoryData, itemObj);

    return (
      <ItemComponent
        key={itemObj._id}
        itemObj={itemObj}
        fullItemData={fullItemData}
        isEditMode={isEditMode}
        onDelete={onDelete}
      />
    );
  });
}
