
import {deleteUser} from "@/app/lib/actions";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { signOut } from "@/auth";

export default async function DeletePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const handleDelete = async () => {
         // Await the params promise to get the actual value
      "use server";
      await deleteUser(params.id); // Call the deleteUser function
        await signOut({ redirectTo: "/" }); // Sign out the user after deletion
     
    };



    return (
       

        <main className="flex flex-col items-center justify-center h-screen">

            <Breadcrumbs
                breadcrumbs={[
                { label: "User", href: "/dashboard" },
                {
                    label: "Delete User",
                    href: `/dashboard/${params.id}/delete`,
                    active: true,
                },
                ]}
            />
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Are you sure you want to delete your account?
          </h1>
          <form action={handleDelete}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Yes, Delete My Account
            </button>
          </form>
        </main>
    );
}