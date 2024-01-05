import { SharedListResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useSharedList(listId: number | undefined) {
  const fetchSharedList = useQuery<SharedListResponse>({
    queryKey: ["sharedList", listId],
    queryFn: async () => {
      const res = await fetch(`/api/getSharedList/${listId}`);
      const data = await res.json();
      return data;
    },
    enabled: !!listId,
  });
  return fetchSharedList;
}
