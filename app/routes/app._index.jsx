import { useAuthenticatedFetch } from "../hooks";
// import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { Card, DataTable, Page, Button, TextField, FormLayout } from "@shopify/polaris";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    vendor: "",
    price: ""
  });
  const fetch = useAuthenticatedFetch();

  // Fetch products from Shopify Admin API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, [fetch]);

  // Handle adding a new product
  async function handleAddProduct() {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
      });
      const data = await response.json();
      setProducts([...products, data.product]); // Add the new product to the list
      setNewProduct({ title: "", vendor: "", price: "" }); // Reset form
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  }

  // Handle deleting a product
  async function handleDeleteProduct(id) {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product.id !== id)); // Remove the deleted product from the list
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  const rows = products.map((product) => [
    product.title,
    product.vendor,
    product.price,
    <Button destructive onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
  ]);

  return (
    <Page title="Products">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["Title", "Vendor", "Price", "Actions"]}
          rows={rows}
        />
      </Card>

      {/* Form to Add a New Product */}
      <Card title="Add New Product">
        <FormLayout>
          <TextField
            label="Title"
            value={newProduct.title}
            onChange={(value) => setNewProduct({ ...newProduct, title: value })}
          />
          <TextField
            label="Vendor"
            value={newProduct.vendor}
            onChange={(value) => setNewProduct({ ...newProduct, vendor: value })}
          />
          <TextField
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(value) => setNewProduct({ ...newProduct, price: value })}
          />
          <Button onClick={handleAddProduct} primary>Add Product</Button>
        </FormLayout>
      </Card>
    </Page>
  );
}
