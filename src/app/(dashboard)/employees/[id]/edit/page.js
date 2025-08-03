// src/app/(dashboard)/employees/[id]/edit/page.js
import EditEmployeeClient from '../../EditEmployeeClient';

// For static export
export async function generateStaticParams() {
  return [];
}

export default function EditEmployeePage({ params }) {
  return <EditEmployeeClient params={params} />;
}