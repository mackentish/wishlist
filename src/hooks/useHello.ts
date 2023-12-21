import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { HelloResponseData } from "@/types/api";

export function useHello(): UseQueryResult<HelloResponseData> {
  return useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await fetch("/api/hello");
      const data = await res.json();
      return data;
    },
  });
}
