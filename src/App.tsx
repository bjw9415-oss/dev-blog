// src/App.tsx

import { useEffect } from "react"
import FirebaseStatus from "@/components/FirebaseStatus";

/**
 * 블로그 앱 메인 컴포넌트
 * 
 * Day 1 컴포넌트 구조도에서 App은 최상위 컴포넌트로,
 * 라우팅과 전역 상태(인증)를 관리합니다.
 */

function App() {
    useEffect(() => {
        console.log("Firebase Config:----");
        console.log("API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
        console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
    }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 임시 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            📝 My Dev Blog
          </h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            블로그 프로젝트 초기 설정 완료!
          </h2>
          <p className="text-gray-600 mb-4">
            Firebase 연동 상태를 확인해보세요.
          </p>
          
         \ {/* Firebase 연동 확인 */}
           <FirebaseStatus />
        </div>
      </main>

      {/* 임시 푸터 */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          © 2025 My Dev Blog. Built with React + Firebase
        </div>
      </footer>
    </div>
  );
}

export default App;