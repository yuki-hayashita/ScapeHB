import { useState } from "react";
import { Link } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import Landscape from "./Landscape";
import "./Main.css";

function Main() {
    const [ended, setEnded] = useState(false);

    return (
      <div className="screen">
          {/*<video autoPlay muted onEnded={() => setEnded(true)} src="SCAPEH@B.mp4" className="video"/>*/}
          {/*<ReactAudioPlayer autoPlay={true} src="IntroMusic.mp3"/>*/}

          {/*  {ended ? <Link to="/landscape" className="link">*/}
          {/*      <img src="StartButton.png" className="start-img"/>*/}
          {/*  </Link> : null}*/}
          <Landscape/>
      </div>
    );
  }
  
  export default Main;