// src/components/Header.tsx

/**
 * 헤더 컴포넌트
 *
 * props 대신 Zustand 스토어에서 직접 user 정보를 가져옵니다.
 * 이제 어디서든 useAuthStore()로 인증 상태에 접근할 수 있습니다!
 */

import { Link } from "react-router-dom";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="header">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold">
            📝 My Dev Blog
          </Link>

          {/* 네비게이션 & 인증 버튼 */}
          <div className="flex items-center gap-4">
            {user ? (
              // 로그인 상태
              <>
                <span className="text-sm">
                  {user.displayName || user.email}
                </span>
                <button onClick={handleLogout} className="btn-ghost">
                  로그아웃
                </button>
              </>
            ) : (
              // 비로그인 상태
              <>
                <Link to="/login" className="btn-ghost">
                  로그인
                </Link>
                <Link to="/signup" className="btn-primary">
                  회원가입
                </Link>
              </>
            )}
            {/* 테마 토글 */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;