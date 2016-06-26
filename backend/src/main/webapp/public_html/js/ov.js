
var sc = new ShapeCanvas('#progress');

// context defaults
sc.width(10);

// set starting values
var fps = 30;
var trackColor = 'gold';
var percent = 0;
var pipeline = makePipeline();
var currentPipe;
var coin = new MyImage(sc, {
    url: '../img/coin.png',
    w: 128, h: 128
});

function makePipeline() {
    var dims = sc.dimensions();
    var pb = new PipelineBuilder(sc);

    // add initial
    pb.add('Line', {
        stroke: trackColor,
        sX: 64, sY: dims.center.y,
        eX: 100, eY: dims.center.y
    }).image('../img/start.png', 32, 32, true)
            .id('start');

    // and build the pipeline! whooo!
    pb.quad(230, dims.center.y, 250, 120, trackColor);
    pb.quad(270, 0, 300, 120, trackColor)
            .image('../img/location.png', 32, 32)
            .id('location');
    pb.line(360, 300, trackColor);

    pb.quad(410, 450, 490, 200, trackColor);
    pb.quad(550, 0, 570, 90, trackColor);

    pb.line(580, 190, trackColor);
    pb.quad(600, 400, 730, 390, trackColor)
            .image('../img/card.png', 32, 32)
            .id('card');

    pb.line(dims.width - 64, 390, trackColor)
            .image('../img/end.png', 32, 32)
            .id('end');

    return pb.pipeline;
}

// draw the current frame based on pipelineProgress
function draw(pipelineProgress, progressStatusCb) {
    // redraw everything
    sc.clear();

    var xy, sm, perc, sl;

    // figure out each segment length
    sl = (100 / pipeline.length);

    // figure out placement of circle based on pipeline progress
    for (var i = 0; i < pipeline.length; i++) {
        sm = (i + 1) * sl; // set section max
        if (pipelineProgress <= sm) {
            perc = (i === 0)
                    // percent in pipeline for first shape
                    ? pipelineProgress / sl
                    : (pipelineProgress - (i * sl)) / sl;
            xy = pipeline[i].pointAtPercent(perc);

            if (currentPipe === 'undefined' || currentPipe !== i) {
                currentPipe = i;

                progressStatusCb && progressStatusCb.call(this, {
                    sectionNumber: currentPipe,
                    sectionId: pipeline[currentPipe].identifier(),
                    pipeline: pipeline[currentPipe]
                });
            }

            break;
        }
    }

    // draw pipeline segments
    pipeline.forEach(function(shape) {
        shape.paint();
    });

    // paint last items from pipeline
    pipeline.forEach(function(shape) {
        shape.paintLast();
    });

    // draw the tracking coin
    if (xy) {
        coin.setXY(xy);
        coin.paint();
    }
}

// moves to the specified id
function moveToId(id, end) {
    var p, i, sl, sm, ran = false;

    sl = (100 / pipeline.length);
    for (i = 0; i < pipeline.length; i++) {
        p = pipeline[i];
        if (p.identifier() === id) {
            sm = (i + 1) * sl;
            ran = true;

            setTimeout(function callMe() {
                draw(percent);

                if (percent < sm) {
                    percent++;
                    requestAnimationFrame(callMe);
                } else {
                    end && end();
                }
            }, 1000 / fps);

            break;
        }
    }

    if (!ran) {
        end && end();
    }
}

function start() {
    setTimeout(function () {
        // initial draw
        draw(0);

        moveToId('location', function() {
            $.ajax({
                type: "GET",
                url: base + "?id=4",
                contentType: "application/json",
                success: function (response) {
                    moveToId('card', function () {
                        // completed move,
                        toastr.options.timeOut = 30000;
                        toastr.info('<div>' + response.message + '</div>' + getHtml(response.nextStep, response.nextId));
                    });
                }
            });
        })

    }, 1000);
}

// start the process
start();

var base = "http://localhost:8080/backend/resources/pipeline/pipe";

function getHtml(evt, id) {
    return '<div><button type="button" onclick="yes(' + "'" + evt + "', " + id + ')" id="okBtn" class="btn btn-primary">Yes</button><button type="button" id="noBtn" onclick="no(' + "'" + evt + "', " + id + ')" class="btn" style="margin: 0 8px 0 8px">No</button></div>';
}

function yes(evt, id) {
    moveToId('end', function() {

    })
}
