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
				$(select).append('<option value="' + record.fields[tableCol] + '">' + record.fields[tableCol] + '</option>');
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

	console.log('getting filters');

	let search = $('.research-search-box').val() || '';
	let categories = $('.categories_select').val() || [];
    	let subjects = $('.subjects_select').val() || [];
    	let types = $('.types_select').val() || [];
    	let countries = $('.countries_select').val() || [];

	console.log(countries);

	let queryParams = [];

	console.log('queryParams:', queryParams);

	if (search) {
	    queryParams.push(`search=${search}`);
	}
	
	categories.forEach(category => {
	    queryParams.push(`categories=${category}`);
	});
	
	subjects.forEach(subject => {
	    queryParams.push(`subjects=${subject}`);
	});
	
	types.forEach(type => {
	    queryParams.push(`types=${type}`);
	});
	
	countries.forEach(country => {
	    queryParams.push(`countries=${country}`);
	});

	let queryString = queryParams.length > 1 ? '?' + queryParams.join('&') : (queryParams.length === 1 ? '?' + queryParams[0] : '');

	console.log(queryString);
	
	if (queryString.length > 0) {
	    history.pushState(null, null, queryString);
	} else {
	    history.pushState(null, null, window.location.pathname);
	}

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

	let countriesFilter = countries.length > 0 ? 
	    (countries.length > 1 ? 
	        `OR(${countries.map(country => `FIND(LOWER('${country}'), LOWER({Countries_Lookup})) > 0`).join(',')})` :
	        `FIND(LOWER('${countries[0]}'), LOWER({Countries_Lookup})) > 0`
	    ) : '';
	
	let categoriesFilter = categories.length > 0 ? 
	    (categories.length > 1 ? 
	        `OR(${categories.map(category => `FIND(LOWER('${category}'), LOWER({Categories_Lookup})) > 0`).join(',')})` :
	        `FIND(LOWER('${categories[0]}'), LOWER({Categories_Lookup})) > 0`
	    ) : '';
	
	let subjectsFilter = subjects.length > 0 ? 
	    (subjects.length > 1 ? 
	        `OR(${subjects.map(subject => `FIND(LOWER('${subject}'), LOWER({Subjects_Lookup})) > 0`).join(',')})` :
	        `FIND(LOWER('${subjects[0]}'), LOWER({Subjects_Lookup})) > 0`
	    ) : '';
	
	let typesFilter = types.length > 0 ? 
	    (types.length > 1 ? 
	        `OR(${types.map(type => `FIND(LOWER('${type}'), LOWER({Types_Lookup})) > 0`).join(',')})` :
	        `FIND(LOWER('${types[0]}'), LOWER({Types_Lookup})) > 0`
	    ) : '';
	
	let searchFilter = (searchTerm != '' && searchTerm != null) ? `find(LOWER('${searchTerm}'), LOWER({Title})) > 0` : '';
	
	let filters = [searchFilter, countriesFilter, categoriesFilter, subjectsFilter, typesFilter].filter(Boolean);
	
	// let queryString = filters.length > 1 ? '?filterByFormula=' + encodeURIComponent('AND(' + filters.join(', ') + ')') : 
		// filters.length > 0 ? '?filterByFormula=' + encodeURIComponent(filters.join(', ')) : '';

	let queryString = '';

	// Constructing the filterByFormula part
	if (filters.length > 1) {
		queryString = '?filterByFormula=' + encodeURIComponent('AND(' + filters.join(', ') + ')');
	} else if (filters.length > 0) {
		queryString = '?filterByFormula=' + encodeURIComponent(filters.join(', '));
	}
	
	// Adding pageNum if provided
	const pageNum = page; // Replace this with the actual page number or variable
	if (pageNum) {
		queryString += queryString ? '&' : '?'; // Adding '&' or '?' based on whether queryString is empty
		queryString += 'pageNum=' + encodeURIComponent(pageNum);
	}

	

	console.log(queryString);

	let records = [];
	let pages = 1;
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

		

		records = data.data.records;
		total = data.data.total;
		pageNum = data.data.pageNum;
		pageSize = data.data.pageSize;
		pages = Math.ceil(total / pageSize);
		
		renderRecords(records);

		renderPagination(pages, pageNum);
		
		$('.research-count-count').text(total);
		

	})
	.catch((error) => {
		console.error(error);
	});

}


function renderRecords(records) {

	const $directoryItem = $('.directory_item').first().clone(true, true);
	const $subjectPill = $directoryItem.find('.research-subject');
	const $categoryPill = $directoryItem.find('.research-category');
	const $countryPill = $directoryItem.find('.research-country');

	$('.directory_list_live').html('');

	records.forEach(record => {

		let recordItem = $directoryItem.clone();
		recordItem.removeClass('hidden_item');
		recordItem.find('a.is--hover-red').attr('href','https://aosf.webflow.io/research-view?id=' + record.recordId);
		recordItem.find('h2').text(record.fields.Title);
		recordItem.find('p').text(record.fields.Description);
		recordItem.find('.research-year').text(new Date(record.fields.Year).getFullYear());
		recordItem.find('.research-type').text(record.fields.Types_Lookup);
		recordItem.find('.research-access').text(record.fields.Access);

		console.log(record.fields.Types_Lookup);
		
		if(record.fields.Types_Lookup[0] == 'Report') {
			recordItem.find('.research-type-img-report').removeClass('hidden_item');
		} else if(record.fields.Types_Lookup[0] == 'Book') {
			recordItem.find('.research-type-img-book').removeClass('hidden_item');
		} else if(record.fields.Types_Lookup[0] == 'Journal') {
			recordItem.find('.research-type-img-journal').removeClass('hidden_item');
		} else {
			recordItem.find('.research-type-img-news').removeClass('hidden_item');
		} 
		
		recordItem.find('.research-meta-2').html('');
		
		if(record.fields.Countries_Lookup != undefined && record.fields.Countries_Lookup.length > 0) {
			record.fields.Countries_Lookup.forEach(country => {
				let countryPill = $countryPill.clone();
				countryPill.text(country);
				recordItem.find('.research-meta-2').append(countryPill);
			})
		}

		if(record.fields.Categories_Lookup != undefined && record.fields.Categories_Lookup.length > 0) {
			record.fields.Categories_Lookup.forEach(cat => {
				let categoryPill = $categoryPill.clone();
				categoryPill.text(cat);
				recordItem.find('.research-meta-2').append(categoryPill);
			})
		}

		if(record.fields.Subjects_Lookup != undefined && record.fields.Subjects_Lookup.length > 0) {
			record.fields.Subjects_Lookup.forEach(sub => {
				let subjectPill = $subjectPill.clone();
				subjectPill.text(sub);
				recordItem.find('.research-meta-2').append(subjectPill);
			})
		}
		
		$('.directory_list_live').append(recordItem);


	});

	



}

function renderPagination(pages, pageNum) {
	
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

	fetchRelations();

	fetchRecords();

	let timeoutId;
	
	$('.research-search-box').on('keyup', function () {
		if ($(this).val().length > 3) {
	        	clearTimeout(timeoutId);
	        	timeoutId = setTimeout(getFilters, 1000);
	    	}
	});

	$('.categories_select').on('change', function () { getFilters(); });
	$('.subjects_select').on('change', function () { getFilters(); });
	$('.types_select').on('change', function () { getFilters(); });
	$('.countries_select').on('change', function () { getFilters(); });

	$('.select2-selection__choice__remove').on('click', function () { getFilters(); });

})


