// src/app/(dashboard)/company/components/MobileCompanyHeader.js
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

export default function MobileCompanyHeader() {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-3">
            <FiChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Company Settings</h1>
        </div>
      </div>
    </div>
  );
}
