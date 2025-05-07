
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/messages/createmessage";


export const dynamic = "force-dynamic";

export default async function Page() {
  

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Message", href: "/dashboard/messages" },
          {
            label: "Create Message",
            href: "/dashboard/messages/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}