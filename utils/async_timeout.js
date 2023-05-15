module.exports.asyncTimeout = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};