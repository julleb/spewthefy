import React from "react";
import {Link} from "react-router-dom";

export function Home() {
  return (
    <div>
      <Link to="/playlists">PlayLists</Link>
    </div>
  );
}
