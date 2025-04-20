import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

const MenuButton = () => {
  return (
    <StyledWrapper>
      <Link className="btn" to="/menu"> Browse
      </Link>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
   width: 6.5em;
   height: 2.3em;
   margin: 0.5em;
   background: White;
   color: black;
   border: none;
   border-radius: 20px;
   font-size: 30px;
   font-weight: bold;
   cursor: pointer;
   position: relative;
   z-index: 1;
   padding: 0.4em 1em;
   text-align: center;
      overflow: hidden;
  }

  .btn:hover {
   color: white;
  }

  .btn:after {
   content: "";
   background: black;
   position: absolute;
   z-index: -1;
   left: -20%;
   right: -20%;
   top: 0;
   bottom: 0;
   transform: skewX(-45deg) scale(0, 1);
   transition: all 0.5s;
  }

  .btn:hover:after {
   transform: skewX(-45deg) scale(1, 1);
   -webkit-transition: all 0.5s;
   transition: all 0.5s;
  }`;

export default MenuButton;
