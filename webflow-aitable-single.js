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

		$typePill = $('.research-type').first().clone(true, true);
		$subjectPill = $('.research-subject').first().clone(true, true);
		$categoryPill = $('.research-category').first().clone(true, true);
		$countryPill = $('.research-country').first().clone(true, true);
		$yearPill = $('.research-year').first().clone(true, true);
		$accessPill = $('.research-access').first().clone(true, true);

		let record = data.data.records[0];

		$('.research-meta').html('');
		$('.research-meta-2').html('');

		let yearPill = $typePill.clone(true, true);
		yearPill.text(record.fields.Year)
		$('.research-meta').append(yearPill);

		
		

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
