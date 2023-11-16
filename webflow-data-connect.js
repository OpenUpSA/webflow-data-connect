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

	$('.categories_select').on('select2:select', function (e) { 
    		console.log($('.categories_select').select2('data'));
	});
	$('.subjects_select').on('select2:select', function (e) { 
    		console.log($('.subjects_select').select2('data'));
	});
	$('.types_select').on('select2:select', function (e) { 
    		console.log($('.types_select').select2('data'));
	});
	$('.countries_select').on('select2:select', function (e) { 
    		console.log($('.countries_select').select2('data'));
	});
		

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

	// let query = '&filterByFormula=AND(find(LOWER("FRAUD"), LOWER({Title})) > 0,find("Free", {Access}) > 0)';

	// let query = '&fitlerByFormula=IF(OR(FIND("rec1DjFYk9Z8g", ARRAYJOIN({Countries_Link},",")) > 0, FIND("recqRtS0AwwtB", ARRAYJOIN({Countries_Link},",")) > 0))';

	
	let categoriesFilter = categories.map(category => `FIND('${category}', ARRAYJOIN({Categories_Link}, ',')) > 0`).join(',');
	
	let query = `filterByFormula=
	AND(
	    OR(
	        FIND('${searchTerm}', LOWER({Title})) > 0
	    ),
	    OR(${categoriesFilter}))
	)`;
	

	console.log(searchTerm, dateRange, categories, subjects, countries, types, page);

	let records = [];
	let pageNum = 1;
	let pageSize = 100;
	let total = 0;

	fetch(aitable + recordsTable + query, {
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

	getFilters();


})


