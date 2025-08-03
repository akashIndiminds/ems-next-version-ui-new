// src/app/(dashboard)/company/components/MobileCompanyHeader.js
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

export default function MobileCompanyHeader() {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
      <div className="flex items-center px-3 py-2.5">
        <Link href="/dashboard" className="mr-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <FiChevronLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-base font-semibold text-gray-900">Company Settings</h1>
      </div>
    </div>
  );
}
