import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseOrder {
  id: number;
  product: { name: string };
  supplier: { name: string };
  warehouse: { name: string };
  quantityOrdered: number;
  status: string;
  expectedArrivalDate: string;
}

interface OrdersTabProps {
  refreshSignal?: number;
}

export default function OrdersTab({ refreshSignal }: OrdersTabProps) {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [refreshSignal]);

  const fetchOrders = async () => {
    const res = await api.get("/purchase-orders");
    setOrders(res.data);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {orders.map((o) => (
        <Card key={o.id}>
          <CardHeader>
            <CardTitle>{o.product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Qty:</strong> {o.quantityOrdered}
            </p>
            <p>
              <strong>Supplier:</strong> {o.supplier.name}
            </p>
            <p>
              <strong>Warehouse:</strong> {o.warehouse.name}
            </p>
            <p>
              <strong>Status:</strong> {o.status.toLocaleUpperCase()}
            </p>
            <p>
              <strong>Expected Arrival:</strong>{" "}
              {new Date(o.expectedArrivalDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
