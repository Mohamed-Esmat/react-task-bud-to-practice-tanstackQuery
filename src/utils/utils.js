import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();
const customFetch = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

export default customFetch;
