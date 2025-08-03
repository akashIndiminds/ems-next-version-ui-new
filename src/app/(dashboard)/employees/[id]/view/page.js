// src/app/(dashboard)/employees/[id]/view/page.js
import ViewEmployeeClient from '../../ViewEmployeeClient';

// For static export
export async function generateStaticParams() {
  return [];
}

export default function ViewEmployeePage({ params }) {
  return <ViewEmployeeClient params={params} />;
}