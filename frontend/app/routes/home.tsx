import type { Route } from "./+types/home";
import UsersTable from "../components/Userstable";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Dashboard" },
    { name: "description", content: "Live user scores table" },
  ];
}

export default function Home() {
  return (
    <>
      <UsersTable />
    </>
  );
}
