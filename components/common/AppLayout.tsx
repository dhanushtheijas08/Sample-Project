"use client";
import { Button } from "@/components/ui/button";

type AppLayout = {
  appLayoutHeading: string;
  btnText: string;
  btnAction: () => void;
  secondaryBtnText?: string;
  secondaryBtnAction?: () => void;
  extraElement?: React.ReactNode;
  children: React.ReactNode;
  showButton?: boolean;
};
const AppLayout = ({
  appLayoutHeading,
  btnAction,
  btnText,
  secondaryBtnText,
  secondaryBtnAction,
  extraElement,
  children,
  showButton,
}: AppLayout) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-start gap-4 flex-col md:flex-row md:items-center">
          <h2 className="text-xl text-nowrap">{appLayoutHeading}</h2>
          {extraElement && extraElement}
        </div>
        {showButton && (
          <div className="flex flex-row gap-1.5">
            {secondaryBtnText && secondaryBtnAction && <Button onClick={secondaryBtnAction}>{secondaryBtnText}</Button>}
            <Button onClick={btnAction}>{btnText}</Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
