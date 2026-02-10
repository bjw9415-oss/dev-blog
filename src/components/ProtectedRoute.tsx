// src/components/ProtectedRoute.tsx

/**
 * 보호된 라우트 컴포넌트
 * 
 * Day 1 요구사항: UX-002
 * "로그인이 필요한 기능 접근 시 로그인 페이지로 이동한다"
 * 
 * 로그인하지 않은 사용자가 접근하면 로그인 페이지로 리다이렉트합니다.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
