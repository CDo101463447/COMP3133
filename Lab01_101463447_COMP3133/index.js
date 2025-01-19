const fs = require('fs');
const csv = require('csv-parser');

// File paths
const inputFile = 'input_countries.csv';
const canadaFile = 'canada.txt';
const usaFile = 'usa.txt';

// Function to delete a file if it exists, to avoid multiple file generated
const deleteFileIfExists = (filePath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) reject(`Error deleting ${filePath}: ${err}`);
        else resolve(`${filePath} deleted.`);
      });
    } else {
      resolve(`${filePath} does not exist.`);
    }
  });
};

// Function to process CSV and filter data
const filterAndWriteData = () => {
  return new Promise((resolve, reject) => {
    const writeStreams = {
      canada: fs.createWriteStream(canadaFile),
      usa: fs.createWriteStream(usaFile),
    };

    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (row) => {
        // pick up data 'canada' in column country
        if (row.country.toLowerCase() === 'canada') {
          writeStreams.canada.write(`${row.country},${row.year},${row.population}\n`);
        // pick up data 'united states' in colmn country
        } else if (row.country.toLowerCase() === 'united states') {
          writeStreams.usa.write(`${row.country},${row.year},${row.population}\n`);
        }
      })
      .on('end', () => {
        resolve('Data filtered and written to files.');
      })
      .on('error', (err) => {
        reject(`Error processing CSV: ${err}`);
      });
  });
};

// Main function to execute the tasks
const main = async () => {
  try {
    console.log(await deleteFileIfExists(canadaFile));
    console.log(await deleteFileIfExists(usaFile));
    console.log(await filterAndWriteData());
  } catch (error) {
    console.error(error);
  }
};

// Run the script
main();
