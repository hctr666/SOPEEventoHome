import { hasWebpSupport, slugify } from './utils'

(function ($) {
   $(function () {

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

      // Request sheet JSON data
      const requestData = sheetURL => {
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

      // Verify if sheet field is valid
      const isFieldValid = field => {
         if (typeof field !== "undefined") {
            return typeof field.$t !== "undefined" && typeof field.$t !== null 
         }
         return null
      }

      const getDataItemParsed = (dataItem) => {
         const pricePromo = isFieldValid(dataItem[PRICE_PROMO]) ? parseFloat(dataItem[PRICE_PROMO].$t) : null
         const priceList  = isFieldValid(dataItem[PRICE_LIST]) ? parseFloat(dataItem[PRICE_LIST].$t) : null
         let savingsAmount = null
         if (pricePromo && priceList) {
            savingsAmount = priceList - pricePromo
         }

         const dataParsed = {
            active: isFieldValid(dataItem[ACTIVE]) ? parseInt(dataItem[ACTIVE].$t) : '',
            code: isFieldValid(dataItem[CODE]) ? dataItem[CODE].$t : '',
            description: isFieldValid(dataItem[DESCRIPTION]) ? dataItem[DESCRIPTION].$t : '',
            price_promo: isFieldValid(dataItem[PRICE_PROMO]) ? parseFloat(dataItem[PRICE_PROMO].$t) : '',
            price_list: isFieldValid(dataItem[PRICE_LIST]) ? parseFloat(dataItem[PRICE_LIST].$t) : '',
            savings_amount: savingsAmount,
            track_id: isFieldValid(dataItem[TRACK_ID]) ? dataItem[TRACK_ID].$t : '',
            is_cmr: isFieldValid(dataItem[IS_CMR]) ? dataItem[IS_CMR].$t : false,
            is_combo: isFieldValid(dataItem[IS_COMBO]) ? dataItem[IS_COMBO].$t : false,
         }

         return dataParsed
      }

      const buildHTMLItem = (dataItem) => {
         const dataParsed = getDataItemParsed(dataItem)
         
         try {
            const itemTemplate = `
               <div class="prod-panel-card">
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
            console.log(itemTemplate);
            
         } catch(err) {
            console.error(err);
         }
      }

      const buildHTML = data => {
         if (typeof data !== "undefined") {
            if (data.length > 0) {
               data.map((dataItem, i) => {
                  buildHTMLItem(dataItem)
               })
            }
         }
      }

      // Initialize all
      const init = () => {
         for (let i = 0; i < TOTAL_SHEETS; i++) {
            requestData(
               `https://spreadsheets.google.com/feeds/list/${SPREADSHEET_ID}/0${i}/public/values?alt=json`
            ).then(data => {
               buildHTML(data)
            }).catch(err => {
               console.error(err);
               
            })
         }
      }

      init()
   })
})(jQuery)
