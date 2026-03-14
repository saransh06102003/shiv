import { getBrandLogo } from "../data/brandAssets";

function BrandLogo({ brand, showName = false, className = "", imgClassName = "" }) {
  if (!brand) return null;
  const logo = getBrandLogo(brand);

  if (!logo) {
    return showName ? <span className={`brand-mark__name ${className}`.trim()}>{brand}</span> : null;
  }

  return (
    <span className={`brand-mark ${className}`.trim()}>
      <img
        src={logo}
        alt={`${brand} logo`}
        loading="lazy"
        decoding="async"
        className={`brand-mark__img ${imgClassName}`.trim()}
      />
      {showName ? <span className="brand-mark__name">{brand}</span> : null}
    </span>
  );
}

export default BrandLogo;
