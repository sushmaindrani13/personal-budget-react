import React from 'react';
import {
    Link
  } from "react-router-dom";

function Menu() {
  return (
    <div>
        <nav>
        <ul>
            <li><Link itemProp="url" to="/" href="/">Home</Link></li>
            <li><Link itemProp="url" to="/about" href="/about.html">About</Link></li>
            <li><Link itemProp="url" to="/login" href="/login.html">Login</Link></li>
        </ul>
        </nav>
    </div>
  );
}

export default Menu;