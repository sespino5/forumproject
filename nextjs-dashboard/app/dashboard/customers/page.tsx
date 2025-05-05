import Pagination from "@/app/ui/invoices/pagination";
import CustomersTable from "@/app/ui/customers/table";
import {fetchCustomersPages} from "@/app/lib/data";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import {createCustomerButton} from "@/app/ui/customers/buttons";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);
 
  return (
    <main className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Customers</h1>
        {createCustomerButton()}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <h1></h1>
      </div>
     <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
             <CustomersTable
               query={query}
               currentPage={currentPage}
             />
      </Suspense>
       <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
        </div>
    </main>
  );
}
