import "./FooterNew.css";

function FooterNew({
  // 이 색이 적용되는건 아님 무조건 prop으로 전달해줘야함.
  bgColor = "#262626",
  textColor = "#FAFAFA",
  logoSrc = "/images/logo_w.png",
}) {
  return (
    <footer
      className="footerNew"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="footerNew-wrapper">
        {/* 로고 */}
        <img src={logoSrc} alt="말뭉치 로고" className="footerNew-logo" />

        {/* 이메일 */}
        <p className="footerNew-email">
          <span className="footerNew-email-info">Email</span>&nbsp;&nbsp;&nbsp;
          <span>malmungchichi@gmail.com</span>&nbsp;|&nbsp;
          <span>malmungchichi@naver.com</span>
        </p>

        {/* 구분선 */}
        <hr className="footerNew-line" />

        {/* 저작권 */}
        <p className="footerNew-copy">
          Copyright ⓒ Malmungchi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default FooterNew;
