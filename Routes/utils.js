const fs = require('fs');

// Recursive function to get files
function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);

  return fileList;
}

function createFile(filePath) {
  try {
    fs.writeFileSync(filePath, '{}');
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getFiles,
  createFile,
};
