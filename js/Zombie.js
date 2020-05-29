class Zombie {
  //Necesitamos la escena, el generador al que pertenece, su indice, y una referencia al personaje principal
  constructor(scene, generador, index, prota) {
    this.scene = scene;
    this.generador = generador;
    this.index = index;
    this.prota = prota;

    //Aspecto del zombie
    this.createZombie();

    //Caja fisica del zombie
    var containerGeometry = new THREE.BoxGeometry(3, 7.8, 3);
    this.box_container = new Physijs.BoxMesh(
      containerGeometry,
      new THREE.MeshBasicMaterial({ wireframe: false, opacity: 0.0, transparent: true }),
      1
    );

    //Añadir el aspecto a la caja fisica
    this.box_container.add(this.meshProta);
    //Posicionar la caja fisica en la posicion del generador
    this.box_container.position.set(generador.x, 4.5, generador.z);
    this.box_container.__dirtyPosition = true;

    //Establecer las variables a la caja fisica
    this.box_container.generador = generador;
    this.box_container.index = index;
    this.box_container.eliminado = false;

    //Añadir la caja a la escena
    scene.add(this.box_container);

    //Variable que controla la animacion
    this.animando = false;
  }

  //Funcion que crea el aspecto fisico del zombie
  createZombie() {
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    this.meshProta = new THREE.Object3D();
    var cabeza = new THREE.BoxGeometry(1, 1, 1);
    cabeza.translate(0, 7, 0);
    var cuerpo = new THREE.BoxGeometry(2, 4, 0.8);
    cuerpo.translate(0, 4.5, 0);
    var piernaI = new THREE.BoxGeometry(0.4, 3, 0.4);
    piernaI.translate(0, -1.5, 0);
    var piernaD = new THREE.BoxGeometry(0.4, 3, 0.4);
    piernaD.translate(0, -1.5, 0);
    var brazoI = new THREE.BoxGeometry(0.4, 3, 0.4);
    brazoI.translate(0, -1.5, 0);
    //brazoI.rotateZ(-0.2);
    brazoI.rotateX(Math.PI / 2);
    var brazoD = new THREE.BoxGeometry(0.4, 3, 0.4);
    brazoD.translate(0, -1.5, 0);
    //brazoD.rotateZ(0.2);
    brazoD.rotateX(Math.PI / 2);

    this.brazoD_ = new THREE.Mesh(brazoD, material);
    this.brazoI_ = new THREE.Mesh(brazoI, material);

    this.brazoDM = new THREE.Object3D();
    this.brazoDM.add(this.brazoD_);
    this.brazoDM.position.set(1, 6.5, 0);

    this.brazoIM = new THREE.Object3D();
    this.brazoIM.add(this.brazoI_);
    this.brazoIM.position.set(-1, 6.5, 0);

    this.piernaD_ = new THREE.Mesh(piernaD, material);
    this.piernaI_ = new THREE.Mesh(piernaI, material);

    this.piernaDM = new THREE.Object3D();
    this.piernaDM.add(this.piernaD_);
    this.piernaDM.position.set(0.6, 3, 0);

    this.piernaIM = new THREE.Object3D();
    this.piernaIM.add(this.piernaI_);
    this.piernaIM.position.set(-0.6, 3, 0);

    //Crear los mesh
    this.cabezaM = new THREE.Mesh(cabeza, material);
    this.cuerpoM = new THREE.Mesh(cuerpo, material);


    this.meshProta.add(this.cabezaM);
    this.meshProta.add(this.cuerpoM);
    this.meshProta.add(this.piernaDM);
    this.meshProta.add(this.piernaIM);
    this.meshProta.add(this.brazoDM);
    this.meshProta.add(this.brazoIM);

    this.meshProta.position.set(0, -3.9, 0);
  }

  //Animacion del zombie
  animar() {
    var origen1 = { p: 0 };
    var destino1 = { p: Math.PI / 4 };
    var that = this;
    //Primera parte de la animacion
    var movimiento1 = new TWEEN.Tween(origen1)
      .to(destino1, 500)
      .yoyo(true)
      .repeat(1)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function (value) {
        //Brazo d
        that.brazoD_.rotation.x = origen1.p / 3;
        that.brazoI_.rotation.x = -origen1.p / 3;

        that.piernaD_.rotation.x = -origen1.p;
        that.piernaI_.rotation.x = origen1.p;
      })
      .onComplete(function (value) {
        movimiento2.start();
      });


    var origen2 = { p: 0 };
    var destino2 = { p: -Math.PI / 4 };
    var movimiento2 = new TWEEN.Tween(origen2)
      .to(destino2, 500)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function (value) {
        //Brazo d
        that.brazoD_.rotation.x = origen2.p / 3;
        that.brazoI_.rotation.x = -origen2.p / 3;

        that.piernaD_.rotation.x = -origen2.p;
        that.piernaI_.rotation.x = origen2.p;
      })
      .yoyo(true)
      .repeat(1)
      .onComplete(function () {
        that.animando = false;
      });

    movimiento1.start();
  }

  update() {

    //Calcular el angulo para mirar siempre hacia el protagonista
    this.meshProta.rotation['y'] = 0;
    var vector1 = new THREE.Vector3(0, 0, -1);
    var protaPos = this.prota.box_container.position;
    var zombiePos = this.box_container.position;

    var vector2 = new THREE.Vector3(protaPos['x'] - zombiePos['x'], protaPos['y'] - zombiePos['y'], protaPos['z'] - zombiePos['z']);

    var parteAbajo = (Math.sqrt(vector1['x'] * vector1['x'] + vector1['z'] * vector1['z']) * Math.sqrt(vector2['x'] * vector2['x'] + vector2['z'] * vector2['z']));
    var cos_angulo = (vector1['x'] * vector2['x'] + vector1['z'] * vector2['z']) / parteAbajo;

    var angulo = Math.acos(cos_angulo);
    if (protaPos['x'] > zombiePos['x']) {
      angulo = -angulo;
    }

    //Establecer la rotación
    this.meshProta.rotation['y'] = angulo;




    //Programar el movimiento
    if (this.prota.box_container.position.x > this.box_container.position.x) {
      var pos = this.box_container.position;
      pos['x'] += 0.05;
      this.box_container.__dirtyPosition = true;
    }
    else if (this.prota.box_container.position.x < this.box_container.position.x) {
      var pos = this.box_container.position;
      pos['x'] -= 0.05;
      this.box_container.__dirtyPosition = true;
    }

    if (this.prota.box_container.position.z > this.box_container.position.z) {
      var pos = this.box_container.position;
      pos['z'] += 0.05;
      this.box_container.__dirtyPosition = true;
    }
    else if (this.prota.box_container.position.z < this.box_container.position.z) {
      var pos = this.box_container.position;
      pos['z'] -= 0.05;
      this.box_container.__dirtyPosition = true;
    }

    //Evitar que se desestabilice el zombie
    this.box_container.rotation['x'] = 0;
    this.box_container.rotation['z'] = 0;
    this.box_container.rotation['y'] = 0;
    this.box_container.__dirtyRotation = true;

    //Control de la animación
    if (this.animando == false) {
      this.animando = true;
      this.animar();
    }

  }
}
