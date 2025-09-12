import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import Modal from "@mui/material/Modal";

/** ----------------- Utilities ----------------- */
function formatCurrency(n) {
  if (n === undefined || n === null || isNaN(Number(n))) return "—";
  return `Rs. ${Number(n).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function copy(text, label = "Copied") {
  try {
    navigator.clipboard.writeText(String(text));
    toast.success(label);
  } catch {
    toast.error("Copy failed");
  }
}

function getStatusClass(status) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 ring-yellow-200";
    case "completed":
      return "bg-green-100 text-green-700 ring-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 ring-red-200";
    default:
      return "bg-gray-100 text-gray-700 ring-gray-200";
  }
}

/** ----------------- Thumbnail with fallback ----------------- */
function ProductThumb({ src, alt }) {
  const [err, setErr] = useState(false);
  return (
    <div className="h-14 w-14 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-white flex items-center justify-center">
      {!err ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs text-gray-400">
          no img
        </div>
      )}
    </div>
  );
}

/** ----------------- Order Modal ----------------- */
function OrderModal({ open, onClose, order }) {
  const totals = useMemo(() => {
    if (!order) return { labelled: 0, actual: 0 };
    const actual =
      Array.isArray(order.products)
        ? order.products.reduce(
            (s, p) => s + Number(p?.productInfo?.price || 0) * Number(p?.quantity || 0),
            0
          )
        : 0;
    return { labelled: order.labelledTotal ?? actual, actual };
  }, [order]);

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="order-modal-title">
      <div
        className="rounded-2xl bg-white p-0 shadow-2xl ring-1 ring-black/5"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(95vw, 820px)",
          maxHeight: "89vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-primary/60 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="order-modal-title" className="text-xl font-bold text-secondary">
                Order {order.orderId}
              </h2>
              <p className="text-sm text-gray-500">
                Placed on {formatDate(order.date)}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${getStatusClass(
                order.status
              )}`}
              title="Order status"
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: "calc(85vh - 126px)" }}>
          {/* Customer & Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-gray-200 p-4 bg-white">
              <h3 className="text-sm font-semibold text-secondary mb-3">Customer</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Name</span>
                  <span className="font-medium text-gray-900">{order.name || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Email</span>
                  <span className="text-gray-900 truncate">{order.email || "—"}</span>
                  {order.email && (
                    <button
                      onClick={() => copy(order.email, "Email copied")}
                      className="ml-auto text-xs px-2 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition"
                    >
                      Copy
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Phone</span>
                  <span className="text-gray-900">{order.phone || "—"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-24">Address</span>
                  <span className="text-gray-900">{order.address || "—"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4 bg-white">
              <h3 className="text-sm font-semibold text-secondary mb-3">Money</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total (label)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.labelledTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Computed total</span>
                  <span className="text-gray-900">{formatCurrency(totals.actual)}</span>
                </div>
              </div>
              {order.total !== undefined && (
                <p className="text-xs text-gray-500 mt-3">
                  Backend total: <span className="font-medium">{order.total}</span>
                </p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3 bg-primary/50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-secondary">Products</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {(order.products || []).map((item) => {
                const info = item?.productInfo || {};
                const img = Array.isArray(info.images) && info.images.length > 0 ? info.images[0] : null;
                const unitLabelled = info.labelledPrice;
                const unit = info.price;
                const qty = Number(item.quantity || 0);
                const lineSubtotal = (Number(unit) || 0) * qty;

                return (
                  <li key={item._id} className="p-4">
                    <div className="flex items-start gap-4">
                      <ProductThumb src={img} alt={info.name || info.productId || "product"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {info.name || "Unnamed product"}
                          </p>
                          {info.productId && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200">
                              {info.productId}
                            </span>
                          )}
                        </div>
                        {Array.isArray(info.altNames) && info.altNames.length > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Also known as: {info.altNames.join(", ")}
                          </p>
                        )}
                        {info.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {info.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Unit (label):</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(unitLabelled)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Unit:</span>
                            <span className="text-gray-900">{formatCurrency(unit)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Qty:</span>
                            <span className="text-gray-900 font-medium">{qty}</span>
                          </div>
                          <div className="ml-auto">
                            <span className="text-gray-500 mr-1">Subtotal:</span>
                            <span className="font-semibold text-secondary">
                              {formatCurrency(lineSubtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              {(!order.products || order.products.length === 0) && (
                <li className="p-6 text-center text-gray-500">No products in this order.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
          <div className="text-xs text-gray-500">
            _id: <span className="font-mono">{order._id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl text-sm bg-accent/10 text-accent hover:bg-accent/20 transition"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/** ----------------- Page ----------------- */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error(
          "Error fetching orders: " + (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    }
    if (isLoading) fetchOrders();
  }, [isLoading]);

  return (
    <div className="w-full h-full max-h-full overflow-hidden relative bg-white">
      {/* Modal */}
      <OrderModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        order={activeOrder}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Orders</h1>
          <p className="text-sm text-gray-500">Manage customer orders</p>
        </div>
      </div>

      {/* Content */}
      <div
        className="h-[calc(100%-76px)] overflow-y-auto px-6 pb-8"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {isLoading && (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <Loading />
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="w-full h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">📭</div>
            <h2 className="text-xl font-semibold text-secondary">No orders yet</h2>
            <p className="text-gray-500 mt-1">
              When customers place orders, they’ll show up here.
            </p>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full table-fixed text-left border-separate border-spacing-0">
              <colgroup>
                <col className="w-[140px]" />{/* Order ID */}
                <col className="w-[180px]" />{/* Name */}
                <col className="w-[220px]" />{/* Email */}
                <col className="w-[220px]" />{/* Address */}
                <col className="w-[140px]" />{/* Phone */}
                <col className="w-[150px]" />{/* Total */}
                <col className="w-[180px]" />{/* Date */}
                <col className="w-[120px]" />{/* Status */}
              </colgroup>

              <thead className="sticky top-0 bg-primary z-10">
                <tr>
                  {[
                    "Order ID",
                    "Name",
                    "Email",
                    "Address",
                    "Phone",
                    "Total Price",
                    "Date",
                    "Status",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-secondary border-b border-gray-200 ${
                        i === 0 ? "rounded-tl-2xl" : ""
                      } ${i === 7 ? "rounded-tr-2xl" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    onClick={() => {
                      setActiveOrder(order);
                      setOpenModal(true);
                    }}
                    key={order._id}
                    className="even:bg-primary hover:bg-accent/5 transition cursor-pointer"
                    title="Click to view details"
                  >
                    <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap text-gray-700">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700 truncate">
                      {order.email}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700 truncate">
                      {order.address}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {order.phone}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {formatCurrency(order.labelledTotal)}{" "}
                      <span className="text-gray-400">({order.total})</span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
