import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    try {
        const response = await admin.rest.resources.Product.all({
            session: admin.session,
        });
        return json(response.data);
    } catch (error) {
        console.error("Error fetching products:", error);
        return json({ error: "Failed to fetch products" }, { status: 500 });
    }
};

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    try {
        switch (request.method) {
            case "POST": {
                const data = await request.json();
                const response = await admin.rest.resources.Product.create({
                    session: admin.session,
                    product: data,
                });
                return json(response.data);
            }
            case "PUT": {
                const url = new URL(request.url);
                const id = url.searchParams.get("id");
                if (!id) {
                    return json({ error: "Product ID is required" }, { status: 400 });
                }
                const data = await request.json();
                const response = await admin.rest.resources.Product.update({
                    session: admin.session,
                    id: id,
                    product: data,
                });
                return json(response.data);
            }
            case "DELETE": {
                const url = new URL(request.url);
                const id = url.searchParams.get("id");
                if (!id) {
                    return json({ error: "Product ID is required" }, { status: 400 });
                }
                await admin.rest.resources.Product.delete({
                    session: admin.session,
                    id: id,
                });
                return json({ success: true });
            }
            default:
                return json({ error: "Method not allowed" }, { status: 405 });
        }
    } catch (error) {
        console.error("Error handling product operation:", error);
        return json({ error: "Failed to process request" }, { status: 500 });
    }
};
