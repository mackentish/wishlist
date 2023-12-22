import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { UserResponseData } from "@/types/api";

export function useUser(): UseQueryResult<UserResponseData> {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      return data;
    },
  });
}
