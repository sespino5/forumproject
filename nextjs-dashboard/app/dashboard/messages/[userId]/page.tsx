import { getMessages } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";

// Define the type for a message
interface Message {
  msg_id: string;
  created_at: string;
  content: string;
  mesagee: string;
}

export default async function UserMessagesPage({
  params,
}: {
  params: { userId: string };
}) {
  // Await params to ensure it's resolved before accessing its properties
  const { userId } = await Promise.resolve(params);

  // Fetch all messages
  const messages = await getMessages();

  // Get messages for the specific userId
  const userMessages: Message[] = messages[userId] || [];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Messages with {userMessages[0]?.mesagee || "Unknown User"}
        </h1>
      </div>
      <div className="mt-4 space-y-4">
        {userMessages.length > 0 ? (
          userMessages.map((message: Message) => (
            <div
              key={message.msg_id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="text-sm text-gray-600">
                  {new Date(message.created_at).toLocaleString()}
                </p>
                <p className="text-lg">{message.content}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href={`/dashboard/messages/${userId}/edit/${message.msg_id}`}
                >
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                </Link>
                <button
                  // onClick={() => handleDelete(message.msg_id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages found.</p>
        )}
      </div>
    </div>
  );
}
