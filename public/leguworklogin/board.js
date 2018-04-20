function popupSuccess(){
	var top = parseInt($('.pop-over').css('top'),10);
	var height = $('.pop-over').height();

	if(top+height > $(window).height()){
		$('.pop-over').css({'bottom':'30px','top':''});
	}
}

function updateBoardSortData(){
	var data = {};
	$('.board-list .ui-sortable-handle').each(function(idx,v){
		data[ $(v).attr('data-bid') ] = idx;
	});
	localStorage.wekanBoardSortData = JSON.stringify(data);
	console.log('localStorage.wekanBoardSortData',localStorage.wekanBoardSortData);
}

$(function(){
	if($('#header-quick-access').length>0 && $(document).width()>=700){
		$('#content,#header').css('margin-left','60px');
	}
	
	if($('.board-list').length>0){
		//首页拖动
		$('.board-list').sortable({
			tolerance:'pointer',
			items: 'li:not(.js-add-board)',
			stop : function(event, ui){
				updateBoardSortData();
			}
		});

		var $msgListItem = $(".board-list .ui-sortable-handle");
		
		var sortData;
		if(localStorage.wekanBoardSortData){
			try{
				sortData = JSON.parse(localStorage.wekanBoardSortData);
			}catch(e){}
		}
		if(sortData){
			$msgListItem.sort(function (a, b) {
				var bida = $(a).attr('data-bid');
				var bidb = $(b).attr('data-bid');
				
				var sort1 = (sortData[bida]||0) * 1;
				var sort2 = (sortData[bidb]||0) * 1;
			 
				if (sort1 > sort2)
					return 1;
				if (sort1 < sort2)
					return -1;
				return 0;
			});
			$msgListItem.detach().appendTo(".board-list");
		}
		
	}
	
	document.body.onmousewheel = function(event) {
		event = event || window.event;
		var v = event.deltaY;
		$('.board-canvas').scrollLeft($('.board-canvas').scrollLeft()*1+v/2);
	};
})