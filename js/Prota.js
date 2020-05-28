class Prota {
    // Parámetros:
    // scene, la escena
    // sc, la escala del coche
    // x, z,  la posición donde se crea
    constructor(scene) {
      //Creamos al personaje
      this.scene = scene;
      this.vida = 100;
      this.vel_powerup = 2;
      this.createProta();
      var containerGeometry = new THREE.BoxGeometry( 3, 7.8, 3 );

      this.box_container = new Physijs.BoxMesh(
        containerGeometry,
        //new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
        // Uncomment the next line to see the wireframe of the container shape
        new THREE.MeshBasicMaterial({ wireframe: true, opacity: 0.5 }), 1
      );

      this.box_container.add(this.meshProta);
      this.box_container.position.set(0,4.5,0);
      this.box_container.__dirtyPosition = true;
      // Assuming your model has already been imported
      
      scene.add(this.box_container);
      this.forward = false;
      this.backward = false;
      this.right = false;
      this.left = false;

      this.animando=false;
      this.box_container.prota = true;

      //Colisiones
      /*
      var that = this;
      this.box_container.addEventListener('collision', function(objeto, v, r, n) {
            if (objeto.index > -1){
                //Se le quita vida al protagonista
                console.log("TOCADO");
                that.vida -= 20;
            }
            
            
        })
        */
    }

    disparar (punto) {

      //Generar una bala y lanzarla hacia el punto
      //Direccion de la bala:
      var direccion = new THREE.Vector3(punto['x'] - this.box_container.position['x'], 0, punto['z'] - this.box_container.position['z']);
      var bala = new Bala(this.scene, direccion, this);
      //bala.disparar();

    }

    createProta() {
      var material = new THREE.MeshNormalMaterial();
      this.meshProta = new THREE.Object3D();
      var cabeza = new THREE.BoxGeometry(1,1,1);
      cabeza.translate(0,7,0);
      var cuerpo = new THREE.BoxGeometry(2,4,0.8);
      cuerpo.translate(0,4.5,0);
      var piernaI = new THREE.BoxGeometry(0.4,3,0.4);
      piernaI.translate(0,-1.5,0);
      var piernaD = new THREE.BoxGeometry(0.4,3,0.4);
      piernaD.translate(0,-1.5,0);
      var brazoI = new THREE.BoxGeometry(0.4,3,0.4);
      brazoI.translate(0, -1.5, 0);
      brazoI.rotateZ(-0.2);
      var brazoD = new THREE.BoxGeometry(0.4,3,0.4);
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

      this.meshProta.position.set(0,-3.9,0);
    }
    
    animar(){
      var origen1 = {p:0};
      var destino1 = {p:Math.PI/4};
      var that = this;
      //Primera parte de la animacion
      var movimiento1 = new TWEEN.Tween(origen1)
      .to(destino1, 200)
      .yoyo(true)
      .repeat(1)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function(value){
          //Brazo d
          that.brazoD_.rotation.x = origen1.p;
          that.brazoI_.rotation.x = -origen1.p

          that.piernaD_.rotation.x = -origen1.p;
          that.piernaI_.rotation.x = origen1.p
      })
      .onComplete(function(value){
        movimiento2.start();
      });
      

      var origen2 = {p:0};
      var destino2 = {p:-Math.PI/4};

      var movimiento2 = new TWEEN.Tween(origen2)
      .to(destino2, 200)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function(value){
        //Brazo d
        that.brazoD_.rotation.x = origen2.p;
        that.brazoI_.rotation.x = -origen2.p

        that.piernaD_.rotation.x = -origen2.p;
        that.piernaI_.rotation.x = origen2.p;
      })
      .yoyo(true)
      .repeat(1)
      .onComplete(function(){
        that.animando = false;
      });

      movimiento1.start();



    }
    
      
    update() {
      //Metodo que actualiza
      if (this.forward) {
        var pos = this.box_container.position;
        pos['z'] -= 0.1 * this.vel_powerup;
        this.box_container.__dirtyPosition = true;  
        if(this.meshProta.rotation['y'] < 0){
          this.meshProta.rotation['y'] += 0.1
        }
        if(this.meshProta.rotation['y'] > 0){
          this.meshProta.rotation['y'] -= 0.1
        }
      }

      if (this.backward) {
        var pos = this.box_container.position;
        pos['z'] += 0.1 * this.vel_powerup;
        this.box_container.__dirtyPosition = true; 
        if(this.meshProta.rotation['y'] < 0){
          this.meshProta.rotation['y'] += 0.1
        }
        if(this.meshProta.rotation['y'] > 0){
          this.meshProta.rotation['y'] -= 0.1
        }           
      }
      
      if (this.right) {
        var pos = this.box_container.position;
        pos['x'] += 0.1 * this.vel_powerup; 
        this.box_container.__dirtyPosition = true; 
        if(this.meshProta.rotation['y'] > -Math.PI/2){
          this.meshProta.rotation['y'] -= 0.1
        }
        
      } 
      else if (this.left) {
        var pos = this.box_container.position;
        pos['x'] -= 0.1 * this.vel_powerup;
        this.box_container.__dirtyPosition = true; 
        if(this.meshProta.rotation['y'] < Math.PI/2){
          this.meshProta.rotation['y'] += 0.1
        }
      }
      this.box_container.rotation['x'] = 0;
      this.box_container.rotation['z'] = 0;
      this.box_container.rotation['y'] = 0;   
      this.box_container.__dirtyRotation = true;

      //Eliminar inercia

      var velocidadNula = new THREE.Vector3(0,0,0);
      this.box_container.setLinearVelocity(velocidadNula);

      if((this.backward || this.forward || this.left || this.right) && this.animando==false){
        this.animando = true;
        this.animar();
      }

      if(this.vida <= 0){
        console.log("MATAO");
      }
        
    }
  }
  