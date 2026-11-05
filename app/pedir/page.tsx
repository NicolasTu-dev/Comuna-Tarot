import { Suspense } from "react";
import PedirForm from "./pedir-form";

export default function PedirPage() {
  return (
    <Suspense>
      <PedirForm />
    </Suspense>
  );
}
