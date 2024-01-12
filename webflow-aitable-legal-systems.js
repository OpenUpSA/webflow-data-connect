const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);	
const country = params.get('country'); 

$(document).ready(function() {
	$('.country-select-wrapper').append('<select><option>Select A Country</option></select>');
})
