import { useSelector } from "react-redux";

function Logo({ className = "" }) {
  const darkMode = useSelector(state=>state.user.darkMode)
    return (
      <img
        src={darkMode?'/Logo/DarkMode_with_text.svg':'/Logo/LightMode_with_text.svg'}
        alt="Focus One Logo"
        className={className}
      />
    );
  }
  
  export default Logo;
  