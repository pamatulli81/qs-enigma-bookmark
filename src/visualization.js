define(['qlik', 'jquery', './config', 'text!./style.css'],

    function(qlik, $, config, style) {

        _this = this;

        var global = qlik.getGlobal();
        var app = qlik.currApp(_this);
        console.log(app);
        var enigmaModel = app.model.enigmaModel;

        $('<style>').html(style).appendTo('head');

        return {
            definition: config.definition,
            initialProperties: config.initialProperties,
            paint: main
        };

        function main($element, layout) {

            var html = "",
                lastrow = 0,
                morebutton = false,
                isPersonalMode = null;
            var bookmarks = [];
            var storedBm = [];

            $element.empty();
            initViz();
            addEvents();

            /********************************************************************************************************************************************
              PAM: Functions and Events Handling      
            ********************************************************************************************************************************************/

            function initViz() {
                html = "<table id='bmTable'><thead><tr>";
                html += '<th>' + 'Id' + '</th>';
                html += '<th>' + 'Type' + '</th>'
                html += '<th>' + 'Created' + '</th>'
                html += '<th></th>';
                html += '</thead></tr>'

                storedBm = JSON.parse(localStorage.getItem("bookmarks"));

                if (storedBm != null) {

                    for (var i = 0; i < storedBm.length; i++) {

                        var obj = storedBm[i];
                        html += '<tr>';
                        html += '<td align="center">' + obj.qInfo.qId + '</td>';
                        html += '<td align="center">' + obj.qInfo.qType + '</td>';
                        html += '<td align="center">' + obj.creationDate + '</td>';
                        html += '<td align="center"><button class="ng-isolate-scope lui-button">Apply</button></td>';
                        html += '</tr>';
                    }
                } else {
                    html += "<tr><td colspan='4' align='center'>No records available</td></tr>";
                }
                html += "</table>";
                html += "<p align='right' style='margin-top:20px'>";
                html += "<button id='btnCreate' class='ng-isolate-scope lui-button'>Create</button>";
                html += "<button id='btnClear' style='margin-left:10px' class='ng-isolate-scope lui-button'>Clear</button>";
                html += "</p>";

                $element.append(html);
            }

            function addEvents() {

                // Bind the click event, to the table rows
                // New way (jQuery 1.7+) - .on(events, selector, handler)
                $('#bmTable').on('click', 'tr', function(event) {

                    var qId = $(this).find("td:eq(0)").text();
                    enigmaModel.applyBookmark(qId).then((layout) => {
                        console.log(layout);
                    });
                });

                $('#btnCreate').click(function() {

                    var mSec = new Date().getTime();
                    var qId = mSec.toString();

                    var bookmark = {
                        "qInfo": {
                            "qId": qId,
                            "qType": enigmaModel.layout.qTitle
                        }
                    };

                    console.log(bookmark);

                    enigmaModel.createBookmark(bookmark).then((model) => {

                        model.getLayout().then(layout => {
                           
                            console.log(layout);
                            if (storedBm == undefined || storedBm == null) {
                                storedBm = [];
                            }

                            if (storedBm.length == 0) {
                                $("#bmTable").find("tr:gt(0)").remove();
                            }

                            storedBm.push(bookmark);
                            localStorage.setItem("bookmarks", JSON.stringify(storedBm));

                            var row = '<tr>';
                            row += '<td align="center">' + layout.qInfo.qId + '</td>';
                            row += '<td align="center">' + layout.qInfo.qType + '</td>';
                            row += '<td align="center">' + layout.creationDate + '</td>';
                            row += '<td align="center"><button class="ng-isolate-scope lui-button">Apply</button></td>';
                            row += '</tr>';

                            $('#bmTable tr:last').after(row);

                            //PAM: Save in case we are using Qliksense Desktop
                            global.isPersonalMode(function(reply) {
                                isPersonalMode = reply.qReturn;
                                if (isPersonalMode) {
                                    console.log('Personal Mode!');
                                    enigmaModel.doSave();
                                }
                            });
                        });
                    });
                });

                $('#btnClear').click(function() {

                    if (storedBm != null) {

                        for (var i = 0; i < storedBm.length; i++) {
                            var obj = storedBm[i];
                            if (enigmaModel.destroyBookmark(obj.qInfo.qId)) {
                                console.log('Bookmark with Id ' + obj.qInfo.qId + ' destroyed successfully!');
                                //PAM: Save in case we are using Qliksense Desktop
                                global.isPersonalMode(function(reply) {
                                    isPersonalMode = reply.qReturn;
                                    if (isPersonalMode) {
                                        console.log('Personal Mode!');
                                        enigmaModel.doSave();
                                    }
                                });
                            }
                        }

                        //PAM: Reset to Initial state
                        storedBm = [];
                        $("#bmTable").find("tr:gt(0)").remove();
                        localStorage.removeItem('bookmarks');
                        $('#bmTable tr:last').after("<tr><td colspan='4' align='center'>No records available</td></tr>");

                    }
                });

            }
        }
    });