function fetchCategories() {

	fetch(aitable + categoriesTable, {
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
		data.data.records.forEach(record => {
			$('.categories_select').append('<option value="' + record.recordId + '">' + record.fields.Category + '</option>');
		})
	})
	.catch((error) => {
		console.error(error);
	});

}

function fetchSubjects() {
}

function fetchCountries() {
}

function fetchTypes() {
}


function renderRecords(records) {

	const $directoryItem = $('.directory_item').first().clone(true, true);

	records.forEach(record => {

		let recordItem = $directoryItem.clone();
		recordItem.removeClass('hidden_item');
		recordItem.find('h2').text(record.fields.Title);
		recordItem.find('p').text(record.fields.Description);
		recordItem.find('.research-year').text(new Date(record.fields.Year).getFullYear());
		recordItem.find('.research-type').text(record.fields.Type_Lookup);
		recordItem.find('.research-access').text(record.fields.Access);

		$('.directory_list').append(recordItem);




	});



}


$(document).ready(() => {

	// add script to page
	const script = document.createElement('script');
	script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.sumoselect/3.4.9/jquery.sumoselect.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);

	// add css to page
	const css = document.createElement('link');
	css.href = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.sumoselect/3.4.9/sumoselect.min.css';
	css.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(css);

	$('.acc_countries').append('<select multiple="multiple" class="countries_select"></select>');
	setTimeout(() => {
		$('.countries_select').SumoSelect();
	}, 1000);

	fetchCategories();
	// fetchSubjects();
	// fetchCountries();
	// fetchTypes();



	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);	

	const searchTerm = params.get('search'); // Output: search
	const dateRange = params.getAll('daterange'); // Output: 2022,2023
	const categories = params.getAll('categories'); // Output: ['asdsa','dsqwewqw']
	const subjects = params.getAll('subjects'); // Output: ['asdsa','dsqwewqw']
	const countries = params.getAll('countries'); // Output: ['wdwd','qwwwwww']
	const types = params.getAll('types'); // Output: ['asdsa','dsqwewqw']
	const page = params.get('page'); // Output: 1

	console.log(searchTerm);
	console.log(dateRange);
	console.log(categories);
	console.log(subjects);
	console.log(countries);
	console.log(types);
	console.log(page);


	let records = [];
	let pageNum = 1;
	let pageSize = 100;
	let total = 0;

	fetch(aitable + recordsTable, {
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

			records = data.data.records;
			total = data.data.total;
			pageNum = data.data.pageNum;
			pageSize = data.data.pageSize;

			if (records.length > 0) {
				renderRecords(records);
			}

		})
		.catch((error) => {
			console.error(error);
		});


})


