import { redirect } from "next/navigation";


/* TODO: Still no authorization */
export default function Page() {
  redirect('/login');
}
