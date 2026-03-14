import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import MobileTabBar from "./components/MobileTabBar";
import SkinQuizModal from "./components/SkinQuizModal";
import SplashScreen from "./components/SplashScreen";
import BeautyAssistant from "./components/BeautyAssistant";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CatalogPage from "./pages/CatalogPage";
import HomePage from "./pages/HomePage";
import IngredientExplorerPage from "./pages/IngredientExplorerPage";
import GiftMessagePage from "./pages/GiftMessagePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import RoutineBuilderPage from "./pages/RoutineBuilderPage";
import SkinAnalyzerPage from "./pages/SkinAnalyzerPage";
import SkinProfileDashboard from "./pages/SkinProfileDashboard";
import WishlistPage from "./pages/WishlistPage";
import {
  discoverySections as fallbackDiscoverySections,
  ingredients as fallbackIngredients,
  products as fallbackProducts,
  reviews as fallbackReviews
} from "./data/mockData";
import { fetchBootstrapData, fetchUserProfile, saveUserProfile } from "./lib/api";
import { sortProductsByProfile } from "./lib/personalization";

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
  const navigate = useNavigate();
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
  const [cartPulse, setCartPulse] = useState(false);
  const [toast, setToast] = useState(null);

  const effectiveProfile = useMemo(() => {
    if (skinProfile) return skinProfile;
    if (typeof window === "undefined") return null;
    const storedSkinType = localStorage.getItem("skinType");
    return storedSkinType ? { skinType: storedSkinType } : null;
  }, [skinProfile]);

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
    () => sortProductsByProfile(data.products, effectiveProfile),
    [data.products, effectiveProfile]
  );

  const productsById = useMemo(
    () =>
      personalizedProducts.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {}),
    [personalizedProducts]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const product = productsById[item.productId];
        if (!product) return total;
        const price = Math.round(product.price * (1 - product.discountPct / 100));
        return total + price * Number(item.quantity || 0);
      }, 0),
    [cartItems, productsById]
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
    setCartPulse(true);
    setToast("✨ Added to your beauty bag!");
    window.setTimeout(() => setCartPulse(false), 500);
    window.setTimeout(() => setToast(null), 1800);
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
      <div className="site-banner">
        <span>🎁 Send Beauty Gifts With A Personal Voice Message</span>
        <p>Only on OpenLeaf Beauty · Personalized Voice Gifts</p>
      </div>
      <Header
        products={personalizedProducts}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        cartPulse={cartPulse}
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
                skinProfile={effectiveProfile}
                ingredients={data.ingredients}
                isLoading={isLoading}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
                onOpenAnalyzer={() => setShowQuiz(true)}
              />
            }
          />
          <Route
            path="/catalog"
            element={
              <CatalogPage
                products={personalizedProducts}
                skinProfile={effectiveProfile}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/category"
            element={
              <CategoryPage
                products={personalizedProducts}
                skinProfile={effectiveProfile}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
                isLoading={isLoading}
                onOpenAnalyzer={() => setShowQuiz(true)}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                products={personalizedProducts}
                wishlistSet={wishlistSet}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                productsById={productsById}
                onUpdateCartQty={updateCartQuantity}
                onRemoveFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/skin-analyzer"
            element={<SkinAnalyzerPage skinProfile={effectiveProfile} onOpenAnalyzer={() => setShowQuiz(true)} />}
          />
          <Route
            path="/skin-profile"
            element={
              <SkinProfileDashboard
                products={personalizedProducts}
                skinProfile={effectiveProfile}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlistSet={wishlistSet}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                skinProfile={effectiveProfile}
                wishlistCount={wishlistIds.length}
                cartCount={cartCount}
              />
            }
          />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route
            path="/product/:productId"
            element={
              <ProductPage
                products={personalizedProducts}
                ingredients={data.ingredients}
                reviews={data.reviews}
                skinProfile={effectiveProfile}
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
          <Route path="/gift/:giftId" element={<GiftMessagePage />} />
          </Routes>
        </div>
      </main>

      {cartCount > 0 ? (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto w-[calc(100%-1.2rem)] max-w-xl md:hidden">
          <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-white/95 px-4 py-3 shadow-card backdrop-blur">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700/70">In your bag</p>
              <p className="text-sm font-semibold text-skin-ink">
                {cartCount} items • Rs {cartSubtotal}
              </p>
            </div>
            <button type="button" onClick={() => navigate("/cart")} className="btn-primary !px-4 !py-2">
              View cart
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="toast-banner">
          {toast}
        </div>
      ) : null}

      <MobileTabBar />

      <BeautyAssistant products={personalizedProducts} skinProfile={effectiveProfile} onAddToCart={addToCart} />

      <SkinQuizModal
        open={showQuiz}
        initialProfile={skinProfile}
        onClose={() => setShowQuiz(false)}
        onSave={async (profile) => {
          if (typeof window !== "undefined" && profile?.skinType) {
            localStorage.setItem("skinType", profile.skinType);
          }
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
