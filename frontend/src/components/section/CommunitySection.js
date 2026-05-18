import "../../styles/section/CommunitySection.css";
import { useNavigate } from "react-router-dom";

function CommunitySection() {
  const navigate = useNavigate();

  const communityItems = [
    {
      title: "자유게시판",
      desc: "반려견과 함께하는 일상, 꿀팁, 고민을 자유롭게 나눠보세요.",
      icon: "💬",
      color: "blue",
      tag: "소통하기",
      path: "/posts",
    },
    {
      title: "펫시터",
      desc: "믿을 수 있는 펫시터를 찾고 우리 아이를 안심하고 맡겨보세요.",
      icon: "🐾",
      color: "green",
      tag: "찾아보기",
      path: "/petsitters",
    },
    {
      title: "리뷰",
      desc: "직접 방문한 애견카페의 분위기와 후기를 공유해보세요.",
      icon: "☆",
      color: "orange",
      tag: "후기보기",
      path: "/reviews",
    },
  ];

  return (
    <section className="community-section">
      <div className="section-head">
        <div>
          <span className="section-label">COMMUNITY</span>
          <h2 className="section-title">커뮤니티</h2>
          <p className="section-subtitle">
            반려견과 함께하는 일상을 공유하세요
          </p>
        </div>
      </div>

      <div className="community-card-wrap">
        {communityItems.map((item, index) => (
          <div
            className="community-card"
            key={index}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
          >
            <div className={`community-icon ${item.color}`}>
              <span>{item.icon}</span>
            </div>

            <div className="community-text">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                }}
              >
                {item.tag} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CommunitySection;