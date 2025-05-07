import Link from "next/link";

export function DeleteUserButton() {
  return (
    <Link
      href={`/dashboard/delete`}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
    >
      <span>Delete</span>
    </Link>
  );
}
