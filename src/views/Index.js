import React, { useState } from "react";
import TextInputExtraction from "./index-sections/TextInputExtraction.js";
import ImageInputExtraction from "./index-sections/ImageInputExtraction.js";
import SelectFactory from './index-sections/SelectFactory.js';

import UploadTemplate from './index-sections/UploadTemplate.js';

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
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <div className="wrapper">
        <div className="main">
          <TextInputExtraction />
          {/* <UploadTemplate /> */}
          <SelectFactory selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          <ImageInputExtraction selectedOption={selectedOption} />
        </div>
      </div>
    </>
  );
}

export default Index;
