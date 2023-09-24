import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

type CreateReportForm = {
  itemId: number;
  content: string;
};

export const CreateReport: React.FC = () => {
  const { register, handleSubmit } = useForm<CreateReportForm>();
  const router = useRouter();
  const createReportMutation = api.reportRouter.createReport.useMutation();

  const onSubmit = async (data: CreateReportForm) => {
    try {
      await createReportMutation.mutateAsync(data);
      router.push("/reports"); // Navigate to report list after successful creation
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="itemId"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Item ID
          </label>
          <input
            {...register("itemId")}
            type="number"
            id="itemId"
            className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Item ID"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            {...register("content")}
            id="content"
            className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Report Content"
          ></textarea>
        </div>
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
