import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { User } from "@/types";

export function useUser(): UseQueryResult<User> {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/getUser");
      const data = await res.json();
      return data;
    },
  });
}
