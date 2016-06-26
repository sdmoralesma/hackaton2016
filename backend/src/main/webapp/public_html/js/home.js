$(function() {
    var sc = new ShapeCanvas('#progress');

    // context defaults
    sc.width(10);

    // set starting values
    var fps = 30;
    var trackColor = 'gold';
    var percent = 0;
    var direction = 1;
    var pipeline = makePipeline();
    var currentPipe;
    var coin = new MyImage(sc, {
        url: 'img/coin.png',
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
        }).image('img/start.png', 32, 32, true)
                .id('start');

        // and build the pipeline! whooo!
        pb.quad(230, dims.center.y, 250, 120, trackColor);
        pb.quad(270, 0, 300, 120, trackColor);
        pb.line(360, 300, trackColor)
                .image('img/facebook.png', 32, 32)
                .id('facebook');

        pb.quad(410, 450, 490, 200, trackColor);
        pb.quad(550, 0, 570, 90, trackColor)
                .image('img/location.png', 32, 32)
                .id('location');

        pb.line(580, 190, trackColor);
        pb.quad(600, 400, 730, 390, trackColor)
                .image('img/youtube.png', 32, 32)
                .id('youtube');

        pb.line(dims.width - 64, 390, trackColor)
                .image('img/end.png', 32, 32)
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

                    progressStatusCb.call(this, {
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

        // draw the tracking coin
        if (xy) {
            coin.setXY(xy);
            coin.paint();
        }

        // paint last items from pipeline
        pipeline.forEach(function(shape) {
            shape.paintLast();
        });
    }

    function animate() {
        percent += Math.random() > 0.5 ? direction : 0;

        if (percent < 0) {
            percent = 0;
            direction = 1;
        }

        if (percent > 100) {
            percent = 100;
            direction = -1;
        }

        draw(percent, function(status) {
            if (status.sectionId !== '') {
                toastr.info(status.sectionId.substring(0, 1).toUpperCase() + status.sectionId.substring(1) + ' Processing...', 'Info');
            }
        });

        // request another frame
        setTimeout(function() {
            requestAnimationFrame(animate);
        }, 1000 / fps);
    }

    // start the animation
    animate();
});