import { CtaButton, UserCounter, UserInfo } from "./PageClient";
import { getUserCounter, incrementCounter } from "./actions/user-counters";

export default async function Home() {
  const count = await getUserCounter();
  return (
    <div className="p-4">
      <CtaButton />
      <br />
      <UserCounter count={count} increment={incrementCounter} />
      <UserInfo />
    </div>
  );
}
