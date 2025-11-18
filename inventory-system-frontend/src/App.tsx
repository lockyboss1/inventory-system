import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTab from "./components/ProductsTab";
import OrdersTab from "./components/OrdersTab";
import { useState } from "react";

export default function App() {
  const [refreshOrders, setRefreshOrders] = useState(0);

  const handleStockChange = () => {
    setRefreshOrders((prev) => prev + 1);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Inventory Dashboard</h1>
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab onStockChange={handleStockChange} />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab refreshSignal={refreshOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
