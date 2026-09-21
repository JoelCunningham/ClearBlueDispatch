import { checkUser } from "@/lib/auth/authorization";
import { BottomNavigation } from "./bottom-navigation";

export async function NavigationContainer() {
  const user = await checkUser();
  return <BottomNavigation user={user} />;
}
