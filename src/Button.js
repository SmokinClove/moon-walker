import React, { useState } from "react";

export default function Button() {
  const [ buttonText, setButtonText ] = useState("Click me!");
  return (<button onClick={() => setButtonText("Clicked")}>{buttonText}</button>);
}
