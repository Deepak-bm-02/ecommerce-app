
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const url = new URL(API_URL);
        if (search.trim()) {
          url.searchParams.set("search", search.trim());
        }

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load products. Check that your backend is running.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [search]);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="/">ShopEase</a>
        <span className="nav-label">Your everyday shopping store</span>
      </header>

      <main className="container">
        <section className="hero">
          <p className="eyebrow">WELCOME TO SHOPEASE</p>
          <h1>Find your next favourite.</h1>
          <p>Explore our products and discover something useful.</p>

          <input
            className="search-input"
            type="search"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
        </section>

        <section className="products-section">
          <div className="section-heading">
            <div>
              <h2>Our Products</h2>
              <p>Products loaded from your MySQL database</p>
            </div>
            <span className="product-count">
              {products.length} products
            </span>
          </div>

          {loading && <p className="message">Loading products...</p>}

          {!loading && error && (
            <p className="message error">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="message">No matching products found.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="image-placeholder">
                      {product.name}
                    </span>
                  </div>

                  <div className="product-details">
                    <span className="category-label">
                      Category #{product.category_id}
                    </span>

                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>

                    <div className="product-footer">
                      <span className="price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>

                      <span className={product.stock_quantity > 0 ? "in-stock" : "out-stock"}>
                        {product.stock_quantity > 0
                          ? "In stock"
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        ShopEase · E-Commerce Web Application
      </footer>
    </div>
  );
}

export default App;
