import { useEffect, useState } from "react";
import { getBuyers } from "../services/buyerService";

export function useBuyers() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const data = await getBuyers();
      setBuyers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch buyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return { buyers, loading, error, refetch: fetchBuyers };
}
