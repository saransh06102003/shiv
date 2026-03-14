import BrandLogo from "./BrandLogo";

function FilterGroup({ title, items, selected, onToggle, renderItem }) {
  return (
    <div className="border-b border-rose-100 pb-4 last:border-b-0">
      <h3 className="mb-3 text-sm font-semibold text-skin-ink">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-2 text-sm text-rose-900/80">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="h-4 w-4 rounded border-rose-200 text-rose-500 focus:ring-rose-300"
            />
            {renderItem ? renderItem(item) : <span>{item}</span>}
          </label>
        ))}
      </div>
    </div>
  );
}

function FilterSidebar({ filters, setFilters, allSkinTypes, allConcerns, allIngredients, allBrands }) {
  const toggleValue = (key, value) => {
    setFilters((prev) => {
      const hasValue = prev[key].includes(value);
      return {
        ...prev,
        [key]: hasValue ? prev[key].filter((item) => item !== value) : [...prev[key], value]
      };
    });
  };

  return (
    <aside className="glass-card sticky top-36 h-fit space-y-4 p-4">
      <FilterGroup
        title="Skin Type"
        items={allSkinTypes}
        selected={filters.skinTypes}
        onToggle={(value) => toggleValue("skinTypes", value)}
      />

      <FilterGroup
        title="Skin Concern"
        items={allConcerns}
        selected={filters.concerns}
        onToggle={(value) => toggleValue("concerns", value)}
      />

      <FilterGroup
        title="Ingredient Include"
        items={allIngredients}
        selected={filters.ingredientInclude}
        onToggle={(value) => toggleValue("ingredientInclude", value)}
      />

      <FilterGroup
        title="Ingredient Exclude"
        items={["fragrance", "alcohol", "parabens", ...allIngredients].slice(0, 8)}
        selected={filters.ingredientExclude}
        onToggle={(value) => toggleValue("ingredientExclude", value)}
      />

      <FilterGroup
        title="Brand"
        items={allBrands}
        selected={filters.brands}
        onToggle={(value) => toggleValue("brands", value)}
        renderItem={(brand) => (
          <BrandLogo brand={brand} showName className="brand-mark--filter" imgClassName="brand-mark__img--xs" />
        )}
      />

      <div className="space-y-3 border-b border-rose-100 pb-4">
        <h3 className="text-sm font-semibold text-skin-ink">Price Range</h3>
        <label className="block text-xs text-rose-900/75">
          Min Rs {filters.minPrice}
          <input
            type="range"
            min="100"
            max="5000"
            value={filters.minPrice}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, minPrice: Number(event.target.value) }))
            }
            className="mt-2 w-full accent-rose-500"
          />
        </label>
        <label className="block text-xs text-rose-900/75">
          Max Rs {filters.maxPrice}
          <input
            type="range"
            min="100"
            max="5000"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, maxPrice: Number(event.target.value) }))
            }
            className="mt-2 w-full accent-rose-500"
          />
        </label>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-skin-ink">Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5].map((score) => (
            <label key={score} className="flex items-center gap-2 text-sm text-rose-900/80">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === score}
                onChange={() => setFilters((prev) => ({ ...prev, minRating: score }))}
                className="h-4 w-4 border-rose-200 text-rose-500 focus:ring-rose-300"
              />
              {score}+ stars
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
