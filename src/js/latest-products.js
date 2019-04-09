import Swiper from 'swiper'

Object.defineProperty(Array.prototype, "chunk", {
   value: function(chunkSize) {
       var array = this;
       return [].concat.apply([], array.map(function(elem, i) {
           return i % chunkSize ? [] : [array.slice(i, i + chunkSize)]
       }))
   },
   configurable: true
})

const swiperFeedProducts = new Swiper(".js-swiper-feedproducts", {
   slidesPerView: 4,
   spaceBetween: 20,
   pagination: {
      el: ".swiper-feedproducts-pagination",
      clickable: true
   },
   navigation: {
      prevEl: ".swiper-feedproducts-button-prev",
      nextEl: ".swiper-feedproducts-button-next"
   },
   preventClicks: false,
   preventClicksPropagation: false,
   observer: true,
   onlyExternal: window.innerWidth > 800,
   breakpoints: {
      1024: {
         slidesPerView: 3
      },
      768: {
         slidesPerView: 2
      },
      470: {
         slidesPerView: "auto",
         centeredSlides: true,
         spaceBetween: 10
      }
   }
});

function DriveObjectManager() {
   this.jsonURL = "https://spreadsheets.google.com/feeds/list/14xCT1ciWsckYrrU-ow7rM4sp-gHmJEYmIIPw-P3lvBA/04/public/values?alt=json";
   this.productCodes = [];
   this.objects = {};

   function validObjectCellValue(objValue) {
      if (typeof objValue !== "undefined" && objValue !== null) {
         return typeof objValue.$t !== "undefined" && objValue.$t !== null && objValue.$t !== ""
      }
      return false
   }
   this.objectsLoaded = function () {
      const _self = this;
      return requestJSON.call(_self).then(objects => {
         if (typeof objects !== "undefined" && objects !== null) {
            const arrayCodes = [];
            for (let o = 0; o < objects.length; o++) {
               if (validObjectCellValue(objects[o].gsx$sku)) {
                  arrayCodes.push(objects[o].gsx$sku.$t);
                  storeObject.call(_self, objects[o].gsx$sku.$t, objects[o])
               }
            }
            setProductCodes.call(_self, arrayCodes)
         }
      });
   };
   this.getProductCodes = function () {
      return this.productCodes
   };
   this.getObjects = function () {
      return this.objects
   };

   function storeObject(index, object) {
      if (typeof index !== "undefined" && typeof object !== "undefined") {
         this.objects[index] = {
            estado: validObjectCellValue(object.gsx$estado) && object.gsx$estado.$t == 1 ? 1 : 0,
            nombre: validObjectCellValue(object.gsx$nombre) ? object.gsx$nombre.$t : null,
            nro: validObjectCellValue(object.gsx$nro) ? parseInt(object.gsx$nro.$t) : null,
            precioAhorro: validObjectCellValue(object.gsx$precioahorro) ? object.gsx$precioahorro.$t : null,
            precioPrimario: validObjectCellValue(object.gsx$precioprimario) ? object.gsx$precioprimario.$t : null,
            precioSecundario: validObjectCellValue(object.gsx$preciosecundario) ? object.gsx$preciosecundario.$t : null,
            promo: validObjectCellValue(object.gsx$promo) ? object.gsx$promo.$t : null,
            sku: validObjectCellValue(object.gsx$sku) ? object.gsx$sku.$t : null,
            stock: validObjectCellValue(object.gsx$stock) ? parseInt(object.gsx$stock.$t) : null,
            vendidos: validObjectCellValue(object.gsx$vendidos) ? parseInt(object.gsx$vendidos.$t) : null
         };
         this.objects[index].percentageSold = this.objects[index].vendidos * 100 / this.objects[index].stock
      }
   }

   function setProductCodes(arrayCodes) {
      if (typeof arrayCodes !== "undefined" && arrayCodes.length > 0) {
         const limit = 8;
         const chunked = arrayCodes.chunk(limit);
         for (let c = 0; c < chunked.length; c++) {
            this.productCodes.push(chunked[c].join("-"))
         }
      }
   }

   function requestJSON() {
      const _self = this;
      return new Promise(resolve => {
         $.getJSON(_self.jsonURL, ({feed}) => {
            resolve(feed.entry)
         })
      });
   }
}

