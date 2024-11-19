/* eslint-disable @typescript-eslint/no-explicit-any */
// / eslint-disable @typescript-eslint/no-explicit-any /
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { errorToast, successToast } from "../toaster";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useAddBookMutation } from "../../api/book/query";
import type { TAddBookInput } from "../../api/book/fetch";

// Match the schema with your backend expectations
const createBookSchema = z.object({
  image: z.string().optional(),
  Title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genres: z.string().min(1, "Genre is required"),
  description: z.string().min(1, "Description is required"),
});

export const CreateBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const addBookMutation = useAddBookMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAddBookInput>({
    mode: "all",
    defaultValues: {
      image: "",
      Title: "",
      author: "",
      genres: "",
      description: "",
    },
    resolver: zodResolver(createBookSchema),
  });

  const onSubmit: SubmitHandler<TAddBookInput> = async (data) => {
    try {
      // Create a new object with clean data
      const bookData: TAddBookInput = {
        Title: data.Title.trim(),
        author: data.author.trim(),
        genres: data.genres.trim(),
        description: data.description.trim(),
        // Set default image if not provided
        image: data.image,
      };

      // Log the data being sent to help with debugging
      console.log("Submitting book data:", bookData);

      await addBookMutation.mutateAsync(bookData, {
        onSuccess(response) {
          console.log("Success response:", response);
          successToast("Book created successfully");
          reset();
          setIsOpen(false);
        },
        onError(error: any) {
          console.error("Detailed error:", error);
          let errorMessage = "Something went wrong, please try again.";

          // Handle different types of error responses
          if (error.message) {
            errorMessage = error.message;
          }
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          if (error.errors) {
            // If there are specific field errors, show the first one
            const firstError = Object.values(error.errors)[0];
            if (firstError) {
              errorMessage = String(firstError);
            }
          }

          errorToast(errorMessage);
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      errorToast("Failed to create book. Please try again.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Create Book
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    Create New Book
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      ✕
                    </button>
                  </DialogTitle>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Image URL 
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="image"
                            {...register("image")}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            placeholder="Image Url * "
                          />
                          {errors.image && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.image.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="Title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title 
                        </label>
                        <input
                          type="text"
                          id="Title"
                          {...register("Title")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                        {errors.Title && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.Title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="author"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Author 
                        </label>
                        <input
                          type="text"
                          id="author"
                          {...register("author")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                        {errors.author && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.author.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="genres"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Genres 
                        </label>
                        <input
                          type="text"
                          id="genres"
                          {...register("genres")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                        {errors.genres && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.genres.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description 
                        </label>
                        <textarea
                          id="description"
                          {...register("description")}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                        {errors.description && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      >
                        Create Book
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
