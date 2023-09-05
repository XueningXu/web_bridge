
var globalPortNumber = 0;

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
      body: 'get port number\n',
      signal: signal, // Assign the signal option
    });
    
    clearTimeout(timeoutId); // Clear the timeout if the request completes before the timeout

    if (response.ok) {
      console.log(`Port ${port} responded with status ${response.status}`);
      globalPortNumber = port;
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
}


// Start sending batches of requests
sendBatches(30000)
