import React from "react";
import { Link } from "react-router-dom";

type Props = {
  cartCount?: number;
  onNavigate?: (path: string) => void;
};

type State = {
  small: boolean;
};

export default class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      small: typeof window !== "undefined" ? window.innerWidth < 600 : false,
    };
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.onResize);
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize);
    }
  }

  onResize = () => {
    const small = window.innerWidth < 600;
    if (small !== this.state.small) {
      this.setState({ small });
    }
  };

  handleNav = (path: string) => {
    if (this.props.onNavigate) this.props.onNavigate(path);
    else {
      if (typeof window !== "undefined") window.location.href = path;
    }
  };

  render() {
    const { cartCount = 0 } = this.props;
    const { small } = this.state;

    const navStyle: React.CSSProperties = {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#0f172a",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    };

    const leftStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 12,
      cursor: "pointer",
    };

    const brandStyle: React.CSSProperties = {
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 0.3,
      display: "flex",
      alignItems: "center",
      gap: 8,
    };

    const logoBox: React.CSSProperties = {
      width: 38,
      height: 38,
      borderRadius: 8,
      background: "linear-gradient(135deg,#06b6d4,#7c3aed)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 800,
      fontSize: 16,
      boxShadow: "0 2px 6px rgba(124,58,237,0.25)",
    };

    const centerStyle: React.CSSProperties = {
      display: small ? "none" : "flex",
      gap: 14,
      alignItems: "center",
    };

    const linkStyle: React.CSSProperties = {
      color: "rgba(255,255,255,0.9)",
      cursor: "pointer",
      padding: "6px 8px",
      borderRadius: 6,
      textDecoration: "none",
      fontSize: 14,
    };

    const rightStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 12,
    };

    const cartStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      padding: "6px 10px",
      borderRadius: 8,
      background: "rgba(255,255,255,0.06)",
      color: "#fff",
      fontSize: 14,
    };

    const badgeStyle: React.CSSProperties = {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      background: "#ef4444",
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      padding: "0 6px",
      fontWeight: 700,
    };

    return (
      <nav style={navStyle}>
        <div style={leftStyle} onClick={() => this.handleNav("/")}>
          <div style={logoBox}>S</div>
          <div style={brandStyle}>
            <span style={{ fontSize: 16 }}>Sembark</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginLeft: 6 }}>
              E-Shop
            </span>
          </div>
        </div>

        <div style={centerStyle}>
          <Link to={"/"} style={linkStyle}>Home</Link>
          <Link to={"#products"} style={linkStyle}>Products</Link>
          <Link to={"/about"} style={linkStyle}>About</Link>
        </div>

        <div style={rightStyle}>
          <div style={cartStyle} onClick={() => this.handleNav("/cart")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6h15l-1.5 9h-11L6 6z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1" fill="currentColor" />
              <circle cx="18" cy="20" r="1" fill="currentColor" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Cart</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                {cartCount} items
              </span>
            </div>
            <div style={badgeStyle}>{cartCount}</div>
          </div>
        </div>
      </nav>
    );
  }
}
