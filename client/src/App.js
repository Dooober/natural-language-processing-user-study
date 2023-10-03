import { useState, useEffect } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { startGame, getNextPrompt } from './game/scene';
import 'survey-core/defaultV2.min.css';

const API_BASE = 'http://15.204.232.175:3001';

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
            { value: 1, text: "Awful" },
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

    const [user, setUser] = useState("");

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
    const [error, setError] = useState("");
    const [prompt, setPrompt] = useState("test");

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
                setPrompt(state.prompt);
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
            .catch(err => console.error("Error: ", err));
    }

    const PostSurvey = (results) => {
        const new_data = {
            user_id: user,
            background: results.background,
            experience: results.experience,
            error: results.error,
            why: results.why,
            features: results.features,
            optional: results.optional
        };
        console.log(new_data);
        fetch(API_BASE + "/survey", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(new_data)})
            .then(res => res.json())
            .catch(err => console.error("Error: ", err));
    }

    const onStart = () => {
        GetUser();
    }
    

    const handleSubmit = (event) => {
        const output = getNextPrompt(gameState, input);
        setGameState(output[1]);
        PostMessage(output[0]);
        
        setPrompt(output[1].prompt);
        setError(output[1].error);
        if (gameState.finished) {
            setAppState(AppState.survey);
        }
        event.target[0].value = "";
        event.preventDefault();
    }

    const survey = new Model(surveyModel);
    const surveyComplete = (sender) => {
        setAppState(AppState.done);
        PostSurvey(sender.data);
    };
    survey.onComplete.add(surveyComplete)
    
    switch (appState) {
        case AppState.game:
            return (            
                <div className="App">
                    <div className='Game'>
                        <h1>{error}</h1>
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
                        <h1>This user study consists of playing a text-adventure and completing a short survey about your experience. Once you click start, you will begin the adventure. Only some commands are valid, and you may or may not receive error messages.</h1>
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
