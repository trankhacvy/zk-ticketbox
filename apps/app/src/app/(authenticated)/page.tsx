import FloatingActionButton from "@/components/float-action-button";
import UserProfile from "./_components/user-profile";
import MainTabs from "./_components/main-tabs";
import { getUser } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const userData = await getUser();

  if (!userData?.data?.success || !userData.data.data) {
    redirect("/login");
  }

  const user = userData.data.data;
  
  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <UserProfile user={user} />
      <MainTabs />
      <FloatingActionButton />
    </div>
  );
}
