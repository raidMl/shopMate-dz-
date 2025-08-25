import React, { useEffect, useState } from 'react';
import useProducts from '../../hooks/useProducts';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
}

const ProductList: React.FC = () => {
  const { products, fetchProducts, deleteProduct, loading, error } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | undefined>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProductId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingProductId(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProductId(undefined);
    fetchProducts(); // Refresh the list
  };

  if (loading) return <div className="text-center py-4">Loading products...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found. Add your first product!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

        </div>
      )}

      {showForm && (
        <ProductForm
          productId={editingProductId}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default ProductList;