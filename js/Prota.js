class Prota {
  //Necesitamos la escena
  constructor(scene) {
    this.scene = scene;
    //Vida del personaje
    this.vida = 100;
    this.vel_powerup = 2;

    //Aspecto del personaje
    this.createProta();

    //Caja fisica del personaje
    var containerGeometry = new THREE.BoxGeometry(3, 7.8, 3);
    this.box_container = new Physijs.BoxMesh(
      containerGeometry,
      new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.0, transparent: true }),
      1
    );

    //Añadir el aspecto a la caja fisica
    this.box_container.add(this.meshProta);
    //Posicionar la caja fisica
    this.box_container.position.set(0, 4.5, 0);
    this.box_container.__dirtyPosition = true;

    //Añadir la caja a la escena
    scene.add(this.box_container);

    //Variables que controlan el movimiento
    this.forward = false;
    this.backward = false;
    this.right = false;
    this.left = false;

    //Variable que controla la animacion
    this.animando = false;

    //Variable auxiliar que establece que este es el personaje principal
    this.box_container.prota = true;

    //Colisiones
    var that = this;
    this.box_container.addEventListener('collision', function (objeto, v, r, n) {
      if (objeto.index > -1) {
        //Se le quita vida al protagonista
        that.vida -= 20;
      }
    });
  }

  //Funcion que dispara una bala dado un punto hacia el que disparar
  disparar(punto) {
    //Generar una bala y lanzarla hacia el punto
    //Calcular direccion de la bala:
    var direccion = new THREE.Vector3(punto['x'] - this.box_container.position['x'], 0, punto['z'] - this.box_container.position['z']);
    //Crear la bala
    var bala = new Bala(this.scene, direccion, this);
    //Disparar
    bala.disparar();

  }

  //Crear el aspecto del personaje
  createProta() {
    var material = new THREE.MeshPhongMaterial({ color: 0x1357a6 });
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
    brazoI.rotateZ(-0.2);
    var brazoD = new THREE.BoxGeometry(0.4, 3, 0.4);
    brazoD.translate(0, -1.5, 0);
    brazoD.rotateZ(0.2);

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

  //Animaciones del personaje
  animar() {
    var origen1 = { p: 0 };
    var destino1 = { p: Math.PI / 4 };
    var that = this;
    //Primera parte de la animacion
    var movimiento1 = new TWEEN.Tween(origen1)
      .to(destino1, 200)
      .yoyo(true)
      .repeat(1)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function (value) {
        //Brazo d
        that.brazoD_.rotation.x = origen1.p;
        that.brazoI_.rotation.x = -origen1.p

        that.piernaD_.rotation.x = -origen1.p;
        that.piernaI_.rotation.x = origen1.p
      })
      .onComplete(function (value) {
        movimiento2.start();
      });


    var origen2 = { p: 0 };
    var destino2 = { p: -Math.PI / 4 };

    var movimiento2 = new TWEEN.Tween(origen2)
      .to(destino2, 200)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function (value) {
        //Brazo d
        that.brazoD_.rotation.x = origen2.p;
        that.brazoI_.rotation.x = -origen2.p

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

  //Metodo que actualiza
  update() {
    //Control del movimiento del personaje
    //Hacia delante
    if (this.forward) {
      var pos = this.box_container.position;
      pos['z'] -= 0.1 * this.vel_powerup;
      this.box_container.__dirtyPosition = true;
      if (this.meshProta.rotation['y'] < 0) {
        this.meshProta.rotation['y'] += 0.1
      }
      if (this.meshProta.rotation['y'] > 0) {
        this.meshProta.rotation['y'] -= 0.1
      }
    }
    //Hacia detras
    if (this.backward) {
      var pos = this.box_container.position;
      pos['z'] += 0.1 * this.vel_powerup;
      this.box_container.__dirtyPosition = true;
      if (this.meshProta.rotation['y'] < 0) {
        this.meshProta.rotation['y'] += 0.1
      }
      if (this.meshProta.rotation['y'] > 0) {
        this.meshProta.rotation['y'] -= 0.1
      }
    }
    //Hacia la izquierda
    if (this.right) {
      var pos = this.box_container.position;
      pos['x'] += 0.1 * this.vel_powerup;
      this.box_container.__dirtyPosition = true;
      if (this.meshProta.rotation['y'] > -Math.PI / 2) {
        this.meshProta.rotation['y'] -= 0.1
      }

    }
    //Hacia la derecha
    else if (this.left) {
      var pos = this.box_container.position;
      pos['x'] -= 0.1 * this.vel_powerup;
      this.box_container.__dirtyPosition = true;
      if (this.meshProta.rotation['y'] < Math.PI / 2) {
        this.meshProta.rotation['y'] += 0.1
      }
    }

    //Evitar que el personaje se desestabilice
    this.box_container.rotation['x'] = 0;
    this.box_container.rotation['z'] = 0;
    this.box_container.rotation['y'] = 0;
    this.box_container.__dirtyRotation = true;

    //Eliminar inercia para un mejor control
    var velocidadNula = new THREE.Vector3(0, 0, 0);
    this.box_container.setLinearVelocity(velocidadNula);

    //Control de animaciones
    if ((this.backward || this.forward || this.left || this.right) && this.animando == false) {
      this.animando = true;
      this.animar();
    }

    //Control de la vida del personaje
    if (this.vida <= 0) {
      this.scene.t_vida.innerHTML = this.vida;
      if (!alert('Te han matado! ¿Quieres jugar de nuevo?')) { window.location.reload(); }
    }

  }
}
