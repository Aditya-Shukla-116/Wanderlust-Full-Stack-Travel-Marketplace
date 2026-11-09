//Map Script Execution Layer 
   // 2. Mapbox requires the token to be set globally FIRST
    mapboxgl.accessToken = mapToken;

    // 3. Initialize and configure the canvas engine layout
    const map = new mapboxgl.Map({
        container: "map", // ADDED: Directs the canvas grid map to paint inside your #map div element box
        style: 'mapbox://styles/mapbox/standard', 
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: list.geometry.coordinates // center the map on this longitude and latitude 
    });

    // map.addControl(new mapboxgl.NavigationControl());
    // map.scrollZoom.disable();

    // map.on('style.load', () => {
    //     map.setFog({}); 
    // });

    //Create a default Marker and add it to the map.
      const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(list.geometry.coordinates) //Liating.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${list.title}</h4><p>Exact location will be provided after booking!<p>`)
        .setMaxWidth("300px"))
        .addTo(map);

  
