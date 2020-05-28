class Bala {
    constructor(scene, direccion, prota) {
        this.scene = scene;
        this.direccion = direccion;
        this.prota = prota;

        //Creamos la bala en si
        var geometry = new THREE.SphereGeometry(0.6, 32, 32);
        var material = new THREE.MeshPhongMaterial ({color: 0xa01414});
        var physiMaterial = Physijs.createMaterial (material, 1, 0.1);
        this.physiMesh = new Physijs.SphereMesh (geometry, physiMaterial, 0.9);


        //Añadimos los efectos de luz
        var pointlight = new THREE.PointLight(0xfcc92f, 1, 500);
        pointlight.position.set(0,3,0);
        this.physiMesh.add(pointlight)

        this.scene.add(this.physiMesh);
        //Posicionar la bala un poco desplazada hacia la direccion con respecto al personaje
        //(AUN NO FUNCIONA CORRECTAMENTE)
        this.physiMesh.position.set(this.prota.box_container.position['x'] + (direccion['x']/Math.abs(direccion['x']) * 1.5), 5, this.prota.box_container.position['z'] + (direccion['x']/Math.abs(direccion['x']) * 1.5));
        this.physiMesh.__dirtyPosition = true;
        this.disparar();
        

        var that = this;
        this.physiMesh.addEventListener('collision', function(objeto, v, r, n) {
            if (objeto.index > -1 ){                
                objeto.eliminado = true;
                that.scene.remove(objeto.generador.zombies[objeto.index].box_container);
                objeto.generador.zombies[objeto.index] = null;

                //Subir la puntuación
                that.scene.puntuacion++;
            }
            if (!objeto.prota){
                //console.log("Has acertado:" + objeto.index);
                that.scene.remove(that.physiMesh);
                that.physiMesh = null;
            }
            
            
        })

    }

    disparar() {
        var fuerza = 1000;
        var dir = new THREE.Vector3(1, 2, 3);
        var effect = this.direccion.normalize().multiplyScalar(100);
        this.physiMesh.applyCentralImpulse (effect);

    }
}