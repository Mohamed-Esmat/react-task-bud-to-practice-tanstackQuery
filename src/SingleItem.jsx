import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import customFetch, { queryClient } from "./utils/utils";
import { toast } from "react-toastify";
import { useDeleteTask, useUpdateTask } from "./reactQueryCustomHooks";

const SingleItem = ({ item }) => {
  const [isDoneState, setIsDoneState] = useState(item.isDone);

  // const { mutate: editTask } = useMutation({
  //   mutationFn: ({ isDone, id }) => customFetch.patch(`${id}`, { isDone }),
  //   onMutate: async ({ isDone, id }) => {
  //     // Optimistically update the cache
  //     const previousTasks = queryClient.getQueryData(["tasks"]);
  //     await queryClient.cancelQueries({ queryKey: ["tasks"] });
  //     queryClient.setQueryData(["tasks"], (oldTasks) => {
  //       return {
  //         taskList: oldTasks.taskList.map((task) =>
  //           task.id === id ? { ...task, isDone } : task
  //         ),
  //       };
  //     });
  //     return { previousTasks };
  //   },
  //   onError: (error, { isDone, id }, context) => {
  //     toast.error(
  //       error.response?.data || "There was an error updating the task"
  //     );
  //     // Rollback the optimistic update
  //     queryClient.setQueryData(["tasks"], context.previousTasks);
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({
  //       queryKey: ["tasks"],
  //       refetchType: "active",
  //     });
  //     toast.success("Task updated successfully");
  //   },
  //   onSettled: () => {
  //     // Optionally, you can refetch the tasks here
  //     queryClient.invalidateQueries({ queryKey: ["tasks"] });
  //   },
  // });

  const { updateTask, isLoading: isUpdating } = useUpdateTask({
    isDone: isDoneState,
    id: item.id,
  });

  // const { mutate: deleteTask, isLoading } = useMutation({
  //   mutationFn: (id) => customFetch.delete(`/${id}`),
  //   onMutate: async (id) => {
  //     // Optimistically update the cache
  //     const previousTasks = queryClient.getQueryData(["tasks"]);
  //     await queryClient.cancelQueries({ queryKey: ["tasks"] });
  //     queryClient.setQueryData(["tasks"], (oldTasks) => {
  //       return {
  //         taskList: oldTasks.taskList.filter((task) => task.id !== id),
  //       };
  //     });
  //     return { previousTasks };
  //   },
  //   onError: (error, id, context) => {
  //     // Rollback the optimistic update
  //     queryClient.setQueryData(["tasks"], context.previousTasks);
  //     toast.error(
  //       error.response?.data || "There was an error deleting the task"
  //     );
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({
  //       queryKey: ["tasks"],
  //       refetchType: "active",
  //     });
  //     toast.success("Task deleted successfully");
  //   },
  //   onSettled: () => {
  //     // Optionally, you can refetch the tasks here
  //     queryClient.invalidateQueries({ queryKey: ["tasks"] });
  //   },
  // });

  const { deleteTask, isLoading } = useDeleteTask();

  const handleCheckboxChange = () => {
    const newIsDoneState = !isDoneState;
    setIsDoneState(newIsDoneState);
    updateTask({ isDone: newIsDoneState, id: item.id });
  };
  const handleDeleteTask = () => {
    deleteTask(item.id);
  };
  return (
    <div className="single-item">
      <input
        type="checkbox"
        checked={isDoneState}
        onChange={() => handleCheckboxChange()}
      />
      <p
        style={{
          textTransform: "capitalize",
          textDecoration: isDoneState && "line-through",
        }}
      >
        {item.title}
      </p>
      <button
        className="btn remove-btn"
        type="button"
        disabled={isLoading}
        aria-label="delete task"
        title="delete task"
        onClick={() => handleDeleteTask()}
      >
        delete
      </button>
    </div>
  );
};
export default SingleItem;
