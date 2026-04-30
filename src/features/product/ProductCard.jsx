// ProductCard.jsx
import { L, getCurrencyLabel } from "@/i18n";
import { Button } from "@/components/Button";

// Display single product card
function ProductCard({
  product,
  highlightId,
  actionType,
  setPreview,
  formatCurrency,
  loadingId,
  onEdit,
  onDelete,
}) {
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
          className="img-product img-product--card"
          onClick={() => setPreview(product.image)}
        />
      )}

      <h3>{product.name}</h3>

      <p>
        {L.price}: {formatCurrency(product.price)} {getCurrencyLabel()}
      </p>

      <p>
        {L.stock}: {product.stock} {L.piece}
      </p>

      <Button
        className="btn-edit"
        children={L.edit}
        onClick={() => onEdit(product)}
      />

      <Button
        disabled={loadingId === product.id}
        className="btn-delete"
        onClick={() => onDelete(product.id, product.name)}
      >
        {loadingId === product.id ? "..." : L.delete}
      </Button>
    </div>
  );
}

export default ProductCard;
