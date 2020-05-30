class Generador {
    //Necesitamos la escena, la posicion del generador, al personaje y el nivel con el que se inicia el generador
    constructor(scene, x, z, prota, nv) {

        this.prota = prota;
        //Array de zombies
        this.zombies = new Array();
        this.nivel = nv;
        this.x = x;
        this.z = z;
        this.scene = scene;
        //Indice de cada zombie
        this.index = 0;

        //Creamos el aspecto fisico del generador (esfera con textura)
        var texture = new THREE.TextureLoader().load('../imgs/circuit_texture.jpg');
        var material = new THREE.MeshPhongMaterial({ map: texture });
        var geometry = new THREE.SphereGeometry(3, 32, 32);
        geometry.rotateZ(Math.PI / 2);
        this.mesh = new THREE.Mesh(geometry, material);

        //Creamos un nodo donde irá el generador y la luz que emite
        var nodo = new THREE.Object3D();

        //Crear una luz puntual
        var pointlight = new THREE.PointLight(0x00bb2d, 1, 100);
        pointlight.position.set(0, 10, 0);
        nodo.add(pointlight);

        //Añadimos el generador al nodo
        nodo.add(this.mesh);
        nodo.position.set(x, 4, z);

        //Añadimos el nodo a la escena
        scene.add(nodo);
        this.tiempoAnterior = Date.now();
    }

    //Funcion que genera un zombie
    generarZombie() {
        //Crear un zombie
        var zombie = new Zombie(this.scene, this, this.index, this.prota);
        //Añadirlo al vector
        this.zombies.push(zombie);
        //Incrementar el indice
        this.index++;

    }

    update() {
        //Incrementa el nivel
        if (this.nivel < 10) {
            this.nivel += 0.0004;
        }

        //Genera un zombie cada 5 segundos
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;
        if (segundosTranscurridos > 5 / this.nivel) {
            this.generarZombie();
            this.tiempoAnterior = tiempoActual;
        }

        //Hace que la esfera del generador gire
        this.mesh.rotation.y += 0.01;

        //Actualizar todos los zombies asociados al generador
        for (let i = 0; i < this.zombies.length; i++) {
            if (this.zombies[i] != null)
                this.zombies[i].update();
        }

    }
}