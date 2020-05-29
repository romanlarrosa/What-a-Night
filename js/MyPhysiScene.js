class MyPhysiScene extends Physijs.Scene {
  constructor(myCanvas) {
    // El gestor de hebras
    Physijs.scripts.worker = './physijs/physijs_worker.js'
    // El motor de física de bajo nivel, en el cual se apoya Physijs
    Physijs.scripts.ammo = './ammo.js'
    super();

    // Crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);

    // Se establece el valor de la gravedad, negativo, los objetos caen hacia abajo
    this.setGravity(new THREE.Vector3(0, -10, 0));

    // El personaje principal
    this.prota = new Prota(this);

    // Raycaster que se usará
    this.raycaster = new THREE.Raycaster();

    //Variables para controlar la puntuación y el nivel de los generadores;
    this.puntuacion = 0;
    this.nivel = 0;

    // Se crean y añaden luces a la escena
    this.createLights();

    // Creamos la camara
    this.createCamera();

    // Creamos el mapa 
    this.mapa = new Mapa(this);

    //Generadores
    this.generadores = new Array();
    this.generadores.push(new Generador(this, -80, -80, this.prota, 1));
    this.generadores.push(new Generador(this,  80, -80, this.prota, 1));


    //Los elementos del html que vamos a ir modificando
    this.t_puntuacion = document.getElementById('puntuacion');
    this.t_nivel = document.getElementById('nivel');
    this.t_vida = document.getElementById('vida');


  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  /// Método que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKeyDown(event) {
    var key = event.which || event.keyCode;
    switch (key) {
      case 72: // La tecla de la  H
        window.alert("Movimiento controlado por WASD.\nApunta con el raton y dispara con el click izquierdo");
        break;
      case 65: // Cursor a la izquierda
        this.prota.left = true;
        break;
      case 87: // Cursor arriba
        this.prota.forward = true;
        break;
      case 68: // Cursor a la derecha
        this.prota.right = true;
        break;
      case 83: // Cursor abajo
        this.prota.backward = true;
        break;
    }
  }

  onKeyUp(event) {
    var key = event.which || event.keyCode;
    switch (key) {
      case 65: // Cursor a la izquierda
        this.prota.left = false;
        break;
      case 87: // Cursor arriba
        this.prota.forward = false;
        break;
      case 68: // Cursor a la derecha
        this.prota.right = false;
        break;
      case 83: // Cursor abajo
        this.prota.backward = false;
        break;
    }
  }


  createCamera() {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set(20, 70, 50);
    // Y hacia dónde mira
    this.look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(this.look);

    //Añadimos la cámara al personaje, para que lo siga en todo momento
    this.prota.box_container.add(this.camera);

  }

  //Cada vez que se haga click se gestiona un disparo
  disparar(event) {
    //Traducir a las coordenadas que entiende el raytracer desde las coordenadas del ratón
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);


    //Metemos a todos objetos seleccionables en un array
    var pickableObjects = new Array();
    //El suelo
    pickableObjects.push(this.mapa.ground);

    //Los zombies de todos los generadores
    for (var i = 0; i < this.generadores.length; i++) {
      for (var j = 0; j < this.generadores[i].zombies.length; j++) {
        if (this.generadores[i].zombies[j] != null)
          pickableObjects.push(this.generadores[i].zombies[j].box_container);
      }
    }

    //Se obtiene el punto hacia el que se dispara
    this.raycaster.setFromCamera(mouse, this.camera);
    var pickedObjects = this.raycaster.intersectObjects(pickableObjects, true);

    if (pickedObjects.length > 0) {
      var selectedPoint = pickedObjects[0].point;

      //Indica al protagonista que dispare al punto encontrado
      this.prota.disparar(selectedPoint);
    }
  }

  createLights() {
    //Se crea la luz focal y se añade al personaje para que lo siga en todo momento
    this.spotLight = new THREE.SpotLight(0xffffff, 0.6);
    this.spotLight.position.set(0, 20, 0);
    //Establecemos el punto al que al luz apunta
    this.spotLight.target.position.set(0, 0, 0);
    this.prota.box_container.add(this.spotLight);
    //Añadimos el punto de mira de la luz al personaje para que siempre apunte a el
    this.prota.box_container.add(this.spotLight.target);
  }

  getCamera() {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }

  //Se define el aspecto de la cámara
  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  update() {
    // Se solicita que La próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
    // La propia función render es la que indica que quiere ejecutarse la proxima vez
    // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
    requestAnimationFrame(() => this.update());

    //Actualizar al prota
    this.prota.update();

    //Actualizar los valores de puntuación y de vida
    this.t_puntuacion.innerHTML = this.puntuacion;
    this.t_vida.innerHTML = this.prota.vida;

    //Actualizar los generadores
    for (var i = 0; i < this.generadores.length; i++) {
      this.generadores[i].update();
      //Actualizar el nivel
      this.t_nivel.innerHTML = Math.trunc(this.generadores[i].nivel);
    }



    // Por último, se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
    this.renderer.render(this, this.getCamera());

    //Se actualizan las animaciones con tween
    TWEEN.update();

    // Se le pide al motor de física que actualice las figuras según sus leyes
    this.simulate();
  }
}


/// La función principal
$(function () {

  // Se crea la escena
  var scene = new MyPhysiScene("#WebGL-output");

  // listeners
  // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
  window.addEventListener("resize", () => scene.onWindowResize());

  // Se añaden listeners para el teclado y el ratón
  window.addEventListener("keydown", () => scene.onKeyDown(event));
  window.addEventListener("keyup", () => scene.onKeyUp(event));
  window.addEventListener("mousedown", () => scene.disparar(event));

  // Finalmente, realizamos el primer renderizado.
  scene.update();
});

