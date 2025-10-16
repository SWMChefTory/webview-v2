import { Button } from "@/components/ui/button";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

const Header = ({
  leftContent,
  centerContent,
  rightContent,
}: {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}) => {
  return (
    <>
      <div className="pt-safe"></div>
      <header className="sticky bg-black top-0 left-0 z-1 flex items-center py-2 px-2 h-[44] bg-transparent">
        {leftContent && (
          <div className="absolute pl-2 h-full top-0 left-0">{leftContent}</div>
        )}
        {centerContent && (
          <div className="flex items-center">
            <HeaderCenterItem>{centerContent}</HeaderCenterItem>
          </div>
        )}
        {rightContent && (
          <div className="absolute pr-2 h-full top-0 right-0 flex items-center">
            {rightContent}
          </div>
        )}
      </header>
    </>
  );
};

export const HeaderSpacing = () => {
  return (
    <div className={`pt-safe`}>
      <div className="flex flex-col h-[44px] bg-transparent" />
    </div>
  );
};

const HeaderCenterItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute flex flex-row items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      {children}
    </div>
  );
};

const HeaderCornerItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col h-full justify-center">{children}</div>;
};

const IconButtonTemplate = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div className="w-full h-full flex items-center">
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className="relative active:scale-95 transition-transform duration-75"
      >
        {icon}
        <span className="absolute inset-0 bg-gray-400 opacity-0 active:opacity-30 transition-opacity duration-150 rounded-md" />
      </Button>
    </div>
  );
};

const Title = ({ string }: { string: string }) => {
  return (
    <div className="flex flex-row items-center justify-center text-xl font-semibold ">
      {string}
    </div>
  );
};

const BackButton = ({
  onClick,
  color,
}: {
  onClick: () => void;
  color?: string;
}) => {
  return (
    <IconButtonTemplate
      icon={<IoMdArrowBack className={`!w-6 !h-6 ${color}`} />}
      onClick={onClick}
    />
  );
};

const ProfileButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButtonTemplate
      icon={<CgProfile className="!w-6 !h-6" />}
      onClick={onClick}
    />
  );
};

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButtonTemplate
      icon={<IoMdClose className="!w-6 !h-6" />}
      onClick={onClick}
    />
  );
};

export { IconButtonTemplate as HeaderIconButtonTemplate };
export { BackButton, ProfileButton, CloseButton, Title };
export default Header;
