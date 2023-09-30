import { useState, useEffect, useCallback } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { startGame, getNextPrompt } from './game/scene';
import 'survey-core/defaultV2.min.css';

const API_BASE = "https://ec2-13-59-117-1.us-east-2.compute.amazonaws.com";

const AppState = {
    start: 0,
    game: 1,
    survey: 2,
    done: 3
}

const surveyModel = {
    elements: [{
        name: "background",
        title: "How often do you play text-adventures?",
        type: "radiogroup",
        choices: [
            { value: 1, text: "Never played one" },
            { value: 2, text: "I played one or two in the past" },
            { value: 3, text: "I play text-adventures every so often" },
            { value: 4, text: "I play text-adventures somewhat frequently" },
            { value: 5, text: "I play text-adventures all the time" }
        ],
        isRequired: true
    }, 
    {
        name: "experience",
        title: "How was your overall experience with the adventure?",
        type: "radiogroup",
        choices: [
            { value: 1, text: "Aweful" },
            { value: 2, text: "Bad" },
            { value: 3, text: "Neutral" },
            { value: 4, text: "Good" },
            { value: 5, text: "Amazing" }
        ],
        isRequired: true
    },
    {
        name: "error",
        title: "How did shown or hidden error messages affect your playing experience?",
        type: "radiogroup",
        choices: [
            { value: 1, text: "Made the adventure unplayable" },
            { value: 2, text: "Negatively affected my playing experience" },
            { value: 3, text: "Did not affect my playing experience" },
            { value: 4, text: "Positively affected my playing experience" },
            { value: 5, text: "Made the adventure much more fun" }
        ],
        isRequired: true
    },
    {
        name: "why",
        title: "Why did this affect your experience in this way?",
        type: "text",
        isRequired: true
    },
    {
        name: "features",
        title: "What additional features would have made your experience more enjoyable?",
        type: "text",
        isRequired: true
    },
    {
        name: "optional",
        title: "Anything else that you would like to add?",
        type: "text"
    }
    ]
}

function App() {
    const [appState, setAppState] = useState(AppState.start);

    const [user, setUser] = useState(0);

    // GameState
    const [gameState, setGameState] = useState({
        parser: -1,
        location: -1,
        // Directions
        left: -1,
        right: -1,
        straight: -1,
        back: -1,
        forest: -1,
        river: -1,
        cliff: -1,
        
        prompt: "",
        message: "",
        messageCount: 0,
        finished: false,
    });

    const [input, setInput] = useState("");
    const [prompt, setPrompt] = useState("test");

    //const [surveyActive, setSurveyActive] = useState(false);

    useEffect(() => {

    }, [])


    // API CALLS
    const GetUser = () => {
        fetch(API_BASE + "/user", {method: 'GET', mode: 'cors'})
            .then(res => res.json())
            .then(data => {
                setUser(data.user_id);
                const state = startGame(data.parser);
                setGameState(state);
                setPrompt(state.message);
                setAppState(AppState.game);
            })
            .catch(err => console.error("Error: ", err));
    }

    const PostMessage = (command) => {
        const data = {
            user_id: user,
            number: gameState.messageCount,
            input: input,
            verb: command.verb,
            direction: command.direction,
            error: command.error
        }
        fetch(API_BASE + "/message", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error("Error: ", err));
    }

    const PostSurvey = (data) => {
        const new_data = {...data, user_id: user};
        fetch(API_BASE + "/survey", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(new_data)})
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error("Error: ", err));
    }

    const onStart = () => {
        GetUser();
    }
    

    const handleSubmit = (event) => {
        const output = getNextPrompt(gameState, input);
        setGameState(output[1]);
        PostMessage(output[0]);
        
        setPrompt(output[1].message);
        if (gameState.finished) {
            setAppState(AppState.survey);
        }
        event.target[0].value = "";
        event.preventDefault();
    }

    const survey = new Model(surveyModel);
    const surveyComplete = useCallback((sender) => {
        setAppState(AppState.done);
        PostSurvey(sender.data);
    }, []);
    survey.onComplete.add(surveyComplete)
    
    switch (appState) {
        case AppState.game:
            return (            
                <div className="App">
                    <div className='Game'>
                        <h1>{prompt}</h1>
                        <form onSubmit={handleSubmit}>
                            <input type="text" onChange={(e) => setInput(e.target.value)} required></input>
                            <input type="submit"></input>
                        </form>
                    </div>
                </div>
            )
        case AppState.start:
            return (
                <div className="App">
                    <div className='Button'>
                        <input type="submit" value="Start" onClick={onStart}></input>
                    </div>
                </div>
            )
        case AppState.survey:
            return (
                <div className="App">
                    <h1>You found your way out of the forest!</h1>
                    <Survey model={survey} />
                </div>
            )
        case AppState.done:
            return (
                <div className='App'>
                    <h1>Thank you for completing the survey</h1>
                </div>
            )
        default:
            return (
                <div className="App">
                
                </div>
            )
    };
}

export default App;