function RestClientManager(options) {
   this.options = options;
   this.endpoint = "https://www.sodimac.com.pe/rest/model/falabella/rest/browse/BrowseActor/getProductDetailsJson";
   this.fakeResponse = {"QPOmniture":[],"productDetailsJson":[{"status":"OK","productId":"prod2720001","name":"Sofá cama Versalles","brand":"Home Collection","combo":false,"published":true,"webCategoryName":"Sofás Cama","webCategory":"cat10530","PriceFormat":"C/U   ","savings":50.0,"COMPANY":349.9,"INTERNET":349.9,"CMR":299.9,"NORMAL":349.9,"CMRFrom":"2019-04-06T21:00:00GMT-05:00","CMRValidity":"2019-04-30T23:59:59GMT-05:00","stockLevel":"{prod2720001\u003d624}","pickupInStore":"{prod2720001\u003dtrue}","skuColorMap":{"2460912":"CB1B26","2641461":"214880","2680920":"B1B06F","1853503":"4F3129"},"bvRating":4.5,"bvReview":4},{"status":"OK","productId":"2698277","name":"Parrilla a Gas 5 quemadores","brand":"Charbroil","combo":false,"published":true,"webCategoryName":"Camping y Parrillas","webCategory":"cat3759003","backEndCategoryName":"PARRILLA/ASADOR A GAS","backEndCategory":"0522050102","PriceFormat":"C/U   ","savings":1300.0,"COMPANY":4199.9,"INTERNET":4199.9,"NORMAL":4199.9,"EVENTO":2899.9,"EVENTFrom":"2019-04-06T21:59:59GMT-05:00","EVENTOValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2698277\u003d9}","pickupInStore":"{2698277\u003dtrue}","bvRating":0.0,"bvReview":0,"ImagePathOrClassName":"/static/site/common/EventPricePpExclusivoOnline-2x.png"},{"status":"OK","productId":"prod4710004","name":"Juego de living Saygón","brand":"Home Collection","combo":false,"published":true,"webCategoryName":"Imbatibles","webCategory":"cat3329006","PriceFormat":"C/U   ","savings":400.0,"COMPANY":1899.9,"INTERNET":1899.9,"CMR":1499.9,"NORMAL":1899.9,"CMRFrom":"2019-02-01T00:00:00GMT-05:00","CMRValidity":"2019-04-30T23:59:59GMT-05:00","stockLevel":"{prod4710004\u003d62}","pickupInStore":"{prod4710004\u003dtrue}","skuColorMap":{"2350734":"FEF1DF","2546949":"6B735C","1690116":"54362D"},"bvRating":0.0,"bvReview":0},{"status":"OK","productId":"2662981","name":"Centro de entretenimiento Mondrian - 55\u0027\u0027","brand":"Caemmun","combo":false,"published":true,"webCategoryName":"Muebles y Organización","webCategory":"cat3179005","backEndCategoryName":"CENTRO ENTRETENIMIENTO MADERA","backEndCategory":"0417020401","PriceFormat":"C/U   ","savings":150.0,"COMPANY":399.9,"INTERNET":399.9,"NORMAL":399.9,"EVENTO":249.9,"EVENTFrom":"2019-04-06T22:00:00GMT-05:00","EVENTOValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2662981\u003d65}","pickupInStore":"{2662981\u003dtrue}","skuColorMap":{"2662981":"C8BCAE"},"bvRating":0.0,"bvReview":0,"ImagePathOrClassName":"/static/site/common/EventPricePpExclusivoOnline-2x.png"},{"status":"OK","productId":"2350734","name":"Juego de Living Saygón 6 personas Beige","brand":"Home Collection","combo":false,"published":true,"webCategoryName":"Promoción Six Pack","webCategory":"cat4279003","backEndCategoryName":"JUEGOS DE COMEDOR RATAN PE","backEndCategory":"0522060401","PriceFormat":"C/U   ","savings":400.0,"COMPANY":1899.9,"INTERNET":1899.9,"CMR":1499.9,"NORMAL":1899.9,"CMRFrom":"2019-02-01T00:00:00GMT-05:00","CMRValidity":"2019-04-30T23:59:59GMT-05:00","stockLevel":"{2350734\u003d62}","pickupInStore":"{2350734\u003dtrue}","skuColorMap":{"2350734":"FEF1DF"},"bvRating":0.0,"bvReview":0},{"status":"OK","productId":"1853503","name":"(Precio Regular S/.349.9) Sofá Cama Versalles Chocolate","brand":"Home Collection","combo":false,"published":true,"webCategoryName":"Muebles y Organización","webCategory":"cat4479005","backEndCategoryName":"FUTONES","backEndCategory":"0417020201","PriceFormat":"C/U   ","savings":50.0,"COMPANY":349.9,"INTERNET":349.9,"CMR":299.9,"NORMAL":349.9,"CMRFrom":"2019-04-06T21:00:00GMT-05:00","CMRValidity":"2019-04-30T23:59:59GMT-05:00","stockLevel":"{1853503\u003d624}","pickupInStore":"{1853503\u003dtrue}","skuColorMap":{"1853503":"4F3129"},"bvRating":4.5,"bvReview":5},{"status":"OK","productId":"2544164","name":"Máquina abdominal MTDP-6206","brand":"Do it Sports","combo":false,"published":true,"webCategoryName":"Papá Aventurero","webCategory":"cat579056","backEndCategoryName":"MAQUINAS DE EJERCICIOS","backEndCategory":"0522070202","PriceFormat":"C/U   ","savings":40.0,"COMPANY":139.9,"INTERNET":139.9,"NORMAL":139.9,"EVENTO":99.9,"EVENTFrom":"2019-04-06T21:59:59GMT-05:00","EVENTOValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2544164\u003d13}","pickupInStore":"{2544164\u003dtrue}","bvRating":4.0,"bvReview":1,"ImagePathOrClassName":"/static/site/common/EventPricePpExclusivoOnline-2x.png"},{"status":"OK","productId":"2579391","name":"Ropero 8 puertas 4 cajones y espejo Porto","brand":"Moval","combo":false,"published":true,"webCategoryName":"Promoción Six Pack","webCategory":"cat4279003","backEndCategoryName":"CLOSETS /ROPEROS MADERA","backEndCategory":"0417040601","PriceFormat":"C/U   ","savings":250.0,"COMPANY":899.9,"INTERNET":899.9,"NORMAL":899.9,"EVENTO":649.9,"EVENTFrom":"2019-04-06T22:00:00GMT-05:00","EVENTOValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2579391\u003d24}","pickupInStore":"{2579391\u003dtrue}","bvRating":5.0,"bvReview":1,"ImagePathOrClassName":"/static/site/common/EventPricePpExclusivoOnline-2x.png"},{"status":"OK","productId":"264889X","name":"Aire acondicionado Split 24000 BTU","brand":"Samsung","combo":false,"published":true,"webCategoryName":"Climatización","webCategory":"cat4199002","backEndCategoryName":"AIRES ACONDICIONADOS SPLIT INVERTER","backEndCategory":"0316040305","PriceFormat":"C/U   ","savings":0.0,"COMPANY":2273.0,"INTERNET":2273.0,"NORMAL":2273.0,"stockLevel":"{264889X\u003d1}","pickupInStore":"{264889X\u003dtrue}","bvRating":0.0,"bvReview":0},{"status":"Not OK","productId":"2350513"}]};
   this.init = function () {
      const _self = this;
      if (typeof this.options.codes !== "undefined") {
         if (typeof this.options.codes === "string") {
            sendRequest.call(this, this.options.codes).then(products => {
               if (typeof products !== "undefined" && products.length > 0) {
                  for (let p = 0; p < products.length; p++) {
                     if (products[p].status === "OK" && products[p].published) {
                        const renderData = getRenderData.call(_self, products[p]);
                        if (renderData) {
                           new SlideBuilder({
                              index: p + 1,
                              renderData,
                              swiperInstance: swiperFeedProducts
                           }).buildSlide()
                        }
                     }
                  }
               }
            })
         } else {
            const codesArr = this.options.codes;
            for (let c = 0; c < codesArr.length; c++) {
               sendRequest.call(this, codesArr[c]).then(products => {
                  if (typeof products !== "undefined" && products.length > 0) {
                     for (let p = 0; p < products.length; p++) {
                        if (products[p].status === "OK" && products[p].published) {
                           const renderData = getRenderData.call(_self, products[p]);
                           if (renderData) {
                              new SlideBuilder({
                                 index: p + 1,
                                 renderData,
                                 swiperInstance: swiperFeedProducts
                              }).buildSlide()
                           }
                        }
                     }
                  }
               })
            }
         }
      }
   };

   function getRenderData(productData) {
      const driveObject = this.options.driveObjects[productData.productId];
      if (typeof driveObject !== "undefined" && driveObject.estado === 1) {
         const isCMR = driveObject.promo == "imbatible" ? true : productData.CMR;
         const isCombo = driveObject.promo == "combo" ? true : productData.combo;

         const Prices = {
            primary: (() => {
               if (driveObject.precioPrimario) {
                  return driveObject.precioPrimario
               } else {
                  return productData.CMR ? productData.CMR : productData.INTERNET
               }
            })(),
            secondary: (() => {
               if (driveObject.precioSecundario) {
                  return driveObject.precioSecundario == 0 || driveObject.precioSecundario == "null" ? null : driveObject.precioSecundario
               } else {
                  return productData.CMR ? productData.INTERNET : productData.NORMAL
               }
            })(),
            savings: (() => {
               if (driveObject.precioAhorro) {
                  return driveObject.precioAhorro == 0 || driveObject.precioAhorro == "null" ? null : driveObject.precioAhorro
               } else {
                  return productData.savings !== 0 ? productData.savings : null
               }
            })()
         };

         return {
            code: productData.productId,
            imgSrc: `https://sodimac.scene7.com/is/image/SodimacPeru/${productData.productId}?$lista175$&qlt=100`,
            name: driveObject.nombre ? driveObject.nombre : productData.name,
            prices: {
               primary: Prices.primary,
               secondary: Prices.secondary,
               savings: Prices.savings
            },
            url: `/sodimac-pe/product/${productData.productId}/`,
            label: isCombo ? "Normal" : "Antes",
            isCMR: typeof isCMR !== "undefined" ? isCMR : false,
            showSavings: Prices.savings ? true : false,
            isCombo,
            percentageSold: Math.round(driveObject.percentageSold),
            brand: isCombo ? false : productData.brand
         };
      }
      return null
   }

   function sendRequest(codes) {
      if (typeof codes === "undefined") return;
      const _self = this;
      return new Promise(resolve => {
         if (window.location.host === "www.sodimac.com.pe") {
            $.ajax({
               type: "GET",
               dataType: "json",
               url: `${_self.endpoint}?{"productId":"${codes}"}`,
               headers: {
                  "Content-Type": "application/json",
                  Authorization: "Basic c29kcHJvZHVjdEpzb246Y29ycFNvZGltYWM="
               }
            }).done((res, textStatus) => {
               if (textStatus === "success" && res) {
                  resolve(res.productDetailsJson)
               }
            }).always((res, textStatus) => { })
         } else {
            resolve(_self.fakeResponse.productDetailsJson)
         }
      });
   }
}

