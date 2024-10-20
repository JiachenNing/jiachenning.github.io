/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Button } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/header.jpg") + ")"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            <img
              alt="..."
              className="n-logo"
              src={require("assets/img/now-logo.png")}
            ></img>
            <h1 className="h1-seo">Vacation Master</h1>
            <h3>Tell us where you're going, we make travel plans instantaneously!</h3>
            <Button 
              color="info" 
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("basic-elements")
                  .scrollIntoView();
            }}
            >
              Get Started!
            </Button>
          </div>
          <h6 className="category category-absolute">
            Designed & coded by Kelly Ning
          </h6>
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
