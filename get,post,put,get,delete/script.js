const baseUrl = 'https://jsonplaceholder.typicode.com/users';
let selectedMethod = 'GET';

// 1. Method Selection
document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMethod = btn.getAttribute('data-method');
        // Clear inputs when switching methods for a clean start
        document.getElementById('statusText').innerText = `Selected: ${selectedMethod}`;
    });
});

// 2. Main Logic
document.getElementById('submitBtn').addEventListener('click', async () => {
    // --- Step A: Get all current input values ---
    const id = document.getElementById('inputId').value.trim();
    const name = document.getElementById('inputName').value.trim();
    const username = document.getElementById('inputUser').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const address = document.getElementById('inputAddress').value.trim();
    
    const outputElement = document.getElementById('jsonOutput');
    const statusText = document.getElementById('statusText');
    const statusCode = document.getElementById('statusCode');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // --- Step B: Validation ---
    if (['POST', 'PUT', 'PATCH'].includes(selectedMethod)) {
        if (!name || !username || !email || !address) {
            alert("Please fill in all fields (Name, Username, Email, and Address).");
            return;
        }
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
    }

    if (['PUT', 'PATCH', 'DELETE'].includes(selectedMethod) && !id) {
        alert("An ID (1-10) is required for this action.");
        return;
    }

    // --- Step C: Build the Request ---
    outputElement.innerText = "Processing...";
    
    // Determine the URL
    let url = (id && selectedMethod !== 'POST') ? `${baseUrl}/${id}` : baseUrl;
    
    // Create the options object FIRST
    let options = { 
        method: selectedMethod,
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    };

    // Add body only for methods that send data
    if (['POST', 'PUT', 'PATCH'].includes(selectedMethod)) {
        const payload = {
            name: name,
            username: username,
            email: email,
            address: { city: address }
        };
        options.body = JSON.stringify(payload);
    }

    // --- Step D: Execute Fetch ---
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        statusCode.innerText = `Status: ${response.status}`;
        
        // Custom Success Message
        if (selectedMethod === 'POST') statusText.innerText = "Successfully Added.";
        else if (selectedMethod === 'DELETE') statusText.innerText = "Successfully Deleted.";
        else statusText.innerText = "Action Successful!";

        outputElement.innerText = JSON.stringify(data, null, 2);

    } catch (error) {
        statusCode.innerText = `Status: Error`;
        statusText.innerText = "Request Failed";
        outputElement.innerText = `Error Detail: ${error.message}`;
    }
});