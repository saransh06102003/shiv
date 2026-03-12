import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", icon: "◍" },
  { to: "/category", label: "Categories", icon: "◫" },
  { to: "/category?wishlist=true", label: "Wishlist", icon: "♡" },
  { to: "/checkout", label: "Cart", icon: "◎" }
];

function MobileTabBar({ onOpenQuiz }) {
  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-3 z-40 mx-auto grid w-[calc(100%-1.2rem)] max-w-xl grid-cols-5 rounded-2xl border border-rose-100 bg-white/90 p-1.5 shadow-soft backdrop-blur md:hidden"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl py-2 text-[11px] font-semibold ${
              isActive ? "bg-rose-100 text-rose-700" : "text-rose-900/65"
            }`
          }
        >
          <span className="text-base leading-none" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="mt-1">{tab.label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => onOpenQuiz?.()}
        className="flex flex-col items-center justify-center rounded-xl py-2 text-[11px] font-semibold text-rose-900/65"
      >
        <span className="text-base leading-none" aria-hidden="true">
          ☺
        </span>
        <span className="mt-1">Profile</span>
      </button>
    </nav>
  );
}

export default MobileTabBar;
