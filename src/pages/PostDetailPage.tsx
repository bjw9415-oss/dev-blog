// /**
//  * 게시글 상세 페이지
//  *
//  * Day 1 요구사항: POST-003, POST-004, POST-005
//  * Day 1 사용자 스토리: US-005 (내 글 수정), US-006 (내 글 삭제)
//  * Day 1 컴포넌트 구조도: PostDetailPage > PostHeader, PostContent
//  */

// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { getPost, deletePost } from "@/lib/posts";
// import { useAuthStore } from "@/store/authStore";
// import type { Post } from "@/types";
// import { CATEGORY_LABELS } from "@/types";
// //파이어 베이스에 등록된 고유한 id를 가져온다.
// //useParams()는 React Router의 훅으로, URL 파라미터를 가져온다.
// //useNavigate()는 React Router의 훅으로, 페이지를 이동한다.
// //useAuthStore()는 Zustand의 훅으로, 인증 상태를 가져온다.
// function PostDetailPage() {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const user = useAuthStore((state) => state.user);

//     const [post, setPost] = useState<Post | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isDeleting, setIsDeleting] = useState(false);

//     // 게시글 불러오기
//     useEffect(() => {
//         const fetchPost = async () => {
//             if (!id) return;

//             try {
//                 const data = await getPost(id); // 파이어 베이스에서 게시글 조회
//                 if (!data) {
//                     setError("게시글을 찾을 수 없습니다.");
//                 } else {
//                     setPost(data); // 게시글 데이터 설정
//                 }
//             } catch (err) {
//                 console.error("게시글 조회 실패:", err); // 콘솔에 에러 출력
//                 setError("게시글을 불러오는데 실패했습니다."); // 사용자에게 에러 알림
//             } finally {
//                 setIsLoading(false); // 로딩 상태 해제
//             }
//         };

//         fetchPost();
//     }, [id]);

//     /**
//      * 게시글 삭제 핸들러
//      *
//      * Day 1 사용자 스토리 US-006 인수 조건:
//      * - 삭제 전 확인 메시지가 표시된다
//      * - 삭제 후 목록에서 해당 글이 사라진다
//      */
//     const handleDelete = async () => {
//         if (!post || !id) return;

//         // Day 1: 삭제 전 확인 메시지
//         if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
//             return;
//         }

//         setIsDeleting(true);
//         try {
//             await deletePost(id); //파이어 베이스에서 게시글 삭제
//             navigate("/"); // 게시글 삭제 후 홈으로 이동
//         } catch (err) {
//             console.error("게시글 삭제 실패:", err); // 콘솔에 에러 출력
//             alert("삭제에 실패했습니다. 다시 시도해주세요."); // 사용자에게 에러 알림 setError랑 다른점: 
//             // alert는 화면에 팝업으로 띄우고, setError는 상태로 저장해서 화면에 표시한다.
//         } finally {
//             setIsDeleting(false); // 삭제 완료 후 로딩 상태 해제
//         }
//     };

//     /**
//      * 날짜 포맷팅
//      */
//     const formatDate = (timestamp: { toDate: () => Date }) => { 
//         const date = timestamp.toDate(); // 파이어 베이스 타임스탬프를 자바스크립트 Date 객체로 변환
//         return date.toLocaleDateString("ko-KR", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     /**
//      * 작성자 본인 여부 확인
//      *
//      * Day 1 사용자 스토리 US-005, US-006:
//      * - 내가 쓴 글에만 수정/삭제 버튼이 보인다
//      */
//     const isAuthor = user && post && user.uid === post.authorId;//user가 존재하고, post가 존재하고, user의 uid가 post의 authorId와 같으면 true 
//     // 즉 모든 상황을 만족하면 true가 된다.

//     // 로딩 상태
//     if (isLoading) {
//         return (
//             <div className="max-w-3xl mx-auto">
//                 <div className="bg-white rounded-lg shadow p-8 animate-pulse">
//                     <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
//                     <div className="space-y-3">
//                         <div className="h-4 bg-gray-200 rounded"></div>
//                         <div className="h-4 bg-gray-200 rounded"></div>
//                         <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // 에러 상태
//     if (error || !post) {
//         return (
//             <div className="max-w-3xl mx-auto">
//                 <div className="bg-white rounded-lg shadow p-8 text-center">
//                     <p className="text-gray-500 text-lg mb-4">
//                         {error || "게시글을 찾을 수 없습니다."}
//                     </p>
//                     <Link to="/" className="text-blue-600 hover:text-blue-700">
//                         홈으로 돌아가기
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-3xl mx-auto">
//             <article className="bg-white rounded-lg shadow">
//                 {/* 게시글 헤더 */}
//                 <header className="p-6 border-b">
//                     {/* 카테고리 */}
//                     {post.category && (
//                         <span
//                             className="inline-block px-2 py-1 text-xs font-medium 
//                            bg-blue-100 text-blue-800 rounded mb-3"
//                         >
//                             {CATEGORY_LABELS[post.category]}
//                         </span>
//                     )}

//                     {/* 제목 */}
//                     <h1 className="text-2xl font-bold text-gray-900 mb-4">
//                         {post.title}
//                     </h1>

