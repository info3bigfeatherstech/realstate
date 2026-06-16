// src/Tabs/SubscriptionsTab/PlansTab.jsx
import React, { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, CreditCard, Calendar, Users } from "lucide-react";

// Demo Plans Data
const mockPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 999,
    duration: "Monthly",
    features: ["5 Property Listings", "Basic Support", "30 Days Validity"],
    status: "active",
    popular: false,
    color: "blue",
  },
  {
    id: 2,
    name: "Professional Plan",
    price: 2499,
    duration: "Monthly",
    features: ["20 Property Listings", "Priority Support", "Featured Listings", "Analytics Dashboard"],
    status: "active",
    popular: true,
    color: "purple",
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: 9999,
    duration: "Yearly",
    features: ["Unlimited Listings", "24/7 Dedicated Support", "Premium Placement", "API Access", "Team Accounts"],
    status: "active",
    popular: false,
    color: "green",
  },
  {
    id: 4,
    name: "Trial Plan",
    price: 0,
    duration: "14 Days",
    features: ["2 Property Listings", "Email Support"],
    status: "inactive",
    popular: false,
    color: "gray",
  },
];

const PlanCard = ({ plan, onEdit, onDelete, onToggle }) => {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    purple: "border-purple-200 bg-purple-50",
    green: "border-green-200 bg-green-50",
    gray: "border-gray-200 bg-gray-50",
  };

  const badgeColors = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    green: "bg-green-600",
    gray: "bg-gray-600",
  };

  return (
    <div className={`relative rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${colors[plan.color]} ${plan.popular ? "ring-2 ring-yellow-400" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-0.5 rounded-full text-xs font-bold">
          MOST POPULAR
        </div>
      )}
      
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
          <span className="text-slate-500 text-sm">/{plan.duration}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            {feature}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${plan.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {plan.status === "active" ? "Active" : "Inactive"}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(plan)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(plan.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => onToggle(plan.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-100 cursor-pointer">
            {plan.status === "active" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlansTab = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "Monthly",
    features: "",
    status: "active",
  });

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features.join(", "),
      status: plan.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleToggle = (id) => {
    setPlans(plans.map(p => 
      p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
    ));
  };

  const handleSave = () => {
    const featuresList = formData.features.split(",").map(f => f.trim());
    
    if (editingPlan) {
      setPlans(plans.map(p => 
        p.id === editingPlan.id ? { ...p, ...formData, price: Number(formData.price), features: featuresList } : p
      ));
    } else {
      const newPlan = {
        id: Date.now(),
        name: formData.name,
        price: Number(formData.price),
        duration: formData.duration,
        features: featuresList,
        status: "active",
        popular: false,
        color: "blue",
      };
      setPlans([...plans, newPlan]);
    }
    setShowModal(false);
    setEditingPlan(null);
    setFormData({ name: "", price: "", duration: "Monthly", features: "", status: "active" });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Subscription Plans</h2>
          <p className="text-sm text-slate-500 mt-1">Manage pricing plans and features</p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setFormData({ name: "", price: "", duration: "Monthly", features: "", status: "active" }); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Total Plans</p>
              <p className="text-2xl font-bold text-slate-800">{plans.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Active Plans</p>
              <p className="text-2xl font-bold text-slate-800">{plans.filter(p => p.status === "active").length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase font-semibold">Active Subscribers</p>
              <p className="text-2xl font-bold text-slate-800">147</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onToggle={handleToggle} 
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editingPlan ? "Edit Plan" : "Add New Plan"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Plan Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="e.g., Professional Plan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="999"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Duration</label>
                  <select 
                    value={formData.duration} 
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                    <option>14 Days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Features (comma separated)</label>
                <textarea 
                  value={formData.features} 
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  rows="3"
                  placeholder="5 Property Listings, Basic Support, 30 Days Validity"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                  {editingPlan ? "Update" : "Create"} Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansTab;