import { toast } from "sonner";

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "lovable-project-milns.myshopify.com";
const SHOPIFY_STOREFRONT_URL =
  `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Note: Shopify Storefront tokens are designed for client-side use with read-only access to public data
const SHOPIFY_STOREFRONT_TOKEN = "9daedc472c5910e742ec88bdaad108e2";

// Sanitize search input to prevent GraphQL injection
function sanitizeSearchTerm(term: string): string {
  // Remove special characters that could break GraphQL queries
  return term.replace(/[^a-zA-Z0-9\s\-\u0600-\u06FF]/g, "").slice(0, 100);
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    vendor?: string;
    productType?: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs to be upgraded to a paid plan.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const graphqlResponse = await response.json();

  if (graphqlResponse.errors) {
    throw new Error(
      `Error calling Shopify: ${
        graphqlResponse.errors.map((shopifyError: { message: string }) => shopifyError.message).join(", ")
      }`,
    );
  }

  return graphqlResponse;
}

// Paginated query for large catalogs (2000+ products)
const STOREFRONT_PRODUCTS_PAGINATED_QUERY = `
  query GetProductsPaginated($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          description
          handle
          vendor
          productType
          tags
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 3) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

// Simple query for initial load (backwards compatibility)
const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          vendor
          productType
          tags
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 3) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      vendor
      productType
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

// Pagination response type
export interface PaginatedProductsResponse {
  products: ShopifyProduct[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

// Fetch products with pagination support for large catalogs
export async function fetchProductsPaginated(
  first: number = 24,
  after?: string | null,
  query?: string,
): Promise<PaginatedProductsResponse> {
  const apiResponse = await storefrontApiRequest(STOREFRONT_PRODUCTS_PAGINATED_QUERY, {
    first,
    after: after || null,
    query,
  });

  if (!apiResponse) {
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  return {
    products: apiResponse.data.products.edges,
    pageInfo: apiResponse.data.products.pageInfo,
  };
}

// Simple fetch for backwards compatibility
export async function fetchProducts(
  first: number = 24,
  query?: string,
): Promise<ShopifyProduct[]> {
  const apiResponse = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, {
    first,
    query,
  });
  if (!apiResponse) return [];
  return apiResponse.data.products.edges;
}

export async function searchProducts(
  searchTerm: string,
  first: number = 10,
): Promise<ShopifyProduct[]> {
  if (!searchTerm.trim()) return [];
  const sanitized = sanitizeSearchTerm(searchTerm);
  if (!sanitized) return [];
  const query = `title:*${sanitized}* OR vendor:*${sanitized}*`;
  const apiResponse = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, {
    first,
    query,
  });
  if (!apiResponse) return [];
  return apiResponse.data.products.edges;
}

export async function fetchProductByHandle(handle: string) {
  const apiResponse = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });
  if (!apiResponse) return null;
  return apiResponse.data.productByHandle;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createStorefrontCheckout(
  items: Array<{ variantId: string; quantity: number }>,
): Promise<string> {
  const lines = items.map((item) => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const cartApiResponse = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines },
  });

  if (!cartApiResponse) {
    throw new Error("Failed to create checkout");
  }

  if (cartApiResponse.data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${
        cartApiResponse.data.cartCreate.userErrors.map((userError: { message: string }) =>
          userError.message
        ).join(", ")
      }`,
    );
  }

  const cart = cartApiResponse.data.cartCreate.cart;

  if (!cart.checkoutUrl) {
    throw new Error("No checkout URL returned from Shopify");
  }

  const url = new URL(cart.checkoutUrl);
  url.searchParams.set("channel", "online_store");
  return url.toString();
}
