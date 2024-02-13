import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { Flex } from "@chakra-ui/react";

export const AuthLayout = () => {
  const outlet = useOutlet();

  const { userPromise } = useLoaderData();

  return (
    <Suspense
      fallback={
        <Flex justifyContent="center" alignItems="center" bgGradient="linear(to-r, #EBF4FA, #CCCCFF, #9FE2BF)" height="100vh">
          <ProgressSpinner />
        </Flex>
      }>
      <Await
        resolve={userPromise}
        errorElement={<Toast severity="error">Something went wrong!</Toast>}
        children={(user) => (
          <AuthProvider userData={user}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  );
};
