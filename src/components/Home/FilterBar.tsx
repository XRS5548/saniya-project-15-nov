import React from "react";

type Props = {
  categories: string[];
  /**
   * Optional callback invoked when filter is applied.
   * Receives the selected category (string) or empty string if cleared.
   */
  onFilter?: (category: string) => void;
  /**
   * Optional initial value (will be used to preselect the select)
   */
  initialCategory?: string;
};

type State = {
  selected: string;
};

export default class FilterBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: props.initialCategory || "",
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selected: e.target.value });
  };

  applyFilter = () => {
    const { selected } = this.state;
    // Build new query string preserving other params (if any) except 'category'
    try {
      const url = new URL(window.location.href);
      if (selected && selected.length > 0) {
        url.searchParams.set("category", selected);
      } else {
        url.searchParams.delete("category");
      }
      // Use history.pushState so we don't reload the page but URL updates
      window.history.pushState({}, "", url.toString());

      // Notify parent if provided
      if (this.props.onFilter) this.props.onFilter(selected);
    } catch  {
      // Fallback: replace location.search
      const base = window.location.pathname;
      const qs = selected ? `?category=${encodeURIComponent(selected)}` : "";
      window.history.pushState({}, "", base + qs);
      if (this.props.onFilter) this.props.onFilter(selected);
    }
  };

  render() {
    const { categories } = this.props;
    const { selected } = this.state;

    const container: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "10px 12px",
      border: "1px solid #e6e6e6",
      borderRadius: 8,
      margin: "10px 0",
      background: "#fff",
    };

    const left: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: 1,
    };

    const selectStyle: React.CSSProperties = {
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #ccc",
      outline: "none",
      minWidth: 200,
      fontSize: 14,
    };

    const btnStyle: React.CSSProperties = {
      padding: "8px 14px",
      borderRadius: 6,
      border: "none",
      background: "#111827",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 14,
    };

    return (
      <div style={container}>
        <div style={left}>
          <label htmlFor="category-select" style={{ marginRight: 8, fontSize: 14 }}>
            Category:
          </label>
          <select
            id="category-select"
            value={selected}
            onChange={this.handleChange}
            style={selectStyle}
            aria-label="Select category"
          >
            <option value="">-- All categories --</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="button" onClick={this.applyFilter} style={btnStyle} aria-label="Apply filter">
            Filter
          </button>
        </div>
      </div>
    );
  }
}
