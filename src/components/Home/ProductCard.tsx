import React from "react";

interface Rating {
  rate: number;
  count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

/**
 * Props accept the full product fields directly.
 */
type Props = Product;

type State = {
  isSmall: boolean;
};

export default class ProductCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const isSmall =
      typeof window !== "undefined" ? window.innerWidth < 680 : false;
    this.state = { isSmall };
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
    const isSmall = window.innerWidth < 680;
    if (isSmall !== this.state.isSmall) {
      this.setState({ isSmall });
    }
  };

  goToDetails = () => {
    const { id } = this.props;
    const url = `/productdetails?id=${encodeURIComponent(String(id))}`;
    if (typeof window !== "undefined") window.location.href = url;
  };

  render() {
    const { title, price, image, category, rating, description } = this.props;
    const { isSmall } = this.state;

    // responsive adjustments
    const cardWidth = isSmall ? "100%" : 260;
    const imageHeight = isSmall ? 120 : 160;
    const padding = isSmall ? 10 : 14;
    const titleFontSize = isSmall ? 14 : 15;
    const descFontSize = isSmall ? 12 : 13;
    const btnPadding = isSmall ? "8px 10px" : "8px 12px";
    const gap = isSmall ? 8 : 10;

    const cardStyle: React.CSSProperties = {
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding,
      width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,
      background: "#ffffff",
      display: "flex",
      flexDirection: "column",
      gap,
      boxSizing: "border-box",
      boxShadow: "0 4px 10px rgba(2,6,23,0.04)",
      fontFamily:
        "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    };

    const imgStyle: React.CSSProperties = {
      width: "100%",
      height: imageHeight,
      objectFit: "contain",
      alignSelf: "center",
      background: "#fafafa",
      borderRadius: 6,
    };

    const titleStyle: React.CSSProperties = {
      fontWeight: 700,
      fontSize: titleFontSize,
      lineHeight: "18px",
      minHeight: isSmall ? 38 : 44,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    };

    const descStyle: React.CSSProperties = {
      fontSize: descFontSize,
      color: "#6b7280",
      minHeight: isSmall ? 34 : 40,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: isSmall ? 2 : 2,
      WebkitBoxOrient: "vertical",
    };

    const metaRow: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    };

    const categoryBadge: React.CSSProperties = {
      padding: "4px 8px",
      borderRadius: 999,
      background: "#111827",
      color: "#fff",
      fontSize: 12,
      fontWeight: 700,
    };

    const ratingStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      color: "#374151",
    };

    const priceStyle: React.CSSProperties = {
      fontWeight: 800,
      fontSize: isSmall ? 15 : 16,
      color: "#059669",
    };

    const btnStyle: React.CSSProperties = {
      marginTop: 8,
      padding: btnPadding,
      background: "#1f2937",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 800,
      fontSize: isSmall ? 13 : 14,
      alignSelf: "flex-start",
    };

    return (
      <article style={cardStyle} aria-label={title}>
        <img src={image} alt={title} style={imgStyle} />

        <div style={titleStyle}>{title}</div>

        <div style={descStyle} aria-hidden>
          {description}
        </div>

        <div style={metaRow}>
          <div style={categoryBadge}>{category}</div>

          <div
            style={ratingStyle}
            title={`Rating ${rating?.rate ?? "N/A"} (${rating?.count ?? 0})`}
          >
            <span aria-hidden style={{ color: "#f59e0b" }}>
              ★
            </span>
            <span style={{ fontWeight: 700 }}>{rating?.rate ?? "N/A"}</span>
            <span style={{ color: "#9ca3af", fontSize: 12 }}>
              ({rating?.count ?? 0})
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={priceStyle}>₹ {price}</div>
          <button style={btnStyle} onClick={this.goToDetails} aria-label="View product details">
            Details
          </button>
        </div>
      </article>
    );
  }
}
