import React, { useState } from "react";
import "../../styles/pages/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const TERM_CONTENT = `
[이용약관 및 개인정보 수집 동의]

1. 수집 항목: 이메일, 닉네임, 비밀번호, 연락처
2. 수집 목적: 반려견 서비스 '꼬리살랑' 회원 관리 및 서비스 제공
3. 보유 기간: 회원 탈퇴 시까지 (단, 법령에 따른 보관 필요 시 해당 기간까지)
4. 동의 거부권: 동의를 거부할 수 있으나, 가입이 제한될 수 있습니다.

항상 꼬리살랑을 이용해주셔서 감사합니다!
`;

const Signup = () => {
  const navigate = useNavigate();

  const [isAgreed, setIsAgreed] = useState(false); // 약관 동의 상태
  const [showModal, setShowModal] = useState(false); // 팝업창 열림/닫힘 상태
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    phone: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 회원가입 제출 핸들러
  const handleSignup = async (e) => {
    e.preventDefault();

    // 약관 동의 여부 확인
    if (!isAgreed) {
      alert("이용약관 및 개인정보 수집에 동의해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8111/api/auth/signup",
        formData,
      );
      if (response.status === 200) {
        alert("회원가입 성공!");
        navigate("/login");
      }
    } catch (error) {
      alert("회원가입 실패!");
      console.error(error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>회원가입</h2>

          <div className="input-group">
            <label>이메일</label>
            <input
              type="text"
              name="email"
              placeholder="사용할 이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="활동할 닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="8~16자 영문, 숫자 조합"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>연락처</label>
            <input
              type="tel"
              name="phone"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-options term-options">
            <label className="checkbox-label term-label">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span
                onClick={() => setShowModal(true)}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: "5px",
                }}
              >
                이용약관 및 개인정보 수집 동의 (필수)
              </span>
            </label>
          </div>
          {/* --- 약관 보기 팝업(모달) 창 --- */}
          {showModal && (
            <div className="term-modal-overlay">
              <div className="term-modal-content">
                <h3>이용약관</h3>
                <pre className="term-text">{TERM_CONTENT}</pre>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="main-submit-btn signup-btn">
            가입하기
          </button>
        </form>
        {/* 구분선 */}
        <div className="divider">
          <span>또는</span>
        </div>

        {/* 소셜 회원가입 */}
        <div className="social-auth-group">
          <button type="button" className="social-btn kakao">
            <i className="ri-chat-fill"></i>
            카카오로 시작하기
          </button>

          <button type="button" className="social-btn naver">
            <span>N</span>
            네이버로 시작하기
          </button>

          <button type="button" className="social-btn google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="G"
            />
            구글로 시작하기
          </button>
        </div>

        <p className="bottom-link">
          이미 계정이 있으신가요?
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
