import { FiCheck } from "react-icons/fi";
import "./CustomCheckbox.css";

function CustomCheckbox({ checked, onChange, label }) {
  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <span className={`checkbox-box ${checked ? "checked" : ""}`}>
        <FiCheck className={`checkbox-icon ${checked ? "active" : ""}`} />
      </span>
      {label}
    </label>
  );
}

export default CustomCheckbox;
