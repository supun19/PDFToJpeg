const express = require('express')
var pdfjsLib  = require('pdfjs-dist');
var Canvas = require('canvas');
var assert = require('assert');
const app = express()
const port = 3000

app.get('/', function(req, res) {
    var url = "http://www.pdf995.com/samples/pdf.pdf";
    pdfConvertImageAndSaveDb(url)
    res.send('Hello World!')

});
function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
    create: function NodeCanvasFactory_create(width, height) {
        assert(width > 0 && height > 0, 'Invalid canvas size');
        var canvas = new Canvas(width, height);
        var context = canvas.getContext('2d');
        return {
            canvas: canvas,
            context: context,
        };
    },

    reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, 'Canvas is not specified');
        assert(width > 0 && height > 0, 'Invalid canvas size');
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    },

    destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, 'Canvas is not specified');

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    },
};
function pdfConvertImageAndSaveDb(url){

    pdfjsLib.getDocument(url).then(function (pdfDocument) {
        console.log('# number of pages.',pdfDocument.pdfInfo.numPages);

        pdfDocument.getPage(1).then(function (page) {
            // Render the page on a Node canvas with 100% scale.
            var viewport = page.getViewport(1.0);
            var canvasFactory = new NodeCanvasFactory();
            var canvasAndContext = canvasFactory.create(viewport.width, viewport.height);

            var renderContext = {
                canvasContext: canvasAndContext.context,
                viewport: viewport,
                canvasFactory: canvasFactory
            };

            page.render(renderContext).then(function () {
                // Convert the canvas to an image buffer.
                canvasAndContext.canvas.toDataURL('image/jpeg', 1, function(err, jpeg){
                    console.log(jpeg);
                });

            }).catch(function(reason){
                //console.log(reason);
            })

        });

    }).catch(function(reason) {
        //console.log(reason);
    });


}


app.listen(port, function(){ console.log('Example app listening on port'+ port)})
