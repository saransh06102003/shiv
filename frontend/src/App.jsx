import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import MobileTabBar from "./components/MobileTabBar";
import SkinQuizModal from "./components/SkinQuizModal";
import SplashScreen from "./components/SplashScreen";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import IngredientExplorerPage from "./pages/IngredientExplorerPage";
import ProductPage from "./pages/ProductPage";
import RoutineBuilderPage from "./pages/RoutineBuilderPage";
import {
  discoverySections as fallbackDiscoverySections,
  ingredients as fallbackIngredients,
  products as fallbackProducts,
  reviews as fallbackReviews
} from "./data/mockData";
import { fetchBootstrapData, fetchUserProfile, saveUserProfile } from "./lib/api";
import { profileScoreForProduct, sortProductsByProfile } from "./lib/personalization";

const STORAGE_KEYS = {
  profile: "skinmatch.profile",
  cart: "skinmatch.cart",
  wishlist: "skinmatch.wishlist",
  alerts: "skinmatch.alerts"
};

const DEFAULT_ALERTS = {
  priceDropProductIds: [],
  restockProductIds: [],
  routineReminder: {
    enabled: false,
    time: "21:00",
    frequency: "daily"
  }
};

function readStoredJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function App() {
  const location = useLocation();
  const [data, setData] = useState({
    products: fallbackProducts,
    ingredients: fallbackIngredients,
    discoverySections: fallbackDiscoverySections,
    reviews: fallbackReviews
  });
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [skinProfile, setSkinProfile] = useState(() => readStoredJSON(STORAGE_KEYS.profile, null));
  const [showQuiz, setShowQuiz] = useState(() => !readStoredJSON(STORAGE_KEYS.profile, null));
  const [cartItems, setCartItems] = useState(() => readStoredJSON(STORAGE_KEYS.cart, []));
  const [wishlistIds, setWishlistIds] = useState(() => readStoredJSON(STORAGE_KEYS.wishlist, []));
  const [alerts, setAlerts] = useState(() => readStoredJSON(STORAGE_KEYS.alerts, DEFAULT_ALERTS));
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  useEffect(() => {
    const startExitTimer = window.setTimeout(() => {
      setIsSplashExiting(true);
    }, 2300);

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2800);

    return () => {
      window.clearTimeout(startExitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const remoteData = await fetchBootstrapData();
        if (!isMounted) return;
        setData(remoteData);
        setApiError("");
      } catch (_error) {
        if (!isMounted) return;
        setApiError(
          "Using offline fallback data because backend API is unavailable. Start backend on http://localhost:8080 for the full catalog."
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchUserProfile("guest")
      .then((profile) => {
        if (!isMounted || !profile) return;
        setSkinProfile(profile);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(skinProfile));
  }, [skinProfile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
  }, [alerts]);

  const personalizedProducts = useMemo(
    () => sortProductsByProfile(data.products, skinProfile),
    [data.products, skinProfile]
  );

  const productsById = useMemo(
    () =>
      personalizedProducts.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {}),
    [personalizedProducts]
  );

  const featuredBrands = useMemo(
    () => [...new Set(personalizedProducts.map((product) => product.brand))].filter(Boolean).slice(0, 12),
    [personalizedProducts]
  );

  const personalizedDiscoverySections = useMemo(
    () =>
      data.discoverySections.map((section) => ({
        ...section,
        productIds: [...section.productIds].sort(
          (left, right) =>
            profileScoreForProduct(productsById[right] || {}, skinProfile) -
            profileScoreForProduct(productsById[left] || {}, skinProfile)
        )
      })),
    [data.discoverySections, productsById, skinProfile]
  );

  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((item) => item !== productId) : [...prev, productId]
    );
  };

  const toggleProductAlert = (key, productId) => {
    setAlerts((prev) => {
      const values = prev[key] || [];
      return {
        ...prev,
        [key]: values.includes(productId)
          ? values.filter((item) => item !== productId)
          : [...values, productId]
      };
    });
  };

  const updateRoutineReminder = (nextReminder) => {
    setAlerts((prev) => ({
      ...prev,
      routineReminder: {
        ...prev.routineReminder,
        ...nextReminder
      }
    }));
  };

  return (
    <div className={`min-h-screen bg-skin-gradient ${showSplash ? "h-screen overflow-hidden" : ""}`}>
      <Header
        products={personalizedProducts}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenQuiz={() => setShowQuiz(true)}
      />

      <main className="layout-container py-5 md:py-6">
        {apiError ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{apiError}</div>
        ) : null}
        {isLoading ? (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-rose-900/70">
            Loading SkinMatch catalog...
          </div>
        ) : null}

        <div key={location.pathname} className="motion-safe:animate-fade-up">
          <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={personalizedProducts}
                ingredients={data.ingredients}
                featuredBrands={featuredBrands}
                discoverySections={personalizedDiscoverySections}
                reviews={data.reviews}
                skinProfile={skinProfile}
                isLoading={isLoading}
                onOpenQuiz={() => setShowQuiz(true)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
              />
            }
          />
          <Route
            path="/category"
            element={
              <CategoryPage
                products={personalizedProducts}
                skinProfile={skinProfile}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductPage
                products={personalizedProducts}
                ingredients={data.ingredients}
                reviews={data.reviews}
                skinProfile={skinProfile}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
                alerts={alerts}
                onTogglePriceAlert={(productId) => toggleProductAlert("priceDropProductIds", productId)}
                onToggleRestockAlert={(productId) => toggleProductAlert("restockProductIds", productId)}
              />
            }
          />
          <Route
            path="/routine-builder"
            element={
              <RoutineBuilderPage
                products={personalizedProducts}
                routineReminder={alerts.routineReminder}
                onUpdateRoutineReminder={updateRoutineReminder}
              />
            }
          />
          <Route
            path="/ingredient-explorer"
            element={<IngredientExplorerPage ingredients={data.ingredients} products={personalizedProducts} />}
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={cartItems}
                productsById={productsById}
                onUpdateCartQty={updateCartQuantity}
                onRemoveFromCart={removeFromCart}
                onClearCart={() => setCartItems([])}
              />
            }
          />
          </Routes>
        </div>
      </main>

      <MobileTabBar onOpenQuiz={() => setShowQuiz(true)} />

      <SkinQuizModal
        open={showQuiz}
        initialProfile={skinProfile}
        onClose={() => setShowQuiz(false)}
        onSave={async (profile) => {
          setSkinProfile(profile);
          setShowQuiz(false);
          try {
            const saved = await saveUserProfile({ userId: "guest", ...profile });
            if (saved) setSkinProfile(saved);
          } catch (_error) {
            // local profile fallback already set
          }
        }}
      />

      {showSplash ? <SplashScreen exiting={isSplashExiting} /> : null}
    </div>
  );
}

export default App;
