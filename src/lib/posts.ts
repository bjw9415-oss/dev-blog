// day6 4.firestore 서비스 함수들

/**
 * Firestore 게시글 서비스 함수 모음
 *
 * Day 1 API 명세서에서 정의한 게시글 관련 함수들을 구현합니다.
 * - POST-001: 게시글 작성 (createPost)
 * - POST-002: 게시글 목록 조회 (getPosts)
 * - POST-003: 게시글 상세 조회 (getPost)
 * - POST-004: 게시글 수정 (updatePost)
 * - POST-005: 게시글 삭제 (deletePost)
 *
 * 📚 공식 문서: https://firebase.google.com/docs/firestore/manage-data/add-data
 */

import {
    collection, // 데이터가 저장될 큰 폴더를 지정
    doc,// 컬렉션 내의 특정문서를 가리킴
    addDoc,// 데이터를 저장하고 랜덤한 ID를 자동으로 생성
    getDoc, // 문서 하나의 데이터를 가져옵니다.
    getDocs, // 문서 여러개의 데이터를 가져옵니다.
    updateDoc, // 문서의 데이터를 수정합니다.
    deleteDoc, // 문서를 삭제합니다.
    query, // 쿼리문을 작성합니다. 질문지를 만듬
    orderBy,
    Timestamp,
    limit,
    where,
    startAfter,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, PostInput, PostSummary, User, Category } from "../types";
import { onSnapshot } from 'firebase/firestore'; 
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
/**
 * 컬렉션 참조
 *
 * Firestore의 'posts' 컬렉션에 대한 참조입니다.
 * 모든 게시글 관련 작업은 이 컬렉션에서 이루어집니다.
 */
const postsCollection = collection(db, "posts");

/**
 * 게시글 작성
 *
 * Day 1 요구사항: POST-001
 * Day 1 기능명세서: FUNC-002 (게시글 작성)
 *
 * @param input - 게시글 입력 데이터 (title, content, category)
 * @param user - 현재 로그인한 사용자
 * @returns 생성된 게시글 ID
 */
export async function createPost(
    input: PostInput,
    user: User,
): Promise<string> {
    const now = Timestamp.now();
    // Firebase에서 사용하는 날짜/시간 형식입니다. 
    // 자바스크립트의 Date 객체보다 정밀하고 데이터베이스 호환성이 좋습니다.
    const postData = {
        title: input.title,
        content: input.content,
        category: input.category,
        authorId: user.uid,
        authorEmail: user.email,
        authorDisplayName: user.displayName,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
}

/**
 * 게시글 목록 조회
 *
 * Day 1 요구사항: POST-002
 * "시스템은 게시글 목록을 최신순으로 표시한다"
 *
 * @param limitCount - 조회할 게시글 수 (기본값: 20)
 * @returns 게시글 요약 목록
 */
export async function getPosts(
    limitCount: number = 20,
): Promise<PostSummary[]> {
    //Promise<Type>: "기다리면 결국 Type 형태의 데이터를 돌려주겠다고 약속합니다."
    // 최신순 정렬 쿼리
    const q = query(
        postsCollection,
        orderBy("createdAt", "desc"),//정렬 순서를 정합니다. desc: 내림차순, asc: 오름차순
        limit(limitCount),//최대 조회 게시글 수를 정합니다.
    );

    const snapshot = await getDocs(q);
    //설명: 데이터를 요청한 그 순간의 데이터베이스 사진입니다.
    //사용법: snapshot.docs.map(...)을 통해 스냅샷 안에 들어있는
    // 문서들(docs)을 하나씩 꺼내서 우리가 쓸 수 있는 배열(Array) 형태로 바꿉니다.

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });
}

/**
 * 게시글 상세 조회
 *
 * Day 1 요구사항: POST-003
 * "사용자는 게시글 상세 내용을 조회할 수 있다"
 *
 * @param postId - 게시글 ID
 * @returns 게시글 전체 데이터 (없으면 null)
 */
export async function getPost(postId: string): Promise<Post | null> {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {
        id: docSnap.id,
        ...docSnap.data(),
        //기능: docSnap.data()가 가지고 있는 
        // 객체의 내용물(title, content 등)을 껍질을 벗겨서 현재 객체에 쫙 펼쳐놓습니다.
        // id 와 데이터 필드들이 하나의 객체로 합쳐집니다.
    } as Post;
    //기능: TypeScript에게 "내가 확실히 아는데, 이 데이터는 Post 모양이 맞아. 그러니 에러 내지 말고 Post 타입으로 취급해"라고 강제하는 것입니다.
    // DB에서 가져온 데이터는 형식이 불분명할 수 있어서 이렇게 타입을 지정해 줍니다.
}

