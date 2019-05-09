$(function(){

	var arrayProductos2 = skuCarrusel2;
	//variable de productos
	var APIproducts2 = '/rest/model/falabella/rest/browse/BrowseActor/getProductDetailsJson?{"productId":' + arrayProductos2.join('-') + "}";


	//insertarmos el array de productos.
	var arrayProductos = skuCarrusel1;
	//variable de productos
	var APIproducts = '/rest/model/falabella/rest/browse/BrowseActor/getProductDetailsJson?{"productId":' + arrayProductos.join('-') + "}";

	console.log(APIproducts);
	appProductos = {
		init: function(){
			_this = this;
			
			$.ajax({
			    // URL a la que se enviará la solicitud Ajax
			    url: APIproducts,
			    headers:{
			            'Content-Type': 'application/json',
			            'Authorization': 'Basic c29kcHJvZHVjdEpzb246Y29ycFNvZGltYWM='
			        }
			    // En data puedes utilizar un objeto JSON, un array o un query string
			    //data: {"parametro1" : "valor1", "parametro2" : "valor2"},
			    //Cambiar a type: POST si necesario
			    //type: "GET",
			    // Formato de datos que se espera en la respuesta
			    //dataType: "json",
			   

			})
			 .done(function( data, textStatus, jqXHR ) {

			        if (textStatus === "success" && data.productDetailsJson && data.productDetailsJson.length > 0 ) {
			        	// console.log('ingreso validacion de producto');
			    	    var jsonObj = data.productDetailsJson;
			    	    var jsonObjNew = data.productDetailsJson;

			    	    var newJsonArray = [];
						
			    	    for(var n = 0, len = jsonObjNew.length, newJsonArray = []; n < len; n++) {
			    	    	var pos = skuCarrusel1.indexOf(jsonObjNew[n].productId);
			 				//console.log(jsonObjNew[n].productId);
			    	    	//skuCarrusel1[n]
							newJsonArray.push(Object.assign({
								orden: orderSkuCarrusel1[pos] 
							},jsonObjNew[n]));
			    	    }
			    	    //recorrer y hacer merge para la posicion
			    	    newJsonArray.sort((primero, segundo) => primero.orden - segundo.orden);

			    	    var htmlSlider1 = '<div class="box-2-slider">';

				        for(var i = 0; i < newJsonArray.length; i++){
				            //verificar si el producto existe.
				            if((newJsonArray[i].published === true) && (newJsonArray[i].status === "OK")){
				                // console.log('el producto si existe');

				                //var nameProduct = newJsonArray[i].productId;
				                //console.log(nameProduct);
				                //verificar el stock de los productos
				                var sl = newJsonArray[i].stockLevel;
			                    var stockCounter = "";
			                    var stockLink = "";
			                    var llave2 = '}';
			                    sl = sl.toString().replace(llave2, '');
			                    sl = sl.split("=");


				                var priceLogic = _this.priceLogic(newJsonArray[i]);
				                var iconClass = '';
                        		var pricePrimary = '';
                        		var nameProduct = '';
                        		var nameProductoTitle = '';


				                //validamos los productos con el estok y con el tipo de precio

				                if (sl[1] > 0) {
				                	if(priceLogic == 'EVENTO'){
				                		iconClass = '';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}          
				                		pricePrimary = newJsonArray[i].EVENTO;
				                	}else if(priceLogic == 'COMBO'){
				                		iconClass = 'icon combo-icon';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].NORMAL;
				                	}else if(priceLogic == 'EVENTOCMR'){
				                		iconClass = 'icon cmr-icon';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].CMR;
				                	}else if(priceLogic == 'CMR'){
				                		iconClass = 'icon cmr-icon';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].CMR;
				                	}else if(priceLogic == 'NORMAL'){
				                		iconClass = '';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].NORMAL;
				                	}
				                }

				                //var $slideItem = $('.sku-' + newJsonArray[i].productId);

				                if(nameProduct.length > 32){
				                	nameProduct = _this.recortar(nameProduct);
				                }
				               	

				                htmlSlider1 += '<div class="box-prod sku-'+skuProduct+'">';
				                htmlSlider1 += '<a class="ss-product--link-inner" title="'+nameProductoTitle+'" href="/sodimac-pe/product/'+skuProduct+'/">';
				                htmlSlider1 += '<div class="ss-product--img-wrapper">';
				                htmlSlider1 += '<img class="ss-product-img center-block swiper-lazy swiper-lazy-loaded" src="http://sodimac.scene7.com/is/image/SodimacPeru/'+ skuProduct +'?wid=200&amp;hei=200" alt="'+nameProductoTitle+'">';
				                htmlSlider1 += '<span class="'+iconClass+'"></span>';
				                htmlSlider1 += '</div>';

				                htmlSlider1 += '<div class="ss-product-info">';
				                htmlSlider1 += '<p class="ss-product--description">'+ nameProduct +'</p>';
				                htmlSlider1 += '<p class="ss-product--brand">'+brandProduct+'</p>';
				                htmlSlider1 += '<div class="ss-product--prices">';
				                htmlSlider1 += '<p class="ss-product--price-primary">S/ '+pricePrimary+'<span style="font-size:100%;font-weight:100;"></span></p>';
				                htmlSlider1 += '</div>'
				                htmlSlider1 += '</div>'
				                htmlSlider1 += '<div class="ss-product">Ver producto <i class="fa fa-angle-right" aria-hidden="true"></i></div>'


				                htmlSlider1 += '</a>';
				                htmlSlider1 += '</div>';

				                

				            }else{
				                // console.log('el producto no existe');
				            }
				        }

				        	htmlSlider1 += '<div class="box-prod" data-rating="0" data-id="2461692" data-cid="lnd42745" data-price-primary="899" data-name="Carpa Miscanti Cabina para 10 Personas" data-swiper-slide-index="2">                        <a class="ss-product--link-inner" data-id="2461692" data-name-concat="Carpa-Miscanti-Cabina-para-10-Personas" title="Carpas" href="/sodimac-pe/category/cat30046/Carpas"><div class="ss-product btn-cat">VER M&Aacute;S</div></a></div>';
				        	htmlSlider1 += '</div>';
				        $( "#slider1" ).html(htmlSlider1);
				        _this.slickCarrusel1();


			        console.log( "La solicitud se ha completado correctamente." );
			    	}else{
			    		console.log('no valido productos');
			    	}
			    console.log('ingreso');
			 })
			 .fail(function( jqXHR, textStatus, errorThrown ) {
			     // if ( console && console.log ) {
			     //     console.log( "La solicitud a fallado: " +  textStatus);
			     // }
			     // console.log('existe un error');
			});

		},
		init2: function(){
			_this = this;
			
			$.ajax({
			    // URL a la que se enviará la solicitud Ajax
			    url: APIproducts2,
			    headers:{
			            'Content-Type': 'application/json',
			            'Authorization': 'Basic c29kcHJvZHVjdEpzb246Y29ycFNvZGltYWM='
			        }
			    // En data puedes utilizar un objeto JSON, un array o un query string
			    //data: {"parametro1" : "valor1", "parametro2" : "valor2"},
			    //Cambiar a type: POST si necesario
			    //type: "GET",
			    // Formato de datos que se espera en la respuesta
			    //dataType: "json",
			   

			})
			.done(function( data, textStatus, jqXHR ) {

			        if (textStatus === "success" && data.productDetailsJson && data.productDetailsJson.length > 0 ) {
			        	// console.log('ingreso validacion de producto');
			    	    var jsonObjNew = data.productDetailsJson;

			    	    var newJsonArray = [];
						console.log('aqui muestra');
						console.log(orderSkuCarrusel2);
			    	    for(var n = 0, len = jsonObjNew.length, newJsonArray = []; n < len; n++) {
			    	    	var pos = skuCarrusel2.indexOf(jsonObjNew[n].productId);
			 				console.log(jsonObjNew[n].productId);
			    	    	//skuCarrusel1[n]
							newJsonArray.push(Object.assign({
								orden: orderSkuCarrusel2[pos] 
							},jsonObjNew[n]));
			    	    }
			    	    //recorrer y hacer merge para la posicion
			    	    newJsonArray.sort((primero, segundo) => primero.orden - segundo.orden);

			    	    console.log(newJsonArray);
			    	    var htmlSlider2 = '<div class="box-3-slider">';

				        for(var i = 0; i < newJsonArray.length; i++){
				            //verificar si el producto existe.
				            if((newJsonArray[i].published === true) && (newJsonArray[i].status === "OK")){
				                // console.log('el producto si existe');

				                console.log('segundo carrusel');
				                var nameProduct = newJsonArray[i].productId;
				                console.log(nameProduct);
				                //verificar el stock de los productos
				                var sl = newJsonArray[i].stockLevel;
			                    var stockCounter = "";
			                    var stockLink = "";
			                    var llave2 = '}';
			                    sl = sl.toString().replace(llave2, '');
			                    sl = sl.split("=");

				                var priceLogic = _this.priceLogic(newJsonArray[i]);
				                var iconClass = '';
                        		var pricePrimary = '';
                        		var nameProduct = '';
                        		var nameProductoTitle = '';

				                //validamos los productos con el estok y con el tipo de precio

				                if (sl[1] > 0) {
				                	if(priceLogic == 'EVENTO'){
				                		iconClass = '';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}          
				                		pricePrimary = newJsonArray[i].EVENTO;
				                	}else if(priceLogic == 'COMBO'){
				                		iconClass = 'icon combo-icon';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].NORMAL;
				                	}else if(priceLogic == 'EVENTOCMR'){
				                		iconClass = 'icon cmr-icon';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].CMR;
				                	}else if(priceLogic == 'CMR'){
				                		iconClass = 'icon cmr-icon';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].CMR;
				                	}else if(priceLogic == 'NORMAL'){
				                		iconClass = '';
				                		pricePrimary = '';
				                		nameProduct = newJsonArray[i].name;
				                		nameProductoTitle = newJsonArray[i].name;
				                		skuProduct = newJsonArray[i].productId;
				                		brandProduct = newJsonArray[i].brand;
				                		if (brandProduct == undefined) {
				                			brandProduct = '';
				                		}
				                		pricePrimary = newJsonArray[i].NORMAL;
				                	}
				                }


				                if(nameProduct.length > 32){
				                	nameProduct = _this.recortar(nameProduct);
				                }
				               	

				                htmlSlider2 += '<div class="box-prod">';
				                htmlSlider2 += '<a class="ss-product--link-inner" title="'+nameProductoTitle+'" href="/sodimac-pe/product/'+skuProduct+'/">';
				                htmlSlider2 += '<div class="ss-product--img-wrapper">';
				                htmlSlider2 += '<img class="ss-product-img center-block swiper-lazy swiper-lazy-loaded" src="http://sodimac.scene7.com/is/image/SodimacPeru/'+ skuProduct +'?wid=200&amp;hei=200" alt="'+nameProductoTitle+'">';
				                htmlSlider2 += '<span class="'+iconClass+'"></span>';
				                htmlSlider2 += '</div>'

				                htmlSlider2 += '<div class="ss-product-info">';
				                htmlSlider2 += '<p class="ss-product--description">'+ nameProduct +'</p>';
				                htmlSlider2 += '<p class="ss-product--brand">'+brandProduct+'</p>';
				                htmlSlider2 += '<div class="ss-product--prices">';
				                htmlSlider2 += '<p class="ss-product--price-primary">S/ '+pricePrimary+'<span style="font-size:100%;font-weight:100;"></span></p>';
				                htmlSlider2 += '</div>'
				                htmlSlider2 += '</div>'
				                htmlSlider2 += '<div class="ss-product">Ver producto <i class="fa fa-angle-right" aria-hidden="true"></i></div>'


				                htmlSlider2 += '</a>';
				                htmlSlider2 += '</div>';

				                

				            }else{
				                // console.log('el producto no existe');
				            }
				        }

				        	htmlSlider2 += '</div>';
				        $( "#carrusel2" ).html(htmlSlider2);
				        _this.slickCarrusel2();


			        // console.log( "La solicitud se ha completado correctamente." );
			    	}else{
			    		console.log('no valido productos');
			    	}
			    // console.log('ingreso');
			 })
			 .fail(function( jqXHR, textStatus, errorThrown ) {
			     // if ( console && console.log ) {
			     //     console.log( "La solicitud a fallado: " +  textStatus);
			     // }
			     console.log('existe un error');
			});
		},
		conection: function(){
			var APIproducts = '/rest/model/falabella/rest/browse/BrowseActor/getProductDetailsJson?{"productId":' + arrayProductos.join('-') + "}";
		},
		recortar: function (nameProduct){
		   var logitud = 32;
		   var dato = nameProduct;
		   var datoAMostrar = "";

		   if (logitud < dato.length) {
			   for(var i = 0; i < logitud && i < dato.length; i++)
			       datoAMostrar = datoAMostrar + dato[i];

			   datoAMostrar = datoAMostrar + "...";
			   return datoAMostrar;
		   }

		},
		priceLogic:function(objeto){

			//precio evento
			if(objeto.EVENTFrom !== undefined && objeto.EVENTOValidity !== undefined){
				//console.log('evento');
				return "EVENTO";
			}
	        // Es Combo y no es cmr
	        if (objeto.combo === true &&  objeto.CMR === undefined) {
	            //console.log('combo');
	            return 'COMBO';
	        }
	        // precio cmr
			if(objeto.CMRFrom !== undefined && objeto.CMRValidity !== undefined){
				//console.log('eventocmr');
				return 'EVENTOCMR';
			}
	         // Es CMR y no es COMBO
	        if (objeto.CMR !== undefined && objeto.combo === false) {
	        	//console.log('cmr')
	            return 'CMR';
	        }
	       	// No es CMR y No es COMBO
	        if ( objeto.CMR === undefined && objeto.combo === false) {
	            //console.log('normal');
	            return 'NORMAL';
	        }

			//return precio;
		},
		slickCarrusel1 : function(){
			$('.box-2-slider').slick({
                infinite: false,
                speed: 300,
                dots: true,
                slidesToShow: 3,
                infinite: true,
                slidesToScroll: 3,
                prevArrow: "<img class='a-left control-c prev slick-prev' src='https://www.sodimac.com.pe/static/categorias/landings/espacios-de-la-casa/dormitorio/dist/images/izquierda.png'>",
                nextArrow: "<img class='a-right control-c next slick-next' src='https://www.sodimac.com.pe/static/categorias/landings/espacios-de-la-casa/dormitorio/dist/images/derecha.png'>",
                responsive: [{
                        breakpoint: 1100,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 3,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ]
            });
		},
		slickCarrusel2 : function(){
			$('.box-3-slider').slick({
                infinite: false,
                speed: 300,
                dots: true,
                slidesToShow: 5,
                infinite: true,
                slidesToScroll: 5,
                prevArrow: "<img class='a-left control-c prev slick-prev' src='https://www.sodimac.com.pe/static/categorias/landings/espacios-de-la-casa/dormitorio/dist/images/izquierda.png'>",
                nextArrow: "<img class='a-right control-c next slick-next' src='https://www.sodimac.com.pe/static/categorias/landings/espacios-de-la-casa/dormitorio/dist/images/derecha.png'>",
                responsive: [{
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ]
            });
		}
	}
	appProductos.init();
	appProductos.init2();
});

