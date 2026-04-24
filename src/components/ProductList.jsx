// Display list of products with basic states
import ProductCard from "./ProductCard";

function ProductList({
  products,
  highlightId,
  actionType,
  setPreview,
  formatCurrency,
  lang,
  loadingId,
  onEdit,
  onDelete,
}) {
  // Empty state
  if (!products.length) {
    return <p className="empty-state">No products found</p>;
  }

  return (
    <div className="list-container">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          highlightId={highlightId}
          actionType={actionType}
          setPreview={setPreview}
          formatCurrency={formatCurrency}
          lang={lang}
          loadingId={loadingId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ProductList;
