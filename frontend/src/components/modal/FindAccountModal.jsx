import React, { useState } from "react";
import "../../styles/modal/FindAccountModal.css";

const FindAccountModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("email");
  const [step, setStep] = useState(1);
  const [inputData, setInputData] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [foundEmail, setFoundEmail] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  // ✨ 추가된 함수: 이메일 찾기 로직
  const handleFindEmail = () => {
    // 실제 구현 시에는 백엔드 API를 호출해야 합니다.
    // 테스트용으로 01012345678 입력 시 이메일이 나오게 설정했습니다.
    if (inputData.phone === "01012345678") {
      setFoundEmail("kkorisallang@mail.com");
    } else {
      alert("일치하는 정보가 없습니다.");
      setFoundEmail("");
    }
  };

  const handleVerifyAndNext = () => {
    if (inputData.email && inputData.phone === "01012345678") {
      setStep(2);
    } else {
      alert("정보가 일치하지 않습니다.");
    }
  };

  const handleResetPassword = () => {
    if (inputData.newPassword !== inputData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert(
      "비밀번호가 성공적으로 변경되었습니다! 새로운 비밀번호로 로그인해주세요.",
    );
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="find-modal-content">
        <button className="close-x" onClick={onClose}>
          &times;
        </button>

        {step === 1 ? (
          <>
            <div className="tab-menu">
              <button
                className={activeTab === "email" ? "active" : ""}
                onClick={() => {
                  setActiveTab("email");
                  setFoundEmail("");
                }}
              >
                이메일 찾기
              </button>
              <button
                className={activeTab === "password" ? "active" : ""}
                onClick={() => {
                  setActiveTab("password");
                  setFoundEmail("");
                }}
              >
                비밀번호 찾기
              </button>
            </div>
            <div className="find-form">
              {activeTab === "password" && (
                <div className="find-input-group">
                  <label>이메일</label>
                  <input type="text" name="email" onChange={handleChange} />
                </div>
              )}
              <div className="find-input-group">
                <label>핸드폰 번호</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="숫자만 입력"
                  onChange={handleChange}
                />
              </div>

              {activeTab === "email" && foundEmail && (
                <div
                  className="find-result-box"
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    backgroundColor: "#fff0eb",
                    color: "#ff6f3d",
                    borderRadius: "10px",
                    fontWeight: "bold",
                  }}
                >
                  찾으시는 이메일: {foundEmail}
                </div>
              )}

              <button
                className="find-submit-btn"
                onClick={
                  activeTab === "email" ? handleFindEmail : handleVerifyAndNext
                }
              >
                {activeTab === "email" ? "이메일 찾기" : "다음 단계"}
              </button>
            </div>
          </>
        ) : (
          <div className="reset-form">
            <h3>새 비밀번호 설정</h3>
            <p className="reset-desc">새로 사용할 비밀번호를 입력해주세요.</p>
            <div className="find-input-group">
              <label>새 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                placeholder="8~16자 영문, 숫자 조합"
                onChange={handleChange}
              />
            </div>
            <div className="find-input-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호를 다시 입력하세요"
                onChange={handleChange}
              />
            </div>
            <button className="find-submit-btn" onClick={handleResetPassword}>
              비밀번호 저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindAccountModal;
