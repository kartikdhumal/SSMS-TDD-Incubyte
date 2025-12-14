import { useEffect, useState } from "react";
import { getAllSweets, purchaseSweet } from "../services/sweets.api";
import Navbar from "../components/layout/Navbar";

export default function Home() {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAllSweets();
    setSweets(res.data.data);
  };

  const buy = async (id) => {
    await purchaseSweet(id, 1);
    load();
  };

  return (
    <>
      <Navbar />

      <div className="bg-pink-500 py-16 px-6 lg:px-12 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          
          <h1 className="text-6xl font-extrabold text-white tracking-tight sm:text-7xl mb-4">
            The Sweet Shop
          </h1>
          
          <p className="mt-4 text-xl text-pink-100 italic font-semibold max-w-3xl mx-auto">
            Where every bite is a happy memory. Freshly made mithai and candies, ready for pickup or delivery!
          </p>
          
          <div className="my-8 h-1 w-24 bg-yellow-300 mx-auto rounded-full shadow-lg"></div>

          <div className="mt-6">
            <a 
              href="#inventory"
              className="inline-block bg-yellow-400 text-pink-800 text-lg font-bold py-3 px-8 rounded-full shadow-2xl uppercase tracking-wider transition-transform duration-300"
            >
              Explore Our Delicious Inventory
            </a>
          </div>
        </div>
      </div>
      
      <div id="inventory" className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-pink-500 pb-2">
            Available Sweets ({sweets.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sweets.map((s) => (
            <div 
              key={s._id} 
              className="bg-white border border-pink-200 rounded-lg shadow-lg p-5 flex flex-col justify-between"
            >
              <h3 className="text-xl font-bold text-pink-700 truncate">{s.name}</h3>
              <p className="text-sm text-gray-500 mt-1 uppercase">{s.category}</p>

              <div className="mt-4 space-y-1">
                <p className="text-2xl font-extrabold text-gray-900">₹{s.price}</p>
                <p className={`text-md font-semibold ${s.quantity > 5 ? 'text-green-600' : s.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Stock: {s.quantity} {s.quantity === 0 && '(Sold Out)'}
                </p>
              </div>
              
              <button
                disabled={s.quantity === 0}
                onClick={() => buy(s._id)}
                className="mt-5 w-full bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          ))}
          {sweets.length === 0 && (
            <div className="col-span-4 text-center py-12 text-gray-500">
                <p className="text-xl">No sweets in stock yet! Check back later.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}