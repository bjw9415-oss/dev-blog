/**
 * 게시글 카드 컴포넌트
 *
 * Day 1 컴포넌트 구조도: HomePage > PostList > PostCard
 * Day 1 기능명세서 FUNC-003 표시 데이터 참고
 */

import { Link } from "react-router-dom";
import type { PostSummary } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface PostCardProps {
    post: PostSummary;
}
//전달 되는 post 는 PostSummary 타입이다.
//PostSummary 타입은 src/types.ts 파일에 정의되어 있다.
//PostSummary 타입은 id, title, content, authorEmail, authorDisplayName, createdAt, updatedAt, category, tags, likeCount, commentCount, viewCount를 포함한다.
function PostCard({ post }: PostCardProps) {
    /**
     * 날짜 포맷팅 - 이후 utils 폴더에 따로 구성
     *
     * Day 1 기능명세서: 작성일 YYYY.MM.DD 형식
     */
    //timestamp 는 { toDate: () => Date } 타입이다. 서버에서 기록되는 날짜. 시간 정보 포함
    //toDate() 함수는 Date 객체를 반환한다.
    //Date 객체는 toLocaleDateString() 함수를 호출해서 "ko-KR" 형식으로 날짜를 반환한다.
    //날짜를 포맷팅 해주는 함수
    
    const formatDate = (timestamp: { toDate: () => Date }) => {
        const date = timestamp.toDate();
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    /**
     * 작성자 표시
     *
     * Day 1 기능명세서: 작성자 이메일 @ 앞부분
     */
    //authorDisplayName 이 있으면 해당 값을 반환하고, 없으면 authorEmail을 @ 기준으로 자른다.
    //예: authorDisplayName 이 "홍길동"이면 "홍길동"을 반환하고, 없으면 "[EMAIL_ADDRESS]"을 "@" 기준으로 자른 "hong"을 반환한다.
    //작성자 이름을 반환하는 함수
    //자바스크립트 내장 함수 split()은 문자열을 특정 문자를 기준으로 자른다.
     
    const getAuthorName = () => {
        if (post.authorDisplayName) {
            return post.authorDisplayName;
        }
        return post.authorEmail.split("@")[0];
    };
    // 아티클은 시멘틱 요소
    // EX) 헤더, 푸터, 메인, 섹션, 아티클, 네비게이션, 사이드바, 푸터
    return (
        <article className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Link to={`/posts/${post.id}`} className="block p-6">
                {/* 카테고리 태그 */}
                {post.category && (
                    <span
                        className="inline-block px-2 py-1 text-xs font-medium 
                         bg-blue-100 text-blue-800 rounded mb-3"
                    >
                        {CATEGORY_LABELS[post.category]}
                    </span>
                )}

                {/* 제목 (Day 1: 최대 50자, 초과 시 "..." 처리) */}
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                </h2>

                {/* 메타 정보 */}
                <div className="flex items-center text-sm text-gray-500 gap-2">
                    <span>{getAuthorName()}</span>
                    <span>·</span>
                    <span>{formatDate(post.createdAt)}</span>
                </div>
            </Link>
        </article>
    );
}

export default PostCard;
