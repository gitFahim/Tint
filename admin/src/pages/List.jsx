import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [listProducts, setListProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // State for tracking the product being edited
  const [updatedProduct, setUpdatedProduct] = useState([{}]); // State for storing updated product details

  const fetchListProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);

      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.info(response.data.message);
        await fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product");
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id); // Set the product ID being edited
    setUpdatedProduct({ ...product }); // Initialize updatedProduct with the current product details
  };

  const saveChanges = async () => {
    try {
      console.log("Editing Product ID:", editingProduct); // Debugging
      console.log("Updated Product Data:", updatedProduct); // Debugging
      console.log("Token:", token); // Debugging

      // Ensure sizes is a JSON stringified array
      
      const processedProduct = {
        ...updatedProduct,
        sizes: Array.isArray(updatedProduct.sizes)
          ? JSON.stringify(updatedProduct.sizes)
          : updatedProduct.sizes, // Only stringify if it's an array
      };
  
      console.log("Processed Product Data (After Processing):", processedProduct);

      const response = await axios.put(
        `${backendUrl}/api/product/update/${editingProduct}`,
        processedProduct,
        { headers: { token } }
      );

      console.log("API Response:", response.data); // Debugging

      if (response.data.success) {
        toast.success("Product updated successfully");
        setEditingProduct(null); // Exit editing mode
        await fetchListProducts(); // Refresh the product list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error); // Debugging
      if (error.response) {
        // The request was made, and the server responded with a status code
        console.error("Error Response:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("Error Request:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error Message:", error.message);
      }
      toast.error("Failed to update product");
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  useEffect(() => {
    console.log("List Products:", listProducts); // Debugging
  }, [listProducts]);

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center py-1 px-2 border bg-gray-200 text-xl text-center">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Sub Category</b>
          <b>Price</b>
          <b>Sizes</b>
          <b>Bestseller</b>
          <b className="text-center">Action</b>
        </div>
        {/* Display Products */}
        {listProducts && listProducts.length > 0 ? (
          listProducts.map((item, index) => (
            <div
              className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] md:grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2 py-1 px-2 border text-sm text-center"
              key={index}
            >
              <img className="w-12" src={item.image[0]} alt="Product Image" />
              {editingProduct === item._id ? (
                <>
                  <input
                    type="text"
                    value={updatedProduct.name}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="text-left border rounded px-2"
                  />
                  <textarea
                    value={updatedProduct.description}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="text-left border rounded px-2"
                  />
                  <input
                    type="text"
                    value={updatedProduct.category}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                  <input
                    type="text"
                    value={updatedProduct.subCategory}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({ ...prev, subCategory: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                  <input
                    type="number"
                    value={updatedProduct.price}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                  <input
                    type="text"
                    value={updatedProduct.sizes}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({ ...prev, sizes: e.target.value }))
                    }
                    className="border rounded px-2"
                  />
                  <input
                    type="checkbox"
                    checked={updatedProduct.bestSeller}
                    onChange={(e) =>
                      setUpdatedProduct((prev) => ({
                        ...prev,
                        bestSeller: e.target.checked,
                      }))
                    }
                    className="border rounded px-2"
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={saveChanges}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-left">{item.name}</p>
                  <p className="text-left">{item.description}</p>
                  <p>{item.category}</p>
                  <p>{item.subCategory}</p>
                  <p>{currency(item.price)}</p>
                  <p>{item.sizes}</p>
                  <p>{item.bestSeller ? "Yes" : "No"}</p>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => startEditing(item)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded w-20" // Added width for resizing
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </>
  );
};

export default List;
