import React, { useEffect, useState } from "react";
import { getProductDetails } from "../api/products";

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

 
interface CartItem {
  id: number;
  title: string;
  price: number;
  qty: number;
  image: string;
}

export default function Details() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");

  const [detail, setDetail] = useState <Product | null>(null);
  const [loading, setLoading] = useState <boolean>(true);
  const [error, setError] = useState <string | null>(null);

   
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [cartQty, setCartQty] = useState<number>(0); 
  const [selectedQty, setSelectedQty] = useState<number>(1);  
  const [descExpanded, setDescExpanded] = useState<boolean>(false);

 
  const readCart = (): CartItem[] => {
    try {
      const raw = sessionStorage.getItem("cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  };

   
  const writeCart = (cart: CartItem[]) => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  };

   
  const hydrateCartState = (id: number) => {
    const cart = readCart();
    const item = cart.find((c) => c.id === id);
    if (item) {
      setAddedToCart(true);
      setCartQty(Number(item.qty) || 0);
    } else {
      setAddedToCart(false);
      setCartQty(0);
    }
  };

  useEffect(() => {
    if (!idParam) {
      setError("Product id not provided in URL.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    getProductDetails(idParam)
      .then((data: Product) => {
        if (!mounted) return;
        setDetail(data);
        setLoading(false);
        hydrateCartState(data.id);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Failed to load product:", err);
        setError(err?.message || "Failed to load product details.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else (window.location.href = "/");
  };

  
  const addToCart = () => {
    if (!detail) return;
    const cart = readCart();
    const idx = cart.findIndex((c) => c.id === detail.id);
    if (idx >= 0) {
      cart[idx].qty = Number(cart[idx].qty || 0) + Number(selectedQty || 1);
    } else {
      cart.push({
        id: detail.id,
        title: detail.title,
        price: detail.price,
        qty: Number(selectedQty || 1),
        image: detail.image,
      });
    }
    writeCart(cart);
    setAddedToCart(true);
    setCartQty((prev) => prev + Number(selectedQty || 1));
  };

 
  const removeFromCart = () => {
    if (!detail) return;
    let cart = readCart();
    cart = cart.filter((c) => c.id !== detail.id);
    writeCart(cart);
    setAddedToCart(false);
    setCartQty(0);
  };

 
  const decrementCartQty = () => {
    if (!detail) return;
    const cart = readCart();
    const idx = cart.findIndex((c) => c.id === detail.id);
    if (idx >= 0) {
      cart[idx].qty = Number(cart[idx].qty) - 1;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
        setAddedToCart(false);
        setCartQty(0);
      } else {
        setCartQty(cart[idx].qty);
      }
      writeCart(cart);
    }
  };
 
  const incrementCartQty = () => {
    if (!detail) return;
    const cart = readCart();
    const idx = cart.findIndex((c) => c.id === detail.id);
    if (idx >= 0) {
      cart[idx].qty = Number(cart[idx].qty) + 1;
      setCartQty(cart[idx].qty);
      writeCart(cart);
    } else {
       
      cart.push({ id: detail.id, title: detail.title, price: detail.price, qty: 1, image: detail.image });
      setAddedToCart(true);
      setCartQty(1);
      writeCart(cart);
    }
  };

   
  const formatPrice = (p: number) => {
     
    return p % 1 === 0 ? p.toString() : p.toFixed(2);
  };

 
  const container: React.CSSProperties = {
    maxWidth: 1024,
    margin: "18px auto",
    padding: 16,
    boxSizing: "border-box",
  };

  const card: React.CSSProperties = {
    display: "flex",
    gap: 20,
    background: "#fff",
    padding: 18,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    alignItems: "flex-start",
  };

  const imgWrap: React.CSSProperties = {
    minWidth: 340,
    maxWidth: 420,
    height: 420,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fafafa",
    borderRadius: 8,
    padding: 12,
  };

  const imgStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  };

  const metaRow: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 6 };

  const badgeStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    background: "#111827",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
  };

  const ratingStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, color: "#374151" };

  const priceStyle: React.CSSProperties = { fontSize: 24, fontWeight: 900, color: "#059669" };

  const descStyle: React.CSSProperties = { color: "#374151", lineHeight: 1.6, fontSize: 15 };

  const actions: React.CSSProperties = { display: "flex", gap: 12, marginTop: 12, alignItems: "center" };

  const btnPrimary: React.CSSProperties = {
    padding: "10px 14px",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800,
  };

  const btnDanger: React.CSSProperties = {
    padding: "10px 14px",
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800,
  };

  const btnGhost: React.CSSProperties = {
    padding: "8px 12px",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
  };

  const qtyBox: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e5e7eb",
    padding: "6px 8px",
    borderRadius: 8,
  };

  // Render states
  if (loading) return <div style={container}>Loading...</div>;
  if (error) return <div style={container}>{error}</div>;
  if (!detail) return <div style={container}>Not found.</div>;

  const totalPrice = detail.price * (addedToCart ? cartQty : selectedQty);

  return (
    <div style={container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button style={btnGhost} onClick={goBack}>
          ← Back
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={btnGhost}
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(detail.title)}`, "_blank")}
          >
            Search
          </button>
        </div>
      </div>

      <div style={card}>
        <div style={imgWrap}>
          <img src={detail.image} alt={detail.title} style={imgStyle} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>{detail.title}</h1>

            <div style={metaRow}>
              <div style={badgeStyle}>{detail.category}</div>

              <div style={ratingStyle} title={`Rating ${detail.rating.rate} (${detail.rating.count})`}>
                <span style={{ color: "#f59e0b", fontSize: 16 }}>★</span>
                <span style={{ fontWeight: 800 }}>{detail.rating.rate}</span>
                <span style={{ color: "#9ca3af", fontSize: 13 }}>({detail.rating.count})</span>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={priceStyle}>₹ {formatPrice(detail.price)}</div>
            </div>
          </div>

          <div>
            <div style={descStyle}>
              {descExpanded ? detail.description : detail.description.slice(0, 220) + (detail.description.length > 220 ? "..." : "")}
            </div>
            {detail.description.length > 220 && (
              <button
                onClick={() => setDescExpanded((s) => !s)}
                style={{ marginTop: 8, ...btnGhost, fontSize: 13 }}
                aria-expanded={descExpanded}
              >
                {descExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Quantity</div>
                {!addedToCart ? (
                  <div style={qtyBox}>
                    <button
                      style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: 800 }}
                      onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div style={{ minWidth: 28, textAlign: "center", fontWeight: 800 }}>{selectedQty}</div>
                    <button
                      style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: 800 }}
                      onClick={() => setSelectedQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={decrementCartQty} style={btnGhost} aria-label="Decrease in cart">
                      −
                    </button>
                    <div style={{ minWidth: 36, textAlign: "center", fontWeight: 800 }}>{cartQty}</div>
                    <button onClick={incrementCartQty} style={btnGhost} aria-label="Increase in cart">
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Total</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#059669" }}>₹ {formatPrice(totalPrice)}</div>
            </div>
          </div>

          <div style={actions}>
            {!addedToCart ? (
              <button style={btnPrimary} onClick={addToCart} aria-label="Add to cart">
                Add to Cart
              </button>
            ) : (
              <>
                <button style={{ ...btnPrimary, opacity: 0.9 }} disabled>
                  Added ✓
                </button>
                <button style={btnDanger} onClick={removeFromCart} aria-label="Remove from cart">
                  Remove
                </button>
              </>
            )}

            <button
              style={btnGhost}
              onClick={() => {
                // go to cart page
                window.location.href = "/cart";
              }}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