//jalar data de drive
var spreadsheetID = "1fjl7usEoTcKxONTky0s0YwMn-7hgTV-KFy-TCw-1p50";
// Make sure it is public or set to Anyone with link can view 
var bxCarrusel1 = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/01/public/values?alt=json";
//var bxCarrusel1 = 'https://www.sodimac.com.pe/static/categorias/contenidoEstatico/landings/landing-camping/build/js/prueba.json';
var bxCarrusel2 = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/02/public/values?alt=json";
//var bxCarrusel2 = 'https://www.sodimac.com.pe/static/categorias/contenidoEstatico/landings/landing-camping/build/js/prueba.json';

var skuCarrusel1 = [];
var orderSkuCarrusel1 = [];
$.getJSON(bxCarrusel1, function(data){
	var bxCarrusel1 = data.feed.entry;
	$(bxCarrusel1).each(function(){

		//allowedCategory.push(this.gsx$categorias.$t);

		skuCarrusel1.push(this.gsx$sku.$t);
		orderSkuCarrusel1.push(this.gsx$orden.$t);
		//categoria ElecroHogar
	})
	// console.log('CESARIN');
	// console.log(skuCarrusel1);
})

//segundo carrusel
var skuCarrusel2 = [];
var orderSkuCarrusel2 = [];
$.getJSON(bxCarrusel2, function(data){
	var bxCarrusel2 = data.feed.entry;
	$(bxCarrusel2).each(function(){

		//allowedCategory.push(this.gsx$categorias.$t);

		skuCarrusel2.push(this.gsx$sku.$t);
		orderSkuCarrusel2.push(this.gsx$orden.$t);
		//categoria ElecroHogar
	})

	console.log('lista drive');
	console.log(orderSkuCarrusel2);

})