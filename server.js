import app from "./src/app.js";
const PORT = process.env.PORT || 5051;


BigInt.prototype.toJSON = function () {
    return this.toString();
};


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
