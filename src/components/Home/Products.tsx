import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProducts, getProductsByCategory } from "../../api/products"; // ensure getProductsByCategory exists

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

type Props = {
  category?: string;
};

export default function Products({ category }: Props) {
  // read category from prop or from URL ?category=
  const getCategoryFromUrl = () => {
    try {
      return new URLSearchParams(window.location.search).get("category") || "";
    } catch {
      return "";
    }
  };

  const initialCat = category || getCategoryFromUrl();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(initialCat);

  async function loadProductsForCategory(cat: string) {
    setLoading(true);
    setError(null);
    try {
      let data: Product[] = [];
      if (cat && cat.length > 0) {
        // call API endpoint for category (preferred)
        // fallback to getAllProducts if API doesn't support category
        try {
          data = (await getProductsByCategory(cat)) as Product[];
        } catch  {
          // fallback: fetch all and filter locally (only if API lacks category endpoint)
          const all = (await getAllProducts()) as Product[];
          data = all.filter((p) => p.category === cat);
        }
      } else {
        data = (await getAllProducts()) as Product[];
      }
      setProducts(data);
    } catch  {
      console.error("Failed to load products:");
      setError("Failed to load products");
      setProducts(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    loadProductsForCategory(activeCategory);

    // handle back/forward or pushState changes -> refetch based on URL param
    const onPop = () => {
      const urlCat = getCategoryFromUrl();
      setActiveCategory(urlCat);
      loadProductsForCategory(urlCat);
    };

    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // watch for prop category changes and update
  useEffect(() => {
    const catFromUrl = getCategoryFromUrl();
    const newCat = category ?? catFromUrl ?? "";
    if (newCat !== activeCategory) {
      setActiveCategory(newCat);
      loadProductsForCategory(newCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // simple grid style
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
    padding: 12,
    boxSizing: "border-box",
  };

  if (loading) {
    return <div style={{ padding: 16 }}>Loading products...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: "#b91c1c" }}>
        Error loading products: {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div style={{ padding: 16 }}>No products found.</div>;
  }

  return (
    <div style={gridStyle}>
      {products.map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          title={item.title}
          price={item.price}
          description={item.description}
          category={item.category}
          image={item.image}
          rating={item.rating}
        />
      ))}
    </div>
  );
}
