define(function() {
  var QLIK_MAX_DATA_PER_REQUEST = 10000;
  var QLIK_DIMENSION_COUNT = 0;
  var QLIK_DIMENSION_MAX = 0;
  var QLIK_DIMENSION_MIN = 0;
  var QLIK_MEASURE_COUNT = 0;
  var DATA_PER_ROW = QLIK_DIMENSION_COUNT + QLIK_MEASURE_COUNT;
  var ROWS_PER_PAGE = Math.floor(QLIK_MAX_DATA_PER_REQUEST/DATA_PER_ROW);

 
  return {
    QLIK_MAX_DATA_PER_REQUEST: QLIK_MAX_DATA_PER_REQUEST,
    DATA_PER_ROW: DATA_PER_ROW,
    ROWS_PER_PAGE: ROWS_PER_PAGE,
     
    initialProperties: {
      version: 1.0,
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [{
            qWidth: DATA_PER_ROW,
            qHeight: 0 // needs a limitation
        }]
      },
      selectionMode: "CONFIRM"
    },
    definition: {
      type: 'items',
      component: 'accordion',
      items: {        
        bubbles: {
          uses: 'dimensions',
          min: QLIK_DIMENSION_MIN,
          max: QLIK_DIMENSION_MAX
        },        
        size: {
          uses: 'measures',
          min: QLIK_MEASURE_COUNT,
          max: QLIK_MEASURE_COUNT,
        },
        addons: {
          uses: "addons",
          items: {
            dataHandling: {
              uses: "dataHandling"
            }
          }
        },
        settings: {
          uses: "settings"
        }
      }     
    },
    snapshot: {
	    canTakeSnapshot: true
    }
  };
});
