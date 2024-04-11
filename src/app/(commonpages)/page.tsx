import { handleUserRegister } from "@/actions/user";
import { connectDB } from "@/config/dbConfig";

connectDB();

export default async function Home() {

  await handleUserRegister();
  
  return (
    <>
      <h1>
        hello world
      </h1>
    </>
  );
}
