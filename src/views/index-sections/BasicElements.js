import React from "react";
// react plugin used to create switch buttons
import Switch from "react-bootstrap-switch";
// plugin that creates slider
import Slider from "nouislider";
import { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";

// reactstrap components
import {
  Button,
  Label,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components

function BasicElements() {
  const [leftFocus, setLeftFocus] = React.useState(false);
  const [rightFocus, setRightFocus] = React.useState(false);
  React.useEffect(() => {
    if (
      !document
        .getElementById("sliderRegular")
        .classList.contains("noUi-target")
    ) {
      Slider.create(document.getElementById("sliderRegular"), {
        start: [50],
        connect: [true, false],
        step: 0.5,
        range: { min: 0, max: 100 },
      });
    }
    if (
      !document.getElementById("sliderDouble").classList.contains("noUi-target")
    ) {
      Slider.create(document.getElementById("sliderDouble"), {
        start: [20, 80],
        connect: [false, true, false],
        step: 1,
        range: { min: 0, max: 100 },
      });
    }
  });
  const [startLocation, setStartLocation] = React.useState('');
  const [endLocation, setEndLocation] = React.useState('');
  const [numberOfDays, setNumberOfDays] = React.useState('');

  function setStart(event) {
    setStartLocation(event.target.value);
  }

  function setEnd(event) {
    setEndLocation(event.target.value);
  }

  function setDays(event) {
    setNumberOfDays(event.target.value);
  }
  

  const [travelPlan, setTravelPlann] = useState([]);

  async function handleInputSubmit(event) {
    event.preventDefault();
    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: `Come up with a travel plan from ${startLocation} to ${endLocation} for ${numberOfDays} days`}]
    });
    const message = response.data.choices[0].message.content;
    setTravelPlann(message);
  }
  
  return (
    <>
      <div className="section section-basic" id="basic-elements">
        <Container>
        <div>
      <div>
        {travelPlan}
      </div>
      </div>
          <div className="space-70"></div>
          <div id="inputs">
            <Row>
              <Col lg="3" sm="6">
                <p className="category">From</p>
                <FormGroup>
                  <Input
                    defaultValue=""
                    placeholder="Where are you now"
                    type="text"
                    onChange={setStart}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Button color="primary" onClick={handleInputSubmit}>Go</Button>
                </FormGroup>
              </Col>
              <Col lg="3" sm="6">
                <p className="category">To</p>
                <FormGroup>
                  <Input
                    defaultValue=""
                    placeholder="Where are you going"
                    type="text"
                    onChange={setEnd}
                  ></Input>
                </FormGroup>
              </Col>
              <Col lg="3" sm="6">
                <p className="category">Days of stay</p>
                <FormGroup>
                  <Input
                    defaultValue=""
                    placeholder="How long do you plan to travel"
                    type="text"
                    onChange={setDays}
                  ></Input>
                </FormGroup>
              </Col>
            </Row>
          </div>
          <div className="space-70"></div>
          <Row id="checkRadios">
            <Col className="mb-4" lg="3" sm="6">
              <p className="category">Checkboxes</p>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox"></Input>
                  <span className="form-check-sign"></span>
                  Unchecked
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input defaultChecked type="checkbox"></Input>
                  <span className="form-check-sign"></span>
                  Checked
                </Label>
              </FormGroup>
              <FormGroup check disabled>
                <Label check>
                  <Input disabled type="checkbox"></Input>
                  <span className="form-check-sign"></span>
                  Disabled Unchecked
                </Label>
              </FormGroup>
              <FormGroup check disabled>
                <Label check>
                  <Input defaultChecked disabled type="checkbox"></Input>
                  <span className="form-check-sign"></span>
                  Disabled Checked
                </Label>
              </FormGroup>
            </Col>
            <Col className="mb-4" lg="3" sm="6">
              <p className="category">Radios</p>
              <FormGroup check className="form-check-radio">
                <Label check>
                  <Input
                    defaultValue="option1"
                    id="exampleRadios1"
                    name="exampleRadios"
                    type="radio"
                  ></Input>
                  <span className="form-check-sign"></span>
                  Radio is off
                </Label>
              </FormGroup>
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
              <FormGroup check className="form-check-radio" disabled>
                <Label check>
                  <Input
                    defaultValue="option3"
                    disabled
                    id="exampleRadios2"
                    name="exampleRadios1"
                    type="radio"
                  ></Input>
                  <span className="form-check-sign"></span>
                  Disabled radio is off
                </Label>
              </FormGroup>
              <FormGroup check className="form-check-radio" disabled>
                <Label check>
                  <Input
                    defaultChecked
                    defaultValue="option4"
                    disabled
                    id="exampleRadios2"
                    name="exampleRadios1"
                    type="radio"
                  ></Input>
                  <span className="form-check-sign"></span>
                  Disabled radio is on
                </Label>
              </FormGroup>
            </Col>
            
            <Col lg="3" sm="6">
              <p className="category">Sliders</p>
              <div className="slider" id="sliderRegular"></div>
              <br></br>
              <div className="slider slider-primary" id="sliderDouble"></div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default BasicElements;
