import { DashboardClient } from "../../components/dashboard/dashboard-client";
import { auth } from "../../../auth";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  
  return <DashboardClient userId={session.user?.id} email={session.user?.email ?? undefined} />;
};

export default Dashboard;
