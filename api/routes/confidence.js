const express = require('express');
const states = require('../../states');
const router = express.Router();
const https = require('https');

router.get('/', (req, res, next) => {
    const query = req.query;
    getData(query).then(data => {
        const formattedData = states.features.map(state => {
            let existingState = JSON.parse(data).filter(cdcState => cdcState.geography === state.properties.name);
            if (existingState.length > 0) state.properties['avg_estimate'] = +existingState[0].avg_estimate;
            return state;
        }).filter(state2 => !!state2.properties.avg_estimate);
        res.status(200).json({
            message: "Handling GET request for /confidence",
            query: query,
            data: formattedData
        });
    });
    
});

const getData = (query) => {

    return new Promise((resolve, reject) => {
        const url = `https://data.cdc.gov/resource/udsf-9v7b.json?group_category=${query.group_category && query.group_category}&$select=geography,avg(estimate)&$having=avg_estimate >= 0&$group=geography`;
        let data = '';
        https.get(url, (res) => {
            
            res.on('data', (chunk) => {
                data += chunk;
                resolve(data);
                
            })
        }).on('error', (err) => {
            console.log('Error: ' + err.message);
            reject();
        })
    })
}

module.exports = router;