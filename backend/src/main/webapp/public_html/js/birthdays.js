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
    pb.quad(270, 0, 300, 120, trackColor);
    pb.line(360, 300, trackColor)
        .image('../img/birthday.png', 32, 32)
        .id('birthday');

    pb.quad(410, 450, 490, 200, trackColor);
    pb.quad(550, 0, 570, 90, trackColor)
        .image('../img/present.png', 32, 32)
        .id('present');

    pb.line(580, 190, trackColor);
    pb.quad(600, 400, 730, 390, trackColor)
        .image('../img/calendar.png', 32, 32)
        .id('event');

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
    pipeline.forEach(function (shape) {
        shape.paint();
    });

    // paint last items from pipeline
    pipeline.forEach(function (shape) {
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

        $.ajax({
            type: "GET",
            url: base + "?id=1",
            contentType: "application/json",
            success: function (response) {
                moveToId('birthday', function () {
                    // completed move,
                    toastr.options.timeOut = 30000;
                    toastr.info('<div>' + response.message + '</div>' + getHtml(response.nextStep, response.nextId));
                });
            }
        });
    }, 1000);
}

// start the process
start();


var base = "http://localhost:8080/backend/resources/pipeline/pipe";

function getHtml(evt, id) {
    return '<div><button type="button" onclick="yes(' + "'" + evt + "', " + id + ')" id="okBtn" class="btn btn-primary">Yes</button><button type="button" id="noBtn" onclick="no(' + "'" + evt + "', " + id + ')" class="btn" style="margin: 0 8px 0 8px">No</button></div>';
}

function yes(evt, id) {
    $.ajax({
        type: "GET",
        url: base + "?id=" + id,
        contentType: "application/json",
        success: function (response) {
            moveToId(evt, function () {
                // completed move,
                if (response.nextId !== '') {
                    if (response.type === 'question') {
                        toastr.options.timeOut = 30000;
                        toastr.info('<div>' + response.message + '</div>' + getHtml(response.nextStep, response.nextId));
                    } else {
                        toastr.options.timeOut = 30000;
                        toastr.info('<div>' + response.message + '</div>');
                        yes(response.nextStep, response.nextId);
                    }
                } else {
                    moveToId('end', function () {

                    });
                }
            });
        }
    });
}

function no(evt, id) {
    toastr.info('Stopping process...', 'Info');
}