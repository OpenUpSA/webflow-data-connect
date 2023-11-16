
let queryString = 'recordsIds=';

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
		
		renderRecords(records);
		
		$('.research-count-count').text(total);
		

	})
	.catch((error) => {
		console.error(error);
	});
