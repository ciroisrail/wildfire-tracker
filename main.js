import './style.css';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Point from 'ol/geom/Point';
import {Icon} from 'ol/style';

const center = fromLonLat([12.482778, 41.893056]);

const getPoints = () => {
    fetch('https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires')
    .then(response => response.json())
    .then(data => {
        const wildfirePoints = [];
        let wildfireCoordinates = [];
        for (let i = 0; i < data['events'].length; i++) {
            wildfireCoordinates[i] = data['events'][i]['geometry'][0]['coordinates'];
            wildfirePoints.push(wildfireCoordinates[i]);
        }
        const wildfireArray = [];
        //
        function wildfireFeatures() {
            for (let j = 0; j < data['events'].length; j++) {
                let wildifreFeature = new Feature({
                    geometry: new Point(fromLonLat(wildfirePoints[j]))
                })
                wildfireArray.push(wildifreFeature);
            }
        }
        wildfireFeatures();
        //
        const wildfireSource = new VectorSource({
            features: wildfireArray
        });
        const wildfireLayer = new VectorLayer({
            source: wildfireSource,
            style: new Style({
                image: new Icon({
                    src: 'https://cdn-icons-png.flaticon.com/512/426/426833.png',
                    scale: 0.04
                })
            })
        });
        const map = new Map({
            layers: [new TileLayer({source: new OSM()}), wildfireLayer],
            target: 'map',
            view: new View({
                center: center,
                zoom: 5
            })
        })
    })
}
getPoints();
