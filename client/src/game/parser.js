export const Direction = {
    none: -1,
    left: 0,
    right: 1,
    straight: 2,
    back: 3,
    forest: 4,
    river: 5,
    cliff: 6
}

const DirectionWords = {
    "left": Direction.left,
    "right": Direction.right,
    "straight": Direction.straight,
    "forest": Direction.forest,
    "back": Direction.back,
    "river": Direction.river,
    "cliff": Direction.cliff,
    "bridge": Direction.bridge,

    // Alternatives
    "ahead": Direction.straight,
    "forward": Direction.straight,
    "onward": Direction.straight,
    "onwards": Direction.straight,

    "backwards": Direction.back,
    "behind": Direction.back,
    
    "tree": Direction.forest,
    "trees": Direction.forest,
    "water": Direction.river,
    "rock": Direction.cliff,
    "rocks": Direction.cliff,
    "up": Direction.cliff,

}

export const Verb = {
    none: -1,
    go: 0,
    climb: 1,
    swim: 2,
    jump: 3,
}

const VerbWords = {
    "go": Verb.go,
    "move": Verb.go,
    "proceed": Verb.go,
    "advance": Verb.go,
    "progress": Verb.go,
    "walk": Verb.go,
    "run": Verb.go,
    "hike": Verb.go,
    "travel": Verb.go,

    "climb": Verb.climb,
    "up": Verb.climb,

    "swim": Verb.swim,

    "jump": Verb.jump,
    "down": Verb.jump,
    "fall": Verb.jump,
}

export const Error = {
    none: -1,
    multiple_directions: "Cannot have multiple directions.\n",
    multiple_verbs: "Cannot have multiple verbs.\n",
    cannot_understand: "Command not understood, please try again.\n",
    wrong_direction: "You cannot go that direction, please try again.\n"
}

export function parse(s) {
    const punctuationless = s.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const finalString = punctuationless.replace(/\s{2,}/g," ");
    const lowerCase = finalString.toLowerCase();
    const words = lowerCase.split(' ');
    const command = {
        direction: Direction.none,
        verb: Verb.none,
        error: Error.none
    }
    words.forEach((word) => {
        if (word in DirectionWords) {
            if (command.direction !== Direction.none && DirectionWords[word] !== command.direction) {
                command.error = Error.multiple_directions;
                return command;
            } else {

                command.direction = DirectionWords[word];
            }
        } else if (word in VerbWords) {
            if (command.verb !== Verb.none && VerbWords[word] !== command.verb) {
                command.error = Error.multiple_verbs;
                return command;
            } else {
                command.verb = VerbWords[word];
            }
        }
    })

    if (command.verb === Verb.none || (command.direction === Direction.none && command.verb === Verb.go)) {
        command.error = Error.cannot_understand;
    }
    return command;
}