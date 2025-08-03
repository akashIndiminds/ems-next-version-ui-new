// src/app/(dashboard)/company/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { companyAPI, paymentAPI } from "@/app/lib/api";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Import Components
import MobileCompanyHeader from "@/components/company/mobile/MobileCompanyHeader";
import MobileCompanyContent from "@/components/company/mobile/MobileCompanyContent";
import DesktopCompanyHeader from "@/components/company/desktop/DesktopCompanyHeader";
import DesktopCompanyContent from "@/components/company/desktop/DesktopCompanyContent";
import UpgradePlanModal from "@/components/company/UpgradePlanModal";

export default function CompanyPage() {
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport width on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (user.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
    fetchCompanyData();
    fetchPaymentHistory();
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getById(user.company.companyId);
      if (response.data.success) {
        setCompanyData(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await paymentAPI.getHistory();
      if (response.data.success) {
        setPaymentHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await companyAPI.update(user.company.companyId, {
        CompanyName: formData.CompanyName,
        Address: formData.Address,
        ContactNumber: formData.ContactNumber,
        Email: formData.Email,
      });
      if (response.data.success) {
        toast.success("Company details updated successfully");
        setEditing(false);
        fetchCompanyData();
      }
    } catch (error) {
      toast.error("Failed to update company details");
    }
  };

  const subscriptionPlans = [
    {
      id: 1,
      name: "Starter",
      price: 999,
      maxEmployees: 50,
      features: ["Basic Attendance", "Leave Management", "Email Support"],
    },
    {
      id: 2,
      name: "Professional",
      price: 2999,
      maxEmployees: 200,
      features: [
        "Everything in Starter",
        "Advanced Reports",
        "API Access",
        "Priority Support",
      ],
    },
    {
      id: 3,
      name: "Enterprise",
      price: 9999,
      maxEmployees: "Unlimited",
      features: [
        "Everything in Professional",
        "Custom Features",
        "Dedicated Support",
        "SLA",
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {/* Conditional rendering based on device type */}
      {isMobile ? (
        <>
          <MobileCompanyHeader />
          <MobileCompanyContent
            companyData={companyData}
            formData={formData}
            setFormData={setFormData}
            editing={editing}
            setEditing={setEditing}
            handleUpdate={handleUpdate}
            paymentHistory={paymentHistory}
            setShowUpgradeModal={setShowUpgradeModal}
          />
        </>
      ) : (
        <>
          <DesktopCompanyHeader />
          <DesktopCompanyContent
            companyData={companyData}
            formData={formData}
            setFormData={setFormData}
            editing={editing}
            setEditing={setEditing}
            handleUpdate={handleUpdate}
            paymentHistory={paymentHistory}
            setShowUpgradeModal={setShowUpgradeModal}
          />
        </>
      )}
      
      {/* Common components */}
      {showUpgradeModal && (
        <UpgradePlanModal
          subscriptionPlans={subscriptionPlans}
          setShowUpgradeModal={setShowUpgradeModal}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
