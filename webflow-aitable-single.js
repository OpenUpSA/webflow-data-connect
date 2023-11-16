const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);	
const record = params.get('id'); // Output: search

let queryString = '?recordsIds=' + record;

fetch(aitable + recordsTable + queryString, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		}
	})
	.then((response) => {
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return response;
	})
	.then((response) => response.json())
	.then((data) => {

		console.log(data);

		
		

	})
	.catch((error) => {
		console.error(error);
	});
