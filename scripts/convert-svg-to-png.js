import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = 'assets/images';
const WIDTH = 1200;
const HEIGHT = 627;
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 0 }; // #ffffff

function walkDir(dir, callback) {
  fs.promises.readdir(dir, { withFileTypes: true })
    .then(entries => {
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath, callback); // recurse
        } else if (entry.isFile()) {
          callback(fullPath);
        }
      }
    })
    .catch(err => {
      console.error(`Error reading directory ${dir}:`, err);
    });
}

function processSvgFile(filePath) {
  if (path.extname(filePath).toLowerCase() !== '.svg') return;

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, '.svg');
  const outputFile = path.join(dir, baseName + '.png');

  // Check if PNG already exists
  fs.promises.access(outputFile, fs.constants.F_OK)
    .then(() => {
      console.log(`Skipping ${filePath}, PNG already exists.`);
    })
    .catch(() => {
      sharp(filePath)
        .resize(WIDTH, HEIGHT, {
          fit: 'contain',
          background: BACKGROUND,
        })
        .png()
        .toFile(outputFile)
        .then(() => {
          console.log(`Converted ${filePath} -> ${outputFile}`);
        })
        .catch(err => {
          console.error(`Error converting ${filePath}:`, err);
        });
    });
}

// Start recursive scan
walkDir(ROOT_DIR, processSvgFile);
