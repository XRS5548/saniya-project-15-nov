import React, { useCallback, useEffect, useState } from "react";
import '../cart.css'

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

  return (
    <div className="ct-container">
      <div className="ct-header "style={{
        display:"flex",
        flexWrap:"wrap"
      }}>
        <div className="ct-header-left" style={{
          display:"flex",
          flexWrap:"wrap"
        }}>
          <button className="ct-btn-ghost" onClick={goBack}>
            ← Back
          </button>
          <h2 className="ct-title">Your Cart</h2>
        </div>

        <div className="ct-header-right">
          <button className="ct-btn-ghost" onClick={() => (window.location.href = "/")}>
            Continue Shopping
          </button>
          <button className="ct-btn-danger" onClick={clearCart} disabled={cart.length === 0}>
            Clear Cart
          </button>
        </div>
      </div>

      <div className="ct-card">
        {cart.length === 0 ? (
          <div className="ct-empty">Your cart is empty.</div>
        ) : (
          <>
            <div className="ct-items">
              {cart.map((item) => (
                <div key={item.id} className="ct-item-row">
                  <div className="ct-item-media">
                    <img src={item.image} alt={item.title} className="ct-img" />
                  </div>

                  <div className="ct-item-main">
                    <div className="ct-item-title">{item.title}</div>
                    <div className="ct-item-meta">
                      <div className="ct-price">₹ {item.price}</div>
                      <div className="ct-sub">Subtotal: ₹ {(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="ct-item-controls">
                    <div className="ct-qty-box">
                      <button className="ct-btn-ghost" onClick={() => decrement(item.id)} aria-label="Decrease">
                        −
                      </button>
                      <div className="ct-qty-value">{item.qty}</div>
                      <button className="ct-btn-ghost" onClick={() => increment(item.id)} aria-label="Increase">
                        +
                      </button>
                    </div>

                    <div className="ct-row-actions">
                      <button
                        className="ct-btn-ghost"
                        onClick={() => (window.location.href = `/productdetails?id=${encodeURIComponent(String(item.id))}`)}
                      >
                        View
                      </button>
                      <button className="ct-btn-danger-compact" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ct-summary">
              <div className="ct-items-count">{cart.length} item(s)</div>

              <div className="ct-summary-right">
                <div className="ct-total">
                  <div className="ct-total-label">Total</div>
                  <div className="ct-total-price">₹ {getTotal().toFixed(2)}</div>
                </div>

                <div className="ct-summary-actions">
                  <button className="ct-btn-ghost" onClick={() => (window.location.href = "/")}>
                    Continue Shopping
                  </button>
                  <button className="ct-btn-primary" onClick={() => alert("Checkout not implemented in this assignment.")}>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
