import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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

  // Helper for status badge styling
  function getStatusClass(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="w-full h-full max-h-full overflow-hidden relative bg-white">
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* Modal content here */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            width: { xs: "90vw", sm: 600 },
          }}
          onClick={(e) => e.stopPropagation()} // optional: clicks inside shouldn't bubble
        >
          <h2 id="order-modal-title" className="text-xl font-semibold">
            Order details
          </h2>
          <p id="order-modal-desc" className="text-sm text-gray-600">
            Content goes here…
          </p>
          {/* Put your order fields/buttons here */}
        </Box>
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
            <h2 className="text-xl font-semibold text-secondary">
              No orders yet
            </h2>
            <p className="text-gray-500 mt-1">
              When customers place orders, they’ll show up here.
            </p>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div
            className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <table className="w-full table-fixed text-left border-separate border-spacing-0">
              <colgroup>
                <col className="w-[140px]" /> {/* Order ID */}
                <col className="w-[180px]" /> {/* Name */}
                <col className="w-[220px]" /> {/* Email */}
                <col className="w-[140px]" /> {/* Phone */}
                <col className="w-[140px]" /> {/* Address */}
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
                    className="even:bg-primary hover:bg-accent/5 transition"
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
                      Rs. {order.labelledTotal}{" "}
                      <span className="text-gray-400">({order.total})</span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {new Date(order.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
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
