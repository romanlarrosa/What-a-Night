 
class Car {
  // Parámetros:
  // scene, la escena
  // sc, la escala del coche
  // x, z,  la posición donde se crea
  constructor(scene,sc,x,z) {
    var car_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0xff4444, opacity: 0.9, transparent: true }),
            .9, // alta friccion
            .9 // alto rebote
    );

    // se crea el cuerpo del coche
    var geom = new THREE.CubeGeometry(15*sc, 4*sc, 4*sc);
    var body = new Physijs.BoxMesh(geom, car_material, 5);
    body.position.set(5*sc+x, 5*sc, 5*sc+z);
    
    // se añade el cuerpo a la escena
    scene.add(body);
    
    // se crean las ruedas
    
    // fr, front right
    // fl, front left
    // rr, rear right
    // rl, rear left
    var fr = this.createWheel(new THREE.Vector3(0+x, 4*sc, 10*sc+z),sc);
    var fl = this.createWheel(new THREE.Vector3(0+x, 4*sc, 0+z),sc);
    var rr = this.createWheel(new THREE.Vector3(10*sc+x, 4*sc, 10*sc+z),sc);
    var rl = this.createWheel(new THREE.Vector3(10*sc+x, 4*sc, 0+z),sc);

    // se añaden las ruedas a la escena
    scene.add(fr);
    scene.add(fl);
    scene.add(rr);
    scene.add(rl);
    
    // PRIMERO, se han añadido las figuras a la escena
    // SEGUNDO, se construyen las restricciones 
    // TERCERO, se añaden las restricciones a la escena

    var frConstraint = this.createWheelConstraint(fr, body);
    scene.addConstraint(frConstraint);

    var flConstraint = this.createWheelConstraint(fl, body);
    scene.addConstraint(flConstraint);

    var rrConstraint = this.createWheelConstraint(rr, body);
    scene.addConstraint(rrConstraint);

    var rlConstraint = this.createWheelConstraint(rl, body);
    scene.addConstraint(rlConstraint);

    // CUARTO, se configuran las restricciones
    
    // Se restringen los giros en los ejes X e Y de las ruedas, 
    // Con respecto al eje Z, el de giro natural de las ruedas, al ser el 
    // límite inferior más alto que el superior, le estamos diciendo que se permite
    // cualquier giro en ese eje.

    rrConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
    rrConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    rlConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
    rlConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

    frConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
    frConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    flConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
    flConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    
    // Guardamos referencias en atributos para usarlas desde otros métodos
   
    this.frConstraint = frConstraint;
    this.flConstraint = flConstraint;
    this.rrConstraint = rrConstraint;
    this.rlConstraint = rlConstraint;

    this.fr = fr;
    this.fl = fl;
    this.rr = rr;
    this.rl = rl;
    
    this.forward = false;
    this.backward = false;
    this.right = false;
    this.left = false;
    
    this.createGUI(scene.gui);
    
    this.zeroSpeed = new THREE.Vector3();
  }
  
  createGUI(gui) {
    // La parte de la interfaz de usuario para el coche.
    this.controls = new function() {
      this.speed = 3;     // La velocidad cuando se pulsen las teclas del cursor
      this.torque = 0.5;
      // Significado de this.brake
      // Si true, no acelerar significa frenar
      // Si false, no acelerar significa continuar moviéndose por la inercia
      this.brake = false;   
    }
    gui.add (this.controls, 'speed', 1, 10, 1).name('Velocidad:');
    gui.add (this.controls, 'torque', 0, 1, 0.1).name('Fuerza:');
    gui.add (this.controls, 'brake').name ('Frenar si no se acelera');
  }
  
  createWheel(position,sc) {
    // Se construye una rueda física y se devuelve
    // Se recibe la posición y la escala
    
    var wheel_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x444444, opacity: 0.9, transparent: true }),
            1, // alta fricción
            .5 // rebote medio
    );

    var wheel_geometry = new THREE.CylinderGeometry(4*sc, 4*sc, 2*sc, 10);
    var wheel = new Physijs.CylinderMesh(
            wheel_geometry,
            wheel_material,
            1
    );

    wheel.rotation.x = Math.PI / 2;
    wheel.position.copy(position);
    return wheel;
  }
  
  createWheelConstraint(wheel, body) {
    // Se construye la restricción de la rueda y se devuelve
    // Se recibe una rueda y el cuerpo del coche
    var constraint = new Physijs.DOFConstraint(
            wheel, body, wheel.position);

    return constraint;
  }
    
  update() {
    if (this.forward) {
      // Se quiere ir hacia adelante. Se habilita un motor angular para las ruedas motrices
      // Y en el eje 2 (el eje Z), con un límite inferior más alto que el superior
      this.rlConstraint.configureAngularMotor(2, 0.1, 0, this.controls.speed, this.controls.torque);
      this.rrConstraint.configureAngularMotor(2, 0.1, 0, this.controls.speed, this.controls.torque);
      this.rlConstraint.enableAngularMotor(2);
      this.rrConstraint.enableAngularMotor(2);      
    } else if (this.backward) {
      // Se quiere ir hacia atrás. Se habilita un motor angular para las ruedas motrices
      // Y en el eje 2 (el eje Z), con un límite inferior más alto que el superior
      // Solo cambia el signo de la velocidad
      this.rlConstraint.configureAngularMotor(2, 0.1, 0, -this.controls.speed, this.controls.torque);
      this.rrConstraint.configureAngularMotor(2, 0.1, 0, -this.controls.speed, this.controls.torque);
      this.rlConstraint.enableAngularMotor(2);
      this.rrConstraint.enableAngularMotor(2);            
    }
    if (!(this.forward || this.backward)) {
      // Si no se está acelerando, ya sea hacia adelante o hacia atrás
      // Se apagan los motores de las 2 ruedas
      this.rlConstraint.disableAngularMotor(2);
      this.rrConstraint.disableAngularMotor(2); 
      if (this.controls.brake) {
        // Si además está el freno habilidado
        // Frenamos deteniendo la velocidad angular de las 4 ruedas
        this.rr.setAngularVelocity (this.zeroSpeed);
        this.rl.setAngularVelocity (this.zeroSpeed);
        this.fr.setAngularVelocity (this.zeroSpeed);
        this.fl.setAngularVelocity (this.zeroSpeed);
      }
    }
    
    if ((this.right && this.left) || !(this.right || this.left)) {
      // Si se pulsan a la vez los cursores derecha e izquierda
      // O no se pulsa ninguno de los 2
      // Las ruedas directrices las dejamos rectas
      this.frConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
      this.frConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
      this.flConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
      this.flConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
    } else if (this.right) {
      // Si no, se cambian los límites angulares en el Eje Y 
      // para que las ruedas estén giradas medio radián hacia uno u otro lado
      // segun corresponda
      this.frConstraint.setAngularLowerLimit({ x: 0, y: -0.5, z: 0.1 });
      this.frConstraint.setAngularUpperLimit({ x: 0, y: -0.5, z: 0 });
      this.flConstraint.setAngularLowerLimit({ x: 0, y: -0.5, z: 0.1 });
      this.flConstraint.setAngularUpperLimit({ x: 0, y: -0.5, z: 0 });
    } else if (this.left) {
      this.frConstraint.setAngularLowerLimit({ x: 0, y: 0.5, z: 0.1 });
      this.frConstraint.setAngularUpperLimit({ x: 0, y: 0.5, z: 0 });
      this.flConstraint.setAngularLowerLimit({ x: 0, y: 0.5, z: 0.1 });
      this.flConstraint.setAngularUpperLimit({ x: 0, y: 0.5, z: 0 });      
    }
      
  }
}
