import Form from "@/app/ui/dashboard/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {fetchUserById} from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const user = await fetchUserById(id);
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "User", href: "/dashboard/overview" },
                    {
                        label: "Edit User",
                        href: `/dashboard/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form user={user}/>
        </main>
    );
}