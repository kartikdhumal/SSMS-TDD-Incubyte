import { useCallback, useEffect, useState } from "react";
import { getAllSweets, deleteSweet, restockSweet, createSweet, updateSweet, searchSweets } from "../../services/sweets.api";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Navbar from "../../components/layout/Navbar";
import { makeToast } from "../../utils/utils";

const Modal = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-cyan-700">
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

const priceOptions = [
  { value: '', label: 'Any Price' },
  { value: '100', label: '₹100' },
  { value: '250', label: '₹250' },
  { value: '500', label: '₹500' },
  { value: '1000', label: '₹1000' },
  { value: '2000', label: '₹2000' },
];

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-3/4"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-2/3"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-1/3"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-1/2"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-1/4"></div></td>
    <td className="px-6 py-4 text-center">
      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex justify-center gap-3">
        <div className="h-5 bg-gray-700 rounded w-10"></div>
        <div className="h-5 bg-gray-700 rounded w-12"></div>
      </div>
    </td>
  </tr>
);

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([{ value: '', label: 'Any Category' }]);
  const [nameOptions, setNameOptions] = useState([{ value: '', label: 'Any Sweet Name' }]);

  const [selectedSweet, setSelectedSweet] = useState(null);
  const [restockQty, setRestockQty] = useState("");
  const [editForm, setEditForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

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

  const handleDeleteConfirm = async () => {
    if (!selectedSweet) return;
    try {
      await deleteSweet(selectedSweet._id);
      setIsDeleteModalOpen(false);
      fetchSweets(filters);
    } catch (error) {
      makeToast("Deletion failed! Check backend auth/logs.", "error");
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    const quantity = Number(restockQty);

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      makeToast("Please enter a valid positive integer quantity.", "error");
      return;
    }

    if (!selectedSweet) return;

    try {
      await restockSweet(selectedSweet._id, quantity);
      setIsRestockModalOpen(false);
      setRestockQty("");
      fetchSweets(filters);
    } catch (error) {
      makeToast("Restock failed! Check backend auth/logs.", "error");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'quantity') ? Number(value) : value
    }));
  };

  const handleClearFilters = () => {
    setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!editForm.name || !editForm.category || editForm.price === undefined || editForm.price < 0) {
        makeToast("Name, Category, and a non-negative Price are required.");
        return;
      }

      if (selectedSweet && selectedSweet._id) {
        await updateSweet(selectedSweet._id, editForm);
      } else {
        await createSweet(editForm);
      }

      setIsEditModalOpen(false);
      fetchSweets(filters);
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${selectedSweet ? 'update' : 'create'} sweet.`;
      makeToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };


  const openDeleteModal = (sweet) => {
    setSelectedSweet(sweet);
    setIsDeleteModalOpen(true);
  };

  const openRestockModal = (sweet) => {
    setSelectedSweet(sweet);
    setIsRestockModalOpen(true);
    setRestockQty(5);
  };

  const openEditModal = (sweet) => {
    setSelectedSweet(sweet);
    setEditForm(sweet || { name: '', category: '', price: 0, image: '', description: '', quantity: 0 });
    setIsEditModalOpen(true);
  };

  return (
    <>
    <Navbar/>
    <div className="w-full p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-4">
        <h1 className="text-3xl font-extrabold text-cyan-400">Sweets Management</h1>

        <button
          onClick={() => openEditModal(null)}
          className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-xl transition duration-300 active:scale-95 text-sm uppercase tracking-wider"
        >
          + Add New Sweet
        </button>
      </div>

      <div className="mb-4 p-1">
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

      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Name</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Category</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Price (₹)</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Stock Qty</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Description</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Actions</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : sweets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-xl">
                  No sweets found matching the criteria.
                </td>
              </tr>
            ) : (
              sweets.map((s) => (
                <tr key={s._id} className="hover:bg-gray-700 transition duration-150">
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-white">{s.name}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400">{s.category || '-'}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300 font-semibold">₹{s.price}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${s.quantity === 0 ? 'bg-red-900 text-red-300' : s.quantity < 10 ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                      {s.quantity}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-400 max-w-xs overflow-hidden truncate">{s.description || '-'}</td>

                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(s)}
                        className="bg-green-700 text-white px-3 py-1 text-xs rounded-lg shadow-sm transition duration-150 active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(s)}
                        className="bg-red-700 text-white px-3 py-1 text-xs rounded-lg shadow-sm transition duration-150 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openRestockModal(s)}
                      className="bg-green-700 text-white px-3 py-1 text-xs rounded-lg shadow-sm transition duration-150 active:scale-95"
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={selectedSweet && selectedSweet._id ? "Edit Sweet" : "Add New Sweet"}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <input name="name" placeholder="Sweet Name" value={editForm.name || ''} onChange={handleEditFormChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
          <input name="category" placeholder="Category" value={editForm.category || ''} onChange={handleEditFormChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" required />
          <input name="price" type="number" placeholder="Price (₹)" value={editForm.price || ''} onChange={handleEditFormChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" min="0" required />
          <input name="quantity" type="number" placeholder="Quantity (Stock)" value={editForm.quantity || ''} onChange={handleEditFormChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" min="0" />
          <input name="image" placeholder="Image URL Link" value={editForm.image || ''} onChange={handleEditFormChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600" />
          <textarea name="description" placeholder="Description" value={editForm.description || ''} onChange={handleEditFormChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 resize-none h-24" />

          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition duration-150">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-bold py-2 px-4 rounded-lg text-sm transition duration-150 ${isSubmitting ? 'bg-cyan-800 text-gray-400 cursor-not-allowed' : 'bg-cyan-600 text-white'}`}
            >
              {isSubmitting ? 'Saving...' : (selectedSweet && selectedSweet._id ? "Update Sweet" : "Create Sweet")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title={`Restock ${selectedSweet ? selectedSweet.name : ''}`}
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
      >
        <form onSubmit={handleRestockSubmit} className="space-y-4">
          <p className="text-gray-300">Current Stock: {selectedSweet?.quantity}</p>
          <input
            type="number"
            placeholder="Restock Quantity"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            min="1"
          />
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={() => setIsRestockModalOpen(false)} className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition duration-150">Cancel</button>
            <button type="submit" className="bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-150">Confirm Restock</button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Confirm Deletion"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <p className="text-red-400 text-lg font-medium">
          Are you sure you want to permanently delete "{selectedSweet?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end pt-6 space-x-3">
          <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition duration-150">Cancel</button>
          <button onClick={handleDeleteConfirm} className="bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-150">Yes, Delete</button>
        </div>
      </Modal>
    </div>
    </>
  );
}