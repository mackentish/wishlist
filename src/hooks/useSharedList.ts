import { SharedListResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useSharedList(listId: number | undefined) {
  const fetchSharedList = useQuery<SharedListResponse>({
    queryKey: ["sharedList", listId],
    queryFn: async () => {
      const res = await fetch(`/api/getSharedList/${listId}`);
      if (!res.ok) {
        throw new Error("Unable to get shared list");
      }
      return res.json();
    },
    enabled: !!listId,
  });
  return fetchSharedList;
}
