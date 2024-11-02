import React from "react";

// reactstrap components
// import {
// } from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DarkFooter from "components/Footers/DarkFooter.js";

// sections for this page
import Images from "./index-sections/Images.js";
import BasicElements from "./index-sections/BasicElements.js";
import ImageToTable from "./index-sections/ImageToTable.js";
import Test from "./index-sections/test.js";
import Navbars from "./index-sections/Navbars.js";
import Tabs from "./index-sections/Tabs.js";
import Pagination from "./index-sections/Pagination.js";
import Notifications from "./index-sections/Notifications.js";
import Typography from "./index-sections/Typography.js";
import Javascript from "./index-sections/Javascript.js";
import Carousel from "./index-sections/Carousel.js";
import NucleoIcons from "./index-sections/NucleoIcons.js";
import CompleteExamples from "./index-sections/CompleteExamples.js";
import SignUp from "./index-sections/SignUp.js";
import Examples from "./index-sections/Examples.js";
import Download from "./index-sections/Download.js";

// extract table: https://www.extracttable.com/

// tesseract: https://github.com/tesseract-ocr/tesstrain 
// tesseract improvement: https://ledgerbox.io/blog/extract-tables-with-tesseract-ocr
// tesseract improvement: https://saiashish90.medium.com/training-tesseract-ocr-with-custom-data-d3f4881575c0

// img2table: https://github.com/xavctn/img2table?tab=readme-ov-file#features

function Index() {
  React.useEffect(() => {
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      {/* <IndexNavbar /> */}
      <div className="wrapper">
        {/* <IndexHeader /> */}
        <div className="main">
          {/* <Images /> */}
          <BasicElements />
          {/* <ImageToTable /> */}
          <Test />
          
          {/* <Navbars />
          <Tabs />
          <Pagination />
          <Notifications />
          <Typography />
          <Javascript />
          <Carousel />
          <NucleoIcons />
          <CompleteExamples />
          <SignUp />
          <Examples />
          <Download /> */}
        </div>
        {/* <DarkFooter /> */}
      </div>
    </>
  );
}

export default Index;
