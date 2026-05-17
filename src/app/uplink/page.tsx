import { redirect } from "next/navigation";

export default function UplinkRedirect() {
  redirect("/ping");
}
