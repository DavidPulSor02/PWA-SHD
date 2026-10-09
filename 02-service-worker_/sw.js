const CACHE_NAME = 'app-v1'; // Guadar las cosas elementales de la web  APP SHELL




self.addEventListener('install', e => {


    const cacheProm = caches.open(CACHE_NAME)
        .then(cache => {

            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js',
               
            ]);


        });



    e.waitUntil(Promise.all([cacheProm]));

});


self.addEventListener('activate', e => {
    // Borrado del cache 
    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            // static-v4
            if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                return caches.delete(key);
            }

        });

    });



    e.waitUntil(respuesta);


});





self.addEventListener('fetch', e => {

    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if (res) {
                    return res;
                } else {
                    return fetch(e.request);
                }

            })
    );
    // // 2. Cache con ayuda de la Red 

         const respuesta =   caches.match( e.request )
         .then(res =>{
             if (res) return res
    //         // No existe el archivo 
    //         // tengo que ir a la red 

           console.log('No existe :',e.request.url)

           return fetch(e.request).then( newResp=>{

               caches.open(CACHE_STATIC_NAME).then(
                    cache=>{
                        cache.put(e.request, newResp )
                    }
                )
                return newResp.clone()
             }

             )


         }) 

     e.respondWith(respuesta)


});