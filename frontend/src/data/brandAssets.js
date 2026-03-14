export const brandLogos = {
  Maybelline: "/brand-logos/maybelline.svg",
  Lakme: "/brand-logos/lakme.jpg",
  "L'Oreal Paris": "/brand-logos/loreal.svg",
  MAC: "/brand-logos/mac.png",
  "The Ordinary": "/brand-logos/the-ordinary.svg",
  Cetaphil: "/brand-logos/cetaphil.png",
  Mamaearth: "/brand-logos/mamaearth.png",
  COSRX: "/brand-logos/cosrx.png",
  Innisfree: "/brand-logos/innisfree.png",
  Neutrogena: "/brand-logos/neutrogena.svg",
  "The Face Shop": "/brand-logos/the-face-shop.svg",
  "Dot & Key": "/brand-logos/dot-and-key.webp",
  Laneige: "/brand-logos/laneige.webp",
  "Beauty of Joseon": "/brand-logos/beauty-of-joseon.webp"
};

export const getBrandLogo = (brand) => brandLogos[brand] || null;
