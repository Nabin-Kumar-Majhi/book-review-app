/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { errorToast, successToast } from "../toaster";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { TReview } from "../../api/review/fetch";
import { useUpdateReviewMutation } from "../../api/review/query";
import { Pencil } from "lucide-react";

// Schema for updating a review
const updatereviewSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  reviewText: z.string().min(1, "Review text is required"),
});

export const Updatereview = ({
  review,
  onUpdateSuccess,
}: {
  review: TReview;
  onUpdateSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const updatereviewMutation = useUpdateReviewMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      rating: review.rating,
      reviewText: review.reviewText,
    },
    resolver: zodResolver(updatereviewSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof updatereviewSchema>> = async (data) => {
    try {
      await updatereviewMutation.mutateAsync(
        {
          ReviewId: review._id,
          rating: data.rating,
          reviewText: data.reviewText,
        },
        {
          onSuccess: () => {
            successToast("Review updated successfully");
            reset();
            setIsOpen(false);
            onUpdateSuccess();
          },
          onError: (error: any) => {
            errorToast(error?.message || "Error updating review");
          },
        }
      );
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-amber-800 text-sm px-4 py-2"
      >
        <Pencil size={16} />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                  <DialogTitle as="h3" className="text-lg font-medium text-gray-900">
                    Update Review
                  </DialogTitle>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    {/* Star Rating */}
                    <Controller
                      name="rating"
                      control={control}
                      render={({ field }) => (
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={`text-2xl cursor-pointer ${
                                index < field.value
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                              onClick={() => field.onChange(index + 1)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    />
                    {errors.rating && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.rating.message}
                      </p>
                    )}

                    {/* Review Text */}
                    <div>
                      <label
                        htmlFor="reviewText"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Review Text
                      </label>
                      <textarea
                        {...control.register("reviewText")}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                      />
                      {errors.reviewText && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.reviewText.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                    >
                      Update Review
                    </button>
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
