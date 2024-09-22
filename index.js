require('colors');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const ignore = require('ignore');

const folderToZip = process.argv[2];

if (!folderToZip || !fs.existsSync(folderToZip)) {
  console.error('Please provide a valid folder path.'.red);
  process.exit(1);
}

const outputDir = path.join(__dirname, 'results');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const folderName = path.basename(folderToZip);
let outputZip = path.join(outputDir, `${folderName}.zip`);

function getUniqueFileName(baseName) {
  let count = 1;
  let newFileName = baseName;
  while (fs.existsSync(newFileName)) {
    newFileName = path.join(outputDir, `${folderName}-${count}.zip`);
    count++;
  }
  return newFileName;
}

outputZip = getUniqueFileName(outputZip);

const gitignorePath = path.join(folderToZip, '.gitignore');
const ig = ignore();

if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  ig.add(gitignoreContent.split('\n').filter(Boolean));
}

const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

const spinner = ['|', '/', '-', '\\'];
let spinIndex = 0;
const loadingInterval = setInterval(() => {
  process.stdout.write(`\rProcessing... ${spinner[spinIndex]}`);
  spinIndex = (spinIndex + 1) % spinner.length;
}, 100000);

output.on('close', () => {
  clearInterval(loadingInterval);
  console.log(`\r${archive.pointer()} total bytes`.green);
  console.log(`Archive has been finalized and saved to ${outputZip}`.green);
  console.log(
    '\nThank you for using zip-helper! \nPlease follow me on GitHub and Twitter: @dntyk'
      .cyan
  );
});

archive.on('error', (err) => {
  clearInterval(loadingInterval);
  throw err;
});

archive.pipe(output);

function addDirectoryToZip(folder) {
  fs.readdirSync(folder).forEach((file) => {
    const filePath = path.join(folder, file);
    const relativePath = path.relative(folderToZip, filePath);

    if (fs.statSync(filePath).isDirectory()) {
      if (!ig.ignores(`${relativePath}/`)) {
        addDirectoryToZip(filePath);
      }
    } else {
      if (!ig.ignores(relativePath)) {
        archive.file(filePath, { name: relativePath });
      }
    }
  });
}

addDirectoryToZip(folderToZip);

archive.finalize();
