import { createUserIfNotExist } from "@/lib/actions";
import { useLogin as usePrivyLogin } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const { ready, authenticated } = usePrivy();
  const { replace } = useRouter();

  const { login } = usePrivyLogin({
    onComplete: (user) => {
      createUserIfNotExist({
        privyId: user.user.id,
        wallet: user.user.wallet?.address ?? String(Date.now()),
      }).then(() => {
        replace("/dashboard");
      });
    },
  });

  const disable = !ready || (ready && authenticated);

  return {
    disable,
    login,
  };
};

export default useLogin;