function SlideBuilder(options) {
   this.options = options;
   this.getClassCMR = function () {
      return this.options.renderData.isCMR ? "color-brand-red" : ""
   };
   this.getClassIsHidden = value => {
      if (typeof value !== "undefined") {
         return value === null ? "hidden" : ""
      }
      return "hidden"
   };
   this.buildSlide = function () {
      let slideHTML = `<div class="swiper-slide"><div class="feed-product-item"><a class="no-decoration" title="${this.options.renderData.name}" href="${this.options.renderData.url}"><div class="feed-product-img-wrapper text-center"><img width="175" height="175" src="${this.options.renderData.imgSrc}" /></div><div class="feed-product-info">`;
      if (this.options.renderData.brand) {
         slideHTML += `<h6 class="mb-5 text-uppercase">${this.options.renderData.brand}</h6>`
      }
      slideHTML += `<h4 class="feed-product-name mt-5">${this.options.renderData.name}</h4><div class="feed-product-prices">`;
      if (this.options.renderData.isCMR) {
         slideHTML += '<span class="tag-promo tag-promo-cmr"></span>'
      } else {
         if (this.options.renderData.isCombo) {
            slideHTML += '<span class="tag-promo tag-promo-cmr"></span>'
         }
      }
      slideHTML += `<h4 class="feed-product-price-primary ${this.getClassCMR()} bold">S/ ${this.options.renderData.prices.primary}</h4>`;
      if (this.options.renderData.showSavings) {
         slideHTML += `<h6 class="feed-product-price-savings mb-5 ${this.getClassIsHidden(this.options.renderData.prices.savings)}">Ahorro: S/ ${this.options.renderData.prices.savings}</h6>`
      }
      slideHTML += `<h6 class="feed-product-price-secondary mt-5 mb-20 ${this.getClassIsHidden(this.options.renderData.prices.secondary)}">${this.options.renderData.label}: S/ ${this.options.renderData.prices.secondary}</h6></div><div class="pt-10"><div class="feed-product-progress"><span style="width:${this.options.renderData.percentageSold}%;"></span></div><span class="block bold text-uppercase mt-5">vendido al ${this.options.renderData.percentageSold}%</span></div></div></a></div></div>`;
      this.options.swiperInstance.appendSlide(slideHTML);
      this.options.swiperInstance.update()
   }
}
const driveObjectManager = new DriveObjectManager;
driveObjectManager.objectsLoaded().then(() => {
   const restClientManager = new RestClientManager({
      codes: driveObjectManager.getProductCodes(),
      driveObjects: driveObjectManager.getObjects()
   });
   restClientManager.init()
})