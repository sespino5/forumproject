import Form from "@/app/ui/dashboard/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {fetchUserById} from "@/app/lib/data";
import { getUserID } from "@/app/lib/actions";
import { get } from "http";


export default async function Page() {
    const id = await getUserID();
    const user = await fetchUserById(id? id : "0");
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