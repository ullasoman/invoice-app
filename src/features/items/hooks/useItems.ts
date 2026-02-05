import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchItems, deleteItem } from "../services/itemService";
import { toast } from "sonner";

export function useItems() {
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  return { ...itemsQuery, deleteMutation };
}
