
var array = {
	"0": {
		"check": true,
		"OBJECT_ID": {
			"check": false,
			"name": "OBJECT_ID",
		},
		"nameTable": "TEST1",
		"EVENT_NAME_MANAGE": {
			"check": false,
			"name": "EVENT_NAME_MANAGE",
		}
	},

	"uno": {
		"check": false,
		"OBJECT_ID": {
			"check": false,
			"name": "OBJECT_ID",
		},

		"nameTable": "TEST1",
		"EVENT_NAME_MANAGE": {
			"check": false,
			"name": "EVENT_NAME_MANAGE",
		}
	}
}
console.log("check", array[0])









$(function () {

	//variable de productos
	var APIproducts1 = '/rest/model/falabella/rest/browse/BrowseActor/getProductDetailsJson?{"productId":' + skuCarrusel1.join('-') + "}";

	var appProductos;

	appProductos = {
		init: function () {
			var _this = this;

			$.ajax({
				// URL a la que se enviará la solicitud Ajax
				url: APIproducts1,
				headers: {
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
				.done(function (data, textStatus, jqXHR) {

				});
		}
	}

	appProductos.init();
});




//jalar data de drive
var spreadsheetID = "1iRZUOrOVHZqMRWCwBdMs7F0n7KFgz1A-tP429WKhRbM";
// Make sure it is public or set to Anyone with link can view 
var bxCategoria1 = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/01/public/values?alt=json";


function Datos(sku, descripcion, precio_promo, precio_lista, imbatible, combo, activo, cid) {

	this.sku = sku,
		this.descripcion = descripcion,
		this.precio_promo = precio_promo,
		this.precio_lista = precio_lista,
		this.imbatible = imbatible,
		this.combo = combo,
		this.activo = activo,
		this.cid = cid
};

var skuCarrusel1 = [];
var orderSkuCarrusel1 = [];

$.getJSON(bxCategoria1, function (data) {
	var bxCategoria1 = data.feed.entry;

	console.log("bxCategoria1", this[0].gsx$combo.$t)

	$(bxCategoria1).each(function () {

		var sku1 = this.gsx$sku;
		var descripcion1 = this.gsx$descripcion;
		var precio_promo1 = this.gsx$preciopromo;
		var precio_lista1 = this.gsx$preciolista;
		var imbatible1 = this.gsx$imbatible;
		var combo1 = this.gsx$combo;
		var activo1 = this.gsx$activo;
		var cid1 = this.gsx$cid;

		//allowedCategory.push(this.gsx$categorias.$t);  
		var datos1 = new Datos(sku1, descripcion1, precio_promo1, precio_lista1, imbatible1, combo1, activo1, cid1)

		skuCarrusel1.push(datos1);
		console.log("datos1", skuCarrusel1)

		orderSkuCarrusel1.push(this.gsx$orden.$t);


	})



	skuCarrusel1.Datos.activo;
	console.log(skuCarrusel1.Datos[0].activo, "holi");
});

