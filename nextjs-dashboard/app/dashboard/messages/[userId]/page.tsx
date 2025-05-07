"use client";

import { useState } from "react";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";

export default function UserMessagesPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  // Simulated fetch for messages (replace with actual fetch logic)
  const [userMessages, setUserMessages] = useState([
    {
      msg_id: "1",
      created_at: new Date().toISOString(),
      content: "Hello, this is a message!",
      mesagee: "John Doe",
    },
    {
      msg_id: "2",
      created_at: new Date().toISOString(),
      content: "Another message here.",
      mesagee: "John Doe",
    },
  ]);

  // Function to handle message deletion
  const handleDelete = async (msgId: string) => {
    try {
      const response = await fetch(`/api/messages/${msgId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted message from the state
        setUserMessages((prevMessages) =>
          prevMessages.filter((message) => message.msg_id !== msgId)
        );
        alert("Message deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete message: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("An error occurred while deleting the message.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Messages with {userMessages[0]?.mesagee || "Unknown User"}
        </h1>
      </div>
      <div className="mt-4 space-y-4">
        {userMessages.length > 0 ? (
          userMessages.map((message: any) => (
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
                  onClick={() => handleDelete(message.msg_id)}
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
