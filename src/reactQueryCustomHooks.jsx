import { useMutation, useQuery } from "@tanstack/react-query";
import customFetch, { queryClient } from "./utils/utils";
import { toast } from "react-toastify";

export const useFetchTasks = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await customFetch.get("/");
      return data;
    },
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: true,
    // refetchOnMount: true,
    // refetchInterval: 10000, // 10 seconds
    // retry: 2, // Retry failed requests up to 2 times
    // retryDelay: 1000, // Wait 1 second before retrying
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // cacheTime: 1000 * 60 * 10, // 10 minutes
    // enabled: false, // Disable automatic fetching
  });
  return { data, isLoading, error, isError };
};

export const useCreateTask = () => {
  const { mutate: createTask, isLoading } = useMutation({
    mutationFn: (newItemName) => customFetch.post("/", { title: newItemName }),
    onMutate: async (newItemName) => {
      // Optimistically update the cache
      // This Optimistic update will couse a weird bug in the UI since we create an item with a new ID that is different form the one returned by the server.
      // To avoid this, the server should return the created item with its ID and we in the on the onSuccess should update the cache with the new item.
      // However, for the sake of this example, we will keep it as is.
      const previousTasks = queryClient.getQueryData(["tasks"]);
      const newTask = {
        id: new Date().getTime(),
        title: newItemName,
        isDone: false,
      };
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData(["tasks"], (oldTasks) => {
        return { taskList: [...oldTasks.taskList, newTask] };
      });
      return { previousTasks };
    },
    onError: (error, newItemName, context) => {
      toast.error(
        error.response?.data || "There was an error creating the task"
      );
      // Rollback the optimistic update
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        refetchType: "active",
      });
    },
    onSettled: () => {
      // Optionally, you can refetch the tasks here
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  return { createTask, isLoading };
};

export const useUpdateTask = ({ isDone, id }) => {
  const { mutate: updateTask, isLoading } = useMutation({
    mutationFn: ({ isDone, id }) => customFetch.patch(`/${id}`, { isDone }),
    onMutate: async ({ isDone, id }) => {
      // Optimistically update the cache
      const previousTasks = queryClient.getQueryData(["tasks"]);
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData(["tasks"], (oldTasks) => {
        return {
          taskList: oldTasks.taskList.map((task) =>
            task.id === id ? { ...task, isDone } : task
          ),
        };
      });
      return { previousTasks };
    },
    onError: (error, { isDone, id }, context) => {
      toast.error(
        error.response?.data || "There was an error updating the task"
      );
      // Rollback the optimistic update
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSuccess: (data, { isDone, id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        refetchType: "active",
      });
      toast.success("Task updated successfully");
    },
    onSettled: () => {
      // Optionally, you can refetch the tasks here
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  return { updateTask, isLoading };
};

export const useDeleteTask = () => {
  const { mutate: deleteTask, isLoading } = useMutation({
    mutationFn: (id) => customFetch.delete(`/${id}`),
    onMutate: async (id) => {
      // Optimistically update the cache
      const previousTasks = queryClient.getQueryData(["tasks"]);
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData(["tasks"], (oldTasks) => {
        return {
          taskList: oldTasks.taskList.filter((tasks) => tasks.id !== id),
        };
      });
      return { previousTasks };
    },
    onError: (error, id, context) => {
      // Rollback the optimistic update
      queryClient.setQueryData(["tasks"], context.previousTasks);
      toast.error(
        error.response?.data || "There was an error deleting the task"
      );
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        refetchType: "active",
      });
      toast.success("Task deleted successfully");
    },
    onSettled: () => {
      // Optionally, you can refetch the tasks here
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  return { deleteTask, isLoading };
};
