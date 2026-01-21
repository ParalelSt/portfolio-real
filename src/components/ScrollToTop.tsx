import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface scrollToTopProps {
  children: React.ReactNode;
}

const ScrollToTop = ({ children }: scrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
