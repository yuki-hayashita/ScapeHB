import { useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

function Main() {
    const [ended, setEnded] = useState(false);

    return (
      <div className="screen">
          <video autoPlay muted onEnded={() => setEnded(true)} src="SCAPEH@B.mp4" className="video"/>

            {ended ? <Link to="/landscape" className="link">
                <img src="StartButton.png" className="start-img"/>
            </Link> : null} 
      </div>
    );
  }
  
  export default Main;