class Generador {
    constructor(scene, x, z, prota, nv){

        this.prota = prota;
        this.zombies = new Array();
        this.nivel = nv;
        this.x = x;
        this.z = z;
        this.scene = scene;

        var texture = new THREE.TextureLoader().load('../imgs/circuit_texture.jpg');
        var material = new THREE.MeshPhongMaterial ({map: texture}); 
        var geometry = new THREE.SphereGeometry(3, 32, 32);
        geometry.rotateZ(Math.PI/2);
        this.mesh = new THREE.Mesh(geometry, material);

        var nodo = new THREE.Object3D();

        //Crear una luz puntual
        var pointlight = new THREE.PointLight(0x00bb2d, 1, 50);
        pointlight.position.set(0,0,0);
        nodo.add(pointlight); 

        nodo.add(this.mesh);
        nodo.position.set(x, 4, z);

        scene.add(nodo);
        this.tiempoAnterior = Date.now();
        
        this.index = 0;

    }

    generarZombie() {
        var zombie = new Zombie(this.scene, this, this.index, this.prota);
        this.zombies.push(zombie);
        this.index ++;

    }

    matar(index){
        this.zombies.splice(index, 1);
    }

    update() {

        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior)/1000;
        
        if(segundosTranscurridos > 5/this.nivel){
            console.log("Creo un zombie");
            this.generarZombie();
            this.tiempoAnterior = tiempoActual;
        }
        this.mesh.rotation.y += 0.01;

        //Actualizar todos los zombies
        for(let i=0; i<this.zombies.length; i++){
            this.zombies[i].update();
        }

    }
}