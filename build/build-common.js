const fs = require('fs');
const path = require('path');

const wordArr = require('../data/word');

const PATH_COMMON_DATA_DIR = path.resolve(__dirname, '../data-common');

try {
  fs.mkdirSync(path.resolve(PATH_COMMON_DATA_DIR));
} catch (e) {}

const commonWordArr = wordArr.filter(wordItem => {
  if (wordItem.strokes > 10 || wordItem.more.startsWith('搜索与')) {
    return false;
  }

  return true;
});

const commonWordFilePath = path.resolve(__dirname, '../data-common/word.json');

fs.writeFileSync(commonWordFilePath, JSON.stringify(commonWordArr));
