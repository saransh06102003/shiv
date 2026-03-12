function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
