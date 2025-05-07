import { PencilIcon} from "@heroicons/react/24/outline";
import Link from "next/link";


export function UpdateUserButton() {
  return (
    <Link
      href={`/dashboard/edit`}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
        
    >
      <PencilIcon className="w-5" />
      <span>Edi User</span>
    </Link>
  );
}

export function DeleteUserButton() {
  return (
    <Link
      href={`/dashboard/delete`}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
    >
      <span >Delete</span>
    
    </Link>
  );
}