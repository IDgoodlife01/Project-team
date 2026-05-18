import React from "react";
import { Routes, Route } from "react-router-dom";

// 레이아웃 및 메인 섹션
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/section/HeroSection";
import PopularRegions from "../components/section/PopularRegions";
import CommunitySection from "../components/section/CommunitySection";

// 일반 페이지
import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import MyPage from "../components/pages/MyPage";

// 커뮤니티 공통 및 목록/상세
import Board from "../components/pages/community/Board";
import PostList from "../components/pages/community/PostList.js";
import Post from "../components/pages/community/Post";
import ReviewList from "../components/pages/community/ReviewList";
import Review from "../components/pages/community/Review";
import PetsitterList from "../components/pages/community/PetsitterList";
import Petsitter from "../components/pages/community/Petsitter";

// 커뮤니티 글쓰기 및 수정 (파일명 대소문자 주의)
import WritePost from "../components/pages/community/WritePost";
import WriteReview from "../components/pages/community/WriteReview";
import WritePetsitter from "../components/pages/community/WritePetsitter";
import EditPost from "../components/pages/community/EditPost";
import EditReview from "../components/pages/community/EditReview";
import EditPetsitter from "../components/pages/community/EditPetsitter";

// 카페 관련
import CafeDetail from "../components/pages/cafe/CafeDetail";
import CafeRegistration from "../components/pages/cafe/CafeRegistration";
import SearchResults from "../components/pages/cafe/SearchResults";

/**
 * 메인 페이지 컴포넌트
 */
function MainPage() {
  return (
    <>
      <HeroSection />
      <PopularRegions />
      <CommunitySection />
    </>
  );
}

/**
 * 앱 전체 라우팅 설정
 */
function AppRouter() {
  return (
    <>
      {/* 모든 페이지 상단에 노출되는 헤더 */}
      <Header />

      <Routes>
        {/* 1. 메인 페이지 */}
        <Route path="/" element={<MainPage />} />

        {/* 2. 회원 관련 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 3. 커뮤니티 - 전체 통합 게시판 */}
        <Route path="/boards" element={<Board />} />

        {/* 4. 커뮤니티 - 자유게시판 (Posts) */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/write" element={<WritePost />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />

        {/* 5. 커뮤니티 - 카페 리뷰 (Reviews) */}
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/reviews/write" element={<WriteReview />} />
        <Route path="/reviews/:id" element={<Review />} />
        <Route path="/reviews/:id/edit" element={<EditReview />} />

        {/* 6. 커뮤니티 - 펫시터 구인 (Petsitters) */}
        <Route path="/petsitters" element={<PetsitterList />} />
        <Route path="/petsitters/write" element={<WritePetsitter />} />
        <Route path="/petsitters/:id" element={<Petsitter />} />
        <Route path="/petsitters/:id/edit" element={<EditPetsitter />} />

        {/* 7. 카페 관련 */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cafe/register" element={<CafeRegistration />} />
        <Route path="/cafe/:id/edit" element={<CafeRegistration />} />
        <Route path="/cafe/:id" element={<CafeDetail />} />
      </Routes>

      {/* 모든 페이지 하단에 노출되는 푸터 */}
      <Footer />
    </>
  );
}

export default AppRouter;
