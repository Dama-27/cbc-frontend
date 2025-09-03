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
      return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
    case "completed":
      return "bg-green-100 text-green-700 ring-1 ring-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
  }
}

/** ----------------- Subcomponents ----------------- */

function InfoRow({ label, value, onCopy }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-xs font-medium text-gray-500 min-w-[88px]">{label}</span>
      <div className="flex-1 break-words text-gray-900">{value || "—"}</div>
      {value ? (
        <button
          className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition"
          onClick={onCopy}
        >
          Copy
        </button>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
        status
      )}`}
    >
      {status || "unknown"}
    </span>
  );
}

/** Products Table */
function ProductsTable({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
        No products found in this order.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary">
          <tr>
            <th className="px-4 py-3 font-semibold text-secondary">Product</th>
            <th className="px-4 py-3 font-semibold text-secondary">ID</th>
            <th className="px-4 py-3 font-semibold text-secondary">Price</th>
            <th className="px-4 py-3 font-semibold text-secondary">Qty</th>
            <th className="px-4 py-3 font-semibold text-secondary">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            const info = p?.productInfo || {};
            const labelled = info.labelledPrice ?? info.price;
            const unitPrice = info.price ?? labelled ?? 0;
            const qty = p?.quantity ?? 0;
            const lineTotal = unitPrice * qty;
            const hasDiscount =
              typeof labelled === "number" &&
              typeof info.price === "number" &&
              info.price < labelled;

            return (
              <tr key={p?._id || i} className="even:bg-primary">
                <td className="align-top px-4 py-3">
                  <div className="font-medium text-gray-900 break-words">
                    {info.name || "Unnamed product"}
                  </div>
                  {Array.isArray(info.altNames) && info.altNames.length > 0 && (
                    <div className="text-xs text-gray-500 break-words">
                      aka: {info.altNames.join(", ")}
                    </div>
                  )}
                  {info.description && (
                    <p className="mt-1 text-xs text-gray-600 break-words">
                      {info.description}
                    </p>
                  )}
                </td>
                <td className="align-top px-4 py-3 text-gray-700 break-words">
                  {info.productId || "—"}
                </td>
                <td className="align-top px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-gray-900">{formatCurrency(unitPrice)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatCurrency(labelled)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="align-top px-4 py-3 text-gray-900">{qty}</td>
                <td className="align-top px-4 py-3 font-semibold text-gray-900">
                  {formatCurrency(lineTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** ----------------- Modal Content ----------------- */
function OrderDetails({ order, onClose }) {
  const {
    orderId,
    status,
    date,
    name,
    email,
    phone,
    address,
    labelledTotal,
    total,
    products,
    _id,
  } = order || {};

  const computedTotals = useMemo(() => {
    // Derive subtotal as sum of product line totals (best effort)
    if (!Array.isArray(products)) return null;
    let subtotal = 0;
    products.forEach((p) => {
      const price = p?.productInfo?.price ?? p?.productInfo?.labelledPrice ?? 0;
      const qty = p?.quantity ?? 0;
      subtotal += Number(price) * Number(qty);
    });
    return { subtotal };
  }, [products]);

  const hasDiscount =
    typeof labelledTotal === "number" &&
    typeof total === "number" &&
    total < labelledTotal;

  return (
    <div
      className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(92vw, 960px)",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-secondary break-words">
              Order #{orderId || "—"}
            </h2>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Placed on: {formatDate(date)} &middot; Internal ID: {_id || "—"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              copy(orderId || "", "Order ID copied");
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            Copy ID
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Customer</h3>
            <div className="mt-2 divide-y divide-gray-100">
              <InfoRow label="Name" value={name} onCopy={() => copy(name, "Name copied")} />
              <InfoRow
                label="Email"
                value={email}
                onCopy={() => copy(email, "Email copied")}
              />
              <InfoRow
                label="Phone"
                value={phone}
                onCopy={() => copy(phone, "Phone copied")}
              />
              <InfoRow
                label="Address"
                value={address}
                onCopy={() => copy(address, "Address copied")}
              />
            </div>
          </div>

          {/* Amounts */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Amounts</h3>
            <div className="mt-2 space-y-2 text-sm">
              {computedTotals?.subtotal !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Computed Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(computedTotals.subtotal)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Labelled Total <span className="text-xs text-gray-400">(MRP)</span>
                </span>
                <span
                  className={`font-medium ${hasDiscount ? "line-through text-gray-500" : ""}`}
                >
                  {formatCurrency(labelledTotal)}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discounted Total</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                </div>
              )}
              {!hasDiscount && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Products</h3>
            <span className="text-xs text-gray-500">
              {Array.isArray(products) ? products.length : 0} item(s)
            </span>
          </div>
          <ProductsTable products={products} />
        </div>

        {/* JSON (debug) */}
        <details className="rounded-xl border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
            Raw JSON (debug)
          </summary>
          <pre className="mt-3 max-w-full overflow-x-auto text-xs bg-gray-50 p-3 rounded-lg break-words whitespace-pre-wrap">
            {JSON.stringify(order, null, 2)}
          </pre>
        </details>
      </div>
    </div>
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
          "Error fetching orders: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoading) fetchOrders();
  }, [isLoading]);

  return (
    <div className="w-full h-full max-h-full overflow-hidden relative bg-white">
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="order-details-title"
        aria-describedby="order-details-body"
      >
        {activeOrder ? (
          <OrderDetails order={activeOrder} onClose={() => setOpenModal(false)} />
        ) : (
          <div />
        )}
      </Modal>

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
                <col className="w-[140px]" /> {/* Order ID */}
                <col className="w-[180px]" /> {/* Name */}
                <col className="w-[220px]" /> {/* Email */}
                <col className="w-[140px]" /> {/* Address */}
                <col className="w-[140px]" /> {/* Phone */}
                <col className="w-[150px]" /> {/* Total */}
                <col className="w-[180px]" /> {/* Date */}
                <col className="w-[120px]" /> {/* Status */}
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
                      title={h}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="even:bg-primary hover:bg-accent/5 transition cursor-pointer"
                    onClick={() => {
                      setActiveOrder(order);
                      setOpenModal(true);
                    }}
                  >
                    <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap text-gray-700">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900 break-words">
                      {order.name}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700 truncate" title={order.email}>
                      {order.email}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700 truncate" title={order.address}>
                      {order.address}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {order.phone}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-semibold">{formatCurrency(order.total)}</span>
                        {typeof order.labelledTotal === "number" &&
                          order.total < order.labelledTotal && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatCurrency(order.labelledTotal)}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <StatusBadge status={order.status} />
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
