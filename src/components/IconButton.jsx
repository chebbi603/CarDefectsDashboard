import "./buttons.css";
import PropTypes from "prop-types";

export default function IconButton({ icon }) {
  return <div className="icon-button">{icon}</div>;
}

IconButton.propTypes = {
  icon: PropTypes.element.isRequired,
};
