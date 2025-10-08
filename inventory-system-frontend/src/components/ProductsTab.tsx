import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: number;
  name: string;
  quantityInStock: number;
  reorderThreshold: number;
  supplier: { id: number; name: string };
  warehouse: { id: number; name: string };
}

interface ProductsTabProps {
  onStockChange?: () => void;
}

export default function ProductsTab({ onStockChange }: ProductsTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [adjustValue, setAdjustValue] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const adjustStock = async (id: number) => {
    const amount = adjustValue[id] || 0;
    if (amount === 0) return;

    await api.patch(`/products/${id}/adjust`, { amount });
    setAdjustValue({ ...adjustValue, [id]: 0 });
    fetchProducts();
    if (onStockChange) onStockChange();
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {products.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{p.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">
              <strong>Stock:</strong> {p.quantityInStock} <br />
              <strong>Reorder Threshold:</strong> {p.reorderThreshold}
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Adjust (+/-)"
                value={adjustValue[p.id] ?? ""}
                onChange={(e) =>
                  setAdjustValue({
                    ...adjustValue,
                    [p.id]: Number(e.target.value),
                  })
                }
              />
              <Button onClick={() => adjustStock(p.id)}>Apply</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
