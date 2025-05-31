import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import customFetch, { queryClient } from "./utils/utils";
import { toast } from "react-toastify";
import { useCreateTask } from "./reactQueryCustomHooks";

const Form = () => {
  const [newItemName, setNewItemName] = useState("");

  const { createTask, isLoading } = useCreateTask();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.warning("Please enter a task name");
      return;
    }

    createTask(newItemName, {
      onSuccess: () => {
        setNewItemName("");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>task bud</h4>
      <div className="form-control">
        <input
          type="text "
          className="form-input"
          value={newItemName}
          onChange={(event) => setNewItemName(event.target.value)}
        />
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? "Loading..." : "add task"}
        </button>
      </div>
    </form>
  );
};
export default Form;
