import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateBookMutation } from "../../api/book/query";
import { SubmitHandler, useForm } from "react-hook-form";
import { errorToast, successToast } from "../toaster";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { TBook } from "../../api/book/fetch";

const updateBookSchema = z.object({
  Title: z.string().min(1),
  author: z.string().min(1),
  genres: z.string().min(1),
  description: z.string(),
  image: z.string().url(),
});

export const UpdateBook = ({ book }: { book: TBook }) => {
  const [isOpen, setIsOpen] = useState(false);
  const updateBookMutation = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      image: book.image,
      Title: book.Title,
      author: book.author,
      genres: book.genres,
      description: book.description,
    },
    resolver: zodResolver(updateBookSchema),
  });
  //   console.log("error", errors);

  const onSubmit: SubmitHandler<z.infer<typeof updateBookSchema>> = (data) => {
    try {
      updateBookMutation.mutateAsync(
        {
          image: data.image,
          bookId: book._id,
          Title: data.Title,
          author: data.author,
          genres: data.genres,
          description: data.description,
        },
        {
          onSuccess() {
            successToast("book update successfully");
            reset();
            setIsOpen(false);
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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-amber-700 text-white text-sm px-4 py-2 rounded-lg shadow-md hover:bg-amber-500 transition-all"
      >
        Update
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
                    className="text-lg font-medium leading-6 text-amber-900 flex justify-between items-center"
                  >
                    Update Book
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-amber-400 hover:text-amber-500"
                    >
                      {/* <X className="h-6 w-6" aria-hidden="true" /> */}X
                    </button>
                  </DialogTitle>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="Title"
                          className="block text-sm font-medium text-amber-700"
                        >
                          Image Url
                        </label>
                        <input
                          type="text"
                          id="image"
                          {...register("image")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                        {errors.image && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.image.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="Title"
                          className="block text-sm font-medium text-amber-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="Title"
                          {...register("Title")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm pl-2 h-8"
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
                          className="block text-sm font-medium text-amber-700"
                        >
                          Author
                        </label>
                        <input
                          type="text"
                          id="author"
                          {...register("author")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm pl-2 h-8"
                        />
                        {errors.author && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.author.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="genre"
                          className="block text-sm font-medium text-amber-700"
                        >
                          Genres
                        </label>
                        <input
                          type="text"
                          id="genre"
                          {...register("genres")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm pl-2 h-8"
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
                          className="block text-sm font-medium text-amber-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          {...register("description")}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm pl-2 pt-1"
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
                        Update Book
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
