import React from "react";
import {AudioPlayer} from "./AudioPlayer";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faHome,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="bg-light text-center text-lg-start"
      style={{position: "fixed", bottom: 0, width: "100%", zIndex: 10}}
    >
      <div className="text-center p-3 bg-secondary">
        <AudioPlayer />
      </div>
      <div className="text-center p-3 bg-secondary">
        <div className="d-flex justify-content-between">
          <FontAwesomeIcon
            size="2x"
            style={{cursor: "pointer"}}
            icon={faHome}
            onClick={() => {
              navigate(`/playlists`);
            }}
          />
          <FontAwesomeIcon
            size="2x"
            style={{cursor: "pointer"}}
            icon={faSearchPlus}
            onClick={() => {}}
          />
          <FontAwesomeIcon
            size="2x"
            style={{cursor: "pointer"}}
            icon={faBookmark}
            onClick={() => {}}
          />
        </div>
      </div>
    </footer>
  );
}
