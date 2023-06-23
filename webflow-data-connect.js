$(document).ready(() => {

	$('[nocodb-template]').each((i, el) => {

		let table = el.attr('nocodb-table');
		let target = el.attr('nocodb-target');
		let $el = el.clone(true, true);

		let params = {
			limit: 250,
		}

		console.log(nocodb_query(table, params));

	});

})


let nocodb_query = (table, params) => {

	xios.get(nocodb + '/' + table, {
		headers: {
			'xc-token': xc_token
		},
		params: params
	}).then(function (response) {
		
		return response.data;

		// const item_template = $('.components [nocodb-template=]').first().clone(true, true);
		
		// let $el = research_item.clone(true, true);

		// response.data.list.forEach((item) => {

		// 	$el.find('[nocodb-field="title"]').text('hey');
		// 	$('body').append($el);

		// })


	}).catch(function (error) {
		console.log(error);
	});

}



