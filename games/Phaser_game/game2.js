let gameState = {}

function preload() {
    // load in background and characters
    this.load.image('bg', 'https://content.codecademy.com/projects/learn-phaser/cyoa/background.png');
    this.load.image('knight', 'https://content.codecademy.com/projects/learn-phaser/cyoa/knight.png');
    this.load.image('orc', 'https://content.codecademy.com/projects/learn-phaser/cyoa/orc.png');
    this.load.image('wizard', 'https://content.codecademy.com/projects/learn-phaser/cyoa/wizard.png');
}

function create() {
    gameState.background = this.add.image(0, 10, 'bg');
    gameState.background.setOrigin(0, 10);
    renderCharacter(this, 'knight');
    initializePage(this);
    const firstPage = fetchPage(1);
    displayPage(this, firstPage);
}

function renderCharacter(scene, key) {
    if (gameState.character) {
        gameState.character.destroy();
    }
    gameState.character = scene.add.image(270, 340, key);
    gameState.character.setOrigin(.5, 1);
    gameState.character.setScale(.7);
}

function initializePage(scene) {
    // create options list and background
    // and saves them into gameState

    if (!gameState.options) {
        // create options list
        // if it doesn't exist
        gameState.options = [];
    }

    if (!gameState.narrative_background) {
        // create narrative background
        // if it doesn't exist
        gameState.narrative_background = scene.add.rectangle(10, 360, 430, 170, 0x000);
        gameState.narrative_background.setOrigin(0, 0);
    }
}

function destroyPage() {
    // wipe out narrative text and options

    if (gameState.narrative) {
        // destroy narrative if it exists
        gameState.narrative.destroy();
    }

    for (let option of gameState.options) {
        // destroy options if they exist
        option.optionBox.destroy();
        option.optionText.destroy();
    }
}

