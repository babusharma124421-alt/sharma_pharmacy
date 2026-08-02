"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
  total: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  items: InvoiceItem[];
  subtotal: string;
  gstAmount: string;
  totalAmount: string;
  paymentMethod: string | null;
  createdAt: string;
}

interface Medicine {
  id: number;
  name: string;
  unitPrice: string;
  mrp: string;
  gstPercent: string;
  quantity: number;
}

export default function InvoicesAdmin() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [items, setItems] = useState<Array<{ medicineId: number; name: string; quantity: number; unitPrice: number; gstPercent: number }>>([]);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const load = () => {
    Promise.all([
      fetch("/api/invoices").then((r) => r.json()),
      fetch("/api/medicines?all=true").then((r) => r.json()),
    ]).then(([invs, meds]) => {
      setInvoices(Array.isArray(invs) ? invs : []);
      setMedicines(Array.isArray(meds) ? meds : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const addItem = () => {
    if (medicines.length === 0) return;
    const med = medicines[0];
    setItems([...items, {
      medicineId: med.id,
      name: med.name,
      quantity: 1,
      unitPrice: parseFloat(med.unitPrice),
      gstPercent: parseFloat(med.gstPercent),
    }]);
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === "medicineId") {
      const med = medicines.find((m) => m.id === Number(value));
      if (med) {
        newItems[index] = {
          ...newItems[index],
          medicineId: med.id,
          name: med.name,
          unitPrice: parseFloat(med.unitPrice),
          gstPercent: parseFloat(med.gstPercent),
        };
      }
    } else {
      (newItems[index] as Record<string, string | number>)[field] = value;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice * (1 + item.gstPercent / 100));
    }, 0);
  };

  const handleCreate = async () => {
    if (!customerName || items.length === 0) return;
    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName, customerPhone, paymentMethod, items }),
    });
    setShowForm(false);
    setCustomerName("");
    setCustomerPhone("");
    setItems([]);
    load();
  };

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Invoices</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 w-full sm:w-auto"
          >
            + Create Invoice
          </button>
        </div>

        {/* View Invoice Modal */}
        {viewInvoice && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-start p-4 border-b">
                <div>
                  <h2 className="font-bold text-slate-800">{viewInvoice.invoiceNumber}</h2>
                  <p className="text-xs text-slate-400">{new Date(viewInvoice.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setViewInvoice(null)} className="p-2 hover:bg-slate-100 rounded-lg">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {/* Header */}
                <div className="bg-primary-50 rounded-xl p-4 mb-4 text-sm">
                  <p className="font-semibold text-primary-800">Sharma Pharmacy</p>
                  <p className="text-primary-600 text-xs">88, Mirpara Rd, Bhatta Nagar, Liluah, Howrah, WB 711203</p>
                  <p className="text-primary-600 text-xs">📞 +91 8336027489</p>
                </div>
                <div className="text-sm mb-4 space-y-1">
                  <p><strong>Customer:</strong> {viewInvoice.customerName}</p>
                  {viewInvoice.customerPhone && <p><strong>Phone:</strong> {viewInvoice.customerPhone}</p>}
                  <p><strong>Payment:</strong> {viewInvoice.paymentMethod}</p>
                </div>
                {/* Items */}
                <div className="bg-slate-50 rounded-xl overflow-hidden mb-4">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-3">Item</th>
                        <th className="text-right p-3">Qty</th>
                        <th className="text-right p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewInvoice.items as InvoiceItem[]).map((item, i) => (
                        <tr key={i} className="border-t border-slate-200">
                          <td className="p-3">{item.name}</td>
                          <td className="p-3 text-right">{item.quantity}</td>
                          <td className="p-3 text-right">₹{item.total?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-sm space-y-1 text-right bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-500">Subtotal: ₹{viewInvoice.subtotal}</p>
                  <p className="text-slate-500">GST: ₹{viewInvoice.gstAmount}</p>
                  <p className="font-bold text-xl text-primary-700">Total: ₹{viewInvoice.totalAmount}</p>
                </div>
              </div>
              <div className="p-4 border-t">
                <button 
                  onClick={() => setViewInvoice(null)}
                  className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Invoice Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-slate-800">Create Invoice</h2>
                <button onClick={() => { setShowForm(false); setItems([]); }} className="p-2 hover:bg-slate-100 rounded-lg">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3 mb-4">
                  <input 
                    placeholder="Customer Name *" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    className="w-full px-4 py-3 border rounded-xl text-sm" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder="Phone" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                      className="w-full px-4 py-3 border rounded-xl text-sm" 
                    />
                    <select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="w-full px-4 py-3 border rounded-xl text-sm bg-white"
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-slate-700 mb-3">Items</h3>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3">
                      <select 
                        value={item.medicineId} 
                        onChange={(e) => updateItem(i, "medicineId", e.target.value)} 
                        className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white mb-2"
                      >
                        {medicines.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} (Stock: {m.quantity})</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-slate-500">Qty</label>
                          <input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)} 
                            className="w-full px-3 py-2 border rounded-lg text-sm" 
                            min={1} 
                          />
                        </div>
                        <div className="text-right">
                          <label className="text-xs text-slate-500">Total</label>
                          <p className="font-bold text-primary-700">
                            ₹{(item.quantity * item.unitPrice * (1 + item.gstPercent / 100)).toFixed(2)}
                          </p>
                        </div>
                        <button 
                          onClick={() => removeItem(i)} 
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={addItem} 
                  className="w-full mt-3 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-primary-600 font-medium"
                >
                  + Add Item
                </button>

                {items.length > 0 && (
                  <div className="mt-4 bg-primary-50 rounded-xl p-4 text-right">
                    <p className="text-lg font-bold text-primary-700">Total: ₹{getTotal().toFixed(2)}</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex gap-3">
                <button 
                  onClick={handleCreate} 
                  disabled={!customerName || items.length === 0}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  Generate Invoice
                </button>
                <button 
                  onClick={() => { setShowForm(false); setItems([]); }} 
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border text-slate-400">No invoices yet</div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div 
                key={inv.id} 
                onClick={() => setViewInvoice(inv)}
                className="bg-white rounded-xl border border-slate-100 p-4 active:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-primary-600 font-medium">{inv.invoiceNumber}</p>
                    <p className="font-semibold text-slate-800 text-sm mt-1">{inv.customerName}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-700">₹{inv.totalAmount}</p>
                    <p className="text-xs text-slate-400 mt-1">{inv.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
