import { auth } from "@/auth";
import MugRenderer from "@/components/editor/MugRenderer";
import Header from "@/components/header/Header";
import ShoppingCartDrawer from "./ShoppingCartDrawer";

export default async function Editor() {
  const session = await auth();

  return (
    <div className="h-screen flex flex-col">
      <Header
        user={{
          name: session?.user.name ?? "",
          email: session?.user.email ?? "",
          image: session?.user.image ?? undefined,
        }}
      />
      <div className="flex-1 -mt-12">
        <button className="absolute">Test</button>
        <MugRenderer />
      </div>
    </div>
  );
}
