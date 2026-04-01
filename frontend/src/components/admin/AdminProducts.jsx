import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Leaf, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AVAILABLE_FORMS = ['Raw', 'Powder', 'Extract', 'Oil', 'Capsule', 'Tablet'];
const AVAILABLE_SIZES = ['50g', '100g', '250g', '500g', '1kg', '5kg', '10kg', '25kg'];

const AdminProducts = ({ authHeaders, showTempMessage }) => {
    const [products, setProducts] = useState([]);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);

    const [images, setImages] = useState([]);
    const [coverImageIndex, setCoverImageIndex] = useState(0);

    const initialProductFormState = {
        name: '', botanicalName: '', sanskritName: '', category: 'Raw Herbs',
        partUsed: '', forms: [], description: '', uses: '', sizes: [], directionsForUse: '',
        bulkAvailability: true, images: []
    };
    const [productFormData, setProductFormData] = useState(initialProductFormState);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/products`);
            if (res.ok) setProducts(await res.json());
        } catch (err) { console.error(err); }
    };

    const openAddProduct = () => { 
        setProductFormData(initialProductFormState); 
        setImages([]);
        setCoverImageIndex(0);
        setIsEditingProduct(false); 
        setShowProductForm(true); 
    };
    
    const openEditProduct = (product) => {
        setProductFormData({
            ...product,
            forms: Array.isArray(product.forms) ? product.forms : [],
            sizes: Array.isArray(product.sizes) ? product.sizes : [],
            directionsForUse: product.directionsForUse || ''
        });
        setImages([]);
        setCoverImageIndex(0);
        setCurrentProduct(product); 
        setIsEditingProduct(true); 
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders() });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                showTempMessage('Product deleted');
            }
        } catch (err) { console.error('Delete failed:', err); }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        Object.keys(productFormData).forEach(key => {
            if (key === 'forms' || key === 'sizes') {
                formData.append(key, JSON.stringify(productFormData[key]));
            } else if (key !== 'images' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
                formData.append(key, productFormData[key]);
            }
        });

        let filesToUpload = [...images];
        if (filesToUpload.length > 0 && coverImageIndex > 0 && coverImageIndex < filesToUpload.length) {
            const coverFile = filesToUpload.splice(coverImageIndex, 1)[0];
            filesToUpload.unshift(coverFile);
        }

        filesToUpload.forEach(image => {
            formData.append('images', image);
        });

        try {
            const url = isEditingProduct ? `${API_BASE}/products/${currentProduct._id}` : `${API_BASE}/products`;
            const method = isEditingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, { 
                method, 
                headers: {
                    'Authorization': authHeaders().Authorization // Do not set Content-Type, let browser set boundary
                }, 
                body: formData 
            });
            if (res.ok) {
                const saved = await res.json();
                if (isEditingProduct) setProducts(products.map(p => p._id === currentProduct._id ? saved : p));
                else setProducts([saved, ...products]);
                setShowProductForm(false);
                showTempMessage(isEditingProduct ? 'Product updated' : 'Product created');
            } else {
                showTempMessage('Failed to save product', true);
            }
        } catch (err) { showTempMessage('Network error saving product', true); }
    };

    return (
        <div className="animate-fade-in-up">
            {!showProductForm ? (
                <>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <h2 className="heading-lg text-earth">Inventory <span className="text-saffron">({products.length})</span></h2>
                        <button className="btn-primary !py-2.5 flex items-center gap-2" onClick={openAddProduct}>
                            <Plus size={18} /> Add Product
                        </button>
                    </div>

                    <div className="glass-card overflow-hidden bg-white/50 shadow-soft-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-earth/10 bg-white/80">
                                        <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Product Details</th>
                                        <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-5 text-xs font-bold text-earth/50 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-earth/5">
                                    {products.map(product => (
                                        <tr key={product._id} className="hover:bg-white/80 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-[1rem] overflow-hidden shrink-0 shadow-sm border border-earth/5 bg-cream flex items-center justify-center">
                                                        {product.images && product.images.length > 0 ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" /> : <Leaf size={20} className="text-earth/20" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-display font-bold text-earth text-lg mb-1">{product.name}</div>
                                                        <div className="text-xs font-bold text-earth/40 italic">{product.botanicalName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-cream rounded-xl text-xs font-bold text-earth/70 shadow-sm border border-earth/5">{product.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${product.bulkAvailability ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                                                    {product.bulkAvailability ? 'Available' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => openEditProduct(product)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal shadow-soft-sm hover:-translate-y-1 transition-transform" title="Edit"><Edit size={16} /></button>
                                                    <button onClick={() => handleDeleteProduct(product._id)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-soft-sm hover:-translate-y-1 transition-transform" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="glass-panel p-10 bg-white/80 shadow-soft-2xl border-white relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-earth/10 pb-6">
                        <h2 className="heading-lg text-earth">{isEditingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <button className="btn-secondary !py-2" onClick={() => setShowProductForm(false)}>Cancel Edit</button>
                    </div>
                    <form onSubmit={handleSaveProduct} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Product Name *</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron shadow-sm" required value={productFormData.name} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Category *</label>
                                <select className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth focus:border-saffron shadow-sm" value={productFormData.category} onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}>
                                    <option value="Raw Herbs">Raw Herbs</option>
                                    <option value="Herbal Powders">Herbal Powders</option>
                                    <option value="Extracts">Extracts</option>
                                    <option value="Oils & Resins">Oils & Resins</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Botanical Name</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.botanicalName} onChange={e => setProductFormData({ ...productFormData, botanicalName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Sanskrit Name</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.sanskritName} onChange={e => setProductFormData({ ...productFormData, sanskritName: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Part Used</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.partUsed} onChange={e => setProductFormData({ ...productFormData, partUsed: e.target.value })} placeholder="e.g. Root, Leaf" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Available Forms</label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {AVAILABLE_FORMS.map(form => (
                                        <label key={form} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 border border-transparent hover:border-earth/10 transition-colors">
                                            <input type="checkbox" checked={productFormData.forms.includes(form)} onChange={e => {
                                                const newForms = e.target.checked ? [...productFormData.forms, form] : productFormData.forms.filter(f => f !== form);
                                                setProductFormData({ ...productFormData, forms: newForms });
                                            }} className="w-4 h-4 rounded accent-saffron" />
                                            <span className="text-sm text-earth">{form}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Description</label>
                            <textarea className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" rows="3" value={productFormData.description} onChange={e => setProductFormData({ ...productFormData, description: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Directions for Use</label>
                            <textarea className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" rows="3" value={productFormData.directionsForUse} onChange={e => setProductFormData({ ...productFormData, directionsForUse: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Traditional Uses</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/50 border border-earth/10 rounded-xl text-earth shadow-sm" value={productFormData.uses} onChange={e => setProductFormData({ ...productFormData, uses: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Pack Sizes</label>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {AVAILABLE_SIZES.map(size => (
                                        <label key={size} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 border border-transparent hover:border-earth/10 transition-colors">
                                            <input type="checkbox" checked={productFormData.sizes.includes(size)} onChange={e => {
                                                const newSizes = e.target.checked ? [...productFormData.sizes, size] : productFormData.sizes.filter(s => s !== size);
                                                setProductFormData({ ...productFormData, sizes: newSizes });
                                            }} className="w-4 h-4 rounded accent-saffron" />
                                            <span className="text-sm text-earth">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                            <div className="glass-card p-4 mt-4 inline-block">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={productFormData.bulkAvailability} onChange={e => setProductFormData({ ...productFormData, bulkAvailability: e.target.checked })} className="w-5 h-5 rounded accent-saffron" />
                                    <span className="text-sm text-earth font-bold uppercase tracking-widest">Available for Bulk Supply</span>
                                </label>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-bold text-earth/60 uppercase tracking-widest mb-2">Product Images</label>
                                <div className="flex flex-col gap-4">
                                    <input 
                                        type="file" 
                                        id="image-upload"
                                        multiple 
                                        accept="image/*" 
                                        className="hidden"
                                        onChange={e => {
                                            const newFiles = Array.from(e.target.files);
                                            setImages(prev => [...prev, ...newFiles]);
                                            e.target.value = null; // reset input so same file can be selected again
                                        }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => document.getElementById('image-upload').click()}
                                        className="btn-secondary whitespace-nowrap !py-2 self-start flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Image(s)
                                    </button>

                                    {images.length > 0 && (
                                        <div>
                                            <p className="text-xs text-earth/60 mb-2">Select an image to set as Cover Image:</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                                {images.map((file, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all group ${coverImageIndex === idx ? 'border-saffron scale-105 shadow-md' : 'border-transparent hover:border-earth/20'}`} 
                                                        onClick={() => setCoverImageIndex(idx)}
                                                    >
                                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-24 object-cover" />
                                                        
                                                        {coverImageIndex === idx && (
                                                            <div className="absolute top-2 left-2 bg-saffron text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                                Cover
                                                            </div>
                                                        )}

                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setImages(prev => prev.filter((_, i) => i !== idx));
                                                                if (coverImageIndex === idx) setCoverImageIndex(0);
                                                                else if (coverImageIndex > idx) setCoverImageIndex(prev => prev - 1);
                                                            }}
                                                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-earth/10 pt-6 mt-6">
                            <button type="submit" className="btn-primary w-full sm:w-auto px-8">
                                {isEditingProduct ? 'Update Product Details' : 'Publish Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
