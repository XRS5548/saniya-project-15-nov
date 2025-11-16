// File: src/components/Details.tsx
import  { useEffect, useState } from "react";
import { getProductDetails } from "../api/products";
import '../details.css'
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

  const [detail, setDetail] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Render states
  if (loading) return <div className="dv-container">Loading...</div>;
  if (error) return <div className="dv-container">{error}</div>;
  if (!detail) return <div className="dv-container">Not found.</div>;

  const totalPrice = detail.price * (addedToCart ? cartQty : selectedQty);

  return (
    <div className="dv-container">
      <div className="dv-header">
        <button className="dv-btn-ghost" onClick={goBack}>
          ← Back
        </button>

        <div className="dv-actions-inline">
          <button
            className="dv-btn-ghost"
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(detail.title)}`, "_blank")}
          >
            Search
          </button>
        </div>
      </div>

      <div className="dv-card">
        <div className="dv-img-wrap">
          <img src={detail.image} alt={detail.title} className="dv-img" />
        </div>

        <div className="dv-content">
          <div>
            <h1 className="dv-title">{detail.title}</h1>

            <div className="dv-meta-row">
              <div className="dv-badge">{detail.category}</div>

              <div className="dv-rating" title={`Rating ${detail.rating.rate} (${detail.rating.count})`}>
                <span className="dv-star">★</span>
                <span className="dv-rating-value">{detail.rating.rate}</span>
                <span className="dv-rating-count">({detail.rating.count})</span>
              </div>
            </div>

            <div className="dv-price">₹ {formatPrice(detail.price)}</div>
          </div>

          <div>
            <div className="dv-desc">
              {descExpanded ? detail.description : detail.description.slice(0, 220) + (detail.description.length > 220 ? "..." : "")}
            </div>
            {detail.description.length > 220 && (
              <button onClick={() => setDescExpanded((s) => !s)} className="dv-btn-ghost dv-readmore" aria-expanded={descExpanded}>
                {descExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div className="dv-qty-row">
            <div className="dv-qty-left">
              <div className="dv-qty-label">Quantity</div>
              {!addedToCart ? (
                <div className="dv-qty-box">
                  <button className="dv-qty-btn" onClick={() => setSelectedQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                    −
                  </button>
                  <div className="dv-qty-value">{selectedQty}</div>
                  <button className="dv-qty-btn" onClick={() => setSelectedQty((q) => q + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              ) : (
                <div className="dv-incart-controls">
                  <button className="dv-btn-ghost" onClick={decrementCartQty} aria-label="Decrease in cart">
                    −
                  </button>
                  <div className="dv-cart-qty">{cartQty}</div>
                  <button className="dv-btn-ghost" onClick={incrementCartQty} aria-label="Increase in cart">
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="dv-total">
              <div className="dv-total-label">Total</div>
              <div className="dv-total-price">₹ {formatPrice(totalPrice)}</div>
            </div>
          </div>

          <div className="dv-action-row">
            {!addedToCart ? (
              <button className="dv-btn-primary" onClick={addToCart} aria-label="Add to cart">
                Add to Cart
              </button>
            ) : (
              <>
                <button className="dv-btn-primary dv-btn-disabled" disabled>
                  Added ✓
                </button>
                <button className="dv-btn-danger" onClick={removeFromCart} aria-label="Remove from cart">
                  Remove
                </button>
              </>
            )}

            <button className="dv-btn-ghost" onClick={() => (window.location.href = "/cart")}>View Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  File: src/components/Details.css
*/