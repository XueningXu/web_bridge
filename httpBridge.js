function startWebhook() {
    const remoteServerUrl = 'https://192.168.1.154:34567'; // Replace with actual remote webhook URL
    const localServerUrl = 'https://192.168.1.182:40291'; // Replace with your local server URL

    const payload = {
        message: 'Get Trigger'
    };

    // Send a POST request to the remote webhook URL
    fetch(remoteServerUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: 'Get Trigger'
    })
    .then(response => response.text())
    .then(data => {
        console.log('Remote server response:', data);

        // After receiving response from remote server, send POST request to local server
        fetch(localServerUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
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
    })
    .catch(error => {
        console.error('Remote server error:', error);
    });

}

window.onload = setInterval(startWebhook, 5000);
