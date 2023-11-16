const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);	
const record = params.get('id'); // Output: search

let queryString = '?recordIds=' + record;

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

		let record = data.data.records[0];

		$('h1').text(record.fields.Title);
		$('.text-size-small').text(record.fields.Citation);
		$('.rl-text-style-medium').text(record.fields.Description);
		$('.rl-button-small').attr('href', record.fields.Link);
		$('.research-access').text(record.fields.Access);
		// year, type, category, subject, country
		
		

	})
	.catch((error) => {
		console.error(error);
	});