/**
 * 게시글 수정
 *
 * Day 1 요구사항: POST-004
 * "작성자는 자신의 게시글을 수정할 수 있다"
 *
 * @param postId - 수정할 게시글 ID
 * @param input - 수정할 내용
 */
export async function updatePost(
    postId: string,
    input: PostInput,
): Promise<void> {
    const docRef = doc(db, "posts", postId);

    await updateDoc(docRef, {
        title: input.title,
        content: input.content,
        category: input.category,
        updatedAt: Timestamp.now(),
    });
}

/**
 * 게시글 삭제
 *
 * Day 1 요구사항: POST-005
 * "작성자는 자신의 게시글을 삭제할 수 있다"
 *
 * @param postId - 삭제할 게시글 ID
 */
export async function deletePost(postId: string): Promise<void> {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
}

/**
 * 카테고리별 게시글 조회
 *
 * Day 1 요구사항: POST-006 (선택)
 * "사용자는 게시글을 카테고리별로 필터링할 수 있다"
 *
 * @param category - 카테고리
 * @param limitCount - 조회할 게시글 수
 * @returns 해당 카테고리의 게시글 목록
 */
export async function getPostsByCategory(
    category: Category,
    limitCount: number = 20,
): Promise<PostSummary[]> {
    const q = query(
        postsCollection,
        where("category", "==", category), // 조건 필터링입니다. (SQL의 WHERE 절과 동일)
        //"카테고리가 'IT'인 글만 가져와라" 같은 명령을 수행합니다.
        orderBy("createdAt", "desc"),
        limit(limitCount),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            category: data.category,
            authorEmail: data.authorEmail,
            authorDisplayName: data.authorDisplayName,
            createdAt: data.createdAt,
        };
    });
}


export interface GetPostsOptions {
  /** 카테고리 필터 (null이면 전체) */
  category?: Category | null;
  /** 조회할 개수 */
  limitCount?: number;
  /** 페이지네이션 커서 (이전 쿼리의 마지막 문서) */
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface GetPostsResult {
  posts: PostSummary[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}
// 이 함수의 역할: 
export async function getPostsWithOptions(
  options: GetPostsOptions = {}
): Promise<GetPostsResult> {
    // options : 매개변수
    // category : 카테고리
    // limitCount : 조회할 게시글 수
    // lastDoc : 이전 페이지의 마지막 문서
  const { category = null, limitCount = 5, lastDoc = null } = options;

  // 쿼리 조건들을 배열로 구성
  const constraints = [];

  // 카테고리 필터 (Day 1 POST-006)
  if (category) {
    constraints.push(where('category', '==', category));
  }

  // 정렬 (Day 1 POST-002: 최신순)
  constraints.push(orderBy('createdAt', 'desc'));

  // 페이지네이션: 이전 페이지의 마지막 문서 이후부터
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  // 개수 제한 (+1로 다음 페이지 존재 여부 확인)
  constraints.push(limit(limitCount + 1));

  // 쿼리 실행
  const q = query(postsCollection, ...constraints);
  const snapshot = await getDocs(q);

  // hasMore 판단: limitCount + 1개를 요청했으므로
  const hasMore = snapshot.docs.length > limitCount;
  
  // 실제 반환할 문서들 (limitCount개만)
  const docs = hasMore ? snapshot.docs.slice(0, limitCount) : snapshot.docs;

  const posts = docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      category: data.category,
      authorEmail: data.authorEmail,
      authorDisplayName: data.authorDisplayName,
      createdAt: data.createdAt,
    };
  });

  return {
    posts,
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
}


/**
 * 게시글 목록 실시간 구독
 * 
 * 데이터가 변경되면 자동으로 callback이 호출됩니다.
 * 
 * @param callback - 데이터 변경 시 호출될 함수
 * @param options - 조회 옵션
 * @returns 구독 해제 함수
 */
export function subscribeToPostsRealtime(
  callback: (posts: PostSummary[]) => void,
  options: { category?: Category | null; limitCount?: number } = {}
): () => void {
  const { category = null, limitCount = 20 } = options;

  const constraints = [];

  if (category) {
    constraints.push(where('category', '==', category));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(limitCount));

  const q = query(postsCollection, ...constraints);

  // onSnapshot은 구독 해제 함수를 반환
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        category: data.category,
        authorEmail: data.authorEmail,
        authorDisplayName: data.authorDisplayName,
        createdAt: data.createdAt,
      };
    });

    callback(posts);
  });
}