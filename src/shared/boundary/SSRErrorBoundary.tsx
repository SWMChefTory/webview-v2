import { ErrorBoundary } from "react-error-boundary";
import { useIsMounted } from "usehooks-ts";

interface SSRErrorBoundaryProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
  }
  
  export const SSRErrorBoundary = ({ fallback, children }: SSRErrorBoundaryProps) => {
    const isMounted = useIsMounted();
  
    if (!isMounted()) {
      return <>{fallback}</>;
    }
    
    return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
  };