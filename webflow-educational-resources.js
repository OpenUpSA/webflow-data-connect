function fetchRelations() {

	[categoriesTable, subjectsTable, countriesTable, typesTable].forEach(table => {
		setTimeout(() => {
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
	
				

				setTimeout(() => {
					$(select).select2({
		   				placeholder: "Select " + placeholder,
		    				allowClear: true
					});
				}, 1000);
	
				
				
			})
			.catch((error) => {
				console.error(error);
			});
		}, 1000);

	})

}

function getFilters() {

	console.log('getting filters');

	let search = $('.research-search-box').val() || '';
	let categories = $('.categories_select').val() || [];
	let subjects = $('.subjects_select').val() || [];
	let types = $('.types_select').val() || [];
	

	

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
	const categories = params.getAll('categories'); // Output: ['asdsa','dsqwewqw']
	const subjects = params.getAll('subjects'); // Output: ['asdsa','dsqwewqw']
	
	const types = params.getAll('types'); // Output: ['asdsa','dsqwewqw']
	const page = params.get('page'); // Output: 1

	
	
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
	
	let queryString = filters.length > 1 ? '?filterByFormula=' + encodeURIComponent('AND(' + filters.join(', ') + ')') : 
		filters.length > 0 ? '?filterByFormula=' + encodeURIComponent(filters.join(', ')) : '';

	console.log(queryString);

	let records = [];
	let pageNum = 1;
	let pageSize = 100;
	let total = 0;

	fetch(aitable + educationalResourcesTable + queryString, {
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
		
		
		renderRecords(records);
		
		
		

	})
	.catch((error) => {
		console.error(error);
	});

}


function renderRecords(records) {

	const $directoryItem = $('.educational-resource-item').first().clone(true, true);
	const $subjectPill = $directoryItem.find('.research-subject').clone(true, true);
	const $categoryPill = $directoryItem.find('.research-category').clone(true, true);
	const $countryPill = $directoryItem.find('.research-country').clone(true, true);
	const $typePill = $directoryItem.find('.research-country').clone(true, true);


	$('.educational-resources-list').html('');

	console.log($subjectPill, $categoryPill, $countryPill, $typePill);

	
	records.forEach(record => {

		let recordItem = $directoryItem.clone();
		recordItem.removeClass('hidden_item');
		recordItem.find('a.is--hover-red').attr('href','https://aosf.webflow.io/educational-resource-view?id=' + record.recordId);
		recordItem.find('h3').text(record.fields.Title);
		recordItem.find('.rl-text-style-small').text(record.fields.Description);
		recordItem.find('.research-type').text(record.fields.Types_Lookup);
		
		recordItem.find('.item-meta').html('');

		if(record.fields.Categories_Lookup != undefined && record.fields.Categories_Lookup.length > 0) {
			record.fields.Categories_Lookup.forEach(cat => {
				let categoryPill = $categoryPill.clone();
				categoryPill.text(cat);
				recordItem.find('.item-meta').append(categoryPill);
			})
		}

		if(record.fields.Subjects_Lookup != undefined && record.fields.Subjects_Lookup.length > 0) {
			record.fields.Subjects_Lookup.forEach(sub => {
				let subjectPill = $subjectPill.clone();
				subjectPill.text(sub);
				recordItem.find('.item-meta').append(subjectPill);
			})
		}
		
		$('.educational-resources-list').append(recordItem);


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
	
	fetchRecords();
	
	fetchRelations();
	
	let timeoutId;
	
	$('.search-box').on('keyup', function () {
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
