function renderRecords(records) {

	records.forEach(record => {

		// duplicate $('.directory_item') for each record
		let $directoryItem = $('.directory_item').clone();

		// change the h2 text to the record name
		$directoryItem.find('h2').text(record.fields.Title);

		// append

		$('.directory_list').append($directoryItem);




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

			records = data.records;
			total = data.total;
			pageNum = data.pageNum;
			pageSize = data.pageSize;

			if(records.length > 0) {
				renderRecords(records);
			}

		})
		.catch((error) => {
			console.error(error);
  		});
	

})


