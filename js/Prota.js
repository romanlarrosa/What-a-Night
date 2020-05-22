class Prota {
    // Parámetros:
    // scene, la escena
    // sc, la escala del coche
    // x, z,  la posición donde se crea
    constructor(scene) {
      //Creamos al personaje
      this.createProta();
      var containerGeometry = new THREE.CubeGeometry( 3, 7.8, 0.8 );

      this.box_container = new Physijs.BoxMesh(
        containerGeometry,
        //new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
        // Uncomment the next line to see the wireframe of the container shape
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 }), 0
    );

    this.constraint = new Physijs.SliderConstraint (
      this.box_container, scene.ground, this.box_container.position, new THREE.Vector3 (Math.PI/2,0,0));
    // DESPUES, se añade la restriccion a la escena
    scene.addConstraint (this.constraint);
    // FINALMENTE, se configura
    //constraint.setLimits (-10,10,0,0);
    

    this.box_container.add(this.meshProta);
    this.box_container.position.set(0,4,0);
    // Assuming your model has already been imported
    
    scene.add(this.box_container);
    this.forward = false;
    this.backward = false;
    this.right = false;
    this.left = false;


      
    }

    createProta() {
      var material = new THREE.MeshNormalMaterial();
      this.meshProta = new THREE.Object3D();
      var cabeza = new THREE.BoxGeometry(1,1,1);
      cabeza.translate(0,7,0);
      var cuerpo = new THREE.BoxGeometry(2,4,0.8);
      cuerpo.translate(0,4.5,0);
      var piernaI = new THREE.BoxGeometry(0.4,3,0.4);
      piernaI.translate(-0.6,1.5,0);
      var piernaD = new THREE.BoxGeometry(0.4,3,0.4);
      piernaD.translate(0.6,1.5,0);
      var brazoI = new THREE.BoxGeometry(0.4,3,0.4);
      brazoI.translate(-1.5,1.5,0);
      brazoI.rotateZ(-0.2);
      brazoI.translate(0, 3,0);

      var brazoD = new THREE.BoxGeometry(0.4,3,0.4);
      brazoD.translate(1.5,1.5,0);
      brazoD.rotateZ(0.2);
      brazoD.translate(0, 3,0);
      //brazoD.translate(0.6,1.5 + 4,0);

      this.meshProta.add(new THREE.Mesh(cabeza, material));
      this.meshProta.add(new THREE.Mesh(cuerpo, material));
      this.meshProta.add(new THREE.Mesh(piernaD, material));
      this.meshProta.add(new THREE.Mesh(piernaI, material));
      this.meshProta.add(new THREE.Mesh(brazoD, material));
      this.meshProta.add(new THREE.Mesh(brazoI, material));

      this.meshProta.position.set(0,-3.9,0);
    }
    
    createGUI(gui) {
      
    }
    
      
    update() {
      
      //Metodo que actualiza
      if (this.forward) {
        console.log("HACIA DELANTE");
        var fuerza = 100;
        var direccion = new THREE.Vector3(1,0,0);

        var effect = direccion.normalize().multiplyScalar(fuerza);
        this.box_container.applyCentralImpulse(effect);
        
      } else if (!this.forward && !this.backward) {
        
                   
      }else if (this.backward) {
        // Se quiere ir hacia atrás. Se habilita un motor angular para las ruedas motrices
        // Y en el eje 2 (el eje Z), con un límite inferior más alto que el superior
        // Solo cambia el signo de la velocidad
                   
      }


      if (!(this.forward || this.backward)) {
        // Si no se está acelerando, ya sea hacia adelante o hacia atrás
        // Se apagan los motores de las 2 ruedas
        
        
      }
      
      if ((this.right && this.left) || !(this.right || this.left)) {
        // Si se pulsan a la vez los cursores derecha e izquierda
        // O no se pulsa ninguno de los 2
        // Las ruedas directrices las dejamos rectas
        
      } else if (this.right) {
        // Si no, se cambian los límites angulares en el Eje Y 
        // para que las ruedas estén giradas medio radián hacia uno u otro lado
        // segun corresponda
        
      } else if (this.left) {
         
      }
        
    }
  }
  