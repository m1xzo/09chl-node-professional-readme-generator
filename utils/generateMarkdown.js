// Include packages needed for this application
const axios = require("axios");
const License_API = 'https://api.github.com/licenses';

// Generate a license badge based on which license is passed in
// If there is no license, return an empty string
async function renderLicenseBadge(license) {
  if (license === "None") {
    return "";
  }
  
  const licenseInfo = await getLicense(license);
  const badgeID = licenseInfo.spdx_id.replace('-', '--');
  const badge = `[![License: ${licenseInfo.spdx_id}](https://img.shields.io/badge/License-${
    badgeID}-blue.svg)]`
  return badge;
}

// Generate the license link
// If there is no license, return an empty string
async function renderLicenseLink(license) {
  if (license === "None") {
    return "";
  }
  
  const licenseInfo = await getLicense(license);
  const result = await axios.get(licenseInfo.url);
  return `(${result.data.html_url})`;
}

// Generate the license section of README
// If there is no license, return an empty string
async function renderLicenseSection(license) {
  if (license === "None") {
    return "";
  }
  
  const licenseInfo = await getLicense(license);
  const result = await axios.get(licenseInfo.url);
  const today = new Date();
  return `This application is released under the *[${result.data.name}](${result.data.html_url})*.
  <details>
  <summary>${result.data.name} &copy ${today.getFullYear()}</summary>
  <p><blockquote>${result.data.body}</blockquote></p>
  </details>`
}

// Get license info from github license API based on user input
const getLicense = async (license) => {
  const result = await axios.get(License_API);
  const licenseInfo = result.data.find((item) => (item.name === license));
  return licenseInfo;
}

// Generate markdown for README
async function generateMarkdown(data) {
  return `# ${data.title}
  ${await renderLicenseBadge(data.license)}${await renderLicenseLink(data.license)}
  ## Description
  ${data.description}
  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)  
  - [Screenshots](#screenshots)  
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [Tests](#tests)
  - [Questions](#questions)
  - [License](#license)
  ## Installation
  ${data.installation}
  ## Usage
  ${data.usage}
  ## Screenshots
  ${data.screenshots}
  ## Contributing
  ${data.contributing}
  ## Credits
  ${data.credits}
  ## Tests
  ${data.tests}
  ## Questions
  If you have any additional questions, please do not hesitate to contact me:
  | GitHub     | Email      |
  | ---------- | ---------- |
  | [@${data.github}](https://www.github.com/${data.github}) | ${data.email} |
  ## License
  ${await renderLicenseSection(data.license)}`;
}

module.exports = generateMarkdown;
