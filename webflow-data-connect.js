let params = {
limit: 250,
}

axios.get(nocodb + '/' + table, {
            headers: {
                'xc-token': xc_token
            },
            params: params
        }).then(function(response) {
				console.log(response);
        const research_item = $('.components .research-item__container').first().clone(true, true);
        
        let target = document.querySelector('body');
  			let $el = research_item.clone(true, true);
        
        response.data.list.forEach((item) => {
        	
          $el.find('[nocodb-field="title"]').text('hey');
					$('body').append($el);

        })


        }).catch(function(error) {
            console.log(error);
        });
