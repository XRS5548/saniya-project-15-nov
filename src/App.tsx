import  { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Cart from "./pages/Cart";
import Navbar from "./components/layout/navbar";
// import Footer from "./components/Home/Footer";

type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

 
function readCart(): CartItem[] {
  try {
    const text = sessionStorage.getItem("cart");
    if (!text) return [];
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

 
function computeCartTotalQty(): number {
  const cart = readCart();
  return cart.reduce((s, it) => s + (Number(it.qty) || 0), 0);
}

 

export default function App() {
   
  const [cartCount, setCartCount] = useState<number>(() => computeCartTotalQty());

  useEffect(() => {
    
    const onCartUpdated = () => {
      setCartCount(computeCartTotalQty());
    };

     
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        setCartCount(computeCartTotalQty());
      }
    };

    window.addEventListener("cart-updated", onCartUpdated as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart-updated", onCartUpdated as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);  

  return (
    <div>
      <BrowserRouter>
        <Navbar cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productdetails" element={<Details />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
         {/* <Footer/> */}
      </BrowserRouter>
    </div>
  );
}
