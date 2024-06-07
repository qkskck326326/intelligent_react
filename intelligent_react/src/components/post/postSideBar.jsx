import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/boards">게시판</Link>
        </li>
        <li>
          <Link to="/my-posts">내 게시물</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
