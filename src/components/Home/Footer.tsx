 
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

const readCart = (): CartItem[] => {
  try {
    const raw = sessionStorage.getItem("cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
};

const sumQty = (cart: CartItem[]) => cart.reduce((s, it) => s + (Number(it.qty) || 0), 0);

export default function Footer(): React.ReactElement {
  const [count, setCount] = useState<number>(() => sumQty(readCart()));

  useEffect(() => {
    const onCartUpdated = () => setCount(sumQty(readCart()));
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") setCount(sumQty(readCart()));
    };

    window.addEventListener("cart-updated", onCartUpdated as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart-updated", onCartUpdated as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const footerStyle: React.CSSProperties = {
    width: "100%",
    borderTop: "1px solid #e6e7eb",
    padding: "12px 20px",
    boxSizing: "border-box",
    background: "rgb(15, 23, 42)",
    display: "flex",
    justifyContent: "space-between",
    color:"white",
    alignItems: "center",
    gap: 12,
    position: "sticky",
    bottom: 0,
    zIndex: 40,
  };

  const navStyle: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
  const linkStyle: React.CSSProperties = { color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 };
  const brandStyle: React.CSSProperties = { fontWeight: 900, fontSize: 16, color: "#fff" };
  const cartBadgeWrap: React.CSSProperties = { position: "relative", display: "inline-block" };
  const cartBtn: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
  };
  const badge: React.CSSProperties = {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    background: "#ef4444",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
    padding: "0 6px",
  };

  return (
    <footer style={footerStyle}>
      <div style={navStyle}>
        <div style={brandStyle}>Sembark</div>
        <nav style={{ marginLeft: 12, display: "flex", gap: 10 }}>
          <Link style={linkStyle} to="/">Home</Link>
          <Link style={linkStyle} to="/cart">Cart</Link>
        </nav>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ color: "#6b7280", fontSize: 13 }}>© {new Date().getFullYear()} Sembark</div>

        <div style={cartBadgeWrap}>
          <button
            style={cartBtn}
            onClick={() => {
              window.location.href = "/cart";
            }}
            aria-label="View cart"
          >
            🛒 Cart
          </button>
          {count > 0 && <div style={badge}>{count}</div>}
        </div>
      </div>
    </footer>
  );
}
