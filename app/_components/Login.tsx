
import Link from "next/link";
import {auth,signOut } from "../../auth";

type Props = {}

export default async function Login({}: Props) {
  const user = await auth()
  return (
    <div className="flex items-center">
      {!user && (
        <div
        >
          <Link href="/api/auth/signin">Login</Link>
          <span className="absolute left-0 bottom-0 h-1 bg-red-300 w-0 transition-all duration-500 group-hover:w-full"></span>
        </div>
      )}

      {user && (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="group relative mr-4 py-2"
        >
          <button>Logout</button>
          <span className="absolute left-0 bottom-0 h-1 bg-red-300 w-0 transition-all duration-500 group-hover:w-full"></span>
        </form>
      )}
    </div>
  );
}