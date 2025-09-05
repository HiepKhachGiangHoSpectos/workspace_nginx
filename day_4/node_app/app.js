const http = require('http');
const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Node change app - Day 4');
});
app.listen(3000, () => {
    console.log('Node app listening on port 3000');
});
