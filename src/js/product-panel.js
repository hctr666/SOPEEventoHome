import { hasWebpSupport, slugify } from './utils'

// ID hoja excel
const SPREADSHEET_ID = "1iRZUOrOVHZqMRWCwBdMs7F0n7KFgz1A-tP429WKhRbM";

// Total de pestañas
const TOTAL_SHEETS = 7

// Campos validos de la hoja excel
const ACTIVE = 'gsx$activo'
const CODE = 'gsx$sku'
const DESCRIPTION = 'gsx$descripcion'
const TRACK_ID = 'gsx$cid'
const PRICE_PROMO = 'gsx$precio-promo'
const PRICE_LIST = 'gsx$precio-lista'
const IS_CMR = 'gsx$es-imbatible'
const IS_COMBO = 'gsx$es-combo'

let isRequestingData = false

class ProductPanel {
   constructor(options) {
      this.options = Object.assign({}, options)
   }
   setSheetIndex(sheetIndex) {
      this.options.sheetIndex = sheetIndex
   }
   setMountContainer(mountContainer) {
      this.mountContainer = mountContainer
   }
   getData() {
      return new Promise((resolve, reject) => {
         this.requestData(
            `https://spreadsheets.google.com/feeds/list/${SPREADSHEET_ID}/0${this.options.sheetIndex}/public/values?alt=json`
         ).then(data => {
            //this.renderbuildHTML(data)
            resolve(data)
         }).catch(err => {
            reject(err)
         })
      })
   }
   
   getHTMLCatItem(dataCategory) {
      if (typeof dataCategory === "undefined") return

      const itemTemplate = `
         <div class="prod-panel-card category-panel-card box-with-button">
            <a class="no-decoration color-white" href="/sodimac-pe/category/${dataCategory.id}/${slugify(dataCategory.name)}${dataCategory.trackId ? `?cid=${dataCategory.trackId}` : ''}">
               <span class="${dataCategory.iconClass} mb-15"></span>
               <p class="mb-10">Descubre más de</p>
               <p class="category-panel-card-heading mb-10">${dataCategory.name}</p>
               <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </a>
         </div>
      `

      return itemTemplate
   }

   renderHTML(data, dataCategory) {
      if (typeof data !== "undefined") {
         let innerHTML = '<div class="prod-panel-container">'
         if (data.length > 0) {
            data.map((dataItem, i) => {
               innerHTML += this.getHTMLItem(dataItem)
            })
         }
         innerHTML += this.getHTMLCatItem(dataCategory)
         innerHTML += '</div>'
         
         if (this.mountContainer) {
            this.mountContainer.innerHTML = innerHTML
         }
      }
   }

   getDataItemParsed(dataItem) {
      if (typeof dataItem === "undefined")
         return;

      const pricePromo = this.isFieldValid(dataItem[PRICE_PROMO]) ? parseFloat(dataItem[PRICE_PROMO].$t) : null
      const priceList = this.isFieldValid(dataItem[PRICE_LIST]) ? parseFloat(dataItem[PRICE_LIST].$t) : null
      let savingsAmount = null
      if (pricePromo && priceList) {
         savingsAmount = priceList - pricePromo
      }
   
      const dataParsed = {
         active: this.isFieldValid(dataItem[ACTIVE]) ? parseInt(dataItem[ACTIVE].$t) : '',
         code: this.isFieldValid(dataItem[CODE]) ? dataItem[CODE].$t : '',
         description: this.isFieldValid(dataItem[DESCRIPTION]) ? dataItem[DESCRIPTION].$t : '',
         price_promo: this.isFieldValid(dataItem[PRICE_PROMO]) ? parseFloat(dataItem[PRICE_PROMO].$t) : '',
         price_list: this.isFieldValid(dataItem[PRICE_LIST]) ? parseFloat(dataItem[PRICE_LIST].$t) : '',
         savings_amount: savingsAmount,
         track_id: this.isFieldValid(dataItem[TRACK_ID]) ? dataItem[TRACK_ID].$t : '',
         is_cmr: this.isFieldValid(dataItem[IS_CMR]) ? dataItem[IS_CMR].$t : false,
         is_combo: this.isFieldValid(dataItem[IS_COMBO]) ? dataItem[IS_COMBO].$t : false,
      }
   
      return dataParsed
   }

   isFieldValid(field) {
      if (typeof field !== "undefined") {
         return typeof field.$t !== "undefined" && typeof field.$t !== null
      }
      return null
   }

   getHTMLItem(dataItem) {
      if (typeof dataItem === "undefined")
         return;

      const dataParsed = this.getDataItemParsed(dataItem)

      try {
         const itemTemplate = `
            <div class="prod-panel-card box-with-button">
               <a href="/sodimac-pe/product/${dataParsed.code}/${slugify(dataParsed.description)}?cid=${dataParsed.track_id}">
                  <div class="prod-panel-img-wrapper">
                     <img src="https://sodimac.scene7.com/is/image/SodimacPeru/${dataParsed.code}?$lista180$${hasWebpSupport() ? '&fmt=webp' : ''}" />
                  </div>
                  <div class="prod-panel-info">
                     ${dataParsed.is_cmr ? '<span class="c-icon c-icon-2x c-icon-cmr"></span>' : ''}
                     ${dataParsed.is_combo && !dataParsed.is_cmr ? '<span class="c-icon c-icon-2x c-icon-combo"></span>' : ''}
                     <p class="prod-panel-price-primary">${dataParsed.description}</p>
                     ${dataParsed.price_promo ? `<p>S/ ${dataParsed.price_promo}</p>` : ''}
                     ${dataParsed.price_list ? `<p class="prod-panel-price-secondary">Normal: S/ ${dataParsed.price_list}</p>` : ''}
                     ${dataParsed.savings_amount ? `<p class="prod-panel-price-secondary">Ahorro: S/ ${dataParsed.savings_amount}</p>` : ''}
                  </div>
               </a>
            </div>
         `
         return itemTemplate
   
      } catch (err) {
         console.error(err);
      }
   }

   requestData(sheetURL) {
      return new Promise((resolve, reject) => {
         if (typeof sheetURL !== "undefined") {
            $.ajax({
               url: sheetURL,
               beforeSend: () => {
                  isRequestingData = true
               }
            }).done((res, textStatus) => {
               if (textStatus === "success" && res.feed.entry) {
                  resolve(res.feed.entry)
               }
            }).fail((res) => {
               reject(res.responseText)
            }).always(() => {
               isRequestingData = false
            })
         } else {
            reject('Error: No se especificó la url para la extracción de datos')
         }
      })
   }
}

export default ProductPanel
