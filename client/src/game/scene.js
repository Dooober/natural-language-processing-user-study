import { parse, Verb, Direction, Error } from './parser'


const Location = {
    none: -1,
    start: 0,
    left: 1,
    right: 2,
    river: 3,
    hill: 4,
    center: 5,
    crossroads: 6,
    cliff: 7,
    bridge: 8
}

const LocationMessages = {
    start: "You are following a path that leads into a forest. As you approach the forest you notice that the path splits into two: a left path and a right path.",
    end: "You found your way out of the forest!",

    // Following paths
    back_to_start: "You exit the forest... back where you started. Determined to make your way through, you turn back around and are again faced with two paths: a left path and a right path.",
    path_LR: "As you follow the path it splits into two, one to the left and one to the right.",
    path_SR: "As you follow the path you come across two more, one straight ahead and one to the right.",
    path_SL: "As you follow the path you come across two more, one straight ahead and one to the left.",
    path_SLR: "As you follow the path it splits into three: one straight ahead, one to the left, and one to the right.",

    // River path
    river_right: "You come across a river as the path bends to the right.",
    river_left: "You come across a river as the path bends to the left.",

    // Hill path
    hill_left: "The path leads you uphill and continues ahead. There is a clearing to your left.",
    hill_right: "The path leads you uphill and continues ahead. There is a clearing to your right.",
    hill_LR: "You leave the cliff's edge and approach the forest. A path continues to the right and the left.",
    cliff: "You approach the clearing and come across a steep cliff that leads to a path below.",

    // Cliff face
    center_LR: "You follow the path until you reach a the bottom of a cliff face. The path splits to the left and to the right.",
    center_SL: "You follow the path until you reach a the bottom of a cliff face. The path splits into two: one straight ahead and one to the left.",
    center_SR: "You follow the path until you reach a the bottom of a cliff face. The path splits into two: one straight ahead and one to the right.",
    jump: "You go down the cliff face with a few bruises. There are three paths in front of you: one straight ahead, one to the left, and one to the right.",
    climb: "You climb the cliff face and reach the top. You stand at the top in a clearing with the forest in front of you.",

    // Through forest
    forest_start: "You cut through the forest and find yourself back where you started. Determined to make your way through, you turn back around and are again faced with two paths: a left path and a right path.",
    forest_center: "You cut through the forest and find yourself at the bottom of a cliff face. There are three paths: one straight ahead, one to the left, and one to the right.",
    forest_SLR: "You cut through the forest and find three paths: one straight ahead, one to the right, and one to the left.",

    // Through river
    river_start: "The river takes you out of the forest. You notice a path in the distance near a forest clearing. As you approach the path you notice that you are back where you started. Determined to make your way through, you are again faced with a left path and a right path.",

    default: "This is a default message for testing..."
}

function nextLocation(state, direction) {
    switch (direction) {
        case Direction.left:
            return state.left;
        case Direction.right:
            return state.right;
        case Direction.straight:
            return state.straight;
        case Direction.back:
            return state.back;
        case Direction.forest:
            return state.forest;
        case Direction.river:
            return state.river;
        case Direction.cliff:
            return state.cliff;
        default:
            return Location.none;
    }
}

