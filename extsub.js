	if (!Lampa.Lang) {
				var lang_data = {};
				Lampa.Lang = {
					add: function (data) {
						lang_data = data;
					},
					translate: function (key) {
						return lang_data[key] ? lang_data[key].ru : key;
					}
				};
			}
			Lampa.Lang.add({
				ext_sub_sync: {
					ru: 'Синхронизация внешних субтитров. Задержка: ',
					uk: 'Синхронізація зовнішніх субтитрів. Затримка: ',
					en: 'Synchronizing external subtitles. Delay: ',
					be: 'Сінхранізацыя знешніх субтытраў. Затрымка: '
				},
				ext_sub_enable: {
					ru: 'Включаем внешние субтитры с USB флешки',
					uk: 'Включаємо зовнішні субтитри з USB флешки',
					en: 'Trying to enable external subtitles from USB flash',
					be: 'Уключаем знешнія субтытры з USB флэшкі'
				},
				ext_sub_fail: {
					ru: 'Внешние субтитры не работают',
					uk: 'Помилка зовнішніх субтитрів',
					en: 'External subtitles fail',
					be: 'Памылка знешніх субтытраў'
				}					
			});

	var sync = 0;
	var enabled = 0;
	
	document.addEventListener("keydown", function(inEvent){
        if (inEvent.keyCode === 33) {
			if (enabled !== 0){
			sync = sync - 50;
			getWebosmediaIdS(setSubtitleSync);
			console.log ("[P+ button hit]");
			Lampa.Noty.show(Lampa.Lang.translate('ext_sub_sync') + (-sync) + "ms");
			}
		}
		else if (inEvent.keyCode === 34) {
			if (enabled !== 0){
			sync = sync + 50;
			getWebosmediaIdS(setSubtitleSync);
			console.log ("[P- button hit]");
			Lampa.Noty.show(Lampa.Lang.translate('ext_sub_sync') + (-sync) + "ms");
			}
		}	
		else if (inEvent.keyCode === 53) {
			enabled = 1;
			sync = 0;
			getWebosmediaIdS(extSubSet);
			setTimeout(getWebosmediaIdS(setSubtitleSync),500);
			
			console.log ("[5 button hit]");
			}				
	});

	//sync ext subs

	function setSubtitleSync(mediaIdS){
	    webOS.service.request("luna://com.webos.media", {
	    method:"setSubtitleSync",
	    parameters: {
			"mediaId": mediaIdS,
			"sync": sync
			},
	      onSuccess: function (result) {
			console.log("[sync][Success] "+ sync + " " + JSON.stringify(result));
    		},
	      onFailure: function (result) {
	        console.log( "[sync fail][" + result.errorCode + "] " + result.errorText );
	        }
	 });
	}

	
	//Get mediaId 

	function getWebosmediaIdS(func) {
        var mediaIdS = document.querySelector('video').mediaId;
		setTimeout(func(mediaIdS),300);
	}


	//set uri of ext subs and enable subs
	
	function extSubSet(mediaIdS){
	    webOS.service.request("luna://com.webos.media", {
	    method:"setSubtitleEnable",
	    parameters: {
			"enable": true,
			"mediaId": mediaIdS
			},
	      onSuccess: function (result) {
			webOS.service.request("luna://com.webos.media", {
			method:"setSubtitleSource",
			parameters: {
				"uri":"file:///tmp/usb/sda/sda1/sub.srt",
				"preferredEncodings":"ISO-8859-1",
				"mediaId": mediaIdS
			    },
			onSuccess: function (result) {},
			onFailure: function (result) {
				console.log( "[external subtitles fail][" + result.errorCode + "] " + result.errorText );
				Lampa.Noty.show(Lampa.Lang.translate('ext_sub_fail'));
			    }
		    });
			  
	    	console.log("[ext subtitles][Success] "+ JSON.stringify(result));
        	Lampa.Noty.show(Lampa.Lang.translate('ext_sub_enable'));

		},
	      onFailure: function (result) {
	        console.log( "[external subtitles fail][" + result.errorCode + "] " + result.errorText );
			Lampa.Noty.show(Lampa.Lang.translate('ext_sub_fail'));

	        }
	 });
	   
	}