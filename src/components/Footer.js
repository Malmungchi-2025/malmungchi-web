import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "../App.css";
import "./Footer.css";

// function Footer() {
//   return (
//     <div className="footer"
//     >

//       <div className="social-container">
//         <div>
//           <a href="#">
//             <FaFacebookF />
//           </a>
//           <p>페이스북</p>
//         </div>
//         <div>
//           <a href="#">
//             <FaInstagram />
//           </a>
//           <p>인스타</p>
//         </div>
//         <div>
//           <a href="#">
//             <FaXTwitter />
//           </a>
//           <p>트위터</p>
//         </div>
//       </div>
//       <p className="copyright">Copyright ⓒ 말뭉치</p>
//     </div>
//   );
// }

function Footer({
  bgColor = "#262626",
  iconBgColor = "#e0e0e0",
  iconColor = "#000000",
  textColor = "#ffffff",
  copyColor = "#616161",
}) {
  return (
    <div
      className="footer"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="social-container">
        {[
          { icon: <FaFacebookF />, label: "페이스북", href: "#" },
          { icon: <FaInstagram />, label: "인스타", href: "#" },
          { icon: <FaXTwitter />, label: "트위터", href: "#" },
        ].map((item, i) => (
          <div key={i} className="icon-block">
            <a
              href={item.href}
              className="icon-circle"
              style={{ backgroundColor: iconBgColor, color: iconColor }}
            >
              {item.icon}
            </a>
            <p style={{ color: textColor }}>{item.label}</p>
          </div>
        ))}
      </div>
      <p className="copyright" style={{ color: copyColor }}>
        Copyright ⓒ 말뭉치
      </p>
    </div>
  );
}

export default Footer;
