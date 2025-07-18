import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface ProductManagerProps {
  isAdmin: boolean;
}

function ProductManager({ isAdmin }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'shop_items'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  // Add new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setIsUploading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await addDoc(collection(firestore, 'shop_items'), {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl
      });

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImagePreview('');
      
      // Refresh products
      await fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    } finally {
      setIsUploading(false);
    }
  };

  // Start editing product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setImagePreview(product.image || '');
    setImageFile(null);
  };

  // Update product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingProduct) return;

    setIsUploading(true);
    try {
      let imageUrl = editingProduct.image || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productRef = doc(firestore, 'shop_items', editingProduct.id);
      await updateDoc(productRef, {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl
      });

      // Reset form
      setEditingProduct(null);
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImagePreview('');
      
      // Refresh products
      await fetchProducts();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(firestore, 'shop_items', productId));
        await fetchProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageFile(null);
    setImagePreview('');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '18px',
        color: '#718096'
      }}>
        🔄 Loading products...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Admin Form */}
      {isAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              fontSize: '24px'
            }}>
              {editingProduct ? '✏️' : '➕'}
            </div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {editingProduct ? 'Update product information' : 'Add a new product to your shop'}
            </p>
          </div>

          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    fontSize: '14px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    fontSize: '14px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  boxSizing: 'border-box',
                  height: '80px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {imagePreview && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }} 
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                type="submit" 
                disabled={isUploading}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  if (!isUploading) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isUploading) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isUploading ? '⏳ Processing...' : (editingProduct ? '💾 Update Product' : '➕ Add Product')}
              </button>
              
              {editingProduct && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.2)',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Products Display */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#2d3748'
          }}>
            🛍️ Shop Inventory
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#718096', 
            fontSize: '16px'
          }}>
            {products.length} product{products.length !== 1 ? 's' : ''} in your shop
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            borderRadius: '20px',
            border: '2px dashed #cbd5e0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#4a5568' }}>No Products Yet</h3>
            <p style={{ margin: 0, color: '#718096' }}>
              {isAdmin ? 'Add your first product using the form above!' : 'Products will appear here once added by admin.'}
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '25px' 
          }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
              >
                {product.image && (
                  <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </div>
                )}
                
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  {product.name}
                </h3>
                
                <p style={{ 
                  margin: '0 0 15px 0', 
                  color: '#718096', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {product.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#667eea'
                  }}>
                    ₹{product.price}
                  </span>
                  
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Active
                  </span>
                </div>
                
                {isAdmin && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '15px'
                  }}>
                    <button 
                      onClick={() => handleEdit(product)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManager; 