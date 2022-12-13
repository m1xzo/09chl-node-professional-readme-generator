// Include packages needed for this application
const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const generateMarkdown = require("./utils/generateMarkdown.js");
const License_API = 'https://api.github.com/licenses';

// Create an array of questions for user input
const questions = [
    {
        type: 'input',
        message: "What is the title of your project?",
        name: 'title',
        validate: function (answer) {
            return ((answer.length < 1) ? 'Please enter a valid project title.' : true);
        }
    },
    {
        type: 'input',
        message: "How would you describe your project?",
        name: 'description',
    }, 
    {
        type: 'input',
        message: "How to install your application?",
        name: 'installation',
    }, 
    {
        type: 'input',
        message: "How to use your application?",
        name: 'usage',
    }, 
    {
        type: 'input',
        message: "Link to screenshot or demo of your application.",
        name: 'screenshots',
    }, 
    {
        type: 'input',
        message: "What are the guidelines on how others can contribute to your project?",
        name: 'contributing',
    }, 
    {
        type: 'input',
        message: "List your collaborators and any third-party assets you have used.",
        name: 'credits',
    }, 
    {
        type: 'input',
        message: "How to run all necessary tests for your application? Please explain testing procedures.",
        name: 'tests',
    }, 
    {
        type: 'input',
        message: "What is your GitHub username?",
        name: 'github',
        transformer: function (answer) {
            return `@ ${answer}`
        },
        validate: function (answer) {
            let regex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
            return ((regex.test(answer)) ? true : 'Please enter a valid GitHub username.');
        }
    },
    {
        type: 'input',
        message: "What is your email address for others to reach you with additional questions?",
        name: 'email',
        validate: function (answer) {
            let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
            return ((regex.test(answer)) ? true : 'Please enter a valid email address.');
        }
    },
    {
        type: 'list',
        message: "Choose a license for your project.",
        name: 'license',
        choices: ''
    }
];

// Write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (err) =>
      err ? console.log(err) : console.log('Successfully created README!')
    );
}

// Initialize app
async function init() {
    // get license names
    const licenseNames = await getLicense();
    // add the available licenses to license choices
    questions[questions.length-1].choices = ['None', ...licenseNames];

    inquirer
        .prompt(questions)
        .then(async (response) => {
            writeToFile("README.md", await generateMarkdown(response))
        })
        .catch((error) => {
            if (error.isTtyError) {
              console.log("Your console environment is not supported!")
            } else {
              console.log(error)
            }
        });
}

// Get the available license names from github license API
const getLicense = async () => {
    const result = await axios.get(License_API);
    const licenseNames = result.data.map((license) => (license.name));
    return licenseNames;
}

// Function call to initialize app
init();