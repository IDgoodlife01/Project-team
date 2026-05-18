import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom"; // 👈 네비게이션 기능 추가
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/section/PopularRegions.css";

const regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

function PopularRegions() {
  const navigate = useNavigate(); // 👈 훅 선언

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="region-section">
      <div className="section-head">
        <div>
          <span className="section-label">LOCATION</span>
          <h2 className="section-title">지역</h2>
          <p className="section-subtitle">
            원하시는 지역의 애견카페를 찾아보세요
          </p>
        </div>
        {/* ✅ 전체보기 클릭 시 검색 페이지로 이동 */}
        <button className="more-btn" onClick={() => navigate("/search")}>
          전체보기
        </button>
      </div>

      <div className="region-slider-wrap">
        <Slider {...settings} className="region-slider">
          {regions.map((region, index) => (
            <div key={index} className="region-slide">
              {/* ✅ 지역 카드 클릭 시 해당 지역 쿼리 스트링을 들고 이동 */}
              <div
                className="region-card"
                onClick={() => navigate(`/search?region=${region}`)}
              >
                <div className={`region-image region-image-${index}`} />
                <span className="region-name">{region}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default PopularRegions;
