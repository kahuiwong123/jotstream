import { Spinner } from "@/components/ui/spinner";
import logo from "../../../public/logo-no-background.svg";
import Image from "next/image";
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={logo} height={200} width={200} alt="jotstream-logo" />
      <Spinner>Loading...</Spinner>
    </div>
  );
}
