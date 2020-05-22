
// En este archivo se comenta principalmente lo relacionado con el  Coche
// Para el resto de comentarios mirar el otro ejemplo de física

class MyPhysiScene extends Physijs.Scene {
  constructor (myCanvas) {
    // El gestor de hebras
    Physijs.scripts.worker = './physijs/physijs_worker.js'
    // El motor de física de bajo nivel, en el cual se apoya Physijs
    Physijs.scripts.ammo   = './ammo.js'

    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se establece el valor de la gravedad, negativo, los objetos caen hacia abajo
    this.setGravity (new THREE.Vector3 (0, -10, 0));
    
    // Para almacenar las figuras que caen
    this.boxes = [];
    this.spheres = [];
    this.todos = [];
    
    // Raycaster que se usará para elegir (pick) las figuras para impulsarlas
    this.raycaster = new THREE.Raycaster();
    
    // Se crea la gui
    this.gui = this.createGUI ();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Se crean y añaden luces a la escena
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();
    
    // IMPORTANTE: Los elementos que se desee sean tenidos en cuenta en la FISICA deben colgar DIRECTAMENTE de la escena. NO deben colgar de otros nodos.
    
    // Un suelo 
    this.createGround ();
    
    // Unas cajas que van a caer
    this.createBoxes (MyPhysiScene.MAXBOXES);
    
    // The Formula 1
    // Tamaño, posicion x inicial, posicion y inicial
    this.car = new Car(this, 0.25, 5, 5); 
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  /// Método que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  onKeyDown (event) {
    var key = event.which || event.keyCode;
    switch (key) {
      case 65 : // La tecla de la  A
        window.alert("El coche avanza/retrocede con los cursores arriba/abajo\nGira a izquierda/derecha con los cursores izquierda/derecha\nPueden pulsarse varias teclas a la vez.");
        break;
      case 37 : // Cursor a la izquierda
        this.car.left = true;
        break;
      case 38 : // Cursor arriba
        this.car.forward = true;
        break;
      case 39 : // Cursor a la derecha
        this.car.right = true;
        break;
      case 40 : // Cursor abajo
        this.car.backward = true;
        break;
    }
  }

  onKeyUp (event) {
    var key = event.which || event.keyCode;
    switch (key) {
      case 37 : // Cursor a la izquierda
        this.car.left = false;
        break;
      case 38 : // Cursor arriba
        this.car.forward = false;
        break;
      case 39 : // Cursor a la derecha
        this.car.right = false;
        break;
      case 40 : // Cursor abajo
        this.car.backward = false;
        break;
    }
  }

