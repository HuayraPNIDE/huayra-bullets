var path = require('path');
var fs = require('fs');
var replaceStream = require('replacestream');
var exec = require('child_process').exec;

Reveal.initialize({
  controls: false,
  progress: true,
  history: true,
  help:false,
  center: true,
  embedded: true,
  autoSlide: 10000,
  loop: true,
  keyboard: {
    13: 'next', // Enter
    37: 'prev', // Flecha Izq
    39: 'next', // Flecha Der
    38: null, // Flecha Arriba
    40: null, // Flecha Abajo
    70: function() {
        location.reload(true);
        } // refrescar página.
  },

  transition: 'slide',

  // Fondo paralaje
  parallaxBackgroundImage: 'css/fondo.svg',
  parallaxBackgroundSize: '1600px 900px',

    // Optional reveal.js plugins
  dependencies: [
  { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
  { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
  { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: 'plugin/zoom-js/zoom.js', async: true },
      { src: 'plugin/notes/notes.js', async: true }
  ]
});

var botonAcercaDe = document.getElementById('botonAcercaDe');
var botonIzquierda = document.getElementById('botonIzquierda');
var botonDerecha = document.getElementById('botonDerecha');
var checkboxIniciar = document.getElementById('check');
var botonNuevoEnHuayra = document.getElementById('nuevo-en-huayra');

function actualizar_estados() {
  if (Reveal.isFirstSlide())
    botonIzquierda.setAttribute('disabled', 'disabled');
  else
    botonIzquierda.removeAttribute('disabled');

  if (Reveal.isLastSlide()) {
    botonDerecha.setAttribute('disabled', 'disabled');
  } else {
    botonDerecha.removeAttribute('disabled');
  }
}

Reveal.addEventListener('ready', actualizar_estados);
Reveal.addEventListener('slidechanged', actualizar_estados);

botonIzquierda.onclick = function() {
  // NOTA: usar Reveal.navigateLeft() si no queremos que ingrese en
  // los slides inferiores.
  Reveal.prev();
};

botonDerecha.onclick = function() {
  // NOTA: usar Reveal.navigateRight() si no queremos que ingrese en
  // los slides inferiores.
  Reveal.next();
};

botonAcercaDe.onclick = function(e) {
  e.preventDefault();
  Reveal.slide(-1, -1);
};

botonNuevoEnHuayra.onclick = function(e) {
  e.preventDefault();
  var huayraManualProcess = exec('huayra-visor-manual articles/p/r/i/Primeros_pasos.html && echo \'EL_PID\' $$',
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      else {
        // Pone el foco en la ayuda
        // WARNING: dependemos del título de la ventana de ayuda
        var focoEnLaAyuda = function(focoEnLaAyudaInterval) {
          setTimeout(function() {
            exec('wmctrl -Fa \'Primeros pasos - Huayra\'', function(err, stdout, stderr) {
              if(err !== null) {
                focoEnLaAyuda(focoEnLaAyudaInterval * 2);
              }
            });
          }, focoEnLaAyudaInterval);
        };
        focoEnLaAyuda(1);
      }
  });
};
document.getElementById('nuevo-en-huayra-2').onclick = botonNuevoEnHuayra.onclick;

function copiar_archivo(desde, hasta, autostart) {
  fs.createReadStream(desde).
    pipe(replaceStream('Terminal=false', "Terminal=false\nX-MATE-Autostart-enabled=" + autostart)).
    pipe(fs.createWriteStream(hasta));
}


function actualizar_acceso_inicio_automatico(reiniciar) {
  var ruta_desktop_original = "/usr/share/applications/huayra-bullets.desktop";
  var ruta_desktop_home = path.join(process.env['HOME'], '.config/autostart/huayra-bullets.desktop');

  if (fs.existsSync(ruta_desktop_original)) {
    copiar_archivo(ruta_desktop_original, ruta_desktop_home, reiniciar);
  } else {
    console.error("El archivo " + ruta_desktop_original + " no existe, no se puede cambiar preferencias de inicio...");
  }

}

function mostrar_estado_iniciar_checkbox() {
  var ruta_desktop_home = path.join(process.env['HOME'], '.config/autostart/huayra-bullets.desktop');

  if (fs.existsSync(ruta_desktop_home)) {
    var activado = /X-MATE-Autostart-enabled=true/.test(fs.readFileSync(ruta_desktop_home).toString());

    if (activado) {
      checkboxIniciar.checked = true;
    }
  } else {
    checkboxIniciar.checked = true;
  }
}

checkboxIniciar.onchange = function() {
  actualizar_acceso_inicio_automatico(checkboxIniciar.checked);
};

mostrar_estado_iniciar_checkbox();
