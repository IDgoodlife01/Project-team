import "../../styles/layout/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">꼬리살랑</div>
          <p>반려견과 함께하는 특별한 공간을 찾아보세요.</p>
        </div>

        <div className="footer-menu">
          <div>
            <h4>서비스</h4>
            <a href="/">카페찾기</a>
            <a href="/">커뮤니티</a>
            <a href="/">이벤트</a>
            <a href="/">공지사항</a>
          </div>

          <div>
            <h4>고객지원</h4>
            <a href="/">고객센터</a>
            <a href="/">FAQ</a>
            <a href="/">문의하기</a>
            <a href="/">이용가이드</a>
          </div>

          <div>
            <h4>정책</h4>
            <a href="/">이용약관</a>
            <a href="/">개인정보처리방침</a>
            <a href="/">위치기반서비스 이용약관</a>
          </div>
        </div>
      </div>

      <div className="footer-info">
        <p>
          상호명 : 꼬리살랑 | 대표 : 홍길동 | 사업자등록번호 : 123-45-67890
        </p>
        <p>주소 : 서울특별시 강남구 | 이메일 : help@ggorisalang.com</p>
        <p className="copyright">© 2026 꼬리살랑 All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;