function displayPage(scene, page) {
    const narrativeStyle = { fill: '#ffffff', fontStyle: 'italic', align: 'center', wordWrap: { width: 340 }, lineSpacing: 8 };

    // display general page character
    // & narrative here:
    renderCharacter(scene, page.character);
    gameState.narrative = scene.add.text(65, 380, page.narrative, narrativeStyle);

    // for-loop creates different options
    // need the index i for spacing the boxes
    for (let i = 0; i < page.options.length; i++) {
        let option = page.options[i];

        // color in the option box
        const optionBox = scene.add.rectangle(40 + i * 130, 470, 110, 40, 0xb39c0e, 0)
        optionBox.strokeColor = 0xb39c0e;
        optionBox.strokeWeight = 2;
        optionBox.strokeAlpha = 1;
        optionBox.isStroked = true;
        optionBox.setOrigin(0, 0)

        // add in the option text
        const baseX = 40 + i * 130;
        const optionText = scene.add.text(baseX, 480, option.option, { fontSize: 14, fill: '#b39c0e', align: 'center', wordWrap: { width: 110 } });
        const optionTextBounds = optionText.getBounds()

        // centering each option text
        optionText.setX(optionTextBounds.x + 55 - (optionTextBounds.width / 2));
        optionText.setY(optionTextBounds.y + 10 - (optionTextBounds.height / 2));

        // add in gameplay functionality
        // for options here
        optionBox.setInteractive();
        optionBox.on('pointerup', function() {
            const newPage = this.option.nextPage;
            if (newPage !== undefined) {
                destroyPage();
                displayPage(scene, fetchPage(newPage));
            }
        }, { option });
        optionBox.on('pointerover', function() {
            this.optionBox.setStrokeStyle(2, 0xffe014, 1);
            this.optionText.setColor('#ffe014');
        }, { optionBox, optionText });

        optionBox.on('pointerout', function() {
            this.optionBox.setStrokeStyle(1, 0xb38c03, 1);
            this.optionText.setColor('#b39c0e');
        }, { optionBox, optionText });
        gameState.options.push({
            optionBox,
            optionText
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    backgroundColor: 0xfea0fd,
    width: 450,
    height: 550,
    scene: {
        preload,
        create,
    }
};

const game = new Phaser.Game(config);

function fetchPage(page) {


    const pages = [{
            character: 'orc',
            page: 1,
            narrative: 'Orc: Hello?',
            options: [
                { option: 'Say Hi', nextPage: 2 },
                { option: 'Ignore', nextPage: 41 },
            ]
        },

        {
            character: 'orc',
            page: 41,
            narrative: 'Orc: Uhm. Excuse me?!',
            options: [
                { option: 'Say Hi', nextPage: 2 },
                { option: 'Continue Ignoring', nextPage: 3 },
            ]
        },

        {
            character: 'orc',
            page: 2,
            narrative: 'Orc: I need help getting the bible from the top cabinet. Can you help me?',
            options: [
                { option: 'Your... what?', nextPage: 5 },
                { option: 'Don\'t think so', nextPage: 4 },
            ]
        },

        {
            character: 'orc',
            page: 5,
            narrative: 'Orc: My Bible. Am I hard to understand? I can\'t reach it by myself but I think you could help.',
            options: [
                { option: 'How do I help', nextPage: 6 },
                { option: 'No I don\'t think so', nextPage: 4 },
            ]
        },

        {
            character: 'orc',
            page: 6,
            narrative: 'Orc: If I lift you up there do you think you can grab it?',
            options: [
                { option: 'Grab it', nextPage: 10 },
            ]
        },

        {
            character: 'orc',
            page: 10,
            narrative: 'Orc: Thank you so much, folks usually just slink away because of my appearance.Someome told me that reading the Bible will change that',
            options: [
                { option: 'No problem', nextPage: 11 },
                { option: 'Really?', nextPage: 18 },
            ]
        },

        {
            character: 'orc',
            page: 18,
            narrative: 'Orc: Uhm. Yes? I\'m an orc? Did you miss that somehow?',
            options: [
                { option: 'I guess so', nextPage: 20 },
            ]
        },

        {
            character: 'orc',
            page: 20,
            narrative: 'You and the orc discuss the Bible while he bakes cookies. You have a perfectly wonderful time.',
            options: [
                { option: 'Eat cookies', nextPage: 21 },
            ]
        },

        {
            character: 'orc',
            page: 21,
            narrative: 'The cookies are fantastic and both you and the Orc decides to be good Christians. ',
            options: [
                { option: 'Request recipe', nextPage: 19 },
            ]
        },

        {
            character: 'orc',
            page: 19,
            narrative: 'The orc shares his recipe with you. The spirit of the lord enters and both of you pray for 20 minutes.You leave the cave feeling energized from the fellowship and the sugar.\nTHE END',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'Satan',
            page: 11,
            narrative: 'Satan: Hey. Did you help out that orc?',
            options: [
                { option: 'Yes', nextPage: 12 },
                { option: 'No', nextPage: 23 },
            ]
        },

        {
            character: 'Satan',
            page: 23,
            narrative: 'Satan: OK Good.You helped me instead',
            options: [
                { option: 'Actually...', nextPage: 12 },
                { option: 'Leave', nextPage: 24 },
            ]
        },

        {
            character: 'Satan',
            page: 24,
            narrative: 'You walk out of the cave. You feel guilty. What a weird adventure you went on today!\nTHE END',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'Satan',
            page: 12,
            narrative: 'Satan: You really shouldn\'t have. How will the orc ever learn?',
            options: [
                { option: 'I guess.', nextPage: 14 },
                { option: 'Who are you?', nextPage: 13 },
            ]
        },

        {
            character: 'Satan',
            page: 13,
            narrative: 'Satan: Just an interested party.',
            options: [
                { option: 'Whatever.', nextPage: 25 },
                { option: 'You\'re right', nextPage: 17 },
            ]
        },

        {
            character: 'Satan',
            page: 25,
            narrative: 'Satan: I know what\'s best for orcs.',
            options: [
                { option: 'I guess.', nextPage: 14 },
            ]
        },

        {
            character: 'Satan',
            page: 17,
            narrative: 'You act like nothing is wrong with what Satan is saying.',
            options: [
                { option: 'OK', nextPage: 22 },
            ]
        },

        {
            character: 'Satan',
            page: 22,
            narrative: 'But thinking about it later you realize you should\'ve been more proactive.\nGAME OVER',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'Satan',
            page: 14,
            narrative: 'Satan: You guess? Come on. An orc should be able to do anything.',
            options: [
                { option: 'Cookies', nextPage: 15 },
                { option: 'Who are you?', nextPage: 13 },
            ]
        },

        {
            character: 'Satan',
            page: 15,
            narrative: 'You let Satan Know that both you and Orc are now Christians and you got cookies and a new friend.',
            options: [
                { option: 'OK', nextPage: 16 },
            ]
        },

        {
            character: 'Satan',
            page: 16,
            narrative: 'But Satan continues being weird, evil and persistent for his own reasons.\nGAME OVER',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'orc',
            page: 3,
            narrative: 'Orc: Look, I need some help. Can you help me or are you just going to stand there not saying anything?',
            options: [
                { option: 'What do you need?', nextPage: 2 },
                { option: 'Walk away slowly', nextPage: 4 },
            ]
        },

        {
            character: 'orc',
            page: 4,
            narrative: 'Orc: Oh I see how it is. Look at the real hero here, slinking away from doing anything good.',
            options: [
                { option: 'Leave', nextPage: 8 },
                { option: 'Engage', nextPage: 7 },
            ]
        },

        {
            character: 'orc',
            page: 7,
            narrative: 'You engage in passionate conversation with the orc, and discuss Jesus Christ and the Bible and rewards for not doing bad things.',
            options: [
                { option: 'OK', nextPage: 9 },
            ]
        },

        {
            character: 'wizard',
            page: 8,
            narrative: 'Wizard: Hey there.',
            options: [
                { option: 'Hello, wizard.', nextPage: 26 },
            ]
        },

        {
            character: 'wizard',
            page: 26,
            narrative: 'Wizard: Do you have any unfinished business in my cave?',
            options: [
                { option: 'Make friends', nextPage: 27 },
                { option: 'Make enemies', nextPage: 46 },
                { option: 'Make cookies', nextPage: 29 },
            ]
        },

        {
            character: 'wizard',
            page: 46,
            narrative: 'Wizard: I don\'t think you need help with that.',
            options: [
                { option: 'Wow', nextPage: 47 },
            ]
        },

        {
            character: 'wizard',
            page: 47,
            narrative: 'You got ROASTED by the wizard.\nGAME OVER',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'wizard',
            page: 27,
            narrative: 'Wizard: There are many creatures to befriend here. Whose companionship do you desire?',
            options: [
                { option: 'Orc', nextPage: 28 },
                { option: 'Wizard', nextPage: 30 },
                { option: 'Satan', nextPage: 38 },
            ]
        },

        {
            character: 'wizard',
            page: 38,
            narrative: 'Wizard: Are you sure? That guy gives me the creeps.',
            options: [
                { option: 'I\'m sure', nextPage: 39 },
                { option: 'I don\'t know', nextPage: 27 },
            ]
        },

        {
            character: 'wizard',
            page: 39,
            narrative: 'Wizard: OK! Summoning Satan now.',
            options: [
                { option: 'Great', nextPage: 40 },
            ]
        },

        {
            character: 'Satan',
            page: 40,
            narrative: 'Satan: Hi.',
            options: [
                { option: 'Hi friend', nextPage: 42 },
            ]
        },

        {
            character: 'Satan',
            page: 42,
            narrative: 'Satan: Actually I\'m kind of busy.',
            options: [
                { option: 'Oh?', nextPage: 43 },
            ]
        },

        {
            character: 'Satan',
            page: 43,
            narrative: 'Satan: But I\'ll call you later when I can.',
            options: [
                { option: 'That\'s fine', nextPage: 44 },
            ]
        },

        {
            character: 'Satan',
            page: 44,
            narrative: 'The evil one keeps calling, and it  really bothers you wish you had listened to Jesus Christ instead.',
            options: [
                { option: 'OK', nextPage: 45 },
            ]
        },

        {
            character: 'Satan',
            page: 45,
            narrative: 'You failed to make friends in the cave.\nGAME OVER',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'wizard',
            page: 30,
            narrative: 'Wizard: Oh. Wow. Ok. What do you want to do?',
            options: [
                { option: 'Play video games', nextPage: 31 },
                { option: 'Small talk', nextPage: 32 },
            ]
        },

        {
            character: 'wizard',
            page: 31,
            narrative: 'You play video games with the wizard.',
            options: [
                { option: 'OK', nextPage: 36 },
            ]
        },

        {
            character: 'wizard',
            page: 36,
            narrative: 'The wizard keeps losing to you at video games!',
            options: [
                { option: 'OK', nextPage: 37 },
            ]
        },

        {
            character: 'wizard',
            page: 37,
            narrative: 'The wizard is a very sore loser and casts a banishing spell on you! Sheesh!\nTHE END',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'wizard',
            page: 32,
            narrative: 'Wizard: How\'s the weather outside?',
            options: [
                { option: 'It\'s OK', nextPage: 33 },
                { option: 'The worst!', nextPage: 33 },
                { option: 'Great!', nextPage: 33 },
            ]
        },

        {
            character: 'wizard',
            page: 33,
            narrative: 'You and the wizard continue engaging in small talk. You learn you grew up not far from each other.',
            options: [
                { option: 'OK', nextPage: 34 },
            ]
        },

        {
            character: 'wizard',
            page: 34,
            narrative: 'You have a couple mutual friends, in fact! You decide to hang out again next week.',
            options: [
                { option: 'OK', nextPage: 35 },
            ]
        },

        {
            character: 'wizard',
            page: 35,
            narrative: 'You made a valuable friend today!\nTHE END',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        },

        {
            character: 'wizard',
            page: 28,
            narrative: 'Wizard: Really? Seems like you were kinda standoffish to him earlier.',
            options: [
                { option: 'I can change', nextPage: 29 },
                { option: 'I was surprised', nextPage: 29 },
            ]
        },

        {
            character: 'wizard',
            page: 29,
            narrative: 'Wizard: I will send you back in time, try being nicer to the orc.',
            options: [
                { option: 'OK', nextPage: 1 },
            ]
        },

        {
            character: 'orc',
            page: 9,
            narrative: 'You leave the cave with a new outlook. Your radiant confidence makes a palpable positive impact on your new Christian life.\nTHE END',
            options: [
                { option: 'Play again', nextPage: 1 },
            ]
        }
    ]

    return pages.find(function(e) { if (e.page == page) return e });
}