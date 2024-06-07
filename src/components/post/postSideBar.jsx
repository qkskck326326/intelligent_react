import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

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
