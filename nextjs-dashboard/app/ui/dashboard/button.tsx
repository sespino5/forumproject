import { PencilIcon} from "@heroicons/react/24/outline";
import Link from "next/link";


export function UpdateUserButton({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/${id}/edit`}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
    >
      <PencilIcon className="w-5" />
      <span>Edi User</span>
    </Link>
  );
}

export function DeleteUserButton({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/${id}/delete`}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
    >
      <span >Delete</span>
    
    </Link>
  );
}