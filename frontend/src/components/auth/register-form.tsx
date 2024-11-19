import { useNavigate } from "react-router-dom"; // Add this import
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRegisterUserMutation } from "../../api/auth/query";
import { errorToast, successToast } from "../toaster";

const registerSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(25),
    confirmPassword: z.string().min(6).max(25),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const navigate = useNavigate();
  const registerUserMutation = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof registerSchema>> = (data) => {
    try {
      registerUserMutation.mutateAsync(
        {
          email: data.email,
          username: data.username,
          password: data.password,
        },
        {
          onSuccess(data) {
            successToast(data.message);
            reset();
            navigate("/login"); // Navigate to Login page after successful registration
          },
          onError(error) {
            console.error("error", error);
            errorToast(error.message);
          },
        }
      );
    } catch (error) {
      console.error("error", error);
      errorToast("something went wrong");
    }
  };

  const navigateToLogin = () => {
    navigate("/login"); // Button to navigate to Login page
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center min-h-screen"
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 hover:border-slate-700 border">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h1>

        <div className="space-y-4 mt-8">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-700 bg-red-200 p-2 rounded-md mt-2">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Email
            </label>
            <input //SA
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-700 bg-red-200 p-2 rounded-md mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Password
            </label>
            <input
              id="password"//SA
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-700 bg-red-200 p-2 rounded-md mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-700 bg-red-200 p-2 rounded-md mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>


        <div className="text-center mt-6">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={navigateToLogin} // Button to navigate to Login
            >
              Login
            </button>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-4"
          disabled={registerUserMutation.isPending}
        >
          {registerUserMutation.isPending ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
