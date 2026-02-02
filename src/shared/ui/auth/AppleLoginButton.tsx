import { Button } from "@/components/ui/button";

interface AppleLoginButtonProps {
  redirectUrl: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function AppleLoginButton({ redirectUrl, onSuccess, onError }: AppleLoginButtonProps) {
  const handleClick = () => {
    onError("Apple OAuth is not implemented yet. Please configure Apple Sign In credentials.");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 border-black"
      onClick={handleClick}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.0395 16.9658C15.2997 18.2108 14.4866 19.4449 13.3261 19.4617C12.1824 19.4785 11.8086 18.744 10.4951 18.744C9.18157 18.744 8.77398 19.4449 7.69748 19.4785C6.57056 19.5121 5.66607 18.1323 4.91946 16.8932C3.39267 14.3643 2.23053 9.7346 3.82432 6.68891C4.61272 5.17779 6.11836 4.19125 7.76388 4.17443C8.85717 4.15762 9.88326 4.95819 10.5455 4.95819C11.2078 4.95819 12.4516 3.99006 13.7652 4.12408C14.3103 4.14931 15.8159 4.33173 16.8086 5.75485C16.7175 5.81329 15.0552 6.82506 15.0721 8.87173C15.0889 11.3163 17.1324 12.0844 17.1493 12.1008C17.1325 12.1513 16.8086 13.2482 16.0395 16.9658ZM13.0399 2.51895C13.6853 1.76391 14.1463 0.703435 14.0216 0C13.0793 0.0346786 11.9356 0.652836 11.2398 1.4079C10.6113 2.09554 10.0662 3.24002 10.2078 4.2602C11.2398 4.34326 12.3415 3.65561 13.0399 2.51895Z"/>
      </svg>
      <span className="font-medium">Continue with Apple</span>
    </Button>
  );
}
