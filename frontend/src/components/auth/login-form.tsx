import { useNavigate } from "react-router-dom"; // Add this import
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginUserMutation } from "../../api/auth/query";
import { successToast, errorToast } from "../toaster";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(25),
});

export function LoginForm() {
  const navigate = useNavigate();
  const loginUserMutation = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = (data) => {
    try {
      loginUserMutation.mutateAsync(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess(data) {
            successToast(data.message);
            reset();
            navigate("/"); // Navigate to home page after login
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

  const navigateToRegister = () => {
    navigate("/register"); // Navigate to Register page
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center min-h-screen"
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 hover:border-slate-600 border">
        <h1 className="text-3xl font-bold text-center text-black-600 mb-6">
          Login
        </h1>

        <div className="space-y-4 mt-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-black-700"
            >
              Email
            </label>
            <input
            //SA
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
              className="block text-sm font-medium mb-1 text-black-700"
            >
              Password
            </label>
            <input
              id="password"
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
        </div>

        <div className="text-center mt-6">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={navigateToRegister} // Button to navigate to Register
            >
              Register
            </button>
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-4"
          disabled={loginUserMutation.isPending}
        >
          {loginUserMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
