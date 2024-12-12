/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { columns } from "@/components/apps/purchase-table/columns";
import { DataTable } from "@/components/apps/purchase-table/data-table";
import PurchaseDialog from "@/components/apps/purchase/PurchaseDialog";
import { AppLayout, ProtectedRoute } from "@/components/common";
import { useAuth } from "@/context/AuthContext";
import { getAllPurchases } from "@/services/dashboard/purchase-service";
import { useEffect, useState } from "react";

const PurchasePage = () => {
  const [isAddPurchaseModalOpen, setIsAddPurchaseModalOpen] = useState(false);
  const [purchases, setPurchases] = useState<any>([]);

  const { user } = useAuth();

  const handleBtn = () => {
    setIsAddPurchaseModalOpen(true);
  };

  useEffect(() => {
    const unsubscribe =
      user?.role === "admin"
        ? getAllPurchases((newPurchases) => setPurchases(newPurchases), user?.uid)
        : getAllPurchases((newPurchases) => setPurchases(newPurchases));

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <AppLayout
        appLayoutHeading="Purchase"
        btnText="Add New Purchase"
        btnAction={handleBtn}
        showButton={user?.role === "superadmin"}
      >
        <div className="mt-5">
          {purchases.length != 0 ? (
            <DataTable columns={columns} data={purchases} />
          ) : (
            <>
              <div className="flex flex-col items-center justify-center h-full p-10 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M12 4h9"></path>
                  <path d="M3 12h9"></path>
                  <path d="M12 12L4 6"></path>
                  <path d="M12 12L4 18"></path>
                </svg>
                <h2 className="text-lg font-semibold">No Purchases Found</h2>
                <p className="mt-2 text-sm">
                  It looks like there are no data in the list. Please add some or check back later.
                </p>
              </div>
            </>
          )}
        </div>
        <PurchaseDialog
          isAddPurchaseModalOpen={isAddPurchaseModalOpen}
          setIsAddPurchaseModalOpen={setIsAddPurchaseModalOpen}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default PurchasePage;
