import { NextResponse } from "next/server";
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function DELETE(
  request: Request,
  { params }: { params: { msgId: string } }
) {
  const { msgId } = params;

  try {
    // Delete the message from the database
    await sql`DELETE FROM messages WHERE msg_id = ${msgId}`;

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 }
    );
  }
}