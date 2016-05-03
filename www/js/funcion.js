$(function() {
localStorage.status = localStorage.status || "";
var watchID = null;
var assetURL = "http://outletpinomontano.esy.es/cancion.mp3";
var fileName = "sonido.mp3";
var progressBar = $("#progressbar");
var progressLabel = $(".progress-label");
$("#sensor").on('click', startWatch);
$("#sensor2").on('click', stopWatch);
$("#check").on('click', comprobar);
start();
function start(){
    if (localStorage.status === ""){
       $("#check").show();
       $("#player").hide();
       progressBar.hide(); 
    }
    else {
       $("#check").hide();
       progressBar.hide();
       $("#player").show();
       setTimeout(comprobar, 1000);
    }
}
function comprobar(){
    window.resolveLocalFileSystemURI(cordova.file.dataDirectory + fileName, onResolveSuccess, downloadAsset);
};
function onResolveSuccess(fileEntry) {
    $("#sound").attr("src", cordova.file.dataDirectory + fileName).detach().appendTo($("#player"));
};
function termino(){
    console.log("reproducido");
}
function error(){
    console.log("error");
}
function downloadAsset() {
    var fileTransfer = new FileTransfer();
    $("#check").hide();
    progressBar.show();
    fileTransfer.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			progressBar.progressbar({
            value: perc});
            progressLabel.html(perc + " %");
	    }
    };
    fileTransfer.download(assetURL, cordova.file.dataDirectory + fileName, 
        function(entry) {
            localStorage.status = 1;
            start();
        }, 
        function(err) {
            alert("Error!");
        });
};
function startWatch(){
    watchID = navigator.accelerometer.watchAcceleration(mostrar, fallo, {frequency: 50});  
};
function mostrar(acceleration){
    $("#ejeX").val(acceleration.x);
    $("#ejeY").val(acceleration.y);
    $("#ejeZ").val(acceleration.z);
    var puntoMovil = $('#punto');
    var limite = $('#caja');
    var posicionPunto = puntoMovil.position();
    var bordeIzquierdo = 0;
    var bordeTop = 0;
    var bordeDerecho = limite.width() - puntoMovil.width();
    var bordeBottom = limite.height() - puntoMovil.height();
    if( acceleration.x < -0.5 && posicionPunto.left <= bordeDerecho ) {
                puntoMovil.animate({
                    left:'+=5'
                },1);
    } else if( acceleration.x > 0.5 && posicionPunto.left > bordeIzquierdo ) {
                puntoMovil.animate({
                    left:'-=5'
                },1);
    }
    if( acceleration.y < -0.5 && posicionPunto.top > bordeTop ) {
                puntoMovil.animate({
                    top:'-=5'
                },1);
    } else if(acceleration.y > 0.5 && posicionPunto.top <= bordeBottom ) {
                puntoMovil.animate({
                    top:'+=5'
                },1);
    }
};

function fallo() {
    alert('error!!');
    };

function stopWatch(){
    if (watchID){
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
        puntoMovil.animate({top: '-=0'}, 1);
        puntoMovil.animate({left: '-=0'}, 1);
    }
};
});
