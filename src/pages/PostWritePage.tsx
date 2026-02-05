/**
 * 글쓰기 페이지
 *
 * Day 1 요구사항: POST-001
 * "로그인한 사용자는 새 게시글을 작성할 수 있다"
 *
 * Day 1 사용자 스토리: US-003 (게시글 작성)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { createPost } from "@/lib/posts";
import PostForm from "@/components/PostForm";
import type { PostInput } from "@/types";

function PostWritePage() {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 게시글 작성 핸들러
     *
     * Day 1 기능명세서 FUNC-002 결과:
     * - Firestore posts 컬렉션에 새 문서 생성
     * - 게시글 목록에 새 글 표시
     */
    const handleSubmit = async (data: PostInput) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const postId = await createPost(data, user);//createPost 함수를 호출하고 반환된 postId를 받아옴

            // Day 1 기능명세서: 저장 후 작성한 글 페이지로 이동
            navigate(`/posts/${postId}`);
        } finally {
            setIsLoading(false);
        }
    };
    //PostForm 컴포넌트에 handleSubmit과 isLoading을 props로 전달 뜻: PostForm 컴포넌트가 이 함수를 호출해서 글을 작성할 수 있음
    // 작성하기를 누르면 handleSubmit 함수가 호출됨
    // isLoading은 PostForm 컴포넌트에서 로딩 상태를 표시하기 위해 사용됨
    // PostForm 컴포넌트가 글을 작성하고 나면 navigate 함수를 호출해서 작성한 글 페이지로 이동함
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                새 글 작성
            </h1>

            <div className="bg-white rounded-lg shadow p-6">
                
                <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
}

export default PostWritePage;
