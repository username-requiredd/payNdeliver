"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, SearchX, Trash2, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import CustomerModal from "./customerProfileMoadal";
const CustomersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomer = useCallback(
    async ({ signal }) => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${session?.user?.id}`, {
          signal,
          headers: { Authorization: `Bearer ${session?.accessToken || ""}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        const uniqueCustomers = data.data
          .map(({ customerId, delivery, items }) => ({
            id: customerId,
            customer: delivery.name,
            email: delivery?.email || "",
            address: delivery?.address || "",
            phone: "0" + delivery.phone || "",
            orders: items,
          }))
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          );
        setRows(uniqueCustomers);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.id]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCustomer({ signal: controller.signal });
    return () => controller.abort();
  }, [fetchCustomer]);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSelectedOrders(customer.orders || []);
    setIsModalOpen(true);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-2">
          Manage and view your customer details
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`transition-all duration-300 ease-in-out transform
            ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <input
              className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              placeholder="Search customers..."
              type="text"
            />
          </div>
          <button
            onClick={() => setIsVisible((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            {isVisible ? (
              <Search className="text-gray-600" />
            ) : (
              <SearchX className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCustomer(row)}
                            className="p-1 hover:bg-blue-100 rounded-full transition-colors duration-200"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {row.customer}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{row.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {row.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{row.phone}</div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex items-center space-x-2">
            <select
              className="rounded-md border border-gray-300 py-1 px-2 text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
            >
              {[10, 25, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of{" "}
              {filteredRows.length} results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium 
                text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 
                disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={
                page >= Math.ceil(filteredRows.length / rowsPerPage) - 1
              }
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium 
                text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 
                disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={selectedCustomer}
          orders={selectedOrders}
        />
      )}
    </div>
  );
};

export default CustomersTable;
