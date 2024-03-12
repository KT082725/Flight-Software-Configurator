// Define a function to fetch JSON data, set up the form, and handle form submission
function setupForm() {
	fetch('https://raw.githubusercontent.com/Gagan-Space/Cansat-Flight-Software/main/data/config.json')
	  .then(response => {
		if (!response.ok) {
		  throw new Error('Network response was not ok');
		}
		return response.json();
	  })
	  .then(originalData => {
		console.log(originalData); // This will log the original JSON data to the console
		
		// Function to recursively create form elements based on JSON data
		function createFormElements(parentElement, data, parentKeys = []) {
		  for (const key in data) {
			if (typeof data[key] === 'object') {
			  createFormElements(parentElement, data[key], [...parentKeys, key]);
			} else {
			  const label = document.createElement('label');
			  label.textContent = key;
			  const input = document.createElement('input');
			  input.setAttribute('type', 'text'); // You can adjust the input type based on your data
			  input.setAttribute('name', [...parentKeys, key].join('.')); // Use dot notation for nested keys
			  input.value = data[key];
			  parentElement.appendChild(label);
			  parentElement.appendChild(input);
			}
		  }
		}
  
		// Assuming you have a <form> element with id 'dynamicForm' in your HTML
		const form = document.getElementById('dynamicForm');
		createFormElements(form, originalData);
		
		// Create a submit button
		const submitButton = document.createElement('button');
		submitButton.textContent = 'Download';
		form.appendChild(submitButton);
  
		// Attach event listener to submit button
		submitButton.addEventListener('click', function(event) {
		  event.preventDefault(); // Prevent form submission
		  
		  // Update original JSON data with form data
		  updateOriginalData(originalData, form);
  
		  // Create a download link for the updated JSON data
		  const downloadLink = document.createElement('a');
		  downloadLink.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(originalData)));
		  downloadLink.setAttribute('download', 'config.json');
		  downloadLink.click(); // Programmatically trigger download
		});
	  })
	  .catch(error => {
		console.error('There was a problem with the fetch operation:', error);
	  });
  
	// Function to update original JSON data with form data
	function updateOriginalData(data, form) {
	  const formData = new FormData(form);
	  for (const [key, value] of formData.entries()) {
		const keys = key.split('.');
		let obj = data;
		for (let i = 0; i < keys.length - 1; i++) {
		  obj = obj[keys[i]];
		}
		obj[keys[keys.length - 1]] = value;
	  }
	}
  }
  
  // Call the setupForm function when the page loads
  window.addEventListener('load', setupForm);
  
