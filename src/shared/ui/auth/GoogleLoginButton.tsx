import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
  redirectUrl: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function GoogleLoginButton({ redirectUrl, onSuccess, onError }: GoogleLoginButtonProps) {
  const handleClick = () => {
    onError("Google OAuth is not implemented yet. Please configure Google OAuth credentials.");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-3 hover:bg-gray-50"
      onClick={handleClick}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.8055 10.2292C19.8055 9.55291 19.7502 8.86791 19.6305 8.20166H10.2V12.0492H15.6009C15.3729 13.2909 14.6593 14.3908 13.6186 15.0875V17.5875H16.8273C18.7093 15.8447 19.8055 13.2725 19.8055 10.2292Z" fill="#4285F4"/>
        <path d="M10.2 20.0001C12.9528 20.0001 15.2709 19.1025 16.8365 17.5876L13.6278 15.0876C12.7579 15.6979 11.6435 16.042 10.2091 16.042C7.54889 16.042 5.29195 14.2808 4.51852 11.9126H1.2207V14.4929C2.81689 17.6743 6.35426 20.0001 10.2 20.0001Z" fill="#34A853"/>
        <path d="M4.50941 11.9125C4.06764 10.6708 4.06764 9.33168 4.50941 8.09001V5.50977H1.21164C-0.207056 8.34417 -0.207056 11.658 1.21164 14.4924L4.50941 11.9125Z" fill="#FBBC04"/>
        <path d="M10.2 3.95805C11.7199 3.93339 13.188 4.47447 14.3023 5.48447L17.1479 2.63897C15.1848 0.789717 12.5499 -0.228567 10.2 -0.199945C6.35426 -0.199945 2.81689 2.12589 1.2207 5.50714L4.51847 8.08738C5.28278 5.71011 7.54884 3.95805 10.2 3.95805Z" fill="#EA4335"/>
      </svg>
      <span className="font-medium">Continue with Google</span>
    </Button>
  );
}
