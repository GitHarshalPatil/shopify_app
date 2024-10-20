import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";
import { Card, DataTable, Page, Button, TextField, FormLayout } from "@shopify/polaris";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", vendor: "", price: "" });
  const fetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN, // Accessing the token from environment variable
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };


  useEffect(() => {
    // async function fetchProducts() {
    //   try {
    //     const response = await fetch('/api/products');
    //     if (!response.ok) {
    //       throw new Error(`Error ${response.status}: ${response.statusText}`);
    //     }
    //     const data = await response.json();
    //     setProducts(data.products);
    //   } catch (error) {
    //     console.error("Failed to fetch products:", error);
    //   }
    // }

    fetchProducts();
  }, [fetch]);

  async function handleAddProduct() {
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN, // Accessing the token from environment variable
        },
        body: JSON.stringify({ product: newProduct }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts([...products, data.product]);
      setNewProduct({ title: "", vendor: "", price: "" });
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN, // Accessing the token from environment variable
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  const rows = products.map((product) => [
    product.title,
    product.vendor,
    product.price,
    <Button destructive onClick={() => handleDeleteProduct(product.id)}>Delete</Button>,
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
          <Button onClick={handleAddProduct} primary loading={loading}>Add Product</Button>
        </FormLayout>
      </Card>
    </Page>
  );
}
