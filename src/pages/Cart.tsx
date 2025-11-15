import React, { useCallback, useEffect, useState } from "react";

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

const writeCartToStorage = (cart: CartItem[]) => {
  try {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  } catch {
    // ignore
  }
};

export default function Cart(): React.ReactElement {

  const [cart, setCart] = useState<CartItem[]>(() => readCart());

  const loadCart = useCallback(() => {
    const c = readCart();
    setCart(c);
  }, []);

  useEffect(() => {

    const onCartUpdated = () => loadCart();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") loadCart();
    };

    window.addEventListener("cart-updated", onCartUpdated as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart-updated", onCartUpdated as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadCart]);

  const increment = (id: number) => {
    const newCart = cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
    writeCartToStorage(newCart);
    setCart(newCart);
  };

  const decrement = (id: number) => {
    const newCart = cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c));
    writeCartToStorage(newCart);
    setCart(newCart);
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter((c) => c.id !== id);
    writeCartToStorage(newCart);
    setCart(newCart);
  };

  const clearCart = () => {
    try {
      sessionStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      // ignore
    }
    setCart([]);
  };

  const getTotal = () => cart.reduce((sum, it) => sum + it.price * it.qty, 0);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else (window.location.href = "/");
  };


  // style....

  const container: React.CSSProperties =
  {
    maxWidth: 1024,
    margin: "20px auto",
    padding: 16, boxSizing: "border-box"
  };


  const card: React.CSSProperties =
  {
    background: "#fff",
    padding: 14,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(2,6,23,0.04)"
  };


  const itemRow: React.CSSProperties =
  {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6"
  };

  const imgStyle: React.CSSProperties =
  {
    width: 88,
    height: 88,
    objectFit: "contain",
    background: "#fafafa",
    borderRadius: 8,
    padding: 8
  };

  const titleStyle: React.CSSProperties =
  {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a"
  };


  const priceStyle: React.CSSProperties =
  {
    fontWeight: 800,
    color: "#059669"
  };

  const qtyBox: React.CSSProperties =
  {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e5e7eb",
    padding: "6px 8px",
    borderRadius: 8
  };

  const btnPrimary: React.CSSProperties =
  {
    padding: "10px 14px",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800
  };


  const btnGhost: React.CSSProperties =
  {
    padding: "8px 12px",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer"
  };

  const btnDanger: React.CSSProperties =
  {
    padding: "8px 12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  };

  return (
    <div style={container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={btnGhost} onClick={goBack}>← Back</button>
          <h2 style={{ margin: 0 }}>Your Cart</h2>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnGhost} onClick={() => (window.location.href = "/")}>Continue Shopping</button>
          <button style={btnDanger} onClick={clearCart} disabled={cart.length === 0}>Clear Cart</button>
        </div>
      </div>

      <div style={card}>
        {cart.length === 0 ? (
          <div style={{ padding: 28, textAlign: "center", color: "#6b7280" }}>
            Your cart is empty.
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} style={itemRow}>
                <img src={item.image} alt={item.title} style={imgStyle} />

                <div style={{ flex: 1 }}>
                  <div style={titleStyle}>{item.title}</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={priceStyle}>₹ {item.price}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>Subtotal: ₹ {(item.price * item.qty).toFixed(2)}</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={qtyBox}>
                    <button style={btnGhost} onClick={() => decrement(item.id)} aria-label="Decrease">−</button>
                    <div style={{ minWidth: 28, textAlign: "center", fontWeight: 800 }}>{item.qty}</div>
                    <button style={btnGhost} onClick={() => increment(item.id)} aria-label="Increase">+</button>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={btnGhost} onClick={() => (window.location.href = `/productdetails?id=${encodeURIComponent(String(item.id))}`)}>View</button>
                    <button style={btnDanger} onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}


            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
              <div style={{ color: "#6b7280" }}>{cart.length} item(s)</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Total</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#059669" }}>₹ {getTotal().toFixed(2)}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button style={btnGhost} onClick={() => (window.location.href = "/")}>Continue Shopping</button>
                  <button style={btnPrimary} onClick={() => alert("Checkout not implemented in this assignment.")}>Checkout</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
