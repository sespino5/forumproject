import { lusitana } from "@/app/ui/fonts";
import { getMessages } from "@/app/lib/data";
import Link from "next/link";
import { CreateMessage } from "@/app/ui/messages/buttons";

export default async function Page() {
  const messages = await getMessages();
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Messages</h1>
        <CreateMessage />
      </div>

      <div className="mt-4 space-y-4">
        {Object.keys(messages).map((userId) => (
          <div
            key={userId}
            className="flex items-center justify-between border-b pb-2"
          >
            <span className="text-lg font-medium">
              {messages[userId][0].mesagee}
            </span>
            <Link href={`/dashboard/messages/${userId}`}>
              <p className="text-blue-500 hover:underline">View Messages</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