  createBoxes (n) {
    var element = null;
    for (var i = 0; i < n; i++) {
      if (Math.random() < MyPhysiScene.PROBBOX) {
        element = new Physijs.BoxMesh (
          new THREE.BoxGeometry (1,1,1),
          Physijs.createMaterial (
            new THREE.MeshLambertMaterial ({color: 0xFFFFFF * Math.random()}), 
            0.1, 0.9),
          1.0
        );
        element.scale.set(Math.random()+0.5, Math.random()+0.5, Math.random()+0.5);
        this.boxes.push(element);      
        this.todos.push(element);
      } else {
        element = new Physijs.SphereMesh (
          new THREE.SphereGeometry (Math.random()*0.25 + 0.5),
          Physijs.createMaterial (
            new THREE.MeshLambertMaterial ({color: 0xFFFFFF * Math.random()}), 
            0.5, 0.7),
          1.0
        );    
        this.spheres.push(element);
        this.todos.push(element);
      }
      element.position.set (Math.random()*10-5, Math.random()*4+10, Math.random()*10-5);
      element.rotation.set (Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);
      
      // Las figuras con física deben estar DIRECTAMENTE colgadas en la escena.
      this.add (element);
      
    }
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (20, 10, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new THREE.TrackballControls (this.camera, this.renderer.domElement);
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createGround () {
    var geometry = new THREE.BoxGeometry (50,0.2,50);
    geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,-0.1,0));
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var material = new THREE.MeshPhongMaterial ({map: texture});
    var materialDark = new THREE.MeshPhongMaterial ({map: texture, color: 0xbfbfbf});
    var physiMaterial = Physijs.createMaterial (material, 1, 0.1);
    var physiMaterialDark = Physijs.createMaterial (materialDark, 0.2, 0.5);
    var ground = new Physijs.BoxMesh (geometry, physiMaterial, 0);

    // Un par de paredes al suelo
    geometry = new THREE.BoxGeometry (50, 1, 0.2);
    geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,0.5,0));
    var physiPared = new Physijs.BoxMesh (geometry,physiMaterial,0);
    physiPared.position.z = 25;
    ground.add (physiPared);
    
    physiPared = new Physijs.BoxMesh (geometry,physiMaterial,0);
    physiPared.position.z = -25;
    ground.add (physiPared);
    
    this.add (ground);
    
    
    // La pieza péndulo
    // El colgador
    geometry = new THREE.SphereGeometry (0.5);
    var ref = new Physijs.SphereMesh (
      geometry, physiMaterialDark, 0
    );
    ref.colisionable = false;
    ref.position.set (0,6,0);
    this.add (ref);
    // Lo cogado
    geometry = new THREE.BoxGeometry (1,5,1);
    var twist = new Physijs.BoxMesh (
      geometry, physiMaterialDark, 25
    );
    twist.colisionable = false;
    twist.position.set (ref.position.x,ref.position.y-3,ref.position.z);
    this.add (twist);
    var constraint = new Physijs.ConeTwistConstraint (
      twist, ref, ref.position
    );
    this.addConstraint (constraint);
    constraint.setLimit (Math.PI/2, 0, Math.PI/2);
  }
  
  createGUI () {
    // Se crea una interfaz gráfica de usuario vacia
    var gui = new dat.GUI();
  
    var that = this;
    // Se definen los controles que se modificarán desde la GUI
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = new function() {
      // En el contexto de una función   this   alude a la función
      this.lightIntensity = 0.5;
      this.brake = true;
      this.boxesUp = function () {
        that.todos.forEach (function (element) {
          element.position.set (Math.random()*10-5, Math.random()*4+10, Math.random()*10-5);
          element.rotation.set (Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2); 
          element.setLinearVelocity (new THREE.Vector3());
          element.__dirtyPosition = true;
          element.__dirtyRotation = true;
          element.material.wireframe = false;
        });
      }
    }

    // Accedemos a la variable global   gui   declarada en   script.js   para añadirle la parte de interfaz que corresponde a los elementos de esta clase
    
    gui.add (this.guiControls, 'boxesUp').name ('[Cajas Arriba]');
    gui.add (this.guiControls, 'brake').name ('Frenar esferas');
    
    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
//     this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  update () {
    // Se solicita que La próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
    // La propia función render es la que indica que quiere ejecutarse la proxima vez
    // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
    requestAnimationFrame(() => this.update());
    
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    this.spotLight.intensity = this.guiControls.lightIntensity;
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    if (this.guiControls.brake) {
      var velocity = null;
      this.spheres.forEach (function (e) {
        velocity = e.getAngularVelocity();
        e.setAngularVelocity (velocity.multiplyScalar(MyPhysiScene.BRAKE));
      });
    }
    
    // Se actualiza el coche
    this.car.update();
    
    // Se le pide al motor de física que actualice las figuras según sus leyes
    this.simulate ();

    // Por último, se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
    this.renderer.render(this, this.getCamera());
  }
}

MyPhysiScene.MAXBOXES=20;
MyPhysiScene.PROBBOX=0.5;
MyPhysiScene.BRAKE=0.95; // En cada frame se reduce la velocidad angular de las esferas un 5%

/// La función principal
$(function () {
  
  // Se crea la escena
  var scene = new MyPhysiScene ("#WebGL-output");
  
  // listeners
  // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Se añaden listeners para el teclado para el control del coche
  window.addEventListener ("keydown", () => scene.onKeyDown(event));
  window.addEventListener ("keyup",   () => scene.onKeyUp(event));
  
  // Finalmente, realizamos el primer renderizado.
  scene.update();
});

