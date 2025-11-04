import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { LuTimer } from "react-icons/lu";

const Header = ({
  leftContent,
  centerContent,
  rightContent,
  color,
  fixed = true,
  className = "",
}: {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  color?: string;
  fixed?: boolean;
  className?: string;
}) => {
  return (
    <div className={className}>
      <div
        className={`flex fixed top-0 left-0 right-0  items-center py-2 px-2 h-[44px] z-40 ${
          color || "bg-transparent"
        }`}
      >
        {/* h-[44] → h-[44px] */}
        {leftContent && (
          <div className="absolute flex pl-2 h-full w-full top-0 left-0 items-center pointer-events-auto">
            {leftContent}
          </div>
        )}
        {centerContent && (
          <div className="flex items-center w-full pointer-events-none">
            <HeaderCenterItem>{centerContent}</HeaderCenterItem>
          </div>
        )}
        {rightContent && (
          <div className="absolute pr-2 h-full w-full top-0 right-0 flex justify-end items-center pointer-events-auto">
            {rightContent}
          </div>
        )}
      </div>
      <div className="h-[44px]" />
    </div>
  );
};

//다른 페이지에서 호환성 때문에 남겨둠. 지워야 함.
export const HeaderSpacing = () => {
  return <div className="flex flex-col h-[44px] bg-transparent" />;
};

const HeaderCenterItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute flex flex-row items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      {children}
    </div>
  );
};

const IconButtonTemplate = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div className="flex items-center">
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
const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButtonTemplate
      icon={<IoMdAdd className="!w-6 !h-6" />}
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

const TimerButton = ({
  onClick,
  waitingCount = 0,
}: {
  onClick: () => void;
  waitingCount?: number;
}) => {
  return (
    <div className="relative">
      {waitingCount > 0 && (
        <div className="absolute top-0.5 right-0 bg-red-400 text-sm w-4 h-4 flex items-center justify-center font-semibold text-white z-1 rounded-full">
          {waitingCount}
        </div>
      )}
      <IconButtonTemplate
        icon={<LuTimer className="!w-6 !h-6" />}
        onClick={onClick}
      />
    </div>
  );
};
export {
  BackButton,
  CloseButton,
  IconButtonTemplate as HeaderIconButtonTemplate,
  ProfileButton,
  Title,
  AddButton,
  TimerButton,
};

export default Header;
