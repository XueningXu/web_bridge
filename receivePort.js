const http = require('http');

var dynamicPort = 0;

const server1 = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            // Parse the data and extract payload
            const payload = JSON.parse(data).payload;
            // configure dynamic port when receiving port update
            dynamicPort = payload;

            // Respond with a success message
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Payload received and processed successfully: ' + payload);
        });
    } else {
        // Respond with a 404 error for non-POST requests
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Invalid request method');
    }

});

// Set up a message listener
window.addEventListener('message', function(event) {
    if (event.data === 'getSharedVariable') {
        // Send the shared variable to the other window
        window.postMessage(dynamicPort, '*');
    }
});

server1.listen(34567, () => {
    console.log('Server 1 is running at http://192.168.1.154:34567');

});
