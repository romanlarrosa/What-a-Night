class Mapa {
    constructor(scene) {
        var geometry = new THREE.BoxGeometry (200,0.2,200);
        geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,-0.1,0));
        var texture = new THREE.TextureLoader().load('../imgs/cemento.jpg');
        var material = new THREE.MeshPhongMaterial ({map: texture});
        var materialDark = new THREE.MeshPhongMaterial ({map: texture, color: 0xbfbfbf});
        var physiMaterial = Physijs.createMaterial (material, 1, 0.1);
        var physiMaterialDark = Physijs.createMaterial (materialDark, 0.2, 0.5);
        var ground = new Physijs.BoxMesh (geometry, physiMaterial, 0);

        var material_transparent = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 })
        var physiMaterial_transparent = Physijs.createMaterial (material_transparent, 1, 0.1);
        //Muros alrededor del mapa
        
        geometry = new THREE.BoxGeometry (205, 30, 5);
        geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,15,0));
        var physiPared = new Physijs.BoxMesh (geometry,physiMaterial_transparent,0);
        physiPared.position.z = 100;
        ground.add(physiPared);

        physiPared = new Physijs.BoxMesh (geometry,physiMaterial_transparent,0);
        physiPared.position.z = -100;
        ground.add (physiPared);


        var geometry1 = new THREE.BoxGeometry (205, 30, 5);
        geometry1.applyMatrix (new THREE.Matrix4().makeTranslation(0,15,0));
        geometry1.applyMatrix (new THREE.Matrix4().makeRotationY(Math.PI/2));
        physiPared = new Physijs.BoxMesh (geometry1,physiMaterial_transparent,0);
        physiPared.position.x = 100;
        ground.add(physiPared);

        physiPared = new Physijs.BoxMesh (geometry1,physiMaterial_transparent,0);
        physiPared.position.x = -100;
        ground.add (physiPared);
        
        //crear los muros
        this.createMuros(ground, physiMaterialDark);
        
        
        scene.add (ground);
        
     
     
    }

    createMuros(ground, material) {
        //Muros de frente
        var geometry = new THREE.BoxGeometry (30, 10,3);
        geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,1.5,0));
        for (let i = 0; i < 15; i++) {
            var physiMuro = new Physijs.BoxMesh (geometry,material,0);
            physiMuro.position.x = Math.floor(Math.random() * 170) - 85 ;
            physiMuro.position.z = Math.floor(Math.random() * 170) - 85 ;
            ground.add(physiMuro);     
        }

        //Muros de lado
        var geometry1 = new THREE.BoxGeometry (30, 10,3);
        geometry1.applyMatrix (new THREE.Matrix4().makeTranslation(0,1.5,0));
        geometry1.applyMatrix (new THREE.Matrix4().makeRotationY(Math.PI/2));
        for (let i = 0; i < 15; i++) {
            var physiMuro = new Physijs.BoxMesh (geometry1,material,0);
            physiMuro.position.x = Math.floor(Math.random() * 170) - 85 ;
            physiMuro.position.z = Math.floor(Math.random() * 170) - 85 ;
            ground.add(physiMuro);     
        }


        
        

    }
   
    update() {
      //Metodo que actualiza
      
        
    }
  }
  