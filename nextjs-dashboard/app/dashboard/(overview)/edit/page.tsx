import Form from "@/app/ui/dashboard/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {fetchUserById} from "@/app/lib/data";
import { getUserID } from "@/app/lib/actions";



export default async function Page() {
    const id = await getUserID();
    const user = await fetchUserById(id? id : "410544b2-4001-4271-9855-fec4b6a6442a");
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "User", href: "/dashboard" },
                    {
                        label: "Edit User",
                        href: `/dashboard/edit`,
                        active: true,
                    },
                ]}
            />
            <Form user={user}/>
        </main>
    );
}