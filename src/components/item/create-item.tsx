import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

type CreateItemForm = {
  title: string;
  status: "PLANNED" | "BRIEFED" | "IN_PROGRESS" | "COMPLETE";
  color: string;
  channelType: "EMAIL" | "TEXT" | "OTHER";
  leadForecast: number;
  leadActual: number;
  date: string;
};

export const CreateItem: React.FC = () => {
  const { register, handleSubmit } = useForm<CreateItemForm>();
  const router = useRouter();
  const createItemMutation = api.item.createItem.useMutation();

  const onSubmit = async (data: CreateItemForm) => {
    try {
      await createItemMutation.mutateAsync(data);
      router.push("/items"); // Navigate to item list after successful creation
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Other form fields for title, status, color, etc. */}
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
