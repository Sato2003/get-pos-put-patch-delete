const baseUrl = 'https://jsonplaceholder.typicode.com/users';
let selectedMethod = 'GET';

// 1. Method Button Logic
document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMethod = btn.getAttribute('data-method');
        document.getElementById('submitBtn').innerText = selectedMethod.toLowerCase();
    });
});

// 2. Main Logic
document.getElementById('submitBtn').addEventListener('click', async () => {
    const id = document.getElementById('inputId').value.trim();
    const name = document.getElementById('inputName').value.trim();
    const username = document.getElementById('inputUser').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const address = document.getElementById('inputAddress').value.trim();
    
    const outputElement = document.getElementById('jsonOutput');
    const statusText = document.getElementById('statusText');
    const statusCode = document.getElementById('statusCode');

    outputElement.innerText = "Processing...";

    let url = (id && selectedMethod !== 'POST') ? `${baseUrl}/${id}` : baseUrl;
    let options = { 
        method: selectedMethod,
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    };

    if (['POST', 'PUT', 'PATCH'].includes(selectedMethod)) {
        options.body = JSON.stringify({ name, username, email, address: { city: address } });
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        statusCode.innerText = `Status: ${response.status}`;
        statusText.innerText = response.ok ? "Success" : "Error";

        // --- CUSTOM PLAIN TEXT DISPLAY ---
        const formatAsText = (user) => {
            const city = user.address?.city || user.address || 'N/A';
            return `ID: ${user.id}\nName: ${user.name}\nUsername: ${user.username}\nEmail: ${user.email}\nAddress: ${city}\n---------------------------`;
        };

        // CHECK IF METHOD IS DELETE
        if (selectedMethod === 'DELETE' && response.ok) {
            outputElement.innerText = `ID ${id} is deleted`;
        } 
        else if (Array.isArray(data)) {
            outputElement.innerText = data.map(user => formatAsText(user)).join('\n\n');
        } 
        else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            outputElement.innerText = formatAsText(data);
        } 
        else {
            outputElement.innerText = "No data found or operation completed.";
        }

    } catch (error) {
        statusCode.innerText = "Status: Error";
        outputElement.innerText = `Error: ${error.message}`;
    }
});
