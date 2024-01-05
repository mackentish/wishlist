import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { GetUserResponse } from "@/types";

export function useUser(): UseQueryResult<GetUserResponse> {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/getUser");
      if (!res.ok) {
        throw new Error("Unable to fetch user");
      }
      return res.json();
    },
  });
}
