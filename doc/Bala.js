class Bala {

    //Necesitamos la escena, la dirección hacia la que va la bala, y al personaje principal
    constructor(scene, direccion, prota) {
        this.scene = scene;
        this.direccion = direccion;
        this.prota = prota;

        //Creamos la bala
        var geometry = new THREE.SphereGeometry(0.6, 32, 32);
        var material = new THREE.MeshPhongMaterial({ color: 0xff1111 });
        var physiMaterial = Physijs.createMaterial(material, 1, 0.1);
        this.physiMesh = new Physijs.SphereMesh(geometry, physiMaterial, 0.9);

        //Añadimos la bala a la escena
        this.scene.add(this.physiMesh);
        //Posicionar la bala un poco desplazada hacia la direccion con respecto al personaje
        this.physiMesh.position.set(this.prota.box_container.position['x'] + (direccion['x'] / Math.abs(direccion['x']) * 1.5), 5, this.prota.box_container.position['z'] + (direccion['x'] / Math.abs(direccion['x']) * 1.5));
        this.physiMesh.__dirtyPosition = true;


        //Listeners de colisiones entre la bala y los zombies o cualquier otro objeto diferente del personaje principal
        var that = this;
        this.physiMesh.addEventListener('collision', function (objeto, v, r, n) {
            //Si el objeto es un zombie
            if (objeto.index > -1) {
                //Eliminamos al zombie
                objeto.eliminado = true;
                that.scene.remove(objeto.generador.zombies[objeto.index].box_container);
                objeto.generador.zombies[objeto.index] = null;

                //Subir la puntuación
                that.scene.puntuacion++;
            }
            //Siempre que el objeto no sea el personaje principal
            if (!objeto.prota) {
                //Eliminar la bala
                that.scene.remove(that.physiMesh);
                that.physiMesh = null;
            }


        })

    }

    //Funcion que provoca el impulso a la bala
    disparar() {
        //Se calcula el efecto con el que sale disparada la bala
        var effect = this.direccion.normalize().multiplyScalar(100);
        this.physiMesh.applyCentralImpulse(effect);

    }
}