//                     {/* 메타 정보 */}
//                     <div className="flex items-center justify-between">
//                         <div className="text-sm text-gray-500">
//                             <span>
//                                 {post.authorDisplayName ||
//                                     post.authorEmail.split("@")[0]}
//                             </span>
//                             <span className="mx-2">·</span>
//                             <span>{formatDate(post.createdAt)}</span>
//                             {/* 수정됨 표시 */}
//                             {post.updatedAt.toMillis() !==
//                                 post.createdAt.toMillis() && (
//                                 <span className="ml-2 text-gray-400">
//                                     (수정됨)
//                                 </span>
//                             )}
//                         </div>

//                         {/* 수정/삭제 버튼 (작성자만 표시) */}
//                         {isAuthor && (
//                             <div className="flex gap-2">
//                                 <Link
//                                     to={`/posts/${post.id}/edit`}
//                                     className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900
//                            border border-gray-300 rounded hover:bg-gray-50
//                            transition-colors"
//                                 >
//                                     수정
//                                 </Link>
//                                 <button
//                                     onClick={handleDelete}
//                                     disabled={isDeleting}
//                                     className="px-3 py-1 text-sm text-red-600 hover:text-red-700
//                            border border-red-300 rounded hover:bg-red-50
//                            disabled:opacity-50 disabled:cursor-not-allowed
//                            transition-colors"
//                                 >
//                                     {isDeleting ? "삭제 중..." : "삭제"}
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </header>

//                 {/* 게시글 본문 */}
//                 <div className="p-6">
//                     <div className="prose max-w-none">
//                         {/* 줄바꿈 유지하여 표시 */}
//                         {post.content.split("\n").map((line, index) => (
//                             <p key={index} className="mb-4">
//                                 {line || <br />}
//                             </p>
//                         ))}
//                     </div>
//                 </div>
//             </article>

//             {/* 목록으로 돌아가기 */}
//             <div className="mt-6">
//                 <Link
//                     to="/"
//                     className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
//                 >
//                     ← 목록으로
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default PostDetailPage;
/**
 * 게시글 상세 페이지
 *
 * Day 1 요구사항: POST-003, POST-004, POST-005
 *
 * TanStack Query 적용으로 리팩토링
 */

import { useParams, useNavigate, Link } from "react-router-dom";
import { usePost } from "@/hooks/queries";
import { useDeletePost } from "@/hooks/mutations";
import { useAuthStore } from "@/store/authStore";
import { CATEGORY_LABELS } from "@/types";

function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    // TanStack Query로 게시글 조회
    const { data: post, isLoading, error } = usePost(id);

    // 삭제 뮤테이션
    const deletePostMutation = useDeletePost();

    /**
     * 게시글 삭제 핸들러
     */
    const handleDelete = async () => {
        if (!id) return;

        if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
            return;
        }

        deletePostMutation.mutate(id, {
            onSuccess: () => {
                navigate("/");
            },
            onError: () => {
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            },
        });
    };

    /**
     * 날짜 포맷팅
     */
    const formatDate = (timestamp: { toDate: () => Date }) => {
        const date = timestamp.toDate();
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /**
     * 작성자 본인 여부 확인
     *
     * Day 1 사용자 스토리 US-005, US-006:
     * - 내가 쓴 글에만 수정/삭제 버튼이 보인다
     */
    const isAuthor = user && post && user.uid === post.authorId;

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error || !post) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                        {error?.message || "게시글을 찾을 수 없습니다."}
                    </p>
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-lg shadow">
                {/* 게시글 헤더 */}
                <header className="p-6 border-b">
                    {/* 카테고리 */}
                    {post.category && (
                        <span
                            className="inline-block px-2 py-1 text-xs font-medium 
                           bg-blue-100 text-blue-800 rounded mb-3"
                        >
                            {CATEGORY_LABELS[post.category]}
                        </span>
                    )}

                    {/* 제목 */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {post.title}
                    </h1>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            <span>
                                {post.authorDisplayName ||
                                    post.authorEmail.split("@")[0]}
                            </span>
                            <span className="mx-2">·</span>
                            <span>{formatDate(post.createdAt)}</span>
                            {/* 수정됨 표시 */}
                            {post.updatedAt.toMillis() !==
                                post.createdAt.toMillis() && (
                                <span className="ml-2 text-gray-400">
                                    (수정됨)
                                </span>
                            )}
                        </div>

                        {/* 수정/삭제 버튼 (작성자만 표시) */}
                        {isAuthor && (
                            <div className="flex gap-2">
                                <Link
                                    to={`/posts/${post.id}/edit`}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900
                           border border-gray-300 rounded hover:bg-gray-50
                           transition-colors"
                                >
                                    수정
                                </Link>
                                {/* 수정됨 ---------------------------------- */}
                                <button
                                    onClick={handleDelete}
                                    disabled={deletePostMutation.isPending}
                                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700
                           border border-red-300 rounded hover:bg-red-50
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                                >
                                    {deletePostMutation.isPending
                                        ? "삭제 중..."
                                        : "삭제"}
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* 게시글 본문 */}
                <div className="p-6">
                    <div className="prose max-w-none">
                        {/* 줄바꿈 유지하여 표시 */}
                        {post.content.split("\n").map((line, index) => (
                            <p key={index} className="mb-4">
                                {line || <br />}
                            </p>
                        ))}
                    </div>
                </div>
            </article>

            {/* 목록으로 돌아가기 */}
            <div className="mt-6">
                <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    ← 목록으로
                </Link>
            </div>
        </div>
    );
}

export default PostDetailPage;
