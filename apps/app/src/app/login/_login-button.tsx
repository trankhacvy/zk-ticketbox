"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useLogin as usePrivyLogin } from "@privy-io/react-auth";

export default function LoginButton() {
  const { ready, authenticated } = usePrivy();
  const { replace } = useRouter();

  const { login } = usePrivyLogin({
    onComplete: (_user) => {
      replace("/");
    },
  });

  const disable = !ready || (ready && authenticated);

  if (!ready) return null;

  return (
    <button
      onClick={login}
      disabled={disable}
      className="w-full py-4 bg-[#FF3030] text-white font-medium rounded-full mb-4"
    >
      Get Started
    </button>
  );
}
