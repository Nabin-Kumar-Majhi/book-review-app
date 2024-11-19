import { useLogoutMutation } from "../../api/auth/query";
import { errorToast, successToast } from "../toaster";

export function Logout() {
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    try {
      logoutMutation.mutateAsync(
        {},
        {
          onSuccess: () => {
            window.location.href = "/login";
            successToast("Logout successful");
          },
          onError: (error) => {
            console.error(error);
            errorToast(error.message);
          },
        }
      );
      //SA
    } catch (error) {
      console.error(error);
      errorToast("something went wrong");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="ml-auto rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      Logout
    </button>
  );
}
