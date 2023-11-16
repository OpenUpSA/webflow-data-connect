function fetchRelations() {

	[categoriesTable, subjectsTable, countriesTable, typesTable].forEach(table => {

		fetch(aitable + table, {
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

			let tableCol = table == categoriesTable ? 'Category' :
				table == subjectsTable ? 'Subject' :
				table == countriesTable ? 'country' :
				'Type';

			let select = table == categoriesTable ? '.categories_select' :
				table == subjectsTable ? '.subjects_select' :
				table == countriesTable ? '.countries_select' :
				'.types_select';

			let placeholder = table == categoriesTable ? 'Categories' :
				table == subjectsTable ? 'Subjects' :
				table == countriesTable ? 'Countries' :
				'Types';

			data.data.records.forEach(record => {
				$(select).append('<option value="' + record.recordId + '">' + record.fields[tableCol] + '</option>');
			})

			$(select).select2({
   				placeholder: "Select " + placeholder,
    				allowClear: true
			});
		})
		.catch((error) => {
			console.error(error);
		});

	})

}

function getFilters() {

	let search = $('search').val() || '';
	let categories = $('.categories_select').val() || [];
    	let subjects = $('.subjects_select').val() || [];
    	let types = $('.types_select').val() || [];
    	let countries = $('.countries_select').val() || [];

	let countriesFilter = countries.length > 0 ? countries.map(country => `FIND(LOWER('${country}'), LOWER({Countries_Lookup})) > 0`).join(',') : '';
	let categoriesFilter = categories.length > 0 ? categories.map(category => `FIND(LOWER('${category}'), LOWER({Categories_Lookup})) > 0`).join(',') : '';
	let subjectsFilter = subjects.length > 0 ? subjects.map(subject => `FIND(LOWER('${subject}'), LOWER({Subjects_Lookup})) > 0`).join(',') : '';
	let typesFilter = types.length > 0 ? types.map(type => `FIND(LOWER('${type}'), LOWER({Types_Lookup})) > 0`).join(',') : '';
	let searchFilter = (search != '' && search != null) ? `find(LOWER('${search}'), LOWER({Title})) > 0` : '';

	let filters = [categoriesFilter, subjectsFilter, typesFilter, countriesFilter].filter(Boolean);
    	let queryString = '?filterByFormula=' + encodeURIComponent('AND(' + filters.join(', ') + ')');

	history.pushState(null, null, '?' + queryString);

	fetchRecords();
		

}

function fetchRecords() {

	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);	

	const searchTerm = params.get('search'); // Output: search
	const dateRange = params.getAll('daterange'); // Output: 2022,2023
	const categories = params.getAll('categories'); // Output: ['asdsa','dsqwewqw']
	const subjects = params.getAll('subjects'); // Output: ['asdsa','dsqwewqw']
	const countries = params.getAll('countries'); // Output: ['wdwd','qwwwwww']
	const types = params.getAll('types'); // Output: ['asdsa','dsqwewqw']
	const page = params.get('page'); // Output: 1

	let countriesFilter = countries.length > 0 ? countries.map(country => `FIND(LOWER('${country}'), LOWER({Countries_Lookup})) > 0`).join(',') : '';
	let categoriesFilter = categories.length > 0 ? categories.map(category => `FIND(LOWER('${category}'), LOWER({Categories_Lookup})) > 0`).join(',') : '';
	let subjectsFilter = subjects.length > 0 ? subjects.map(subject => `FIND(LOWER('${subject}'), LOWER({Subjects_Lookup})) > 0`).join(',') : '';
	let typesFilter = types.length > 0 ? types.map(type => `FIND(LOWER('${type}'), LOWER({Types_Lookup})) > 0`).join(',') : '';
	let searchFilter = (searchTerm != '' && searchTerm != null) ? `find(LOWER('${searchTerm}'), LOWER({Title})) > 0` : '';
	
	
	let filters = [searchFilter, countriesFilter, categoriesFilter, subjectsFilter, typesFilter].filter(Boolean);
	let queryString = '?filterByFormula=' + encodeURIComponent('AND(' + filters.join(', ') + ')');
	

	console.log(searchTerm, dateRange, categories, subjects, countries, types, page);

	console.log(queryString);

	let records = [];
	let pageNum = 1;
	let pageSize = 100;
	let total = 0;

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

}


function renderRecords(records) {

	const $directoryItem = $('.directory_item').first().clone(true, true);

	$('.directory_list').html('');

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
	script.src = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);

	// add css to page
	const css = document.createElement('link');
	css.href = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css';
	css.rel = 'stylesheet';
	document.getElementsByTagName('head')[0].appendChild(css);

	$('.acc_categories').append('<select multiple="multiple" class="categories_select" name="categories[]" multiple="multiple" style="width: 100%"></select>');
	$('.acc_subjects').append('<select multiple="multiple" class="subjects_select" name="subjects[]" multiple="multiple" style="width: 100%"></select>');
	$('.acc_types').append('<select multiple="multiple" class="types_select" name="types[]" multiple="multiple" style="width: 100%"></select>');
	$('.acc_countries').append('<select multiple="multiple" class="countries_select" name="countries[]" multiple="multiple" style="width: 100%"></select>');

	fetchRelations();

	fetchRecords();

	$('.categories_select, .subjects_select, .types_select, .countries_select', '.research-search-box').on('change', function () {
		getFilters();
	})


})


