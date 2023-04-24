const path = require('path')
module.exports = {
    getLanding: (req,res)=>{
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        console.log("landing")
    },
    getReact: (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'app.html'));
        console.log("react")
}
}