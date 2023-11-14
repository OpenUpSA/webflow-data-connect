function renderRecords(records) {

	const $directoryItem = $('.directory_item').first().clone(true, true);

	records.forEach(record => {

		let recordItem = $directoryItem.clone();
		recordItem.find('h2').text(record.fields.Title);
		$('.directory_list').append(recordItem);




	});



}


$(document).ready(() => {

	let records = [];
	let pageNum = 1;
	let pageSize = 100;
	let total = 0;

	fetch(apitable, {
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

			if(records.length > 0) {
				renderRecords(records);
			}

		})
		.catch((error) => {
			console.error(error);
  		});
	

})


