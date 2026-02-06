// /**
//  * 게시글 수정 페이지
//  *
//  * Day 1 요구사항: POST-004
//  * "작성자는 자신의 게시글을 수정할 수 있다"
//  *
//  * Day 1 사용자 스토리: US-005 (내 글 수정)
//  */

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPost, updatePost } from "@/lib/posts";
// import { useAuthStore } from "@/store/authStore";
// import PostForm from "@/components/PostForm";
// import type { Post, PostInput } from "@/types";

// function PostEditPage() {
//     const { id } = useParams<{ id: string }>();
//     // 기능: URL 경로에 포함된 파라미터를 추출한다.
//     // 여기에서의 역활: 사용자가 접속한 URL 에서 게시글 ID 를 가져와
//     // id 변수에 저장하고 이 id는 어떤 글을 수정할지 식별하는 데 사용된다.
//     const navigate = useNavigate();
//     // 기능: 페이지를 이동시키는 함수를 반환
//     // 여기에서의 역활: 수정 완료 후 상세 페이지로 이동
//     // 취소/에러 시 뒤로가기
//     const user = useAuthStore((state) => state.user);
//     // 기능: 전역 상태 관리 라이브러리에서 현재 로그인한 사용자 정보를 가져옴
//     // 여기에서의 역활: 본인 확인에 사용 , 게시글 작성자 와 현재 로그인한 사용자가
//     // 다르면 수정권한 없음 에러를 띄움

//     const [post, setPost] = useState<Post | null>(null);
//     // 기능: 컴포넌트 내부에서 변경되는 데이터(상태)를 관리
//     // 여기에서의 역활:
//     // post: 게시글 데이터를 저장
//     // setPost: 게시글 데이터를 변경
//     const [isLoading, setIsLoading] = useState(true);
//     // isLoading: 로딩 상태를 관리 -> 불로온 게시글 데이터를 저장
//     const [isSaving, setIsSaving] = useState(false);
//     // isSaving: 저장 버튼을 눌렀을 때 중복 클릭 방지 및 로딩 표시를 관리합니다.
//     const [error, setError] = useState<string | null>(null);
//     // error: 에러 상태를 관리

//     // 기존 게시글 불러오기
//     // 이 함수의 기능: fetchPost는 게시글을 불러오는 함수이다.
//     // useEffect는 컴포넌트가 마운트되었을 때, 그리고 id 또는 user가 변경되었을 때 실행된다.
//     // id가 변경되었을 때 실행되는 이유는 게시글을 수정하기 위해서는 게시글의 id가 필요하기 때문이다.
//     // user가 변경되었을 때 실행되는 이유는 게시글을 수정하기 위해서는 사용자의 정보가 필요하기 때문이다.
//     useEffect(() => {
//         //기능: 서버에서 게시글 데이터를 가져옵니다.
//         const fetchPost = async () => {
//             if (!id) return;

//             try {
//                 const data = await getPost(id);

//                 if (!data) {
//                     setError("게시글을 찾을 수 없습니다.");
//                     return;
//                 }

//                 // Day 1 사용자 스토리 US-005: 다른 사람의 글은 수정할 수 없다
//                 if (!user || data.authorId !== user.uid) {
//                     setError("수정 권한이 없습니다.");
//                     return;
//                 }

//                 setPost(data);
//             } catch (err) {
//                 console.error("게시글 조회 실패:", err);
//                 setError("게시글을 불러오는데 실패했습니다.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchPost();
//     }, [id, user]);

//     /**
//      * 게시글 수정 핸들러
//      */
//     // 이 함수의 기능: handleSubmit은 게시글을 수정하는 함수이다.
//     // 사용자가 폼을 작성하고 "수정하기" 버튼을 눌렀을 때 실행되는 최종 처리 함수
//     const handleSubmit = async (data: PostInput) => {
//         if (!id) return;
//         // isSaving은 게시글을 수정하는 동안 true가 된다.
//         // try는 게시글을 수정하는 동안 에러가 발생할 수 있기 때문에 사용한다.
//         // finally는 게시글을 수정하는 동안 에러가 발생하든 안하든 실행된다.
//         setIsSaving(true);
//         try {
//             await updatePost(id, data);
//             navigate(`/posts/${id}`);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     // 로딩 상태
//     if (isLoading) {
//         return (
//             <div className="max-w-2xl mx-auto">
//                 <div className="bg-white rounded-lg shadow p-6 animate-pulse">
//                     <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//                     <div className="h-12 bg-gray-200 rounded mb-4"></div>
//                     <div className="h-12 bg-gray-200 rounded mb-4"></div>
//                     <div className="h-64 bg-gray-200 rounded"></div>
//                 </div>
//             </div>
//         );
//     }

//     // 에러 상태
//     if (error || !post) {
//         return (
//             <div className="max-w-2xl mx-auto">
//                 <div className="bg-white rounded-lg shadow p-8 text-center">
//                     <p className="text-red-600 mb-4">
//                         {error || "게시글을 찾을 수 없습니다."}
//                     </p>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="text-blue-600 hover:text-blue-700"
//                     >
//                         뒤로 가기
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-2xl mx-auto">
//             <h1 className="text-2xl font-bold text-gray-900 mb-6">글 수정</h1>

//             <div className="bg-white rounded-lg shadow p-6">
//                 <PostForm
//                     initialData={{
//                         title: post.title,
//                         content: post.content,
//                         category: post.category,
//                     }}
//                     onSubmit={handleSubmit}
//                     submitLabel="수정하기"
//                     isLoading={isSaving}
//                 />
//             </div>
//         </div>
//     );
// }

// export default PostEditPage;

// day7 10.4 게시글 수정 페이지 TanStack Query 적용 리팩토링
// src/pages/PostEditPage.tsx

/**
 * 게시글 수정 페이지
 *
 * Day 1 요구사항: POST-004
 *
 * TanStack Query 적용으로 리팩토링
 */

import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/PostForm";
import type { PostInput } from "@/types";

// ----------------------------------
import { usePost } from "@/hooks/queries";
import { useUpdatePost } from "@/hooks/mutations";

function PostEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    // 기존 게시글 조회
    const { data: post, isLoading, error } = usePost(id);

    // 수정 뮤테이션
    const updatePostMutation = useUpdatePost();

    /**
     * 게시글 수정 핸들러
     */
    const handleSubmit = async (data: PostInput) => {
        if (!id) return;

        updatePostMutation.mutate(
            { postId: id, input: data },
            {
                onSuccess: () => {
                    navigate(`/posts/${id}`);
                },
            },
        );
    };

    // 권한 체크
    const hasPermission = user && post && user.uid === post.authorId;

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // 에러 또는 권한 없음
    if (error || !post || !hasPermission) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-red-600 mb-4">
                        {error
                            ? "게시글을 찾을 수 없습니다."
                            : "수정 권한이 없습니다."}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">글 수정</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <PostForm
                    initialData={{
                        title: post.title,
                        content: post.content,
                        category: post.category,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="수정하기"
                    isLoading={updatePostMutation.isPending}
                />
            </div>
        </div>
    );
}

export default PostEditPage;
