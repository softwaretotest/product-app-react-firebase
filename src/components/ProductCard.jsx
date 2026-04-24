import { LANG } from "../i18n";
// Display single product card
function ProductCard({
  product,
  highlightId,
  actionType,
  setPreview,
  formatCurrency,
  lang,
  loadingId,
  onEdit,
  onDelete,
}) {
  const L = LANG[lang];
  return (
    <div
      className={`card ${product.id === highlightId ? "highlight" : ""}`}
      id={product.id}
    >
      {product.id === highlightId && (
        <span className="badge-new">
          {actionType === "edit" ? L.update : L.new}
        </span>
      )}

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => setPreview(product.image)}
        />
      )}

      <h3>{product.name}</h3>

      <p>
        {L.price}: {formatCurrency(product.price, lang)} {L.currency}
      </p>

      <p>
        {L.stock}: {product.stock} {L.piece}
      </p>

      <button className="btn-edit" onClick={() => onEdit(product)}>
        {L.edit}
      </button>

      <button
        disabled={loadingId === product.id}
        className="btn-delete"
        onClick={() => onDelete(product.id, product.name)}
      >
        {loadingId === product.id ? "..." : L.delete}
      </button>
    </div>
  );
}

export default ProductCard;
