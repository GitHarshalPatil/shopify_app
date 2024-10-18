import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix/server";
// import "@shopify/polaris/build/esm/styles.css";
// import "../../node_modules/@shopify/polaris/build/esm/styles.css";
import "@shopify/polaris/build/esm/styles.css"

// export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export async function loader({ request }) {
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
}

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};