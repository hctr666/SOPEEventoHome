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
   spaceBetween: 5,
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

const swiperNightProducts = new Swiper(".js-swiper-nightproducts", {
   slidesPerView: 5,
   spaceBetween: 5,
   pagination: {
      el: ".swiper-nightproducts-pagination",
      clickable: true
   },
   navigation: {
      prevEl: ".swiper-nightproducts-button-prev",
      nextEl: ".swiper-nightproducts-button-next"
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

function DriveObjectManager(options) {
   this.jsonURL = options.sheetJson;
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
            vendidos: validObjectCellValue(object.gsx$vendidos) ? parseInt(object.gsx$vendidos.$t) : null,
            trackId: validObjectCellValue(object.gsx$cid) ? object.gsx$cid.$t : null
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
   this.fakeResponse = {"QPOmniture":[],"productDetailsJson":[{"status":"OK","productId":"2078155","name":"Centro de Juegos Inflable 11 en 1","brand":"Happy Hop","combo":false,"published":true,"webCategoryName":"Juegos Inflables","webCategory":"cat10648","backEndCategoryName":"CENTRO DE JUEGOS Y CASAS DE M","backEndCategory":"0522040104","PriceFormat":"C/U   ","savings":800.9,"COMPANY":2499.9,"INTERNET":2499.9,"NORMAL":2499.9,"EVENTO":1699.0,"EVENTFrom":"2019-04-06T21:59:59GMT-05:00","EVENTOValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2078155\u003d3}","pickupInStore":"{2078155\u003dtrue}","bvRating":0.0,"bvReview":0,"ImagePathOrClassName":"/static/site/common/EventPricePpExclusivoOnline-2x.png"},{"status":"OK","productId":"2635275","name":"Refrigeradora básica 187 LT NT GT22BPPD","brand":"LG","combo":false,"published":true,"webCategoryName":"Refrigeradoras","webCategory":"cat10670","backEndCategoryName":"REFRIGERACION NO FROST","backEndCategory":"0316010404","PriceFormat":"C/U   ","savings":250.0,"COMPANY":1049.0,"INTERNET":1049.0,"CMR":799.0,"NORMAL":1049.0,"CMRFrom":"2019-04-06T21:00:00GMT-05:00","CMRValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2635275\u003d14}","pickupInStore":"{2635275\u003dtrue}","bvRating":0.0,"bvReview":0},{"status":"OK","productId":"3443418","name":"Impresora Multifuncional L575 Ecotank","brand":"Epson","combo":false,"published":true,"webCategoryName":"Impresoras y complementos","webCategory":"cat689043","backEndCategoryName":"IMPRESORAS","backEndCategory":"0211010313","PriceFormat":"C/U   ","savings":200.0,"COMPANY":999.0,"INTERNET":999.0,"NORMAL":999.0,"EVENTO":799.0,"EVENTFrom":"2019-04-06T22:00:00GMT-05:00","EVENTOValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{3443418\u003d36}","pickupInStore":"{3443418\u003dtrue}","bvRating":0.0,"bvReview":0,"ImagePathOrClassName":"/static/site/common/EventPricePpExclusivoOnline-2x.png"},{"status":"OK","productId":"2382296","name":"Refrigeradora 361L RT35K5930SL ","brand":"Samsung","combo":false,"published":true,"webCategoryName":"EspecialTCP","webCategory":"cat1809002","backEndCategoryName":"REFRIGERACION NO FROST","backEndCategory":"0316010404","PriceFormat":"C/U   ","savings":400.0,"COMPANY":1899.0,"INTERNET":1899.0,"CMR":1499.0,"NORMAL":1899.0,"CMRFrom":"2019-04-06T21:00:00GMT-05:00","CMRValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{2382296\u003d27}","pickupInStore":"{2382296\u003dtrue}","bvRating":5.0,"bvReview":2},{"status":"OK","productId":"344340X","name":"Impresora Multifuncional L4160 Ecotank","brand":"Epson","combo":false,"published":true,"webCategoryName":"Impresoras y complementos","webCategory":"cat689043","backEndCategoryName":"IMPRESORAS","backEndCategory":"0211010313","PriceFormat":"C/U   ","savings":150.0,"COMPANY":849.0,"INTERNET":849.0,"CMR":699.0,"NORMAL":849.0,"CMRFrom":"2019-04-06T21:00:00GMT-05:00","CMRValidity":"2019-04-11T23:59:59GMT-05:00","stockLevel":"{344340X\u003d44}","pickupInStore":"{344340X\u003dtrue}","bvRating":0.0,"bvReview":0}]};
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
                              swiperInstance: this.options.swiperInstance,
                              showSalePercentage: this.options.showSalePercentage
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
                                 showSalePercentage: this.options.showSalePercentage,
                                 swiperInstance: this.options.swiperInstance
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
            url: `/sodimac-pe/product/${productData.productId}/?cid=${driveObject.trackId}`,
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
      let slideHTML = `<div class="swiper-slide"><div class="feed-product-item"><a class="no-decoration color-dark" title="${this.options.renderData.name}" href="${this.options.renderData.url}"><div class="feed-product-img-wrapper mb-5 text-center"><img width="175" height="175" src="${this.options.renderData.imgSrc}" /></div><div class="feed-product-info">`;
      slideHTML += `<h6 class="mb-5 text-uppercase feed-product-brand">${this.options.renderData.brand ? this.options.renderData.brand : ''}</h6>`
      slideHTML += `<h4 class="feed-product-name mt-5">${this.options.renderData.name}</h4><div class="feed-product-prices posr">`;
      
      if (this.options.renderData.isCMR) {
         slideHTML += '<span class="c-icon c-icon-2x c-icon-cmr"></span>'
      } else {
         if (this.options.renderData.isCombo) {
            slideHTML += '<span class="c-icon c-icon-2x c-icon-combo"></span>'
         }
      }
      slideHTML += `<h4 class="feed-product-price-primary ${this.getClassCMR()} bold">S/ ${this.options.renderData.prices.primary}</h4>`;
      if (this.options.renderData.showSavings) {
         slideHTML += `<h6 class="feed-product-price-savings mb-5 ${this.getClassIsHidden(this.options.renderData.prices.savings)}">Ahorro: S/ ${this.options.renderData.prices.savings}</h6>`
      }
      slideHTML += `<h6 class="feed-product-price-secondary mt-5 mb-20 ${this.getClassIsHidden(this.options.renderData.prices.secondary)}">${this.options.renderData.label}: S/ ${this.options.renderData.prices.secondary}</h6></div><div class="pt-10 feed-product-sale-percentage ${this.options.showSalePercentage ? '' : 'hidden'}"><div class="feed-product-progress"><span style="width:${this.options.renderData.percentageSold}%;"></span></div><span class="block bold text-uppercase mt-5 color-brand-event-primary">vendido al ${this.options.renderData.percentageSold}%</span></div></div></a></div></div>`;
      this.options.swiperInstance.appendSlide(slideHTML);
      this.options.swiperInstance.update()
   }
}
const driveObjectManager = new DriveObjectManager({
   sheetJson: 'https://spreadsheets.google.com/feeds/list/1isxgoYmzDODLboMyBOseZlT_ObNaFxAKtsTBrx3jH0s/01/public/values?alt=json'
});
driveObjectManager.objectsLoaded().then(() => {
   const restClientManager = new RestClientManager({
      codes: driveObjectManager.getProductCodes(),
      driveObjects: driveObjectManager.getObjects(),
      swiperInstance: swiperFeedProducts,
      showSalePercentage: true
   });
   restClientManager.init()
})


const driveObjectManager2 = new DriveObjectManager({
   sheetJson: 'https://spreadsheets.google.com/feeds/list/1isxgoYmzDODLboMyBOseZlT_ObNaFxAKtsTBrx3jH0s/02/public/values?alt=json'
});
driveObjectManager2.objectsLoaded().then(() => {
   const restClientManager2 = new RestClientManager({
      codes: driveObjectManager2.getProductCodes(),
      driveObjects: driveObjectManager2.getObjects(),
      swiperInstance: swiperNightProducts,
      showSalePercentage: false
   });
   restClientManager2.init()
})