import React, {useState, useRef, useEffect} from 'react';
import './App.css';
import {nanoid} from "nanoid";


function App() {
  const [response, setResponse] = useState(
    () => JSON.parse(localStorage.getItem("response")) || [])
  const [isToggle, setIsToggle] = useState(false)
  const ref = useRef(null)

  function getPrompt() {
    
    const promptData = {
      prompt: ref.current.value,
      temperature: 0.6,
      max_tokens: 128,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
     }

    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
    },
    body: JSON.stringify(promptData),
    })
   .then(res => res.json())
   .then(data => {const newResponse = {
     id: nanoid(),
     prompt: ref.current.value,
     res: data.choices[0].text
   }
   setResponse(prev => [newResponse, ...prev])
    })
  }

  useEffect(() => {
    localStorage.setItem("response", JSON.stringify(response))
  }, [response])

  const deleteRes = (event, responseId) => {
    event.stopPropagation()
    setResponse(prevRes => prevRes.filter(res => res.id !== responseId))
  }

  const clearAllPrompts = () => {
    localStorage.clear()
    setResponse([])
  }

  const handleToggle = () => {
    setIsToggle(!isToggle)
  }
  
  const displayRes = response.map(res => 
  <div key={res.id} className="response-container">
    <div className="response-prompts">
      <p>Prompt: </p>
      <p>Response: </p>
    </div>
    <div className="response-prompts">
      <p>{res.prompt}</p>
      <p>{res.res}</p>
    </div>
    <button className="delete-btn" 
    onClick={(event) => deleteRes(event, res.id)}>
      <i className="fa-solid fa-trash"></i>
    </button>
  </div>
  )

  return (
    <div id="App">
      <div id="formArea">
        <h1>Prompt AI</h1>
        <div className="description">
          <p>Type a Prompt!</p>
          <button className="btn" id="exampleBtn" onClick={handleToggle}>Examples</button>
        </div>
        {isToggle && <div className="example-container">
          <ul>
          <li>Write a poem about a dog riding skis</li>
          <li>Write a story about a boy following his dreams</li>
          <li>Write a tagline for an ice cream shop</li>
          <li>Suggest one name for a black horse</li>
          </ul>
        </div>}
        <textarea 
        name="prompt" 
        id="prompt" 
        ref={ref}
        placeholder="Enter text here"
        />
        <button type="button" className="btn" id="submitBtn" onClick={getPrompt}>Submit</button>
        {response.length > 0 && <button className="btn" id="clearStorageBtn" onClick={clearAllPrompts}>Remove All Prompts</button>}
      </div>
      <div id="res">{displayRes}</div>
    </div>
  );
}

export default App;
