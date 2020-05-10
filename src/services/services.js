const apiCaller = async (url, method = 'GET', requestBody, headers = { "Content-Type": "application/json", "Accept": "application/json" }) => {
    let abortController = new AbortController();
    let configForFetch = {
        method,
        headers,
        body: JSON.stringify(requestBody),
        signal: abortController.signal
    }

    setTimeout(() => {
        abortController.abort();
    }, 6000);

    let response = '';
    try {
        response = await fetch(basePath + url, configForFetch)
    } catch (err) {
        throw err;
    }

    return await response.json();
}

let basePath = 'https://resviscard.herokuapp.com/'

export default apiCaller;