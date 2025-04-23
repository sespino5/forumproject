import CustomersTable from "@/app/ui/customers/table";
import { fetchCustomersAll } from "@/app/lib/data";

export default async function Page() {
  const customer = await fetchCustomersAll()
  return (
    <main className="w-full">
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Add any additional buttons or actions here */}
      </div>
      <CustomersTable customers={customer} />
    </main>
  );
}
