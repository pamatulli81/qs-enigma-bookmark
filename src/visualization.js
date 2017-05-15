define(['qlik', 'jquery', './config', 'text!./style.css'],

  function (qlik, $, config, style) {

    _this = this;

    var global = qlik.getGlobal();
    var app = qlik.currApp(_this);
    var enigmaModel = app.model.enigmaModel;

    console.log(enigmaModel);

    $('<style>').html(style).appendTo('head');

    return {
      definition: config.definition,
      initialProperties: config.initialProperties,
      paint: main
    };

    function main($element, layout) {

      console.log(layout);

      var qId = 'BM01';
      var qType = 'Bookmark';

      $element.empty();
      $element.append(

        $('<button>Create Bookmark</button>').click(function () {

          var bookmarkProperties = { "qInfo": { "qId": qId, "qType": qType } };

          enigmaModel.destroyBookmark(qId).then((layout) => {
            console.log(layout);
            enigmaModel.createBookmark(bookmarkProperties).then((layout) => {
              console.log(layout);

              var isPersonalMode;
              global.isPersonalMode(function (reply) {
                isPersonalMode = reply.qReturn;
                if (isPersonalMode) {
                  console.log('Personal Mode!');
                  enigmaModel.doSave();
                }
              });
            });
          });
        })
      );

      $element.append(

        $('<button style="margin-left:10px">Apply Bookmark</button>').click(function () {

          enigmaModel.applyBookmark(qId).then((layout) => {
            console.log(layout);
          });
        })
      );

      $element.append(

        $('<button style="margin-left:10px">Get Bookmark</button>').click(function () {

          enigmaModel.getBookmark(qId).then((bookmark) => {
            bookmark.getLayout().then((layout) => {
              console.log(layout);
            });
          });
        })
      );

    }
  });




