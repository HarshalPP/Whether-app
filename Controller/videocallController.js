const { v4: uuidv4 } = require('uuid');

exports.getHome = (req, res) => {
    res.redirect(`/${uuidv4()}`);
};

exports.getRoom = (req, res) => {
    res.render('index', { roomId: req.params.room });
};
