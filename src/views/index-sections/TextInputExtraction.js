import React from "react";
import { useState } from 'react';
import {
  Button,
  Label,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

function TextInputExtraction() {
  // State to store the list of products
  const [products, setProducts] = useState([]);

  const [userInput, setUserInput] = React.useState(''); // Stores the input text

  // Function to extract product data from multiple input lines
  const extractProductsData = (input) => {
    const productLines = input.split('\n').map(line => line.trim()).filter(line => line);
    return productLines.map(line => extractProductData(line));
  };

  const extractProductData = (input) => {
    const productName = extractProduct(input);
    const tax = '13%';
    const count = extractProductCount(input);
    const weight1 = extractWeight(input, '毛重');
    const weight2 = extractWeight(input, '净重');

    return { productName, tax, count, weight1, weight2 };
  };

  const extractProduct = (input) => {
    const delimiters = [',', '.', '，', '。'];
    let shortestIndex = input.length;

    // Find the earliest occurrence of any delimiter
    for (const delimiter of delimiters) {
      const index = input.indexOf(delimiter);
      if (index !== -1 && index < shortestIndex) {
        shortestIndex = index;
      }
    }

    // Extract product name before the shortest delimiter found
    const productName = shortestIndex < input.length ? input.substring(0, shortestIndex).trim() : input.trim();
    // Remove trailing numbers from the product name
    return productName.replace(/\s*\d+.*$/, '').trim(); 
  };

  const extractWeight = (input, keyword) => {
    const keywordIndex = input.indexOf(keyword);
    if (keywordIndex === -1) return ''; 

    // Extract the part after the keyword
    const afterKeyword = input.substring(keywordIndex + keyword.length).trim();

    // Match the first valid number (including decimal)
    let number = '';
    for (let i = 0; i < afterKeyword.length; i++) {
      const char = afterKeyword[i];
      if ((char >= '0' && char <= '9') || char === '.') {
        number += char;
      } else if (number) {
        // Stop collecting if we hit a non-numeric character after finding numbers
        break;
      }
    }

    return number || '';
  };

  const extractProductCount = (input) => {
      const lowerInput = input.toLowerCase();
      const boxKeywordIndex = lowerInput.indexOf('箱');
      if (boxKeywordIndex === -1) return '';

      // Check before the keyword for a number
      let countBefore = '';
      let i = boxKeywordIndex - 1;
      while (i >= 0 && (lowerInput[i] >= '0' && lowerInput[i] <= '9')) {
          countBefore = lowerInput[i] + countBefore;
          i--;
      }

      // Check after the keyword for a number
      let countAfter = '';
      i = boxKeywordIndex + 1;
      while (i < lowerInput.length && (lowerInput[i] >= '0' && lowerInput[i] <= '9')) {
          countAfter += lowerInput[i];
          i++;
      }

      // Return the first found count, prefer countBefore
      return countBefore || countAfter || '';
  };

  const addProducts = () => {
    if (!userInput) {
      alert('Please enter valid input!');
      return;
    }

    const newProducts = extractProductsData(userInput);
    setProducts([...products, ...newProducts]);
    setUserInput(''); // Clear input after adding products
  };

  function setInputText(event) {
    setUserInput(event.target.value);
  }

  const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  };
  
  const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
  };

  // Function to copy table data to clipboard
  const copyToClipboard = () => {
    const tableData = products.map(product => `${product.productName}\t${product.tax}\t${product.count}\t${product.weight1}\t${product.weight2}\t`).join('\n');
    navigator.clipboard.writeText(tableData).then(() => {
      alert('表格复制成功!');
    }, (err) => {
      console.error('无法复制表格: ', err);
    });
  };
  
  return (
    <>
      <div className="section section-basic" id="basic-elements">
        <Container>
        <div>
      </div>
          <div className="space-70"></div>
          <div id="inputs">
            <Row>
              <Col>
                <p className="category">输入产品信息（每个产品另起一行）</p>
                <FormGroup>
                  <Input
                    defaultValue=""
                    placeholder=""
                    onChange={setInputText}
                    type="textarea"
                    value={userInput}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Button color="primary" onClick={addProducts}>提交</Button>
                  <Button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
                    复制表格
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>中文品名</th>
              <th style={tableHeaderStyle}>退税率</th>
              <th style={tableHeaderStyle}>箱数</th>
              <th style={tableHeaderStyle}>毛重</th>
              <th style={tableHeaderStyle}>净重</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{product.productName}</td>
                <td style={tableCellStyle}>{product.tax}</td>
                <td style={tableCellStyle}>{product.count}</td>
                <td style={tableCellStyle}>{product.weight1}</td>
                <td style={tableCellStyle}>{product.weight2}</td>
              </tr>
            ))}
          </tbody>
        </table>

          {/* <div className="space-70"></div>
          <Row id="checkRadios">
            <Col className="mb-4" lg="3" sm="6">
              <p className="category">Checkboxes</p>
              <FormGroup check>
                <Label check>
                  <Input defaultChecked type="checkbox"></Input>
                  <span className="form-check-sign"></span>
                  Checked
                </Label>
              </FormGroup>
            </Col>
            <Col className="mb-4" lg="3" sm="6">
              <p className="category">Radios</p>
              <FormGroup check className="form-check-radio">
                <Label check>
                  <Input
                    defaultChecked
                    defaultValue="option2"
                    id="exampleRadios1"
                    name="exampleRadios"
                    type="radio"
                  ></Input>
                  <span className="form-check-sign"></span>
                  Radio is on
                </Label>
              </FormGroup>
            </Col>
          </Row> */}
        </Container>
      </div>
    </>
  );
}

export default TextInputExtraction;
