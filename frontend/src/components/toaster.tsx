import { toast } from "react-hot-toast";

export function errorToast(message: string) {
  toast(message, {
    duration: 2000,
    position: "top-center",
    style: {
      background: "#ef4444", // Red color for error
      color: "#fff",
    },
  });
}

export function successToast(message: string) {
  toast(message, {
    duration: 2000,
    position: "top-center",
    style: {
      background: "#22c55e", // Green color for success
      color: "#fff",
    },
  });
}
