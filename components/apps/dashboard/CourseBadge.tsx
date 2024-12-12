import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
const CourseBadge = () => {
  const arr = [1, 2, 3, 4, 5];
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center pb-0">
        <span className="pr-2 font-semibold pt-2">Badges</span>
        <Badge>9</Badge>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-5 pt-0">
        {arr.map((_, index) => (
          <Image
            key={index}
            src="/badge.png"
            width={100}
            height={100}
            alt="badge"
          />
        ))}
        <Image src="/badge.png" width={100} height={100} alt="badge" />
      </CardContent>
    </Card>
  );
};

export default CourseBadge;