function moveLocations(state, nextLocation) {
    switch(state.location) {
        case Location.start: // 2 paths, 1 forest
            switch (nextLocation) {
                case Location.left:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SR,
                        left: Location.none,
                        right: Location.center,
                        straight: Location.river,
                        back: Location.start,
                        forest: Location.right,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.right:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SL,
                        left: Location.center,
                        right: Location.none,
                        straight: Location.hill,
                        back: Location.start,
                        forest: Location.left,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.center:
                    Object.assign(state, {
                        prompt: LocationMessages.forest_center,
                        left: Location.left,
                        right: Location.right,
                        straight: Location.crossroads,
                        back: Location.start,
                        forest: Location.start,
                        river: Location.none,
                        cliff: Location.cliff,
                        
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.left: // 3 paths, 1 forest
            switch (nextLocation) {
                case Location.start:
                    Object.assign(state, {
                        prompt: LocationMessages.back_to_start,
                        left: Location.left,
                        right: Location.right,
                        straight: Location.none,
                        back: Location.none,
                        forest: Location.center,
                        river: Location.none,
                        cliff: Location.none,
                        
                    })
                    break;
                case Location.river:
                    Object.assign(state, {
                        prompt: LocationMessages.river_right,
                        left: Location.none,
                        right: Location.crossroads,
                        straight: Location.none,
                        back: Location.left,
                        forest: Location.none,
                        river: Location.start,
                        cliff: Location.none,
                        
                    })
                    break;
                case Location.center:
                    Object.assign(state, {
                        prompt: LocationMessages.center_LR,
                        left: Location.crossroads,
                        right: Location.right,
                        straight: Location.none,
                        back: Location.left,
                        forest: Location.start,
                        river: Location.none,
                        cliff: Location.cliff,
                        
                    })
                    break;
                case Location.right:
                    Object.assign(state, {
                        prompt: LocationMessages.forest_SLR,
                        left: Location.center,
                        right: Location.start,
                        straight: Location.hill,
                        back: Location.left,
                        forest: Location.left,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.right:
            switch (nextLocation) {
                case Location.start:
                    Object.assign(state, {
                        prompt: LocationMessages.back_to_start,
                        left: Location.left,
                        right: Location.right,
                        straight: Location.none,
                        back: Location.none,
                        forest: Location.center,
                        river: Location.none,
                        cliff: Location.none,
                        
                    })
                    break;
                case Location.hill:
                    Object.assign(state, {
                        prompt: LocationMessages.hill_left,
                        left: Location.cliff,
                        right: Location.none,
                        straight: Location.crossroads,
                        back: Location.right,
                        forest: Location.none,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.center:
                    Object.assign(state, {
                        prompt: LocationMessages.center_SL,
                        left: Location.left,
                        right: Location.none,
                        straight: Location.crossroads,
                        back: Location.right,
                        forest: Location.start,
                        river: Location.none,
                        cliff: Location.cliff,
                        
                    })
                    break;
                case Location.left:
                    Object.assign(state, {
                        prompt: LocationMessages.forest_SLR,
                        left: Location.start,
                        right: Location.center,
                        straight: Location.river,
                        back: Location.right,
                        forest: Location.right,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.river:
            switch (nextLocation) {
                case Location.left:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SL,
                        left: Location.center,
                        right: Location.none,
                        straight: Location.start,
                        back: Location.river,
                        forest: Location.right,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.crossroads:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SLR,
                        left: Location.bridge,
                        right: Location.center,
                        straight: Location.hill,
                        back: Location.river,
                        forest: Location.none,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.start:
                    Object.assign(state, {
                        prompt: LocationMessages.river_start,
                        left: Location.left,
                        right: Location.right,
                        straight: Location.none,
                        back: Location.none,
                        forest: Location.center,
                        river: Location.none,
                        cliff: Location.none,
                        
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.hill:
            switch (nextLocation) {
                case Location.crossroads:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SLR,
                        left: Location.center,
                        right: Location.bridge,
                        straight: Location.river,
                        back: Location.hill,
                        forest: Location.none,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.right:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SR,
                        left: Location.none,
                        right: Location.center,
                        straight: Location.start,
                        back: Location.hill,
                        forest: Location.left,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.cliff:
                    Object.assign(state, {
                        prompt: LocationMessages.cliff,
                        left: Location.none,
                        right: Location.none,
                        straight: Location.center,
                        back: Location.hill,
                        forest: Location.hill,
                        river: Location.none,
                        cliff: Location.center,
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.center:
            switch (nextLocation) {
                case Location.left:
                    Object.assign(state, {
                        prompt: LocationMessages.path_LR,
                        left: Location.start,
                        right: Location.river,
                        straight: Location.none,
                        back: Location.center,
                        forest: Location.right,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.right:
                    Object.assign(state, {
                        prompt: LocationMessages.path_LR,
                        left: Location.hill,
                        right: Location.start,
                        straight: Location.none,
                        back: Location.center,
                        forest: Location.left,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.crossroads:
                    Object.assign(state, {
                        prompt: LocationMessages.path_SLR,
                        left: Location.river,
                        right: Location.hill,
                        straight: Location.bridge,
                        back: Location.center,
                        forest: Location.none,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.start:
                    Object.assign(state, {
                        prompt: LocationMessages.forest_start,
                        left: Location.left,
                        right: Location.right,
                        straight: Location.none,
                        back: Location.none,
                        forest: Location.center,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.cliff:
                    Object.assign(state, {
                        prompt: LocationMessages.climb,
                        left: Location.none,
                        right: Location.none,
                        straight: Location.hill,
                        back: Location.center,
                        forest: Location.hill,
                        river: Location.none,
                        cliff: Location.center,
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.crossroads:
            switch (nextLocation) {
                case Location.bridge:
                    Object.assign(state, {
                        prompt: LocationMessages.end,
                        finished: true,
                    })
                    break;
                case Location.hill:
                    Object.assign(state, {
                        prompt: LocationMessages.hill_right,
                        left: Location.none,
                        right: Location.cliff,
                        straight: Location.right,
                        back: Location.crossroads,
                        forest: Location.none,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.river:
                    Object.assign(state, {
                        prompt: LocationMessages.river_left,
                        left: Location.left,
                        right: Location.none,
                        straight: Location.none,
                        back: Location.crossroads,
                        forest: Location.none,
                        river: Location.start,
                        cliff: Location.none,
                        
                    })
                    break;
                case Location.center:
                    Object.assign(state, {
                        prompt: LocationMessages.center_SR,
                        left: Location.none,
                        right: Location.left,
                        straight: Location.right,
                        back: Location.crossroads,
                        forest: Location.start,
                        river: Location.none,
                        cliff: Location.cliff,
                        
                    })
                    break;
                default:
                    break;
            }
            break;
        case Location.cliff:
            switch (nextLocation) {
                case Location.hill:
                    Object.assign(state, {
                        prompt: LocationMessages.hill_LR,
                        left: Location.crossroads,
                        right: Location.right,
                        straight: Location.none,
                        back: Location.cliff,
                        forest: Location.none,
                        river: Location.none,
                        cliff: Location.none,
                    })
                    break;
                case Location.center:
                    Object.assign(state, {
                        prompt: LocationMessages.jump,
                        left: Location.right,
                        right: Location.crossroads,
                        straight: Location.left,
                        back: Location.cliff,
                        forest: Location.start,
                        river: Location.none,
                        cliff: Location.cliff,
                        
                    })
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return state;
}

/* 
Start game
*/
export function startGame(parser) {
    const state = {
        parser: parser,
        location: Location.start,
        // Directions
        left: Location.left,
        right: Location.right,
        straight: Location.none,
        back: Location.none,
        forest: Location.center,
        river: Location.none,
        cliff: Location.none,
        
        prompt: LocationMessages.start,
        error: "",
        messageCount: 0,
        finished: false,
    }
    return state;
}

function performMove(state, direction) {
    const location = nextLocation(state, direction);
    state = moveLocations(state, location);
    state.location = location;
    state.message = state.prompt;
    return state;
}

function getNextState(state, command) {
    if (command.error !== Error.none) { // Error when parsing, need exactly one location and verb
        if (state.parser === 2) {
            state.error = command.error;
        }
    } else {
        state.error = Error.none;
        switch (command.verb) {
            case Verb.go:
                if (nextLocation(state, command.direction) === Location.none) {
                    command.error = Error.wrong_direction;
                    return getNextState(state, command);
                }
                state = performMove(state, command.direction);
                break;
            case Verb.climb:
                if (state.location === Location.center) {
                    state = performMove(state, Direction.cliff);
                } else if (command.direction === Direction.forest) {
                    state.message = "You try to climb a tree but fall down...\n" + state.prompt;
                } else {
                    state.message = "What are you trying to climb?\n" + state.prompt;
                }
                break;
            case Verb.jump:
                if (state.location === Location.cliff) {
                    state = performMove(state, Direction.cliff);
                } else {
                    state.message = "You jump really high, then fall down.\n" + state.prompt;
                }
                break;
            case Verb.swim:
                if (state.location === Location.river) {
                    state = performMove(state, Direction.river);
                } else {
                    state.message = "There is no water here...\n" + state.prompt;
                }
                break;
            default:
                state.message = "Something went wrong...";
                break;
        }
    }
    state.messageCount += 1;
    return state;
}


/*
Gets the next prompt from a given a message and parser
*/
export function getNextPrompt(state, message) {
    // Parse message into a command
    const command = parse(message);
    console.log(command);
    // Return next game state from the command
    const nextState = getNextState(state, command);
    console.log(nextState);

    return [command, nextState];
}
