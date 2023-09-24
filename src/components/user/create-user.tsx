import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

type CreateUserForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const CreateUser: React.FC = () => {
  const { register, handleSubmit } = useForm<CreateUserForm>();
  const router = useRouter();
  const createUserMutation = api.user.createUser.useMutation();

  const onSubmit = async (data: CreateUserForm) => {
    try {
      await createUserMutation.mutateAsync({
        email: data.email,
        // Add other fields as needed
      });
      router.push("/users"); // Navigate to user list after successful creation
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Password"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            {...register("rememberMe")}
            type="checkbox"
            id="rememberMe"
            className="text-primary-600 focus:border-primary-300 focus:ring-primary-200 h-4 w-4 rounded border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium text-gray-700"
          >
            Remember me
          </label>
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
