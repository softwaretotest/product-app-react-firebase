// Display list of products with basic states
import ProductCard from "@/features/product/components/ProductCard";

function ProductList({
  products,
  highlightId,
  actionType,
  setPreview,
  formatCurrency,
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
          loadingId={loadingId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ProductList;
