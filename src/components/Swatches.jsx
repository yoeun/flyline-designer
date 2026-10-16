export default function Swatches({ colors, value, onChange, label, size = 32, marked }) {
  return (
    <div className="swatches" role="radiogroup" aria-label={label}>
      {colors.map((c) => (
        <button
          key={c.id}
          type="button"
          role="radio"
          aria-checked={value === c.id}
          aria-label={marked === c.id ? `${c.name} (suggested)` : c.name}
          title={c.name}
          className={`swatch${value === c.id ? ' is-selected' : ''}${marked === c.id ? ' is-marked' : ''}`}
          style={{ '--swatch': c.hex, '--size': `${size}px` }}
          onClick={() => onChange(c.id)}
        />
      ))}
    </div>
  );
}
