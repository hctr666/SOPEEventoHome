$(function(){

//variable de productos
var APIproducts1 = '/rest/model/falabella/rest/browse/BrowseActor/getProductDetailsJson?{"productId":' + skuCarrusel1.join('-') + "}";

var appProductos;

    appProductos = {
        init: function(){
           var  _this = this;

            $.ajax({
			    // URL a la que se enviará la solicitud Ajax
			    url: APIproducts1,
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

            });
        },
        prueba: function(){

        }
    }

    appProductos.init();
});




//jalar data de drive
var spreadsheetID = "1fjl7usEoTcKxONTky0s0YwMn-7hgTV-KFy-TCw-1p50";
// Make sure it is public or set to Anyone with link can view 
var bxCategoria1 = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/01/public/values?alt=json";

var skuCarrusel1=[];
var orderSkuCarrusel1 = [];
$.getJSON(bxCategoria1, function(data){
    var bxCategoria1 = data.feed.entry;
    console.log(bxCategoria1);
	$(bxCategoria1).each(function(){

		//allowedCategory.push(this.gsx$categorias.$t);
        
		skuCarrusel1.push(this.gsx$sku.$t);
		orderSkuCarrusel1.push(this.gsx$orden.$t);
		//categoria ElecroHogar
	})
	console.log(skuCarrusel1);
    console.log(orderSkuCarrusel1);
});

