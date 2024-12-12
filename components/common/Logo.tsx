import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex mt-4 items-center justify-center">
      <Link href="/" className="flex text-center font-semibold">
        <Image src="/logos.png" width={150} height={150} alt="Logo" />
      </Link>
    </div>
  );
};

export default Logo;
