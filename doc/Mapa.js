class Mapa {
    constructor(scene) {

        //Definir los materiales que se van a usar
        var texture = new THREE.TextureLoader().load('../imgs/cemento.jpg');
        var material = new THREE.MeshPhongMaterial({ map: texture });
        var materialDark = new THREE.MeshPhongMaterial({ map: texture, color: 0xbfbfbf });
        var physiMaterial = Physijs.createMaterial(material, 1, 0.1);
        var physiMaterialDark = Physijs.createMaterial(materialDark, 0.2, 0.5);
        var material_transparent = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 })
        var physiMaterial_transparent = Physijs.createMaterial(material_transparent, 1, 0.1);
        var material_ = new THREE.MeshBasicMaterial({ color: 0x000000 })
        var physiMaterial_ = Physijs.createMaterial(material_, 1, 0.1);

        //Crear el suelo
        var geometry = new THREE.BoxGeometry(200, 0.2, 200);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.1, 0));
        this.ground = new Physijs.BoxMesh(geometry, physiMaterial, 0);


        //Paredes alrededor del mapa
        //Pared SUR
        geometry = new THREE.BoxGeometry(205, 30, 5);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 0));
        var physiPared = new Physijs.BoxMesh(geometry, physiMaterial_transparent, 0);
        physiPared.position.z = 100;
        this.ground.add(physiPared);

        //Pared NORTE
        physiPared = new Physijs.BoxMesh(geometry, physiMaterial_, 0);
        physiPared.position.z = -100;
        this.ground.add(physiPared);


        //Pared ESTE
        var geometry1 = new THREE.BoxGeometry(205, 30, 5);
        geometry1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 0));
        geometry1.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
        physiPared = new Physijs.BoxMesh(geometry1, physiMaterial_transparent, 0);
        physiPared.position.x = 100;
        this.ground.add(physiPared);

        //Pared OESTE
        physiPared = new Physijs.BoxMesh(geometry1, physiMaterial_, 0);
        physiPared.position.x = -100;
        this.ground.add(physiPared);

        //Crear los muros aleatorios
        this.createMuros(this.ground, physiMaterialDark);


        scene.add(this.ground);



    }

    //Funcion que crea los muros de manera aleatoria
    createMuros(ground, material) {
        //Muros de frente
        var geometry = new THREE.BoxGeometry(30, 10, 3);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1.5, 0));
        for (var i = 0; i < 15; i++) {
            var physiMuro = new Physijs.BoxMesh(geometry, material, 0);
            physiMuro.position.x = Math.floor(Math.random() * 170) - 85;
            physiMuro.position.z = Math.floor(Math.random() * 170) - 85;
            ground.add(physiMuro);
        }

        //Muros de lado
        var geometry1 = new THREE.BoxGeometry(30, 10, 3);
        geometry1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1.5, 0));
        geometry1.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
        for (var i = 0; i < 15; i++) {
            var physiMuro = new Physijs.BoxMesh(geometry1, material, 0);
            physiMuro.position.x = Math.floor(Math.random() * 170) - 85;
            physiMuro.position.z = Math.floor(Math.random() * 170) - 85;
            ground.add(physiMuro);
        }
    }
}
