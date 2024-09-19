const http = require('http');
const cron = require('node-cron');
const moment = require('moment-timezone');
const axios = require('axios');

// 添加24小时访问的URL数组
const urls = [
  'https://www.baidu.com',
  'https://www.yahoo.com',
  'https://www.baidu.com',
  'https://www.yahoo.com',
  'https://www.baidu.com',
  'https://www.yahoo.com',
  'https://www.baidu.com',
  'https://www.yahoo.com',
];

// 添加在01:00至05:00暂停访问，其他时间正常访问的URL数组
function visitWebsites() {
  const websites = [
    'https://www.google.com',
    'https://www.google.com',
    'https://www.google.com',
    'https://www.google.com'
  ];

  websites.forEach(async (url) => {
    try {
      const response = await axios.get(url);
      console.log(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Visited web successfully: ${url} - Status code: ${response.status}\n`);
    } catch (error) {
      console.error(`Error visiting ${url}: ${error.message}\n`);
    }
  });
}

function checkAndSetTimer() {
  const currentMoment = moment().tz('Asia/Hong_Kong');
  if (currentMoment.hours() >= 1 && currentMoment.hours() < 5) {
    console.log(`Stop visit from 1:00 to 5:00 --- ${currentMoment.format('YYYY-MM-DD HH:mm:ss')}`);
    clearInterval(visitIntervalId);
    const nextVisitTime = moment().tz('Asia/Hong_Kong').add(0, 'day').hours(5).minutes(0).seconds(0);
    const nextVisitInterval = nextVisitTime.diff(currentMoment);
    setTimeout(() => {
      startVisits();
    }, nextVisitInterval);
  } else {
    startVisits();
  }
}

let visitIntervalId; 
function startVisits() {
  clearInterval(visitIntervalId);
  visitIntervalId = setInterval(() => {
    visitWebsites();
  }, 2 * 60 * 1000);
}

function runScript() {
  setInterval(() => {
    checkAndSetTimer();
  }, 2 * 60 * 1000);
}

async function scrapeAndLog(url) {
  try {
    const response = await axios.get(url);
    console.log(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')} Web visited Successfully: ${url} - Status code: ${response.status}\n`);
  } catch (error) {
    console.error(`${moment().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss')}: Web visited Error: ${url}: ${error.message}\n`);
  }
}

// 创建HTTP服务
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!\n');
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found\n');
  }
});

// 导出 app 函数
module.exports = () => {
  const port = process.env.PORT || 3000;
  
  server.listen(port, () => {
    console.log(`Server is running on port:${port}`);
    
    // 启动定时任务
    checkAndSetTimer();
    runScript();
    
    // 每2分钟访问一次
    cron.schedule('*/2 * * * *', () => {
      console.log('Running webpage access...');
      urls.forEach((url) => {
        scrapeAndLog(url);
      });
    });
  });
  
  return server;
};
