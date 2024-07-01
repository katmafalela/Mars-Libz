// Function to process the story
function processStory(rawStory) {
    // Split the story into individual words
    const storyWords = rawStory.split(' ');

    // Define a map to categorize words by placeholders
    const wordTypes = {
        '\[n\]': 'noun',
        '\[v\]': 'verb',
        '\[a\]': 'adjective'
    };

    // Loop through each word
    return storyWords.map(word => {
        // Check if the word is a placeholder
        const match = Object.keys(wordTypes).find(key => word.includes(key));

        if (match) {
            // Create an object with the word and its type
            return {
                text: word.replace(match, ''),
                type: wordTypes[match]
            };
        } else {
            // Return the word as-is
            return { text: word };
        }
    });
}

// Get the raw story from the server
getRawStory()
    .then(processStory)
    .then((processedStory) => {
        // Select the edit and preview areas
        const editArea = document.querySelector('.madLibsEdit');
        const previewArea = document.querySelector('.madLibsPreview');

        // Loop through each word in the processed story
        processedStory.forEach((storyItem) => {
            // Check if the word has a type (noun, verb, or adjective)
            if (storyItem.type) {
                // Create an input field for the user to enter a word
                const inputField = document.createElement('input');
                inputField.type = "text";
                inputField.placeholder = storyItem.type;
                inputField.maxLength = 20;
                editArea.appendChild(inputField);

                // Create a span to display the word in the preview area
                const outputField = document.createElement('span');
                outputField.classList.add("blank");
                outputField.innerText = storyItem.type;
                previewArea.appendChild(outputField);

                // Update the output field when the user types in the input field
                inputField.addEventListener("input", () => {
                    outputField.innerText = inputField.value;
                });
            } else {
                // If the word doesn't have a type, just add it to the edit and preview areas
                const editField = document.createElement('span');
                editField.innerText = ` ${storyItem.text}`;
                editArea.appendChild(editField);
                const previewField = document.createElement('span');
                previewField.innerText = ` ${storyItem.text}`;
                previewArea.appendChild(previewField);
            }
        });

        // Select all the input fields
        const inputFields = document.querySelectorAll("input");
        // Add an event listener to each input field to move to the next field when Enter is pressed
        inputFields.forEach((input, i) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const nextIndex = i === inputFields.length - 1 ? 0 : i + 1;
                    inputFields[nextIndex].focus();
                }
            });
        });

        // Select the reset button
        const resetButton = document.querySelector(".reset");
        // Select all the output fields
        const outputFields = document.querySelectorAll(".blank");

        // Add an event listener to the reset button to clear the input fields and reset the output fields
        resetButton.addEventListener("click", () => {
            inputFields.forEach((input, i) => {
                input.value = "";
                outputFields[i].innerText = input.placeholder;
            });
        });

        // Select the sound effect element (assuming elements exist)
        const soundEffect = document.querySelector("#sound");
        // Select the play and stop buttons
        const startButton = document.querySelector(".play");
        const stopButton = document.querySelector(".stop");

        // Add event listeners to the play and stop buttons to control the sound effect
        startButton.addEventListener("click", () => soundEffect.play());
        stopButton.addEventListener("click", () => soundEffect.pause());
    });
