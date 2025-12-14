import { useEffect, useState, useCallback } from "react";
import { getAllSweets, purchaseSweet, searchSweets } from "../services/sweets.api";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { makeToast } from "../utils/utils";


const Modal = ({ title, children, isOpen, onClose, maxWidthClass = "max-w-xl" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className={`bg-gray-800 p-6 rounded-xl shadow-2xl w-full ${maxWidthClass} border border-cyan-700`}>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">
                        &times;
                    </button>
                </div>
                <div className="pt-4">{children}</div>
            </div>
        </div>
    );
};

const ProductImage = ({ src, alt, size = "h-40" }) => {
    return (
        <div className={`bg-gray-700 rounded-md overflow-hidden mb-4 border-2 border-gray-700 ${size}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/4B5563/FFFFFF?text=Sweet+Image"; }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Image Not Available</div>
            )}
        </div>
    );
};

const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '100', label: '₹100' },
    { value: '250', label: '₹250' },
    { value: '500', label: '₹500' },
    { value: '1000', label: '₹1000' },
    { value: '2000', label: '₹2000' },
];

export default function Home() {
    const { user } = useAuth();
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [categoryOptions, setCategoryOptions] = useState([{ value: '', label: 'Any Category' }]);
    const [nameOptions, setNameOptions] = useState([{ value: '', label: 'Any Sweet Name' }]);

    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToBuy, setQuantityToBuy] = useState(1);

    const extractOptions = useCallback((data) => {
        const uniqueCategories = new Set();
        const uniqueNames = new Set();

        data.forEach(s => {
            if (s.category) uniqueCategories.add(s.category);
            if (s.name) uniqueNames.add(s.name);
        });

        const categoryOps = [{ value: '', label: 'Any Category' }];
        uniqueCategories.forEach(cat => {
            categoryOps.push({ value: cat, label: cat });
        });
        setCategoryOptions(categoryOps);

        const nameOps = [{ value: '', label: 'Any Sweet Name' }];
        uniqueNames.forEach(name => {
            nameOps.push({ value: name, label: name });
        });
        setNameOptions(nameOps);

    }, []);

    const fetchSweets = useCallback(async (currentFilters = {}) => {
        setLoading(true);
        try {
            const params = Object.keys(currentFilters).reduce((acc, key) => {
                if (currentFilters[key] !== '' && currentFilters[key] !== undefined) {
                    acc[key] = currentFilters[key];
                }
                return acc;
            }, {});

            let res;
            
            const allSweetsRes = await getAllSweets();
            const allSweetsData = allSweetsRes.data.data || [];
            
            extractOptions(allSweetsData); 
            
            if (Object.keys(params).length > 0) {
                res = await searchSweets(params);
                setSweets(res.data || []);
            } else {
                setSweets(allSweetsData);
            }
        } catch (error) {
            console.error("Failed to fetch sweets:", error);
            setSweets([]);
        } finally {
            setLoading(false);
        }
    }, [extractOptions]);

    useEffect(() => {
        fetchSweets(filters);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSweets(filters);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, fetchSweets]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleClearFilters = () => {
        setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });
    };

    const openDetailsModal = (product) => {
        setSelectedProduct(product);
        setQuantityToBuy(1);
    };

    const closeDetailsModal = () => {
        setSelectedProduct(null);
    };

    const handleQuantityChange = (delta) => {
        setQuantityToBuy(prev => {
            const newQty = prev + delta;
            if (newQty < 1) return 1;
            if (newQty > selectedProduct.quantity) return selectedProduct.quantity;
            return newQty;
        });
    };

    const handlePurchase = async () => {
        if (!user) {
            makeToast("Please log in to make a purchase.", "error");
            return;
        }
        if (!selectedProduct || quantityToBuy < 1) return;

        try {
            await purchaseSweet(selectedProduct._id, quantityToBuy);
            makeToast(`Purchase successful! Your sweet order has been processed.` , "success");
            
            closeDetailsModal();
            fetchSweets(filters); 
        } catch (error) {
            makeToast("Purchase failed! The item might be sold out, or there was a server error.", "error");
        }
    };

    return (
        <>
            <Navbar />

            <div className="bg-gray-800 py-20 px-6 lg:px-12 shadow-inner border-b-4 border-cyan-700">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl font-extrabold text-white tracking-tight sm:text-7xl mb-4">
                        The Sweet Shop
                    </h1>
                    <p className="mt-4 text-xl text-gray-400 font-semibold max-w-3xl mx-auto">
                        Your source for high-quality, freshly crafted delights. View our inventory below.
                    </p>
                    <div className="my-8 h-1 w-24 bg-cyan-500 mx-auto rounded-full shadow-lg"></div>
                    <div className="mt-6">
                        <a 
                            href="#inventory"
                            className="inline-block bg-cyan-600 text-white text-lg font-bold py-3 px-8 rounded-full shadow-2xl uppercase tracking-wider transition duration-300 hover:bg-cyan-500 active:scale-95"
                        >
                            Explore Inventory
                        </a>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-gray-900">
                <div className="max-w-7xl mx-auto mb-8 p-6 border border-gray-700 rounded-xl">
                    <div className="grid grid-cols-5 gap-4">    
                        <Select
                            label="Filter by Name"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            options={nameOptions}
                        />
                        
                        <Select
                            label="Filter by Category"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            options={categoryOptions}
                        />
                        
                        <Select
                            label="Min Price (₹)"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            options={priceOptions}
                        />
                        
                        <Select
                            label="Max Price (₹)"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            options={priceOptions}
                        />
                        
                        <div className="flex items-end">
                            <Button
                                onClick={handleClearFilters}
                                className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded-lg shadow-md transition duration-300 active:scale-95"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>
            
                <div id="inventory" className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
                        Available Products ({sweets.length})
                    </h2>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-800 rounded-lg shadow-xl p-5 flex flex-col animate-pulse">
                                    <div className="h-40 bg-gray-700 rounded-md mb-4"></div>
                                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
                                    <div className="h-5 bg-gray-700 rounded w-1/2 mb-4"></div>
                                    <div className="h-10 bg-gray-700 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : sweets.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-lg">
                            <p className="text-xl">No sweets in stock yet! The inventory is empty.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sweets.map((s) => (
                                <div 
                                    key={s._id} 
                                    className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 flex flex-col justify-between transition duration-300 hover:border-cyan-500 hover:shadow-cyan-900/50 cursor-pointer"
                                    onClick={() => openDetailsModal(s)}
                                >
                                    
                                    <ProductImage src={s.image} alt={s.name} />

                                    <h3 className="text-xl font-bold text-white truncate mb-1">{s.name}</h3>
                                    <p className="text-sm text-cyan-400 uppercase font-semibold mb-3">{s.category}</p>

                                    <div className="space-y-2">
                                        <p className="text-3xl font-extrabold text-white">₹{s.price}</p>
                                        <p className={`text-sm font-medium ${s.quantity > 5 ? 'text-green-500' : s.quantity > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            Stock: {s.quantity} {s.quantity === 0 && '(Sold Out)'}
                                        </p>
                                    </div>
                                    
                                    <button
                                        disabled={true} 
                                        className="mt-5 w-full font-bold px-4 py-2 rounded-lg bg-gray-700 text-gray-400 cursor-default"
                                    >
                                        Click to View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title={selectedProduct?.name || 'Product Details'}
                isOpen={!!selectedProduct}
                onClose={closeDetailsModal}
                maxWidthClass="max-w-3xl"
            >
                {selectedProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="space-y-4">
                            <ProductImage src={selectedProduct.image} alt={selectedProduct.name} size="h-64" />
                            <p className="text-sm text-gray-400">Category: <span className="text-cyan-400 font-semibold">{selectedProduct.category}</span></p>
                            <p className={`text-sm font-medium ${selectedProduct.quantity > 5 ? 'text-green-500' : selectedProduct.quantity > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                Stock Available: {selectedProduct.quantity} {selectedProduct.quantity === 0 && '(Sold Out)'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col justify-between">
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h4>
                                <p className="text-4xl font-extrabold text-cyan-400 mb-4">₹{selectedProduct.price}</p>
                                
                                <div className="text-gray-300 mt-4 border-t border-gray-700 pt-4">
                                    <p className="text-sm font-semibold mb-1">Description:</p>
                                    <p className="text-sm text-gray-400">{selectedProduct.description || 'No detailed description provided.'}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white font-semibold text-lg">Quantity:</span>
                                    
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantityToBuy <= 1}
                                            className="bg-gray-700 text-white p-2 rounded-lg font-bold w-10 h-10 disabled:opacity-40"
                                        >
                                            -
                                        </button>
                                        <span className="text-2xl font-bold text-white w-10 text-center">{quantityToBuy}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantityToBuy >= selectedProduct.quantity || selectedProduct.quantity === 0}
                                            className="bg-gray-700 text-white p-2 rounded-lg font-bold w-10 h-10 disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                <p className="text-lg text-gray-300 font-medium mb-4">
                                    Total: <span className="text-white font-extrabold">₹{(selectedProduct.price * quantityToBuy).toFixed(2)}</span>
                                </p>

                                <button
                                    onClick={handlePurchase}
                                    disabled={selectedProduct.quantity === 0 || !user}
                                    className={`w-full font-bold px-4 py-3 rounded-lg shadow-md transition duration-200 active:scale-98 ${selectedProduct.quantity === 0 || !user
                                        ? 'bg-red-900 text-gray-500 cursor-not-allowed'
                                        : 'bg-cyan-600 text-white hover:bg-cyan-500'
                                    }`}
                                >
                                    {selectedProduct.quantity === 0 ? 'Out of Stock' : !user ? 'Login to Buy' : 'BUY NOW'}
                                </button>
                                {!user && <p className="text-red-400 text-xs mt-2 text-center">You must be logged in to purchase items.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}