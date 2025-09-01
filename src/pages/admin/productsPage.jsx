import { useEffect, useState } from "react";
import { sampleProducts } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(sampleProducts || []);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!cancelled) {
          toast.error("Failed to load products. Showing sample data.");
          setProducts(sampleProducts || []);
        }
        console.error(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    if (isLoading) fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [isLoading]);

  async function deleteProduct(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login as admin to delete a product");
      return;
    }
    if (!window.confirm(`Delete product "${productId}"?`)) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  }

  return (
    <div className="w-full h-full max-h-full overflow-hidden relative bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Products</h1>
          <p className="text-sm text-gray-500">Manage your catalog</p>
        </div>

        <Link
          to="/admin/addProduct"
          className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-white font-semibold shadow hover:shadow-md active:scale-95 transition"
        >
          <FaPlus size={14} />
          Add Product
        </Link>
      </div>

      {/* Scroller (stable scrollbar to avoid width jumps) */}
      <div
        className="h-[calc(100%-76px)] overflow-y-auto px-6 pb-8"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {isLoading && (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="w-full h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">🗂️</div>
            <h2 className="text-xl font-semibold text-secondary">
              No products found
            </h2>
            <p className="text-gray-500 mt-1">
              Start by adding your first product.
            </p>
            <Link
              to="/admin/addProduct"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-white font-semibold shadow hover:shadow-md active:scale-95 transition"
            >
              <FaPlus size={14} />
              Add Product
            </Link>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full table-fixed text-left border-separate border-spacing-0">
              {/* Lock column widths so header/body align perfectly */}
              <colgroup>
                {/* Product ID */}
                <col className="w-[140px]" />

                {/* Name (flex) */}
                <col />

                {/* Image */}
                <col className="w-[120px]" />

                {/* Labelled Price */}
                <col className="w-[150px]" />

                {/* Price */}
                <col className="w-[120px]" />

                {/* Stock */}
                <col className="w-[100px]" />

                {/* Actions */}
                <col className="w-[200px]" />
              </colgroup>

              <thead className="sticky top-0 bg-primary z-10">
                <tr>
                  {[
                    "Product ID",
                    "Name",
                    "Image",
                    "Labelled Price",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-secondary border-b border-gray-200 ${
                        i === 0 ? "rounded-tl-2xl" : ""
                      } ${i === 6 ? "rounded-tr-2xl" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map((item) => {
                  const imgSrc =
                    (Array.isArray(item.images) && item.images[0]) ||
                    item.image ||
                    "";
                  return (
                    <tr
                      key={item.productId || item._id}
                      className="even:bg-primary hover:bg-accent/5 transition"
                    >
                      <td className="px-4 py-3 align-middle text-gray-700 border-b border-gray-200 whitespace-nowrap">
                        {item.productId}
                      </td>
                      <td className="px-4 py-3 align-middle text-gray-900 font-medium border-b border-gray-200">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 align-middle border-b border-gray-200">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-dashed border-gray-300 grid place-items-center text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle text-gray-700 border-b border-gray-200">
                        {item.labelledPrice}
                      </td>
                      <td className="px-4 py-3 align-middle text-gray-700 border-b border-gray-200">
                        {item.price}
                      </td>
                      <td className="px-4 py-3 align-middle text-gray-700 border-b border-gray-200">
                        {item.stock}
                      </td>
                      <td className="px-4 py-3 align-middle border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate("/admin/editProduct", { state: item })
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-secondary hover:bg-primary active:scale-95 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-blue-700" />
                            <span className="hidden sm:inline text-sm font-medium">
                              Edit
                            </span>
                          </button>

                          <button
                            onClick={() => deleteProduct(item.productId)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-3 py-1.5 text-white hover:bg-red-600 active:scale-95 transition"
                            title="Delete"
                          >
                            <FaTrash />
                            <span className="hidden sm:inline text-sm font-medium">
                              Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
