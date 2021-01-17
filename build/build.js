const fs = require('fs');
const path = require('path');

// github 通过 HTTP 接口直接访问源文件的文件大小限制为 1MB(1000000B)
// 为了保险，不卡那么死（因为数组里每个对象占的磁盘空间其实是不相等的），这里指定为 500000B
const GITHUB_HTTP_GET_FILE_SIZE_LIMIT = 500000;

const PATH_CHUNKED_DATA_DIR = path.resolve(__dirname, '../data-chunked');

const dataFilePaths = [
  path.resolve(__dirname, '../data/ci.json'),
  path.resolve(__dirname, '../data/idiom.json'),
  path.resolve(__dirname, '../data/word.json'),
  path.resolve(__dirname, '../data/xiehouyu.json'),
];

fs.mkdirSync(path.resolve(PATH_CHUNKED_DATA_DIR));
dataFilePaths.forEach(dataFilePath => {
  const { size: dataFileSize } = fs.statSync(dataFilePath);

  // 需要分成多少份
  const chunksAmount = Math.ceil(dataFileSize/GITHUB_HTTP_GET_FILE_SIZE_LIMIT);

  const data = require(dataFilePath);
  const chunkOffset = Math.round(data.length / chunksAmount);

  for (let i = 0, chunkIndex = 0; i < data.length; i += chunkOffset, chunkIndex++) {
    const chunkData = data.slice(i, i + chunkOffset);

    const originFileName = path.basename(dataFilePath, path.extname(dataFilePath));
    const chunkFileName = `${PATH_CHUNKED_DATA_DIR}/${originFileName}-chunk-${chunkIndex}.json`;

    fs.writeFileSync(chunkFileName, JSON.stringify(chunkData));
  }
});
