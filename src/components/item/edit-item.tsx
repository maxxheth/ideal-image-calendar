import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

type EditItemForm = {
  title: string;
  status: "PLANNED" | "BRIEFED" | "IN_PROGRESS" | "COMPLETE";
  color: string;
  channelType: "EMAIL" | "TEXT" | "OTHER";
  leadForecast: number;
  leadActual: number;
  date: string;
};

export const EditItem: React.FC = ({ id }: { id: string }) => {
  const { register, handleSubmit, setValue } = useForm<EditItemForm>();
  const router = useRouter();
  //  const { id } = router.query; // Assuming the item ID is passed as a query parameter
  const itemQuery = api.itemRouter.getItemById.useQuery({ id: id });
  const updateItemMutation = api.itemRouter.updateItem.useMutation();

  useEffect(() => {
    if (itemQuery.data) {
      setValue("title", itemQuery.data.title);
      setValue("status", itemQuery.data.status);
      setValue("color", itemQuery.data.color);
      setValue("channelType", itemQuery.data.channelType);
      setValue("leadForecast", itemQuery.data.leadForecast);
      setValue("leadActual", itemQuery.data.leadActual);
      setValue("date", itemQuery.data.date);
    }
  }, [itemQuery.data, setValue]);

  const onSubmit = async (data: EditItemForm) => {
    try {
      await updateItemMutation.mutateAsync({
        id: id,
        ...data,
      });
      router.push("/items"); // Navigate to item list after successful update
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Add form fields similar to the CreateUser component, but for items */}
        {/* Example: */}
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Item Title"
          />
        </div>
        {/* Add more fields for status, color, channelType, leadForecast, leadActual, and date */}
        <button
          type="submit"
          className="border-primary-500 bg-primary-500 hover:border-primary-700 hover:bg-primary-700 focus:ring-primary-200 rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all focus:ring"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
